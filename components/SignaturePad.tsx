
import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, X, MousePointer2, Download, Palette } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [inkColor, setInkColor] = useState('#000000'); // Default pure black

  const COLORS = [
    { name: 'Black', hex: '#000000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Red', hex: '#FF0000' }
  ];

  // Initialize canvas only once or on resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Store existing content if any (though resizing usually clears)
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

        // Adjust dimensions
        canvas.width = parent.clientWidth * 2;
        canvas.height = parent.clientHeight * 2;
        
        // Restore context settings
        ctx.scale(2, 2);
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = inkColor;

        // Restore content if it was a window resize
        ctx.drawImage(tempCanvas, 0, 0, canvas.width / 2, canvas.height / 2);
      }
    };

    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, []);

  // Update stroke style when color changes without clearing the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = inkColor;
    }
  }, [inkColor]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasContent(true);
    const ctx = canvasRef.current?.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      // Account for the scale(2,2)
      ctx?.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      setHasContent(false);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas && hasContent) {
      const link = document.createElement('a');
      link.download = 'Signature_SignFlow.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (canvas && hasContent) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Create Signature</h3>
          <p className="text-sm text-slate-500 mt-1">Sign with your mouse or touch screen</p>
        </div>
        <button onClick={onCancel} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Palette size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Ink Color</span>
        </div>
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => setInkColor(c.hex)}
              className={`
                w-8 h-8 rounded-full border-2 transition-all
                ${inkColor === c.hex ? 'border-blue-500 scale-110' : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'}
              `}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>
      
      {/* Drawing Pad Area - Set to pure white for visibility as requested */}
      <div className="relative bg-white rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 overflow-hidden mb-8 h-72 shadow-inner group">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="w-full h-full cursor-crosshair touch-none"
        />
        {!hasContent && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-300">
            <MousePointer2 size={48} className="mb-3 opacity-20" />
            <span className="text-sm font-bold uppercase tracking-widest opacity-40">Digital Ink Workspace</span>
          </div>
        )}
        <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            type="button"
            onClick={handleDownload} 
            disabled={!hasContent} 
            title="Download PNG"
            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-blue-500 disabled:opacity-30 shadow-lg transition-all"
          >
            <Download size={20} />
          </button>
          <button 
            type="button"
            onClick={clear} 
            title="Clear Board"
            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-rose-500 shadow-lg transition-all"
          >
            <Eraser size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={onCancel} className="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
          Cancel
        </button>
        <button 
          onClick={save} 
          disabled={!hasContent} 
          className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-2xl shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Check size={20} /> Adopt Signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
