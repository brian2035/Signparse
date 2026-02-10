
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  MoreVertical, 
  Download, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Inbox,
  Send,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocumentStatus } from '../types';
import { STATUS_ICONS } from '../constants';

const MOCK_DOCS = [
  { id: '1', name: 'Contract_Design_Services.pdf', status: DocumentStatus.COMPLETED, date: 'Oct 24, 2023', size: '2.4 MB', type: 'Sent' },
  { id: '2', name: 'NDA_Venture_Capital.pdf', status: DocumentStatus.PENDING, date: 'Oct 23, 2023', size: '1.1 MB', type: 'Received' },
  { id: '3', name: 'Lease_Agreement_AptB.pdf', status: DocumentStatus.DRAFT, date: 'Oct 22, 2023', size: '4.5 MB', type: 'Draft' },
  { id: '4', name: 'Employment_Offer_V3.pdf', status: DocumentStatus.COMPLETED, date: 'Oct 21, 2023', size: '890 KB', type: 'Sent' },
];

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filteredDocs = MOCK_DOCS.filter(doc => filter === 'All' || doc.type === filter);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Document Repository</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search all documents..." 
              className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-80"
            />
          </div>
          <button className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900/50 rounded-2xl w-fit border border-slate-800/50">
        {[
          { id: 'All', icon: FileText },
          { id: 'Sent', icon: Send },
          { id: 'Received', icon: Inbox },
          { id: 'Draft', icon: Save }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${filter === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            <tab.icon size={16} />
            {tab.id}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                <th className="px-8 py-5">Document Name</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Type</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDocs.map((doc) => (
                <tr 
                  key={doc.id} 
                  className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/editor?id=${doc.id}&name=${encodeURIComponent(doc.name)}`)}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <FileText size={20} />
                      </div>
                      <span className="font-semibold text-slate-200 group-hover:text-white">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm">
                      {STATUS_ICONS[doc.status]}
                      <span className="text-slate-400">{doc.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 font-medium">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500">{doc.date}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white" title="Download">
                        <Download size={18} />
                      </button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white" title="Open">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-2 hover:bg-rose-900/20 rounded-lg text-slate-400 hover:text-rose-500" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Documents;
