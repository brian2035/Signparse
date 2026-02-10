
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
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  FileCode,
  MousePointer2,
  Info,
  Settings2,
  Check,
  Palette,
  AlignLeft,
  Upload,
  ZoomIn,
  ZoomOut,
  Maximize,
  Hand,
  ShieldCheck,
  FileCheck
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
  x: number;
  y: number;
  label: string;
  value?: string;
  color?: 'black' | 'blue' | 'red';
}

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const docName = params.get('name') || 'Untitled Document';
  const docId = params.get('id');
  const fileExtension = docName.split('.').pop()?.toLowerCase() || '';

  const paperRef = useRef<HTMLDivElement>(null);
  const sigUploadRef = useRef<HTMLInputElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  
  const [fields, setFields] = useState<CanvasField[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [draggingFieldId, setDraggingFieldId] = useState<string | null>(null);

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
      x: 15 + (Math.random() * 60),
      y: 30 + (i * 12),
      color: 'black'
    }));

    setFields(prev => [...prev, ...newFields]);
    setIsAiLoading(false);
  };

  const addField = (type: CanvasField['type']) => {
    const labels = { signature: 'Signature', date: 'Date Signed', initials: 'Initials', text: 'Text Field' };
    const newField: CanvasField = {
      id: `field-${Date.now()}`,
      type,
      label: labels[type],
      x: 40,
      y: 40,
      color: 'black'
    };
    setFields([...fields, newField]);
    setSelectedFieldId(newField.id);
    setToolMode('select');
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

  const handleDragStart = (id: string) => {
    if (toolMode === 'pan') return;
    setDraggingFieldId(id);
    setSelectedFieldId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingFieldId || !paperRef.current) return;

    const rect = paperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const boundedX = Math.max(0, Math.min(x, 90));
    const boundedY = Math.max(0, Math.min(y, 95));

    setFields(prev => prev.map(f => 
      f.id === draggingFieldId ? { ...f, x: boundedX, y: boundedY } : f
    ));
  };

  const handleExportPDF = async () => {
    if (!paperRef.current) return;
    setIsDownloading(true);
    
    // Save current view state
    const originalSelectedId = selectedFieldId;
    const originalZoom = zoom;
    const originalPan = panOffset;
    
    // Preparation for snapshot: Clear selection and reset view for perfect DPI alignment
    setSelectedFieldId(null);
    setZoom(1); 
    setPanOffset({ x: 0, y: 0 });
    
    try {
      // Give time for the layout to settle after state updates
      await new Promise(r => setTimeout(r, 400));

      const canvas = await html2canvas(paperRef.current, {
        scale: 4, // High scale for professional print quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: paperRef.current.scrollWidth,
        windowHeight: paperRef.current.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      // Determine actual aspect ratio for the PDF
      const pdfWidth = paperRef.current.offsetWidth;
      const pdfHeight = paperRef.current.offsetHeight;
      
      const pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Signed_SignParse_${docName.replace(/\.[^/.]+$/, "")}.pdf`);
    } catch (err) {
      console.error('Export error:', err);
      alert('An error occurred while generating your professional PDF. Please check console.');
    } finally {
      // Restore user's view state
      setSelectedFieldId(originalSelectedId);
      setZoom(originalZoom);
      setPanOffset(originalPan);
      setIsDownloading(false);
    }
  };

  // Pan Logic
  const handleWorkspaceMouseDown = (e: React.MouseEvent) => {
    if (toolMode === 'pan') {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleWorkspaceMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setPanOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleWorkspaceMouseUp = () => {
    setIsPanning(false);
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedFieldId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFieldValue(selectedFieldId, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSignatureFilter = (color?: string) => {
    if (color === 'blue') return 'invert(24%) sepia(98%) saturate(3015%) hue-rotate(209deg) brightness(97%) contrast(106%)';
    if (color === 'red') return 'invert(11%) sepia(91%) saturate(7180%) hue-rotate(357deg) brightness(92%) contrast(117%)';
    return 'none';
  };

  const getDocIcon = () => {
    if (['png', 'jpg', 'jpeg'].includes(fileExtension)) return <ImageIcon className="text-emerald-400" size={18} />;
    if (fileExtension === 'pdf') return <FileCode className="text-rose-400" size={18} />;
    return <FileText className="text-blue-400" size={18} />;
  };

  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col bg-slate-950 overflow-hidden -m-6 relative">
      {/* Global Export Loading Overlay */}
      {isDownloading && (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-8 animate-bounce">
            <Download size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Generating Secure PDF</h2>
          <p className="text-slate-400 font-medium mb-8">SignParse is flattening fields and encrypting your signatures...</p>
          <div className="w-64 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-blue-500 w-1/2 animate-progress-fast"></div>
          </div>
        </div>
      )}

      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            {getDocIcon()}
            <h1 className="text-sm font-bold text-white truncate max-w-[200px]">{docName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleAiDetection} disabled={isAiLoading} className="hidden sm:flex items-center gap-2 bg-slate-800 text-blue-400 px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 disabled:opacity-50 transition-all active:scale-95">
            {isAiLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            AI Smart Detect
          </button>
          <button 
            onClick={handleExportPDF} 
            disabled={isDownloading || fields.length === 0} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <FileCheck size={14} />}
            Finalize & Download
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0 overflow-y-auto z-20">
          <div className="p-6 space-y-8">
            <section>
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Add Content Field</h3>
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

            <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-800/50">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Compliance</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                Fields placed here are protected by SignParse e-Sign standards and are legally binding under UETA/eIDAS.
              </p>
            </div>
          </div>
        </aside>

        {/* Workspace */}
        <main 
          ref={workspaceRef}
          className={`flex-1 bg-slate-950 relative overflow-hidden flex justify-center items-start ${toolMode === 'pan' ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
          onDragOver={handleDragOver}
          onMouseDown={handleWorkspaceMouseDown}
          onMouseMove={handleWorkspaceMouseMove}
          onMouseUp={handleWorkspaceMouseUp}
          onMouseLeave={handleWorkspaceMouseUp}
        >
          {/* Document Container */}
          <div 
            ref={paperRef}
            className="bg-white shadow-2xl relative select-none flex-shrink-0 transition-transform duration-200 ease-out origin-top"
            style={{ 
              width: '100%', 
              maxWidth: '816px', 
              minHeight: '1056px',
              height: 'auto',
              marginTop: '48px',
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`
            }}
            onClick={() => toolMode === 'select' && setSelectedFieldId(null)}
          >
            {previewSrc ? (
              <img src={previewSrc} className="w-full block pointer-events-none" alt="Doc" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200">
                <FileText size={64} className="opacity-10 mb-4" />
                <p className="font-bold opacity-10 uppercase tracking-[0.2em]">{docName}</p>
              </div>
            )}

            {/* Fields Overlay */}
            {fields.map((field) => (
              <div
                key={field.id}
                draggable={toolMode === 'select'}
                onDragStart={() => handleDragStart(field.id)}
                style={{ 
                  left: `${field.x}%`, 
                  top: `${field.y}%`,
                  position: 'absolute'
                }}
                className={`z-20 group ${selectedFieldId === field.id ? 'z-30' : ''}`}
                onClick={(e) => { 
                  if (toolMode === 'select') {
                    e.stopPropagation(); 
                    setSelectedFieldId(field.id); 
                  }
                }}
              >
                <div 
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 shadow-xl min-w-[140px]
                    ${toolMode === 'select' ? 'cursor-move' : 'cursor-inherit'}
                    ${selectedFieldId === field.id ? 'border-blue-600 bg-white scale-105' : 'border-slate-300 bg-white/95'}
                  `}
                >
                  <div className="shrink-0">
                    {field.type === 'signature' && field.value ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : (
                      field.type === 'signature' ? <PenTool size={16} className="text-blue-400" /> :
                      field.type === 'date' ? <Calendar size={16} className="text-emerald-400" /> :
                      field.type === 'initials' ? <User size={16} className="text-purple-400" /> :
                      <Type size={16} className="text-amber-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-center truncate">
                    {field.type === 'signature' && field.value ? (
                      <img 
                        src={field.value} 
                        className="h-10 w-full object-contain signature-ink" 
                        style={{ filter: getSignatureFilter(field.color) }}
                        alt="signed" 
                      />
                    ) : (
                      field.type === 'text' && field.value ? (
                        <span className="text-sm font-semibold text-slate-900">{field.value}</span>
                      ) : (
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{field.label}</span>
                      )
                    )}
                  </div>

                  {selectedFieldId === field.id && toolMode === 'select' && !isDownloading && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeField(field.id); }} 
                      className="p-1 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Floating View Controls */}
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
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} 
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
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Properties</h2>
            </div>
            
            <div className="flex-1 space-y-8">
              {selectedField ? (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-slate-800/50 p-5 rounded-[2rem] border border-slate-800/50 space-y-4">
                    <div className="flex items-center gap-2">
                      <AlignLeft size={14} className="text-blue-400" />
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Display Label</label>
                    </div>
                    <input 
                      type="text" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                      value={selectedField.label}
                      onChange={(e) => updateFieldLabel(selectedField.id, e.target.value)}
                    />
                  </div>

                  {selectedField.type === 'signature' && (
                    <div className="space-y-6">
                      <div className="bg-slate-800/50 p-5 rounded-[2rem] border border-slate-800/50 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Palette size={14} className="text-blue-400" />
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Signature Style</label>
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
                            <span className="text-[10px] font-bold uppercase">Draw</span>
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
                    </div>
                  )}

                  <button 
                    onClick={() => removeField(selectedField.id)}
                    className="w-full py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Remove Field
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-40">
                  <MousePointer2 size={40} className="text-slate-600" />
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">Select a field on the document to edit its properties or placement.</p>
                </div>
              )}
            </div>

            {/* Finalization Card */}
            <div className="pt-8 border-t border-slate-800">
               <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2 text-white">
                      <FileCheck size={18} />
                      <h4 className="text-sm font-bold">Ready to sign?</h4>
                    </div>
                    <p className="text-[11px] text-blue-100/80 font-medium leading-relaxed">
                      Finalizing will bake your signatures into the document forever. This action is irreversible.
                    </p>
                    <button 
                      onClick={handleExportPDF}
                      disabled={isDownloading || fields.length === 0}
                      className="w-full py-3.5 bg-white text-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                      Finish Document
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Editor;
