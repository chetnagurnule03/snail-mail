import React, { useState, useEffect } from 'react';
import { Mail, Clock, CheckCircle2, Search, RefreshCw, Lock, Sparkles, Zap, Bell, ChevronRight, Send } from 'lucide-react';
import { letterService, triggerSnitchWebhook } from '../lib/supabase';

export default function Inbox({ user, onNewLetterClick }) {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'in_transit', 'delivered'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [snitchStatus, setSnitchStatus] = useState(null);
  const [now, setNow] = useState(new Date());

  const loadLetters = async () => {
    setLoading(true);
    const { data } = await letterService.getLetters();
    if (data) setLetters(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLetters();
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getRemainingTime = (deliverAt) => {
    const target = new Date(deliverAt);
    const diff = target - now;

    if (diff <= 0) return { delivered: true, text: 'Delivered' };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { delivered: false, text: `${days}d ${hours % 24}h remaining` };
    }

    return {
      delivered: false,
      text: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    };
  };

  const handleManualSnitchPing = async (letter) => {
    setSnitchStatus({ loading: true });
    const res = await triggerSnitchWebhook(letter);
    setSnitchStatus(res);
  };

  const filteredLetters = letters.filter(l => {
    const isDelivered = new Date(l.deliver_at) <= now || l.status === 'delivered';
    const currentStatus = isDelivered ? 'delivered' : 'in_transit';

    if (activeFilter === 'in_transit' && currentStatus !== 'in_transit') return false;
    if (activeFilter === 'delivered' && currentStatus !== 'delivered') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        l.subject?.toLowerCase().includes(q) ||
        l.recipient_name?.toLowerCase().includes(q) ||
        l.sender_name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Controls */}
      <div className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold gradient-text flex items-center gap-2">
            <Mail className="w-6 h-6 text-amber-400" /> Snail Postal Vault
          </h2>
          <p className="text-xs text-gray-400 font-serif italic">
            Track in-transit delayed mail & read wax-sealed delivered letters.
          </p>
        </div>

        {/* Filter Buttons & Refresh */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex bg-slate-900/80 p-1 rounded-lg border border-white/10 text-xs">
            {[
              { id: 'all', label: 'All Post' },
              { id: 'in_transit', label: '🐌 In Transit' },
              { id: 'delivered', label: '✉️ Delivered' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  activeFilter === f.id ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={loadLetters}
            className="btn btn-outline text-xs py-2 px-3"
            title="Refresh letters"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Letter Cards List */}
        <div className={selectedLetter ? 'lg:col-span-6 space-y-4' : 'lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
          
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-400 space-y-3">
              <div className="animate-spin text-3xl">🐌</div>
              <p className="font-serif">Retrieving mail from Snail Post vaults...</p>
            </div>
          ) : filteredLetters.length === 0 ? (
            <div className="col-span-full glass-panel p-12 text-center text-gray-400 space-y-4">
              <div className="text-4xl">📭</div>
              <h3 className="font-heading text-lg font-bold text-gray-200">No Mail in this Vault Filter</h3>
              <p className="text-xs max-w-sm mx-auto">
                No letters match your selection. Compose your first wax-sealed letter to get started!
              </p>
              <button onClick={onNewLetterClick} className="btn btn-primary text-xs py-2 px-4">
                Compose New Letter
              </button>
            </div>
          ) : (
            filteredLetters.map(letter => {
              const timeInfo = getRemainingTime(letter.deliver_at);
              const isDelivered = timeInfo.delivered;
              const isSnitch = letter.stamp_type === 'golden_snitch' || Boolean(letter.webhook_url);

              return (
                <div
                  key={letter.id}
                  onClick={() => {
                    setSelectedLetter(letter);
                    setSnitchStatus(null);
                  }}
                  className={`glass-panel p-5 glass-panel-hover cursor-pointer relative overflow-hidden transition-all ${
                    selectedLetter?.id === letter.id ? 'ring-2 ring-amber-400 border-amber-400/50 bg-amber-500/5' : ''
                  }`}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`badge badge-${isDelivered ? 'delivered' : 'in_transit'}`}>
                      {isDelivered ? '✉️ Delivered' : '🐌 In Transit'}
                    </span>
                    
                    {isSnitch && (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" /> Golden Snitch
                      </span>
                    )}
                  </div>

                  {/* Letter Details */}
                  <h4 className="font-serif font-bold text-lg text-gray-100 mb-1 line-clamp-1">
                    {letter.subject}
                  </h4>

                  <p className="text-xs text-gray-400 mb-4 font-mono">
                    To: <span className="text-amber-200 font-semibold">{letter.recipient_name}</span> ({letter.recipient_email})
                  </p>

                  {/* Countdown Timer or Delivered Stamp */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    {isDelivered ? (
                      <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unsealed & Ready
                      </span>
                    ) : (
                      <span className="text-amber-400 font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 animate-pulse" /> {timeInfo.text}
                      </span>
                    )}

                    <div className="flex items-center gap-1 text-amber-300 font-semibold group">
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Wax Seal Accent Corner */}
                  <div 
                    className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full opacity-30 blur-[1px]"
                    style={{ backgroundColor: letter.wax_color || '#9b111e' }}
                  />
                </div>
              );
            })
          )}

        </div>

        {/* Selected Letter Reader View */}
        {selectedLetter && (
          <div className="lg:col-span-6">
            <div className="sticky top-24 glass-panel p-6 border-amber-500/30 space-y-6 animate-fade-in">
              
              {/* Reader Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {selectedLetter.stamp_type === 'golden_snitch' ? '🪙⚡' : '🐌'}
                  </span>
                  <div>
                    <span className={`badge badge-${getRemainingTime(selectedLetter.deliver_at).delivered ? 'delivered' : 'in_transit'}`}>
                      {getRemainingTime(selectedLetter.deliver_at).delivered ? 'Delivered Post' : 'Locked in Transit'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLetter(null)}
                  className="btn btn-ghost text-xs py-1 px-2"
                >
                  Close Reader ✕
                </button>
              </div>

              {/* Snitch Webhook Alert Trigger Button */}
              {selectedLetter.webhook_url && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5" /> Golden Snitch Webhook Notifier
                    </span>
                    <button
                      onClick={() => handleManualSnitchPing(selectedLetter)}
                      disabled={snitchStatus?.loading}
                      className="btn btn-gold text-[11px] py-1 px-3"
                    >
                      {snitchStatus?.loading ? 'Dispatching...' : 'Fire Snitch Webhook Alert ⚡'}
                    </button>
                  </div>

                  {snitchStatus && !snitchStatus.loading && (
                    <p className={`text-[11px] font-mono p-2 rounded ${
                      snitchStatus.success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {snitchStatus.message}
                    </p>
                  )}
                </div>
              )}

              {/* Locked vs Unlocked Letter Content */}
              {!getRemainingTime(selectedLetter.deliver_at).delivered ? (
                <div className="p-8 rounded-xl bg-slate-900/90 border border-amber-500/20 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-amber-300">
                    Wax Seal Intact
                  </h3>
                  <p className="text-xs text-gray-400 font-serif leading-relaxed max-w-md mx-auto">
                    This Snail Mail is still making its journey across time. The wax seal will automatically break and unlock the full text when the transit timer expires.
                  </p>
                  <div className="inline-block font-mono text-sm px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {getRemainingTime(selectedLetter.deliver_at).text}
                  </div>
                </div>
              ) : (
                /* Unlocked Parchment Sheet */
                <div className="parchment-sheet p-8 rounded-xl relative shadow-2xl">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-xs font-mono font-bold text-amber-900 uppercase tracking-widest">
                        From: {selectedLetter.sender_name}
                      </p>
                      <p className="text-[11px] font-mono text-stone-600">
                        {selectedLetter.sender_email}
                      </p>
                    </div>

                    <div 
                      className="wax-seal" 
                      style={{ backgroundColor: selectedLetter.wax_color || '#d4af37' }}
                    >
                      <span className="text-amber-100 font-heading font-extrabold text-xs">
                        OPEN
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-2xl text-stone-900 mb-4 pb-2 border-b border-amber-900/20">
                    {selectedLetter.subject}
                  </h3>

                  <div className="font-serif text-stone-900 text-base leading-relaxed whitespace-pre-line mb-8">
                    {selectedLetter.body}
                  </div>

                  <div className="pt-4 border-t border-amber-900/20 text-right text-xs font-serif text-stone-600 italic">
                    Delivered to {selectedLetter.recipient_name} ({selectedLetter.recipient_email})
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
