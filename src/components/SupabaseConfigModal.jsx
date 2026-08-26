import React, { useState } from 'react';
import { Database, Github, CheckCircle2, AlertTriangle, ExternalLink, Copy, Check, Key, ShieldCheck, Code, Zap, Bell, Send } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function SupabaseConfigModal({ isOpen, onClose }) {
  const [url, setUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [anonKey, setAnonKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [testWebhookUrl, setTestWebhookUrl] = useState('https://httpbin.org/post');
  const [webhookResult, setWebhookResult] = useState(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [activeTab, setActiveTab] = useState('credentials'); // 'credentials', 'snitch', 'sql', 'github'

  if (!isOpen) return null;

  const currentIsConfigured = isSupabaseConfigured();

  const envTemplate = `VITE_SUPABASE_URL=${url || 'https://your-project-id.supabase.co'}
VITE_SUPABASE_ANON_KEY=${anonKey || 'your-actual-anon-key-here'}`;

  const sqlCode = `-- Run this in Supabase SQL Editor:
ALTER TABLE public.letters ADD COLUMN IF NOT EXISTS webhook_url TEXT;`;

  const handleTestWebhook = async () => {
    if (!testWebhookUrl) return;
    setIsTestingWebhook(true);
    setWebhookResult(null);

    try {
      const payload = {
        event: 'snail_email.snitch_test_ping',
        timestamp: new Date().toISOString(),
        message: '⚡ Golden Snitch Webhook Connection Successful!',
        app: 'Snail Email'
      };

      const res = await fetch(testWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setWebhookResult({
        success: res.ok,
        status: res.status,
        message: res.ok ? `HTTP ${res.status}: Golden Snitch ping received!` : `HTTP ${res.status}: Webhook returned error response.`
      });
    } catch (err) {
      setWebhookResult({
        success: false,
        message: `Connection Error: ${err.message}`
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'sql') {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } else {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl overflow-hidden border-amber-500/40 shadow-2xl animate-scale-up">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-gray-100">
                GitHub, Supabase & Snitch Setup
              </h3>
              <p className="text-xs text-gray-400 font-serif">
                Manage credentials, database schemas, and Golden Snitch webhooks
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-white/10 bg-slate-950/60 px-6 overflow-x-auto">
          {[
            { id: 'credentials', label: '1. Supabase API Keys' },
            { id: 'snitch', label: '2. Snitch Webhook Tester ⚡' },
            { id: 'sql', label: '3. Database Schema' },
            { id: 'github', label: '4. GitHub OAuth' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-300 bg-white/5'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: Credentials */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
                currentIsConfigured
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                {currentIsConfigured ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
                )}
                <div>
                  <p className="font-bold text-sm">
                    {currentIsConfigured ? 'Live Supabase Connection Active' : 'Currently Running in Local Demo Mode'}
                  </p>
                  <p className="opacity-80 mt-0.5">
                    {currentIsConfigured 
                      ? 'Your application is directly reading and writing to your real Supabase project.' 
                      : 'To connect to your own Supabase cloud database, paste your credentials below into your .env file.'}
                  </p>
                </div>
              </div>

              <div>
                <label className="input-label">Project URL (VITE_SUPABASE_URL)</label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="input-field font-mono text-xs"
                />
              </div>

              <div>
                <label className="input-label">Public Anon Key (VITE_SUPABASE_ANON_KEY)</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  className="input-field font-mono text-xs"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gray-300">
                  <span>Environment Code (.env)</span>
                  <button
                    onClick={() => copyToClipboard(envTemplate, 'env')}
                    className="text-amber-400 hover:underline flex items-center gap-1"
                  >
                    {copiedEnv ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedEnv ? 'Copied' : 'Copy .env snippet'}
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-amber-300/90 bg-black/50 p-3 rounded overflow-x-auto">
                  {envTemplate}
                </pre>
              </div>

            </div>
          )}

          {/* TAB 2: Snitch Webhook Tester */}
          {activeTab === 'snitch' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <h4 className="font-heading font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Golden Snitch Express Webhook Tester
                </h4>
                <p className="text-xs text-gray-300">
                  The Snitch engine automatically dispatches a JSON POST payload to your webhook (Discord, Slack, Make, Zapier, HTTP endpoint) when a letter is delivered.
                </p>
              </div>

              <div>
                <label className="input-label">Webhook URL to Test</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={testWebhookUrl}
                    onChange={(e) => setTestWebhookUrl(e.target.value)}
                    placeholder="https://httpbin.org/post"
                    className="input-field font-mono text-xs flex-1"
                  />
                  <button
                    onClick={handleTestWebhook}
                    disabled={isTestingWebhook}
                    className="btn btn-gold text-xs py-2 px-4 whitespace-nowrap"
                  >
                    {isTestingWebhook ? 'Pinging...' : 'Send Test Ping ⚡'}
                  </button>
                </div>
              </div>

              {webhookResult && (
                <div className={`p-4 rounded-xl border font-mono text-xs ${
                  webhookResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}>
                  <p className="font-bold">{webhookResult.message}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SQL Schema */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-300 font-serif">
                Run this SQL in your Supabase Dashboard SQL Editor to ensure the <code className="text-amber-200">webhook_url</code> column exists:
              </p>

              <div className="relative">
                <button
                  onClick={() => copyToClipboard(sqlCode, 'sql')}
                  className="absolute top-3 right-3 btn btn-gold text-xs py-1 px-3 z-10"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSql ? 'Copied SQL' : 'Copy Schema SQL'}
                </button>
                <pre className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-4 rounded-xl border border-white/10 overflow-x-auto max-h-60">
                  {sqlCode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: GitHub Integration */}
          {activeTab === 'github' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3">
                <h4 className="font-heading font-bold text-amber-400 flex items-center gap-2">
                  <Github className="w-4 h-4" /> Enable GitHub OAuth in Supabase
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Go to <strong>GitHub Settings ➔ Developer Settings ➔ OAuth Apps</strong>.</li>
                  <li>Click <strong>New OAuth App</strong> and set Homepage URL to your web app address.</li>
                  <li>Copy Client ID & Client Secret into <strong>Supabase Dashboard ➔ Authentication ➔ Providers ➔ GitHub</strong>.</li>
                </ol>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-white/10 flex justify-end">
          <button onClick={onClose} className="btn btn-gold text-xs py-2 px-5">
            Done & Close
          </button>
        </div>

      </div>
    </div>
  );
}
