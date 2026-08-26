import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Composer from './components/Composer';
import Inbox from './components/Inbox';
import SupabaseConfigModal from './components/SupabaseConfigModal';
import { authService, isSupabaseConfigured } from './lib/supabase';
import { Github, Database, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [user, setUser] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  useEffect(() => {
    // Check initial user session
    authService.getCurrentUser().then((u) => {
      if (u) setUser(u);
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Header Navigation */}
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          setUser={setUser}
          onOpenConfig={() => setIsConfigOpen(true)}
        />

        {/* Main Content Area */}
        <main className="pb-16">
          {activeTab === 'inbox' ? (
            <Inbox
              user={user}
              onNewLetterClick={() => setActiveTab('compose')}
            />
          ) : (
            <Composer
              user={user}
              onLetterSent={() => setActiveTab('inbox')}
            />
          )}
        </main>
      </div>

      {/* Footer Banner */}
      <footer className="border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          
          <div className="flex items-center gap-2 font-serif">
            <span>🐌 Snail Email</span>
            <span>•</span>
            <span>Wax-Sealed Digital Mail Service</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsConfigOpen(true)}
              className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSupabaseConfigured() ? 'Supabase Connected' : 'Supabase Config'}</span>
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repo Ready</span>
            </a>
          </div>

        </div>
      </footer>

      {/* Supabase Configuration Modal */}
      <SupabaseConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />

    </div>
  );
}
