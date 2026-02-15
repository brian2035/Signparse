
import React, { useState, useEffect, useRef } from 'react';
import { 
  Type, 
  Calendar, 
  User, 
  PenTool, 
  ChevronLeft,
  Sparkles,
  Loader2,
  Trash2,
  Plus,
  Download,
  FileText,
  MousePointer2,
  Settings2,
  Check,
  Palette,
  AlignLeft,
  Upload,
  ZoomIn,
  ZoomOut,
  Maximize,
  Hand,
  FileCheck,
  Move
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { detectSuggestedFields } from '../services/gemini';
import SignaturePad from '../components/SignaturePad';

// @ts-ignore
import html2canvas from 'html2canvas';
// @ts-ignore
import { jsPDF } from 'jspdf';

interface CanvasField {
  id: string;
  type: 'signature' | 'date' | 'initials' | 'text';
  x: number; // percentage
  y: number; // percentage
  width: number; // percentage
  height: number; // percentage
  label: string;
  value?: string;
  color?: 'black' | 'blue' | 'red';
}

const LOGO_URL = "https://i.ibb.co/5xCWL6pX/Sign-Parse-1.png";

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const docName = params.get('name') || 'Untitled Document';
  const docId = params.get('id');

  const paperRef = useRef<HTMLDivElement>(null);
  const sigUploadRef = useRef<HTMLInputElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  
  const [fields, setFields] = useState<CanvasField[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  
  // Custom Interaction States
  const [dragState, setDragState] = useState<{ id: string, startX: number, startY: number, fieldStartX: number, fieldStartY: number } | null>(null);
  const [resizeState, setResizeState] = useState<{ id: string, startX: number, startY: number, startWidth: number, startHeight: number } | null>(null);

  // Zoom and Pan States
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [toolMode, setToolMode] = useState<'select' | 'pan'>('select');
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (docId) {
      const stored = sessionStorage.getItem(`preview_${docId}`);
      if (stored) setPreviewSrc(stored);
    }
  }, [docId]);

  const handleAiDetection = async () => {
    setIsAiLoading(true);
    const results = await detectSuggestedFields(`Analyzing document named ${docName}. Suggest signature, date and initial field placements.`);
    
    const newFields: CanvasField[] = results.map((res, i) => ({
      id: `ai-${Date.now()}-${i}`,
      type: res.type as any,
      label: res.label,
      x: 15 + (Math.random() * 40),
      y: 30 + (i * 12),
      width: res.type === 'signature' ? 25 : 18,
      height: res.type === 'signature' ? 10 : 5,
      color: 'black'
    }));

    setFields(prev => [...prev, ...newFields]);
    setIsAiLoading(false);
  };

  const addField = (type: CanvasField['type']) => {
    const labels = { signature: 'Signature', date: 'Date Signed', initials: 'Initials', text: 'Text Field' };
    const defaultSizes = {
      signature: { w: 28, h: 10 },
      date: { w: 18, h: 5 },
      initials: { w: 14, h: 6 },
      text: { w: 25, h: 5 }
    };
    
    const newField: CanvasField = {
      id: `field-${Date.now()}`,
      type,
      label: labels[type],
      x: 35,
      y: 35,
      width: defaultSizes[type].w,
      height: defaultSizes[type].h,
      color: 'black'
    };
    
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
    setToolMode('select');
    
    if (type === 'signature') {
      setShowSignaturePad(true);
    }
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const updateFieldLabel = (id: string, label: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, label } : f));
  };

  const updateFieldValue = (id: string, value: string) => {
    setFields(fields.map(f => f.id === id ? { ...f, value } : f));
  };

  const updateFieldColor = (id: string, color: CanvasField['color']) => {
    setFields(fields.map(f => f.id === id ? { ...f, color } : f));
  };

  const handleFieldMouseDown = (e: React.MouseEvent, field: CanvasField) => {
    if (toolMode !== 'select') return;
    e.stopPropagation();
    setSelectedFieldId(field.id);
    setDragState({
      id: field.id,
      startX: e.clientX,
      startY: e.clientY,
      fieldStartX: field.x,
      fieldStartY: field.y
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, field: CanvasField) => {
    e.stopPropagation();
    setResizeState({
      id: field.id,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: field.width,
      startHeight: field.height
    });
  };

  const handleWorkspaceMouseDown = (e: React.MouseEvent) => {
    if (toolMode === 'pan') {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    } else {
      setSelectedFieldId(null);
    }
  };

  const handleWorkspaceMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!paperRef.current) return;
    const rect = paperRef.current.getBoundingClientRect();
    
    if (dragState) {
      const dxPercent = ((e.clientX - dragState.startX) / rect.width) * 100 / zoom;
      const dyPercent = ((e.clientY - dragState.startY) / rect.height) * 100 / zoom;
      
      const field = fields.find(f => f.id === dragState.id);
      if (!field) return;

      // STICK TO DOCUMENT SIZE: Clamp x and y between 0 and (100 - width/height)
      const newX = Math.max(0, Math.min(dragState.fieldStartX + dxPercent, 100 - field.width));
      const newY = Math.max(0, Math.min(dragState.fieldStartY + dyPercent, 100 - field.height));

      setFields(prev => prev.map(f => 
        f.id === dragState.id ? { ...f, x: newX, y: newY } : f
      ));
    }

    if (resizeState) {
      const dwPercent = ((e.clientX - resizeState.startX) / rect.width) * 100 / zoom;
      const dhPercent = ((e.clientY - resizeState.startY) / rect.height) * 100 / zoom;
      
      const field = fields.find(f => f.id === resizeState.id);
      if (!field) return;

      // STICK TO DOCUMENT SIZE: Clamp width and height based on current position
      const newW = Math.max(5, Math.min(resizeState.startWidth + dwPercent, 100 - field.x));
      const newH = Math.max(2, Math.min(resizeState.startHeight + dhPercent, 100 - field.y));

      setFields(prev => prev.map(f => 
        f.id === resizeState.id ? { ...f, width: newW, height: newH } : f
      ));
    }
  };

  const handleWorkspaceMouseUp = () => {
    setIsPanning(false);
    setDragState(null);
    setResizeState(null);
  };

  const handleExportPDF = async () => {
    if (!paperRef.current) return;
    setIsDownloading(true);
    
    const originalSelectedId = selectedFieldId;
    const originalZoom = zoom;
    const originalPan = panOffset;
    
    setSelectedFieldId(null);
    setZoom(1); 
    setPanOffset({ x: 0, y: 0 });
    
    try {
      await new Promise(r => setTimeout(r, 600));

      const canvas = await html2canvas(paperRef.current, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: paperRef.current.scrollWidth,
        windowHeight: paperRef.current.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdfWidth = paperRef.current.offsetWidth;
      const pdfHeight = paperRef.current.offsetHeight;
      
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Signed_${docName.replace(/\.[^/.]+$/, "")}.pdf`);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setSelectedFieldId(originalSelectedId);
      setZoom(originalZoom);
      setPanOffset(originalPan);
      setIsDownloading(false);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedFieldId) {
      const reader = new FileReader();
      reader.onloadend = () => updateFieldValue(selectedFieldId, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const getSignatureFilter = (color?: string) => {
    if (color === 'blue') return 'invert(24%) sepia(98%) saturate(3015%) hue-rotate(209deg) brightness(97%) contrast(106%)';
    if (color === 'red') return 'invert(11%) sepia(91%) saturate(7180%) hue-rotate(357deg) brightness(92%) contrast(117%)';
    return 'none';
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-slate-950 overflow-hidden -m-6 relative">
      {/* Export Overlay */}
      {isDownloading && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6 animate-pulse">
            <Download size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Flattening Document</h2>
          <p className="text-slate-400 text-sm">Embedding secure signatures and audit metadata...</p>
        </div>
      )}

      <header className="h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} className="h-14 w-auto opacity-90" alt="logo" />
            <div className="w-px h-4 bg-slate-700 mx-2"></div>
            <h1 className="text-xs font-bold text-slate-300 truncate max-w-[200px] uppercase tracking-widest">{docName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleAiDetection} disabled={isAiLoading} className="hidden sm:flex items-center gap-2 bg-slate-800 text-blue-400 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 disabled:opacity-50 transition-all active:scale-95">
            {isAiLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            Smart Detect
          </button>
          <button 
            onClick={handleExportPDF} 
            disabled={isDownloading || fields.length === 0} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <FileCheck size={14} />}
            Finalize
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0 overflow-y-auto z-20">
          <div className="p-6 space-y-8">
            <section>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Add Element</h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { type: 'signature', icon: PenTool, label: 'Signature', color: 'text-blue-400', bg: 'bg-blue-400/10' },
                  { type: 'initials', icon: User, label: 'Initials', color: 'text-purple-400', bg: 'bg-purple-400/10' },
                  { type: 'date', icon: Calendar, label: 'Date', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                  { type: 'text', icon: Type, label: 'Text Field', color: 'text-amber-400', bg: 'bg-amber-400/10' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addField(item.type as any)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-all text-xs font-bold text-slate-300 group"
                  >
                    <div className={`p-2 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                      <item.icon size={16} />
                    </div>
                    {item.label}
                    <Plus size={12} className="ml-auto text-slate-700 group-hover:text-blue-500" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* Workspace */}
        <main 
          ref={workspaceRef}
          className={`flex-1 bg-slate-950 relative overflow-hidden flex justify-center items-start ${toolMode === 'pan' ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
          onMouseDown={handleWorkspaceMouseDown}
          onMouseMove={handleWorkspaceMouseMove}
          onMouseUp={handleWorkspaceMouseUp}
          onMouseLeave={handleWorkspaceMouseUp}
        >
          {/* Document Container */}
          <div 
            ref={paperRef}
            className="bg-white shadow-2xl relative select-none flex-shrink-0 transition-transform duration-100 ease-out origin-top"
            style={{ 
              width: '100%', 
              maxWidth: '816px', 
              minHeight: '1056px',
              height: 'auto',
              marginTop: '48px',
              marginBottom: '100px',
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`
            }}
          >
            {previewSrc ? (
              <img src={previewSrc} className="w-full block pointer-events-none" alt="Doc" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-100">
                <FileText size={64} className="opacity-5 mb-4" />
                <p className="font-bold opacity-10 text-slate-900 uppercase tracking-widest">{docName}</p>
              </div>
            )}

            {/* Fields Overlay */}
            {fields.map((field) => (
              <div
                key={field.id}
                style={{ 
                  left: `${field.x}%`, 
                  top: `${field.y}%`,
                  width: `${field.width}%`,
                  height: `${field.height}%`,
                  position: 'absolute'
                }}
                onMouseDown={(e) => handleFieldMouseDown(e, field)}
                className={`z-20 group ${selectedFieldId === field.id ? 'z-30' : ''}`}
                onClick={(e) => { 
                  if (toolMode === 'select') {
                    e.stopPropagation(); 
                    setSelectedFieldId(field.id);
                    if (field.type === 'signature' && !field.value) setShowSignaturePad(true);
                  }
                }}
              >
                <div 
                  className={`
                    w-full h-full flex items-center justify-center rounded-lg border-2 shadow-sm transition-all relative
                    ${selectedFieldId === field.id ? 'border-blue-600 bg-white ring-4 ring-blue-500/10' : 'border-slate-300 bg-white/95'}
                  `}
                >
                  {/* Interaction Indicators */}
                  {selectedFieldId === field.id && (
                    <>
                      <div className="absolute -top-3 -left-3 p-1.5 bg-blue-600 text-white rounded-lg shadow-lg">
                        <Move size={12} />
                      </div>
                      <div 
                        onMouseDown={(e) => handleResizeMouseDown(e, field)}
                        className="absolute -bottom-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-lg shadow-lg flex items-center justify-center cursor-nwse-resize hover:scale-110 transition-transform z-50"
                      >
                        <Maximize size={14} />
                      </div>
                    </>
                  )}

                  <div className="flex-1 h-full flex flex-col items-center justify-center p-1 overflow-hidden">
                    {field.type === 'signature' && field.value ? (
                      <img 
                        src={field.value} 
                        className="max-h-full max-w-full object-contain pointer-events-none" 
                        style={{ filter: getSignatureFilter(field.color) }}
                        alt="signed" 
                      />
                    ) : (
                      field.type === 'text' && field.value ? (
                        <span className="text-sm font-semibold text-slate-900 break-all line-clamp-2 px-2 text-center">{field.value}</span>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          {field.type === 'signature' ? <PenTool size={14} className="text-blue-400" /> :
                           field.type === 'date' ? <Calendar size={14} className="text-emerald-400" /> :
                           field.type === 'initials' ? <User size={14} className="text-purple-400" /> :
                           <Type size={14} className="text-amber-400" />}
                          <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">{field.label}</span>
                        </div>
                      )
                    )}
                  </div>

                  {selectedFieldId === field.id && !isDownloading && (
                    <button 
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); removeField(field.id); }} 
                      className="absolute -top-8 right-0 p-1.5 bg-slate-900 text-white hover:text-rose-400 rounded-lg shadow-xl transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl z-40">
            <div className="flex items-center bg-slate-950/50 rounded-2xl border border-slate-800 p-1 mr-2">
              <button 
                onClick={() => setToolMode('select')}
                className={`p-2 rounded-xl transition-all ${toolMode === 'select' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Select Tool"
              >
                <MousePointer2 size={18} />
              </button>
              <button 
                onClick={() => setToolMode('pan')}
                className={`p-2 rounded-xl transition-all ${toolMode === 'pan' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Pan Tool"
              >
                <Hand size={18} />
              </button>
            </div>
            
            <button 
              onClick={() => setZoom(Math.max(0.4, zoom - 0.1))} 
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-[10px] font-black text-slate-300 min-w-[40px] text-center uppercase tracking-widest">
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={() => setZoom(Math.min(3, zoom + 0.1))} 
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all"
            >
              <ZoomIn size={18} />
            </button>
            <div className="w-px h-6 bg-slate-800 mx-1"></div>
            <button 
              onClick={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }); }} 
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all"
            >
              <Maximize size={18} />
            </button>
          </div>

          {showSignaturePad && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4">
              <SignaturePad 
                onSave={(data) => {
                  if (selectedFieldId) updateFieldValue(selectedFieldId, data);
                  setShowSignaturePad(false);
                }} 
                onCancel={() => setShowSignaturePad(false)} 
              />
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900/30 flex flex-col shrink-0 z-20 overflow-y-auto">
          <div className="p-6 h-full flex flex-col space-y-8">
            <div className="flex items-center gap-2">
              <Settings2 size={18} className="text-slate-400" />
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Element Options</h2>
            </div>
            
            <div className="flex-1 space-y-8">
              {selectedField ? (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-slate-800/50 p-5 rounded-[2rem] border border-slate-800/50 space-y-4">
                    <div className="flex items-center gap-2">
                      <AlignLeft size={14} className="text-blue-400" />
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Field Label</label>
                    </div>
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                      value={selectedField.label}
                      onChange={(e) => updateFieldLabel(selectedField.id, e.target.value)}
                    />
                  </div>

                  {selectedField.type === 'signature' && (
                    <div className="bg-slate-800/50 p-5 rounded-[2rem] border border-slate-800/50 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Palette size={14} className="text-blue-400" />
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Ink Selection</label>
                      </div>
                      
                      <div className="flex gap-3 mb-4">
                        {(['black', 'blue', 'red'] as const).map((color) => (
                          <button
                            key={color}
                            onClick={() => updateFieldColor(selectedField.id, color)}
                            className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedField.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                            style={{ backgroundColor: color }}
                          >
                            {selectedField.color === color && <Check size={16} className="text-white" />}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => setShowSignaturePad(true)} 
                          className="flex flex-col items-center gap-2 py-4 px-2 bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 text-blue-400 rounded-2xl transition-all"
                        >
                          <PenTool size={20} />
                          <span className="text-[10px] font-bold uppercase">Redraw</span>
                        </button>
                        
                        <button 
                          onClick={() => sigUploadRef.current?.click()}
                          className="flex flex-col items-center gap-2 py-4 px-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 rounded-2xl transition-all"
                        >
                          <Upload size={20} />
                          <span className="text-[10px] font-bold uppercase">Upload</span>
                        </button>
                        <input type="file" ref={sigUploadRef} className="hidden" accept="image/*" onChange={handleSignatureUpload} />
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => removeField(selectedField.id)}
                    className="w-full py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Remove Element
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-30">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center">
                    <MousePointer2 size={32} className="text-slate-600" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Select an element to adjust properties or resize.</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Editor;
