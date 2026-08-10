'use client';

import { useState, useRef } from 'react';

export default function OnboardingCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState<'idle' | 'camera-requested' | 'previewing' | 'analyzing' | 'complete'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [passport, setPassport] = useState<{ undertone: string; topConcern: string } | null>(null);

  // Preflight check: verify camera permissions
  const requestCamera = async () => {
    try {
      setStatus('camera-requested');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus('previewing');
      }
    } catch (err) {
      setError(`Camera access denied: ${String(err)}`);
      setStatus('idle');
    }
  };

  // Capture selfie from video stream
  const captureSelfie = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);

    // Convert canvas to blob
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return;

      setStatus('analyzing');

      // Upload and analyze
      const formData = new FormData();
      formData.append('file', blob, 'selfie.jpg');

      try {
        const response = await fetch('/api/analyze', { method: 'POST', body: formData });

        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Stream SSE responses
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const lines = text.trim().split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const json = JSON.parse(line.slice(6));
              if (json.status === 'complete') {
                setPassport(json.passport);
                setStatus('complete');
              }
            }
          }
        }
      } catch (err) {
        setError(String(err));
        setStatus('previewing');
      }
    }, 'image/jpeg', 0.9);
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
          <div className="text-red-600 mb-4">
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
          <button onClick={requestCamera} className="w-full rounded-md bg-black text-white py-2">
            Start Camera
          </button>
        )}

        {(status === 'camera-requested' || status === 'previewing') && (
          <div>
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg mb-4" />
            <canvas ref={canvasRef} className="hidden" />
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
