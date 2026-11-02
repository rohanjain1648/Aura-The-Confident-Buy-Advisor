'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Sparkles, AlertCircle, RefreshCw, ArrowRight, ShieldCheck, CheckCircle2, User } from 'lucide-react';
import Link from 'next/link';

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
  const [analysisStep, setAnalysisStep] = useState(0);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => stopCamera, []);

  // Preflight check: verify camera permissions
  const requestCamera = async () => {
    try {
      setError(null);
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
    setAnalysisStep(1);

    const stepTimer = setInterval(() => {
      setAnalysisStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1200);

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
          if (!event.trim()) continue;
          const match = event.match(/data:\s*(.+)/);
          if (match) {
            try {
              const data = JSON.parse(match[1]);
              if (data.status === 'complete' && data.passport) {
                setPassport(data.passport);
                setStatus('complete');
                finished = true;
                clearInterval(stepTimer);
                break;
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }

      clearInterval(stepTimer);
      if (!finished) {
        throw new Error('Analysis incomplete. Please try again.');
      }
    } catch (err) {
      clearInterval(stepTimer);
      setError(err instanceof Error ? err.message : String(err));
      setStatus('idle');
    }
  };

  const captureSelfie = async () => {
    const video = videoRef.current;
    if (!video) return;
    const { videoWidth: w, videoHeight: h } = video;
    const side = skinCropSide(w, h);
    const sx = Math.round((w - side) / 2);
    const sy = Math.round((h - side) / 2);

    const skinPhoto = await toJpeg(video, sx, sy, side, side, side, side);
    const personPhoto = await toJpeg(video, 0, 0, w, h, w, h);
    stopCamera();
    await analyze(skinPhoto, personPhoto);
  };

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    try {
      const bitmap = await createImageBitmap(file);
      if (Math.min(bitmap.width, bitmap.height) < MIN_SKIN_SIDE) {
        throw new Error(TOO_SMALL);
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
    setStatus('idle');
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Bento Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-3xl border border-neutral-200/90 shadow-2xl shadow-purple-950/5 overflow-hidden"
      >
        {/* Card Header */}
        <div className="p-7 sm:p-8 border-b border-neutral-100 bg-gradient-to-b from-neutral-50/60 to-white">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-mono font-bold text-rose-700">
              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>AURA SKIN PASSPORT</span>
            </div>
            <span className="text-xs font-mono font-semibold text-neutral-400">
              STEP 1 OF 2
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Capture Your Aura
          </h1>
          <p className="mt-1.5 text-sm text-neutral-600 font-normal leading-relaxed">
            One clear selfie generates your biometric undertone profile and clinical skin concerns for instant product verdicts.
          </p>
        </div>

        {/* Card Body */}
        <div className="p-7 sm:p-8 space-y-6">
          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 space-y-3"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-sm font-medium leading-relaxed">{error}</div>
              </div>
              <button
                onClick={handleRetry}
                className="w-full py-2.5 rounded-xl bg-white border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-100/50 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </motion.div>
          )}

          {/* Idle State: Choose Camera or Upload */}
          {status === 'idle' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Live Webcam */}
                <button
                  onClick={requestCamera}
                  className="p-6 rounded-2xl border-2 border-neutral-200 hover:border-purple-500 bg-neutral-50/50 hover:bg-purple-50/30 text-left transition-all duration-300 group flex flex-col justify-between space-y-4 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 group-hover:bg-purple-600 text-white flex items-center justify-center transition-colors shadow-sm">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-950 text-base group-hover:text-purple-700 transition-colors">
                      Live Webcam
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 font-normal leading-relaxed">
                      Guided on-screen face oval alignment for optimal lighting.
                    </p>
                  </div>
                </button>

                {/* Option 2: Upload File */}
                <label className="p-6 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-rose-400 bg-neutral-50/50 hover:bg-rose-50/30 text-left transition-all duration-300 group flex flex-col justify-between space-y-4 cursor-pointer shadow-xs">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 group-hover:bg-rose-500 text-neutral-700 group-hover:text-white flex items-center justify-center transition-colors shadow-sm">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-950 text-base group-hover:text-rose-600 transition-colors">
                      Upload Photo
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 font-normal leading-relaxed">
                      Select a selfie from your device (JPEG or PNG, min 480px).
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="sr-only"
                    onChange={onUpload}
                  />
                </label>
              </div>

              {/* Security guarantee footer note */}
              <div className="pt-2 flex items-center justify-center gap-2 text-xs font-medium text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero client key exposure • Ephemeral server-side analysis</span>
              </div>
            </div>
          )}

          {/* Camera Requested / Previewing State */}
          {(status === 'camera-requested' || status === 'previewing') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-300 shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  onLoadedMetadata={onVideoReady}
                  className="w-full h-full object-cover"
                />

                {/* Face Oval Reticle Guide */}
                <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div
                    className="flex items-center justify-center"
                    style={{ aspectRatio: '1', [guide.landscape ? 'height' : 'width']: `${guide.ratio * 100}%` }}
                  >
                    <div className="h-full w-[72%] rounded-[50%] border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] ring-2 ring-purple-500/80 animate-pulse" />
                  </div>
                </div>

                {/* Live guide instruction pill */}
                <div className="absolute bottom-3 inset-x-3 px-3 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-center text-xs font-semibold text-white">
                  Fit face inside the oval guide in natural light
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    stopCamera();
                    setStatus('idle');
                  }}
                  className="py-3.5 px-5 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-sm hover:bg-neutral-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={captureSelfie}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-purple-600/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture &amp; Analyze</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Analyzing State with Live Step Progress */}
          {status === 'analyzing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center space-y-6"
            >
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-purple-100 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <RefreshCw className="w-8 h-8 text-white animate-spin" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-neutral-950">
                  Analyzing Your Aura...
                </h3>
                <p className="text-xs font-mono text-neutral-500">
                  Communicating with YouCam S2S Neural Engine
                </p>
              </div>

              {/* Progress Milestones */}
              <div className="max-w-sm mx-auto space-y-2 text-left pt-2 font-mono text-xs">
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${analysisStep >= 1 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-neutral-50 border-neutral-200 text-neutral-400"}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>1. CIELAB skin undertone extraction</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${analysisStep >= 2 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-neutral-50 border-neutral-200 text-neutral-400"}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>2. 8 clinical skin concerns scan</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${analysisStep >= 3 ? "bg-purple-50 border-purple-200 text-purple-800 font-bold" : "bg-neutral-50 border-neutral-200 text-neutral-400"}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>3. Deterministic Skin Passport compilation</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Complete State: Show Skin Passport Card */}
          {status === 'complete' && passport && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-50 via-purple-50/30 to-rose-50/40 border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80">
                  <div className="text-xs font-mono font-bold uppercase text-neutral-500">
                    Passport Verified
                  </div>
                  <span className="inline-block rounded-full bg-neutral-950 text-white font-mono text-xs font-bold px-3 py-1">
                    {passport.undertone} Undertone
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 font-medium">Primary Skin Concern:</div>
                  <div className="text-lg font-black text-rose-600">
                    {passport.topConcern}
                  </div>
                </div>

                <div className="text-xs text-neutral-600 leading-relaxed font-normal">
                  Your Skin Passport is now active in your session. All catalog items have computed instant personalized confidence scores.
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => (window.location.href = '/shop')}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-extrabold text-base shadow-xl shadow-purple-600/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Explore Personalized Storefront</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleRetry}
                  className="w-full py-2.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 transition"
                >
                  Scan Again
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
