"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  Camera, 
  ShieldCheck, 
  Database, 
  Fingerprint, 
  Scan,
  RefreshCcw,
  CheckCircle2
} from "lucide-react";

export default function EnrollmentPage() {
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", role: "Staff" });
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/jpeg", 0.9);
    setPhoto(data);
    setStep(2);
    
    // Stop stream
    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach(t => t.stop());
  };

  const handleEnroll = async () => {
    if (!photo || !formData.name) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/security/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          photoUrl: photo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(3);
      } else {
        alert("Enrollment failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to enroll identity.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-cyan-50/90 font-mono p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between border-b border-cyan-900/30 pb-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/50 rounded-xl flex items-center justify-center">
                <Fingerprint size={28} className="text-cyan-400" />
             </div>
             <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter">Biometric Enrollment</h1>
                <p className="text-[10px] text-cyan-600 uppercase tracking-widest font-bold">Secure Personnel Registration v1.0</p>
             </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-black">
             <span className="text-cyan-900">Database Status:</span>
             <span className="text-emerald-500 animate-pulse">Connected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Action Area */}
          <div className="bg-[#0a0b0e] border border-cyan-900/30 rounded-2xl overflow-hidden shadow-2xl">
            {step === 1 && (
              <div className="p-8 flex flex-col gap-6">
                <div className="relative aspect-square bg-black rounded-xl overflow-hidden border border-cyan-900/50">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                  <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute inset-0 border-2 border-cyan-500/20 m-12 rounded-[25%]" />
                     <motion.div 
                        className="absolute inset-x-0 h-1 bg-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                        animate={{ top: ["20%", "80%", "20%"] }}
                        transition={{ duration: 4, repeat: Infinity }}
                     />
                  </div>
                </div>
                {!videoRef.current?.srcObject ? (
                  <button 
                    onClick={startCamera}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-black py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <Camera size={20} />
                    Initialize Camera
                  </button>
                ) : (
                  <button 
                    onClick={capturePhoto}
                    className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <Scan size={20} />
                    Scan Face
                  </button>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="p-8 flex flex-col gap-6">
                <div className="relative aspect-square bg-black rounded-xl overflow-hidden border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                   <img src={photo!} className="w-full h-full object-cover grayscale brightness-125 contrast-125" />
                   <div className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-500/50 p-2 rounded-lg">
                      <ShieldCheck size={20} className="text-emerald-400" />
                   </div>
                   <div className="absolute bottom-0 inset-x-0 bg-emerald-500/20 backdrop-blur-md p-3 text-center border-t border-emerald-500/30">
                      <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest leading-none">Biometric Data Captured</span>
                   </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-cyan-600 uppercase font-bold ml-1">Personnel Name</label>
                    <input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/40 border border-cyan-900/30 rounded-lg p-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="e.g. John Wick"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-cyan-600 uppercase font-bold ml-1">Access Level</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-black/40 border border-cyan-900/30 rounded-lg p-3 text-sm focus:outline-none focus:border-cyan-500 appearance-none text-cyan-100"
                    >
                      <option value="Staff">Authorized Staff</option>
                      <option value="VIP">VIP Guest</option>
                      <option value="Admin">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCcw size={16} />
                    Retake
                  </button>
                  <button 
                    onClick={handleEnroll}
                    disabled={isProcessing || !formData.name}
                    className="flex-[2] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    {isProcessing ? <RefreshCcw size={16} className="animate-spin" /> : <Database size={16} />}
                    Finalize Identity
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 flex flex-col items-center justify-center text-center gap-6"
              >
                 <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={48} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black text-emerald-400 uppercase tracking-tighter">Enrollment Successful</h2>
                    <p className="text-xs text-cyan-600 tracking-wider mt-2 bg-cyan-950/20 p-4 rounded-lg border border-cyan-900/30">
                       Identity for <span className="text-emerald-400 underline">{formData.name}</span> has been indexed and propagated to the Tactical Monitoring network.
                    </p>
                 </div>
                 <button 
                   onClick={() => { setStep(1); setPhoto(null); setFormData({ name: "", role: "Staff" }); }}
                   className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all"
                 >
                    Enroll Another
                 </button>
              </motion.div>
            )}
          </div>

          {/* Info Area */}
          <div className="space-y-8 py-4">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="text-cyan-500" size={20} />
                 <h3 className="text-sm font-black uppercase tracking-widest">Protocol Instructions</h3>
              </div>
              <ul className="space-y-4">
                 {[
                   { t: "Lighting", d: "Ensure high-contrast, front-facing lighting for feature extraction." },
                   { t: "Positioning", d: "Align facial features within the central scanning zone." },
                   { t: "Verification", d: "Neural network will auto-detect eyes, nose, and jawline landmarks." }
                 ].map((item, i) => (
                   <li key={i} className="flex gap-4 p-4 border border-cyan-900/20 rounded-xl bg-cyan-950/5">
                      <span className="text-cyan-800 font-black text-xs">0{i+1}</span>
                      <div>
                        <p className="text-[11px] font-black uppercase text-cyan-400 leading-none mb-1">{item.t}</p>
                        <p className="text-[10px] text-cyan-600/80 leading-relaxed font-bold">{item.d}</p>
                      </div>
                   </li>
                 ))}
              </ul>
            </section>

            <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-3xl -mr-12 -mt-12" />
               <div className="flex items-center gap-3 mb-4">
                  <UserPlus size={18} className="text-cyan-400" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Global Sync</span>
               </div>
               <p className="text-[10px] text-cyan-600 leading-relaxed font-bold">
                 Profiles registered here are immediately available to all "Eye of Aegis" surveillance units across the hospitality mesh network. 
               </p>
            </div>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
