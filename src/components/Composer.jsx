import React, { useState } from 'react';
import { Send, Clock, Sparkles, Shield, Check, Calendar, Lock, Zap, Bell, Share2 } from 'lucide-react';
import { letterService } from '../lib/supabase';

const STAMPS = [
  { id: 'royal_snail', name: 'Royal Snail', icon: '🐌', color: 'from-amber-600 to-yellow-500' },
  { id: 'golden_snitch', name: 'Golden Snitch', icon: '🪙⚡', color: 'from-yellow-400 via-amber-300 to-amber-600' },
  { id: 'golden_leaf', name: 'Golden Autumn', icon: '🍂', color: 'from-orange-500 to-amber-700' },
  { id: 'vintage_owl', name: 'Postmaster Owl', icon: '🦉', color: 'from-purple-600 to-indigo-800' },
  { id: 'time_capsule', name: 'Time Capsule', icon: '⏳', color: 'from-blue-600 to-cyan-800' },
];

const WAX_COLORS = [
  { name: 'Crimson Red', hex: '#9b111e' },
  { name: 'Royal Gold', hex: '#d4af37' },
  { name: 'Imperial Navy', hex: '#1e3a8a' },
  { name: 'Forest Emerald', hex: '#065f46' },
];

const STATIONERY_THEMES = [
  { id: 'classic_parchment', name: 'Classic Parchment', bgClass: 'parchment-sheet', textClass: 'text-stone-900' },
  { id: 'midnight_star', name: 'Midnight Starlight', bgClass: 'bg-slate-900 text-amber-100 border border-amber-500/30', textClass: 'text-amber-100' },
  { id: 'rose_velvet', name: 'Rose Velvet', bgClass: 'bg-pink-950/80 text-rose-100 border border-rose-500/30', textClass: 'text-rose-100' },
];

