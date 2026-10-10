import React from 'react';
import { Mail, GraduationCap, Calendar, User } from 'lucide-react';
import { Member } from '@/lib/supabase';

// Brand icons as clean inline SVGs
function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.05 1.53 1.53 0 0 0 0 3.05m1.37 9.74v-8.37H5.1v8.37h2.73z" />
    </svg>
  );
}

interface MemberCardProps {
  member: Partial<Member>;
  isPreview?: boolean;
}

// Domain badge color helper
export function getDomainBadgeStyle(domain?: string) {
  switch (domain) {
    case 'Web Development':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    case 'Design':
      return 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20';
    case 'Logistics':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'Operations':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Sponsorship':
      return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
    case 'Hospitality':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    case 'Social Media':
      return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    case 'Event Management':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    default:
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  }
}

// Position badge style helper
export function getPositionBadgeStyle(position?: string) {
  switch (position) {
    case 'Head':
      return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30';
    case 'Vice-Head':
      return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30';
    case 'Core Member':
      return 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30';
    default:
      return 'bg-zinc-800 text-zinc-300 border-zinc-700';
  }
}

export default function MemberCard({ member, isPreview = false }: MemberCardProps) {
  const {
    name = '',
    domain = 'Web Development',
    position = 'Member',
    srn = '',
    email = '',
    linkedin_url = '',
    github_url = '',
    branch = 'CSE',
    semester = 1,
    bio = '',
    photo_url = '',
  } = member;

  const displayName = name.trim() || 'Your Full Name';
  const displayBio =
    bio?.trim() ||
    'A short bio about yourself, your interests, experience, and what excites you about joining The Embrione.';

  return (
    <div className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-zinc-700/60 via-zinc-800/40 to-zinc-900/60 hover:from-indigo-500/50 hover:via-purple-500/30 hover:to-zinc-800/60 transition-all duration-300 shadow-xl shadow-black/40">
      <div className="relative h-full flex flex-col justify-between rounded-2xl bg-zinc-900/90 backdrop-blur-xl p-6 border border-zinc-800/80 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />

        {/* Top Header: Avatar & Badges */}
        <div>
          <div className="flex items-start justify-between gap-4">
            {/* Avatar Image with Fallback */}
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-zinc-700/80 group-hover:border-indigo-500/60 transition-colors duration-300 bg-zinc-800 flex items-center justify-center shadow-md">
                {photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo_url}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-500">
                    <User className="w-8 h-8 stroke-1 text-zinc-400" />
                  </div>
                )}
              </div>
              {isPreview && (
                <span className="absolute -bottom-2 -right-2 text-[10px] font-semibold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full shadow">
                  Preview
                </span>
              )}
            </div>

            {/* Position & Domain Badges */}
            <div className="flex flex-col items-end gap-1.5 flex-1 min-w-0">
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border tracking-wide uppercase ${getPositionBadgeStyle(
                  position
                )}`}
              >
                {position || 'Member'}
              </span>
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-md border truncate max-w-full ${getDomainBadgeStyle(
                  domain
                )}`}
              >
                {domain || 'Domain'}
              </span>
            </div>
          </div>

          {/* Member Name & SRN */}
          <div className="mt-4">
            <h3 className="text-lg font-bold text-white tracking-tight truncate group-hover:text-indigo-200 transition-colors">
              {displayName}
            </h3>
            <p className="text-xs font-mono text-zinc-400 tracking-wider">
              {srn.trim() ? srn.toUpperCase() : 'PES1UG23CS000'}
            </p>
          </div>

          {/* Academic Info: Branch & Semester */}
          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
            <div className="flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>{branch || 'Branch'}</span>
            </div>
            <div className="flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Sem {semester || 1}</span>
            </div>
          </div>

          {/* Bio with line-clamp */}
          <p className="mt-4 text-xs leading-relaxed text-zinc-300 line-clamp-3 min-h-[3.6rem]">
            {displayBio}
          </p>
        </div>

        {/* Footer: Contact & Social links */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-zinc-400">
          <div className="flex items-center gap-2">
            {email && (
              <a
                href={`mailto:${email}`}
                className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition"
                title={email}
                target="_blank"
                rel="noreferrer"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {github_url && (
              <a
                href={github_url.startsWith('http') ? github_url : `https://${github_url}`}
                className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition"
                title="GitHub"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {linkedin_url && (
              <a
                href={linkedin_url.startsWith('http') ? linkedin_url : `https://${linkedin_url}`}
                className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition"
                title="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedinIcon className="w-4 h-4 text-sky-400" />
              </a>
            )}
          </div>

          <span className="text-[11px] font-mono text-zinc-500">The Embrione</span>
        </div>
      </div>
    </div>
  );
}
