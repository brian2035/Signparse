
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, ShieldCheck, Palette, Type as TypeIcon, Check, RefreshCw } from 'lucide-react';

const FONTS = [
  { name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { name: 'Pacifico', family: "'Pacifico', cursive" },
  { name: 'Satisfy', family: "'Satisfy', cursive" },
  { name: 'Caveat', family: "'Caveat', cursive" },
  { name: 'Homemade Apple', family: "'Homemade Apple', cursive" },
];

const COLORS = [
  { name: 'Black', hex: '#0f172a' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Red', hex: '#dc2626' }
];

const TypeSignature: React.FC = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawSignature();
  }, [text, selectedFont, selectedColor]);

  const drawSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and set sizes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!text) return;

    ctx.fillStyle = selectedColor.hex;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Dynamically adjust font size to fit canvas
    let fontSize = 120;
    ctx.font = `${fontSize}px ${selectedFont.family}`;
    const textWidth = ctx.measureText(text).width;
    
    if (textWidth > canvas.width - 40) {
      fontSize = fontSize * (canvas.width - 40) / textWidth;
    }
    
    ctx.font = `${fontSize}px ${selectedFont.family}`;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;
    const link = document.createElement('a');
    link.download = 'SignFlow_Type_Signature.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 py-20 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-5xl space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-4"
          >
            <ChevronLeft size={16} /> Back to home
          </button>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white">Type Signature</h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Transform your name into a beautiful handwriting-style signature. Choose from premium fonts and export for free.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-8 bg-slate-900 border border-white/5 p-8 rounded-[3rem] shadow-2xl">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Type your name</label>
              <div className="relative">
                <TypeIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  maxLength={40}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Choose Ink</label>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor.hex === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor.hex === c.hex && <Check size={16} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-1">Handwriting Style</label>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {FONTS.map((font) => (
                  <button
                    key={font.name}
                    onClick={() => setSelectedFont(font)}
                    className={`w-full p-4 rounded-2xl border transition-all text-left ${selectedFont.name === font.name ? 'bg-emerald-600/10 border-emerald-500 text-white' : 'bg-slate-950 border-white/5 text-slate-400 hover:border-white/20'}`}
                    style={{ fontFamily: font.family }}
                  >
                    <span className="text-xl">{font.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex-1 bg-white rounded-[3rem] p-10 flex items-center justify-center min-h-[400px] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-slate-50/50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={400} 
                className="w-full h-auto pointer-events-none"
              />
              {!text && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                  <RefreshCw size={48} className="mb-4 opacity-20" />
                  <p className="text-lg font-bold opacity-30 uppercase tracking-widest">Awaiting Input</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleDownload}
              disabled={!text}
              className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-[2rem] font-extrabold text-xl shadow-2xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Download size={24} /> Download Signature PNG
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 text-slate-500">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]">
            <ShieldCheck size={16} className="text-emerald-500" />
            SignFlow Public Utility
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeSignature;