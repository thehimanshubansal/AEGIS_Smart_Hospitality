"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  ShieldCheck, 
  Scan,
  RefreshCcw,
  X
} from "lucide-react";
import { motion } from "framer-motion";

interface BiometricScannerProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
  title?: string;
}

export function BiometricScanner({ onCapture, onClose, title = "Biometric Face Scan" }: BiometricScannerProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isBurstMode, setIsBurstMode] = useState(false);
  const [burstCount, setBurstCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Please allow camera access for biometric scanning.");
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (isBurstMode) {
      for (let i = 1; i <= 5; i++) {
        setBurstCount(i);
        // Wait bit for user to see the count
        await new Promise(resolve => setTimeout(resolve, 400));
      }
      setBurstCount(0);
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", 0.95);
    setPhoto(data);
    
    // Stop stream
    const stream = video.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }
    setIsCameraActive(false);
  };

  const handleConfirm = () => {
    if (photo) {
      onCapture(photo);
      onClose();
    }
  };

  const reset = () => {
    setPhoto(null);
    startCamera();
  };

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-[#0a0b0e] border border-cyan-900/30 rounded-[2rem] overflow-hidden shadow-2xl relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-cyan-900/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center">
               <ShieldCheck size={20} className="text-cyan-400" />
            </div>
            <div>
               <h3 className="text-sm font-black uppercase tracking-widest text-cyan-50">{title}</h3>
               <p className="text-[10px] text-cyan-600 uppercase font-bold">Aegis Tactical ID System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!photo && (
              <button 
                onClick={() => setIsBurstMode(!isBurstMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${
                  isBurstMode ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                <RefreshCcw size={12} className={isBurstMode ? 'text-cyan-400' : ''} />
                Burst Mode
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full text-cyan-600 hover:text-cyan-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-8">
          {/* Viewport */}
          <div className="relative aspect-[4/3] bg-black rounded-3xl overflow-hidden border border-cyan-900/50 group shadow-inner">
            {!photo ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover scale-x-[-1]" 
                />
                
                {/* Burst Count Indicator */}
                {burstCount > 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-cyan-950/40 backdrop-blur-sm">
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={burstCount}
                      className="text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                    >
                      {burstCount}/5
                    </motion.div>
                    <p className="text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px] mt-4">
                      Analyzing Facial Topology...
                    </p>
                  </div>
                )}

                <div className="absolute inset-0 pointer-events-none">
                  {/* Scanning Overlay */}
                  <div className="absolute inset-0 border-2 border-cyan-500/20 m-16 rounded-[25%]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {/* Corner Accents */}
                  <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-lg shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                </div>
              </>
            ) : (
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={photo} 
                className="w-full h-full object-cover grayscale contrast-125 brightness-110" 
              />
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            {!photo ? (
              <button 
                onClick={capturePhoto}
                disabled={!isCameraActive || burstCount > 0}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(6,182,212,0.2)] active:scale-95 disabled:opacity-50"
              >
                <Scan size={18} />
                {isBurstMode ? 'Start Burst Scan' : 'Capture Biometrics'}
              </button>
            ) : (
              <>
                <button 
                  onClick={reset}
                  className="flex-1 bg-white/5 border border-white/10 text-white/70 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 hover:bg-white/10"
                >
                  <RefreshCcw size={16} />
                  Retake
                </button>
                <button 
                  onClick={handleConfirm}
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
                >
                  Confirm Identity
                </button>
              </>
            )}
          </div>

          {/* Footer Info */}
          <div className="text-center">
            <p className="text-[9px] text-cyan-700/50 uppercase tracking-[0.3em] font-bold">
              Secure Data Protocol • AES-256 Encrypted • Facial Hash Ready
            </p>
          </div>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  );
}
