import React, { useState } from 'react';
import { ShieldAlert, Terminal, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate database lookup delay for premium UI feel
    setTimeout(() => {
      if (username === 'shafi@admin.com' && password === 'admin@shafi') {
        onLoginSuccess(username);
      } else {
        setError('ACCESS DENIED: Invalid tactical credentials.');
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#060814] flex flex-col justify-center items-center px-4 relative overflow-hidden font-mono text-zinc-300">
      {/* Dynamic scanline background effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-40"></div>

      {/* Cyber ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-emerald-950/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0b0e1f]/95 border border-red-500/30 rounded-xl shadow-[0_0_50px_rgba(239,68,68,0.15)] overflow-hidden backdrop-blur-md relative z-10">
        {/* Glow accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-full text-red-500 mb-4 animate-pulse">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black tracking-[0.2em] text-white uppercase text-center flex items-center gap-2">
              <span className="text-red-500">NTT</span>RAPTOR
            </h1>
            <p className="text-xs text-zinc-500 uppercase mt-1 tracking-wider text-center">
              Tactical Red Team Report Hub
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border-l-4 border-red-500 text-red-400 text-sm rounded-r-md flex items-start gap-3">
              <Terminal className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">SYSTEM ERROR:</span> {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter operator username"
                  style={{ backgroundColor: '#0d0f22', color: '#ffffff', borderColor: '#3f3f46' }}
                  className="w-full border rounded-lg px-4 py-3 text-sm placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret code"
                  style={{ backgroundColor: '#0d0f22', color: '#ffffff', borderColor: '#3f3f46' }}
                  className="w-full border rounded-lg pl-4 pr-12 py-3 text-sm placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 disabled:from-zinc-800 disabled:to-zinc-800 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-lg text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(239,68,68,0.25)] hover:shadow-[0_4px_30px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>DECRYPTING CREDENTIALS...</span>
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4 animate-pulse" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
