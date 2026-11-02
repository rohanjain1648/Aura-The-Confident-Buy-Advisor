'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';

// YouCam skin analysis needs the face to span over 60% of the image width and a
// short side of at least 480px. Try-on needs the wider shot, so a capture sends both.
const CROP_RATIO = 0.62;
const MIN_SKIN_SIDE = 480;
const MAX_UPLOAD_SIDE = 2048;
const TOO_SMALL = `This photo is too small. Use one at least ${MIN_SKIN_SIDE} pixels on its shortest side.`;

type Passport = { undertone: string; topConcern: string };

function skinCropSide(width: number, height: number) {
  const short = Math.min(width, height);
  return Math.min(short, Math.max(MIN_SKIN_SIDE, Math.round(short * CROP_RATIO)));
}

function toJpeg(
  source: CanvasImageSource,
  sx: number, sy: number, sw: number, sh: number,
  dw: number, dh: number,
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = dw;
  canvas.height = dh;
  canvas.getContext('2d')?.drawImage(source, sx, sy, sw, sh, 0, 0, dw, dh);
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not read the photo'))), 'image/jpeg', 0.9);
  });
}

export default function OnboardingCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<'idle' | 'camera-requested' | 'previewing' | 'analyzing' | 'complete'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [passport, setPassport] = useState<Passport | null>(null);
  const [guide, setGuide] = useState({ landscape: true, ratio: CROP_RATIO });

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => stopCamera, []);

  // Preflight check: verify camera permissions
  const requestCamera = async () => {
    try {
      setStatus('camera-requested');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus('previewing');
      }
    } catch (err) {
      setError(`Camera access denied: ${String(err)}`);
      setStatus('idle');
    }
  };

  const onVideoReady = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const { videoWidth: w, videoHeight: h } = video;
    setGuide({ landscape: w >= h, ratio: skinCropSide(w, h) / Math.min(w, h) });
  };

  const analyze = async (skinPhoto: Blob, personPhoto: Blob) => {
    setStatus('analyzing');
    setError(null);

    const formData = new FormData();
    formData.append('file', skinPhoto, 'selfie.jpg');
    formData.append('person', personPhoto, 'person.jpg');

    try {
      const response = await fetch('/api/analyze', { method: 'POST', body: formData });
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finished = false;

      // Stream SSE responses
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const event of events) {
          if (!event.startsWith('data: ')) continue;
          const json = JSON.parse(event.slice(6));
          if (json.status === 'complete') {
            finished = true;
            setPassport(json.passport);
            setStatus('complete');
          } else if (json.status === 'error') {
            throw new Error(json.message ?? 'Analysis failed');
          }
        }
      }

      if (!finished) throw new Error('The analysis ended unexpectedly. Please try again.');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('idle');
    }
  };

  // Capture selfie from video stream
  const captureSelfie = async () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;

    const { videoWidth: w, videoHeight: h } = video;
    if (Math.min(w, h) < MIN_SKIN_SIDE) {
      setError(TOO_SMALL);
      return;
    }
    const side = skinCropSide(w, h);
    const skinPhoto = await toJpeg(video, (w - side) / 2, (h - side) / 2, side, side, side, side);
    const personPhoto = await toJpeg(video, 0, 0, w, h, w, h);

    stopCamera();
    await analyze(skinPhoto, personPhoto);
  };

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      const bitmap = await createImageBitmap(file);
      // Checked here because a rejected photo can still spend API units on skin tone.
      if (Math.min(bitmap.width, bitmap.height) < MIN_SKIN_SIDE) {
        setError(TOO_SMALL);
        return;
      }
      const scale = Math.min(1, MAX_UPLOAD_SIDE / Math.max(bitmap.width, bitmap.height));
      const photo = await toJpeg(
        bitmap, 0, 0, bitmap.width, bitmap.height,
        Math.round(bitmap.width * scale), Math.round(bitmap.height * scale),
      );
      await analyze(photo, photo);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('idle');
    }
  };

  const handleRetry = () => {
    setError(null);
    setPassport(null);
    requestCamera();
  };

  return (
    <div className="w-full max-w-md mx-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-semibold">Capture Your Aura</h2>
      </div>
      <div className="p-6 pt-2">
        {error && (
          <div className="text-red-600 mb-4" role="alert">
            {error}
            <button
              onClick={handleRetry}
              className="block w-full mt-2 rounded-md border border-red-300 text-red-600 py-2"
            >
              Retry
            </button>
          </div>
        )}

        {status === 'idle' && (
          <div>
            {!error && (
              <button onClick={requestCamera} className="w-full rounded-md bg-black text-white py-2">
                Start Camera
              </button>
            )}
            <label className="block w-full mt-2 rounded-md border border-gray-300 py-2 text-center cursor-pointer">
              Upload a photo
              <input type="file" accept="image/jpeg,image/png" className="sr-only" onChange={onUpload} />
            </label>
          </div>
        )}

        {(status === 'camera-requested' || status === 'previewing') && (
          <div>
            <div className="relative mb-2">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={onVideoReady}
                className="w-full rounded-lg"
              />
              <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                  className="flex items-center justify-center"
                  style={{ aspectRatio: '1', [guide.landscape ? 'height' : 'width']: `${guide.ratio * 100}%` }}
                >
                  <div className="h-full w-[72%] rounded-[50%] border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]" />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Fill the oval with your face, in good light.</p>
            <button onClick={captureSelfie} className="w-full rounded-md bg-black text-white py-2">
              Capture &amp; Analyze
            </button>
          </div>
        )}

        {status === 'analyzing' && <p>Analyzing your skin tone and concerns...</p>}

        {status === 'complete' && passport && (
          <div>
            <span className="inline-block rounded-full bg-gray-900 text-white text-xs px-3 py-1">
              {passport.undertone}
            </span>
            <p className="mt-2">
              Top concern: <strong>{passport.topConcern}</strong>
            </p>
            <button
              onClick={() => (window.location.href = '/shop')}
              className="w-full mt-4 rounded-md bg-black text-white py-2"
            >
              Browse Shop
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
