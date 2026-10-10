import Link from 'next/link';
import { ArrowRight, Sparkles, UserPlus, Users, ShieldCheck, Database, Image as ImageIcon, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[24rem] h-[24rem] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-md shadow-sm">
        <Sparkles className="w-4 h-4" />
        PES University • Department of CSE
      </div>

      {/* Hero Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          The Embrione{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Recruitment Portal
          </span>
        </h1>
        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Welcome to the official team onboarding and moderation system. Register your profile with real-time card rendering, client-side WebP image compression, and live moderation.
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/register"
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Candidate</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/team"
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 font-semibold text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <Users className="w-4 h-4 text-purple-400" />
          <span>Meet The Team</span>
        </Link>

        <Link
          href="/admin"
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 font-semibold text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Admin Portal</span>
        </Link>
      </div>

      {/* Feature Highlights Grid */}
      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Live Reactive Preview</h3>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Card rendering mirrors candidate keystrokes instantly using React state with zero server lag.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Browser WebP Engine</h3>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            Automatic client-side compression reduces 10MB+ camera photos by up to 95% before upload.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Supabase Cloud Stack</h3>
          <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
            PostgreSQL relational store with row-level security policies and public cloud object storage.
          </p>
        </div>
      </div>
    </div>
  );
}