export default function Composer({ user, onLetterSent }) {
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [stampType, setStampType] = useState('golden_snitch');
  const [waxColor, setWaxColor] = useState('#d4af37');
  const [theme, setTheme] = useState('classic_parchment');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [deliveryPreset, setDeliveryPreset] = useState('1_min');
  const [customDate, setCustomDate] = useState('');
  const [isSealing, setIsSealing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const calculateDeliveryDate = () => {
    const now = new Date();
    if (deliveryPreset === 'now') return now.toISOString();
    if (deliveryPreset === '1_min') return new Date(now.getTime() + 60 * 1000).toISOString();
    if (deliveryPreset === '1_day') return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    if (deliveryPreset === '1_year') return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
    if (deliveryPreset === 'custom' && customDate) return new Date(customDate).toISOString();
    return new Date(now.getTime() + 60 * 1000).toISOString();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipientEmail || !subject || !body) return;

    setIsSealing(true);
    const deliverAt = calculateDeliveryDate();

    const letterData = {
      sender_id: user?.id || null,
      sender_name: user?.user_metadata?.full_name || 'Anonymous Mailer',
      sender_email: user?.email || 'guest@snailmail.local',
      recipient_name: recipientName || recipientEmail,
      recipient_email: recipientEmail,
      subject,
      body,
      deliver_at: deliverAt,
      stamp_type: stampType,
      stationery_theme: theme,
      wax_color: waxColor,
      webhook_url: webhookUrl,
    };

    setTimeout(async () => {
      const { error } = await letterService.createLetter(letterData);
      setIsSealing(false);
      
      if (!error) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setRecipientName('');
          setRecipientEmail('');
          setSubject('');
          setBody('');
          setWebhookUrl('');
          if (onLetterSent) onLetterSent();
        }, 1800);
      }
    }, 1200);
  };

  const activeThemeObj = STATIONERY_THEMES.find(t => t.id === theme) || STATIONERY_THEMES[0];
  const activeStampObj = STAMPS.find(s => s.id === stampType) || STAMPS[0];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-3">
          <Zap className="w-3.5 h-3.5" /> Golden Snitch Express Notifier Enabled
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold gradient-text mb-2">
          Compose Delayed Snail Letter
        </h1>
        <p className="text-gray-400 font-serif italic max-w-xl mx-auto text-sm sm:text-base">
          Craft a thoughtful message, affix the Golden Snitch stamp, seal it with wax, and send webhook pings automatically upon delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Panel (Left side) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 space-y-5">
            <h3 className="font-heading font-semibold text-amber-400 text-sm tracking-wider uppercase flex items-center gap-2">
              <Clock className="w-4 h-4" /> 1. Delivery Timer & Speed
            </h3>

            <div>
              <label className="input-label">Select Delivery Transit Delay</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: '1_min', label: '⚡ 1 Minute (Test)' },
                  { id: '1_day', label: '🐌 1 Day (Slow)' },
                  { id: '1_year', label: '⏳ 1 Year (Capsule)' },
                  { id: 'custom', label: '📅 Custom Date' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDeliveryPreset(item.id)}
                    className={`btn text-xs py-2 px-3 justify-start ${
                      deliveryPreset === item.id 
                        ? 'btn-gold' 
                        : 'bg-slate-900/60 border border-white/10 hover:border-amber-500/40 text-gray-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {deliveryPreset === 'custom' && (
                <div className="mt-3">
                  <input
                    type="datetime-local"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="input-field text-xs font-mono"
                  />
                </div>
              )}
            </div>

            {/* Stamp & Wax Selection */}
            <div className="pt-2 border-t border-white/10">
              <label className="input-label mb-2">2. Postal Stamp</label>
              <div className="grid grid-cols-2 gap-2">
                {STAMPS.map((stamp) => (
                  <div
                    key={stamp.id}
                    onClick={() => setStampType(stamp.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer flex items-center gap-2 transition-all ${
                      stampType === stamp.id
                        ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-400'
                        : 'bg-slate-900/40 border-white/5 hover:border-white/20 text-gray-400'
                    }`}
                  >
                    <span className="text-xl">{stamp.icon}</span>
                    <span className="text-xs font-medium">{stamp.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Snitch Webhook Notifier Input */}
            <div className="pt-2 border-t border-white/10">
              <label className="input-label mb-1 flex items-center gap-1.5 text-amber-300">
                <Bell className="w-3.5 h-3.5 text-amber-400" /> Golden Snitch Webhook URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://discord.com/api/webhooks/... or https://httpbin.org/post"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="input-field text-xs font-mono"
              />
              <p className="text-[11px] text-gray-400 mt-1 italic">
                Snitch will send an instant HTTP POST JSON payload to this endpoint upon delivery.
              </p>
            </div>

            {/* Wax Seal Color Picker */}
            <div className="pt-2 border-t border-white/10">
              <label className="input-label mb-2">3. Wax Seal Color</label>
              <div className="flex items-center gap-3">
                {WAX_COLORS.map((wax) => (
                  <button
                    key={wax.hex}
                    type="button"
                    onClick={() => setWaxColor(wax.hex)}
                    style={{ backgroundColor: wax.hex }}
                    className={`w-9 h-9 rounded-full transition-transform flex items-center justify-center ${
                      waxColor === wax.hex ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-105 opacity-80'
                    }`}
                    title={wax.name}
                  >
                    {waxColor === wax.hex && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Parchment Theme */}
            <div className="pt-2 border-t border-white/10">
              <label className="input-label mb-2">4. Stationery Paper</label>
              <div className="flex gap-2">
                {STATIONERY_THEMES.map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTheme(th.id)}
                    className={`btn text-xs flex-1 py-1.5 ${
                      theme === th.id ? 'btn-gold' : 'btn-outline'
                    }`}
                  >
                    {th.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Live Letter Parchment Canvas (Right side) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSend} className={`p-8 rounded-2xl relative transition-all duration-500 ${activeThemeObj.bgClass}`}>
            
            {/* Stamp & Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-amber-900/20">
              <div className="space-y-1">
                <p className="text-xs uppercase font-mono tracking-widest text-amber-900/60 font-semibold flex items-center gap-1">
                  <span>Snail Express Dispatch</span>
                  {stampType === 'golden_snitch' && <span className="text-amber-700">⚡ SNITCH ACTIVE</span>}
                </p>
                <div className="text-2xl font-heading font-bold text-amber-950">
                  Letter of Delivery
                </div>
              </div>

              {/* Selected Postage Stamp Visual */}
              <div className={`w-20 h-24 border-2 border-dashed border-amber-800/40 rounded p-1 bg-amber-100/60 flex flex-col items-center justify-center text-center shadow-inner relative ${
                stampType === 'golden_snitch' ? 'ring-2 ring-amber-500/80 bg-gradient-to-b from-amber-100 to-amber-200' : ''
              }`}>
                <span className="text-2xl mb-1">{activeStampObj.icon}</span>
                <span className="text-[9px] font-mono uppercase font-extrabold text-amber-950">
                  {activeStampObj.name}
                </span>
                {webhookUrl && (
                  <div className="absolute -top-2 -right-2 bg-amber-600 text-white text-[9px] p-1 rounded-full shadow" title="Snitch Webhook Armed">
                    ⚡
                  </div>
                )}
              </div>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-xs font-serif font-bold text-amber-950 mb-1">To (Recipient Name)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lady Genevieve"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-white/60 border border-amber-900/20 rounded px-3 py-2 text-stone-900 placeholder:text-stone-400 font-serif outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-bold text-amber-950 mb-1">Recipient Email</label>
                <input
                  type="email"
                  required
                  placeholder="recipient@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full bg-white/60 border border-amber-900/20 rounded px-3 py-2 text-stone-900 placeholder:text-stone-400 font-mono text-sm outline-none focus:border-amber-700"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="mb-5">
              <label className="block text-xs font-serif font-bold text-amber-950 mb-1">Subject Line</label>
              <input
                type="text"
                required
                placeholder="A secret message waiting for tomorrow..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white/60 border border-amber-900/20 rounded px-3 py-2 text-stone-900 placeholder:text-stone-400 font-serif font-semibold text-lg outline-none focus:border-amber-700"
              />
            </div>

            {/* Letter Body */}
            <div className="mb-6">
              <label className="block text-xs font-serif font-bold text-amber-950 mb-1">Letter Content</label>
              <textarea
                required
                rows={7}
                placeholder="Write your timeless words here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-white/70 border border-amber-900/20 rounded px-4 py-3 text-stone-900 placeholder:text-stone-400 font-serif text-base leading-relaxed outline-none focus:border-amber-700 shadow-inner resize-none"
              />
            </div>

            {/* Bottom Seal & Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-900/20">
              
              {/* Wax Seal Visual Indicator */}
              <div className="flex items-center gap-3">
                <div 
                  className="wax-seal" 
                  style={{ backgroundColor: waxColor }}
                  title="Your custom wax seal"
                >
                  <span className="text-amber-200 font-heading font-extrabold text-sm drop-shadow">
                    {stampType === 'golden_snitch' ? '⚡' : 'S'}
                  </span>
                </div>
                <div className="text-xs font-serif text-amber-950">
                  <p className="font-semibold">Secured by Snail Express</p>
                  <p className="opacity-75">
                    {webhookUrl ? '⚡ Snitch Webhook Alert Armed' : 'Encrypted with Supabase backend'}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSealing || isSuccess}
                className="btn btn-primary w-full sm:w-auto px-6 py-3 text-base shadow-xl"
              >
                {isSealing ? (
                  <>
                    <span className="animate-spin text-lg">🪙</span> Catching Golden Snitch...
                  </>
                ) : isSuccess ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-300" /> Dispatched!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Seal & Dispatch Letter
                  </>
                )}
              </button>

            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
