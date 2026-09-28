import React, { useState } from 'react';
import { X, FileText, Search, Filter, Clock, Eye, Download, ShieldCheck } from 'lucide-react';

export default function EventMemoryModal({
  isOpen,
  onClose,
  events,
  onFocusCamera
}) {
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = events.filter((e) => {
    if (filterType !== 'ALL' && e.objectType.toUpperCase() !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        e.trackId.toLowerCase().includes(q) ||
        e.camCode.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.timestamp.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Surveillance Event Memory Store
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold font-mono">
                  {events.length} Events Logged
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Lightweight per-detection event stream feeding the Cross-Camera Correlation Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Filter & Search */}
        <div className="px-6 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter:</span>
            {['ALL', 'PERSON', 'VEHICLE'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === type
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Track ID (P-12), Cam..."
              className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-56 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Table of Events matching Requirement 4 */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-4 font-mono">Timestamp</th>
                  <th className="py-2.5 px-3">Camera ID</th>
                  <th className="py-2.5 px-3">Object Type</th>
                  <th className="py-2.5 px-3">Track ID</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Condition</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-800">
                      {evt.timestamp}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
                        {evt.camCode}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">
                      {evt.objectType}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-blue-600 font-mono">
                      {evt.displayLabel || `${evt.objectType} ${evt.trackId}`}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-600">
                      {typeof evt.confidence === 'number' && evt.confidence <= 1
                        ? evt.confidence.toFixed(2)
                        : `${evt.confidence}%`}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {evt.location}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        evt.qualityStatus?.includes('ENHANCED')
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {evt.qualityStatus || 'NORMAL'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          const cid = evt.camCode.toLowerCase().replace('-', '_');
                          onFocusCamera(cid);
                          onClose();
                        }}
                        className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Camera Feed"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 text-xs">
          <div className="text-slate-500">
            Event Stream Architecture: <strong className="text-slate-700">Lightweight In-Memory Event Ring Buffer (FIFO)</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition-colors"
          >
            Close Event Log
          </button>
        </div>

      </div>
    </div>
  );
}
