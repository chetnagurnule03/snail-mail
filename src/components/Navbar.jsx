import React from 'react';
import { Mail, Github, Database, Sparkles, Send, Inbox as InboxIcon, Settings, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured, authService } from '../lib/supabase';

export default function Navbar({ activeTab, setActiveTab, user, setUser, onOpenConfig }) {
  const isConfigured = isSupabaseConfigured();

  const handleGitHubAuth = async () => {
    if (user) {
      await authService.signOut();
      setUser(null);
    } else {
      const { data, error } = await authService.signInWithGitHub();
      if (data?.user) {
        setUser(data.user);
      }
    }
  };

  return (
    <header className="glass-panel sticky top-4 z-40 mx-4 my-4 px-6 py-3 border-amber-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('inbox')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 via-red-700 to-yellow-500 flex items-center justify-center text-xl shadow-lg animate-float">
            🐌
          </div>
          <div>
            <div className="font-heading font-bold text-lg leading-none gradient-text flex items-center gap-2">
              SNAIL EMAIL
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                v1.0
              </span>
            </div>
            <p className="text-xs text-gray-400 font-serif italic">Timed & Wax-Sealed Digital Post</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`btn text-xs sm:text-sm px-4 py-2 rounded-lg ${
              activeTab === 'inbox' ? 'btn-gold' : 'btn-ghost'
            }`}
          >
            <InboxIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Postal Vault</span>
          </button>
          
          <button
            onClick={() => setActiveTab('compose')}
            className={`btn text-xs sm:text-sm px-4 py-2 rounded-lg ${
              activeTab === 'compose' ? 'btn-primary' : 'btn-ghost'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Compose Letter</span>
          </button>
        </div>

        {/* Status Indicators & Setup Modal Trigger */}
        <div className="flex items-center gap-3">
          
          {/* Supabase Status Indicator */}
          <button 
            onClick={onOpenConfig}
            className={`hidden md:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all ${
              isConfigured 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title="Click to configure Supabase URL and Keys"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="font-mono font-medium">
              {isConfigured ? 'Supabase Connected' : 'Supabase: Demo Mode'}
            </span>
            <Settings className="w-3.5 h-3.5 opacity-60 ml-1" />
          </button>

          {/* GitHub Auth Button */}
          <button
            onClick={handleGitHubAuth}
            className="btn btn-outline text-xs sm:text-sm py-2 px-3 flex items-center gap-2"
          >
            <Github className="w-4 h-4 text-white" />
            <span className="hidden lg:inline">
              {user ? (user.user_metadata?.full_name || 'GitHub User') : 'GitHub Connect'}
            </span>
            {user && <LogOut className="w-3.5 h-3.5 text-gray-400 hover:text-red-400 ml-1" />}
          </button>

        </div>

      </div>
    </header>
  );
}
