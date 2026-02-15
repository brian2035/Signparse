
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignaturePad from '../components/SignaturePad';
import { ChevronLeft, Download, ShieldCheck } from 'lucide-react';

const DrawSignature: React.FC = () => {
  const navigate = useNavigate();

  const handleSave = (dataUrl: string) => {
    const link = document.createElement('a');
    link.download = 'SignFlow_Signature.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 py-20 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-4xl space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-4"
          >
            <ChevronLeft size={16} /> Back to home
          </button>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">Draw Signature</h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Create a professional digital signature using your mouse, touchpad, or screen. Adopt it for free as a high-quality PNG.
          </p>
        </div>

        <div className="flex justify-center">
          <SignaturePad 
            onSave={handleSave} 
            onCancel={() => navigate('/')} 
          />
        </div>

        <div className="flex flex-col items-center gap-4 text-slate-500">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]">
            <ShieldCheck size={16} className="text-emerald-500" />
            SignFlow Public Utility
          </div>
          <p className="text-[10px] max-w-xs text-center leading-relaxed">
            Your drawing never leaves your browser. Private, secure, and instant signature generation for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrawSignature;