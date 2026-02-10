
import React, { useState, useMemo, useRef } from 'react';
import { 
  FilePlus, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpRight, 
  Users, 
  Clock, 
  CheckCircle2, 
  FileText,
  Upload,
  FolderPlus,
  Tag,
  X,
  Edit3,
  Download,
  FileUp,
  Image as ImageIcon,
  FileCode,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { DocumentStatus, Document } from '../types';
import { STATUS_ICONS } from '../constants';
import { useNavigate } from 'react-router-dom';

// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';

const INITIAL_MOCK_DOCS: Document[] = [
  { id: '1', name: 'Contract_Design_Services.pdf', owner: 'You', status: DocumentStatus.COMPLETED, createdAt: '2023-10-24', lastModified: 'Oct 24, 2023', size: '2.4 MB', category: 'Legal' },
  { id: '2', name: 'NDA_Venture_Capital.pdf', owner: 'Sarah Chen', status: DocumentStatus.PENDING, createdAt: '2023-10-23', lastModified: 'Oct 23, 2023', size: '1.1 MB', category: 'Legal' },
  { id: '3', name: 'Lease_Agreement_AptB.pdf', owner: 'You', status: DocumentStatus.DRAFT, createdAt: '2023-10-22', lastModified: 'Oct 22, 2023', size: '4.5 MB', category: 'Finance' },
  { id: '4', name: 'Employment_Offer_V3.pdf', owner: 'HR Dept', status: DocumentStatus.COMPLETED, createdAt: '2023-10-21', lastModified: 'Oct 21, 2023', size: '890 KB', category: 'HR' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All', 'Legal', 'HR', 'Finance', 'Sales']);
  const [documents] = useState<Document[]>(INITIAL_MOCK_DOCS);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [documents, searchTerm, selectedCategory]);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    const newDocId = Date.now().toString();
    try {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          sessionStorage.setItem(`preview_${newDocId}`, reader.result as string);
          navigate(`/editor?id=${newDocId}&name=${encodeURIComponent(file.name)}`);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs';
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          const imgData = canvas.toDataURL('image/png');
          sessionStorage.setItem(`preview_${newDocId}`, imgData);
          navigate(`/editor?id=${newDocId}&name=${encodeURIComponent(file.name)}`);
        }
      } else {
        navigate(`/editor?id=${newDocId}&name=${encodeURIComponent(file.name)}`);
      }
    } catch (err) {
      console.error('Error processing file:', err);
      alert('Failed to process document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-white">Your Workspace</h1>
          <p className="text-slate-400 mt-3 text-lg font-medium">Coordinate, parse, and verify your document assets.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          disabled={isProcessing}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-2xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <FilePlus size={20} />}
          New Signature Request
        </button>
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/5 rounded-[40px] w-full max-w-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Upload Asset</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">Files are encrypted instantly upon upload.</p>
              </div>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-3 hover:bg-white/5 rounded-2xl text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-10">
              {isProcessing ? (
                <div className="py-20 flex flex-col items-center gap-6">
                  <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                  </div>
                  <p className="text-white font-bold text-xl tracking-tight text-center">Reading document structure...</p>
                  <div className="w-full max-w-xs h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-1/2 animate-progress-fast"></div>
                  </div>
                </div>
              ) : (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if(f) processFile(f); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative border-2 border-dashed rounded-[32px] p-20 text-center transition-all cursor-pointer group
                    ${isDragging ? 'border-blue-500 bg-blue-500/5 scale-[0.98]' : 'border-white/5 hover:border-blue-500/30 hover:bg-white/5'}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-20 h-20 rounded-[28px] bg-blue-600/10 flex items-center justify-center text-blue-400 mb-8 transition-all duration-500 ${isDragging ? 'scale-125 neon-glow' : 'group-hover:scale-110'}`}>
                      <Upload size={36} />
                    </div>
                    <h3 className="text-2xl font-extrabold text-white mb-3">Drop file here</h3>
                    <p className="text-slate-400 font-medium mb-8">PDF, Images, or DOCX documents supported.</p>
                    <div className="px-8 py-3 bg-white text-slate-950 rounded-2xl text-sm font-black uppercase tracking-widest active:scale-95 transition-all">
                      Browse Files
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900/50 backdrop-blur-md rounded-[32px] border border-white/5 p-8">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Tag size={16} /> Filters
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold tracking-tight transition-all duration-300
                    ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                  `}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <ChevronRight size={16} />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="bg-slate-900/50 backdrop-blur-md rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] border-b border-white/5">
                    <th className="px-10 py-6">Document Name</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6 text-right">Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-white/5 cursor-pointer transition-colors group" onClick={() => navigate(`/editor?id=${doc.id}&name=${encodeURIComponent(doc.name)}`)}>
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <FileText size={22} />
                          </div>
                          <div>
                            <span className="text-lg font-extrabold text-white tracking-tight">{doc.name}</span>
                            <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">{doc.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-slate-800/50">
                            {STATUS_ICONS[doc.status]}
                          </div>
                          <span className="text-sm font-bold text-slate-300">{doc.status}</span>
                        </div>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <div className="inline-flex items-center gap-2 text-slate-500 font-bold text-sm bg-slate-800/50 px-4 py-2 rounded-xl group-hover:text-blue-400 group-hover:bg-blue-600/10 transition-all">
                          Manage <ChevronRight size={14} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
