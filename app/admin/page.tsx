'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Check,
  X,
  Trash2,
  RefreshCw,
  Search,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Mail,
  GraduationCap,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { supabase, Member } from '@/lib/supabase';
import { getDomainBadgeStyle, getPositionBadgeStyle } from '@/components/MemberCard';

const ADMIN_CREDENTIALS = {
  email: 'admin@embrione.pes.edu',
  password: 'EmbrioneAdmin@2026',
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard state
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generate unique IDs for accessibility
  const emailInputId = useId();
  const passwordInputId = useId();
  const searchInputId = useId();
  const domainFilterId = useId();

  // Check existing session
  useEffect(() => {
    const session = sessionStorage.getItem('embrione_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch all members from Supabase
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers((data as Member[]) || []);
    } catch (err: unknown) {
      console.error('Failed to fetch members:', err);
      showToast('Failed to load members from database');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMembers();
    }
  }, [isAuthenticated, fetchMembers]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (
      loginEmail.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
      loginPassword === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('embrione_admin_auth', 'true');
    } else {
      setLoginError('Invalid credentials. Please use the universal admin credentials.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('embrione_admin_auth');
    setLoginEmail('');
    setLoginPassword('');
  };

  // Moderation Actions
  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    setActionLoadingId(id);
    try {
      const { error } = await supabase
        .from('members')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
      showToast(`Member marked as ${newStatus}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      showToast(`Error: ${msg}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${name}'s profile?`)) {
      return;
    }

    setActionLoadingId(id);
    try {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) throw error;

      setMembers((prev) => prev.filter((m) => m.id !== id));
      showToast(`${name}'s profile was deleted`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      showToast(`Error: ${msg}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Quick stats counters
  const totalCount = members.length;
  const pendingCount = members.filter((m) => m.status === 'pending').length;
  const approvedCount = members.filter((m) => m.status === 'approved').length;
  const rejectedCount = members.filter((m) => m.status === 'rejected').length;

  // Filtered members for table/card view
  const filteredMembers = members.filter((m) => {
    const matchesTab = activeTab === 'all' ? true : m.status === activeTab;
    const matchesDomain = domainFilter === 'All' ? true : m.domain === domainFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.srn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesDomain && matchesSearch;
  });

  // Unique domains present in data
  const domainsList = ['All', ...Array.from(new Set(members.map((m) => m.domain)))];

  // 1. LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6 text-indigo-400">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Moderation</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Sign in using the universal credentials to review candidates
            </p>
          </div>

          {/* Quick Credential Hint Box */}
          <div className="mb-6 p-3.5 rounded-xl bg-zinc-800/60 border border-zinc-700/60 text-xs text-zinc-300 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Universal Admin Credentials</span>
            </div>
            <p className="font-mono text-[11px] text-zinc-300">
              Email: <span className="text-white selection:bg-indigo-600">admin@embrione.pes.edu</span>
            </p>
            <p className="font-mono text-[11px] text-zinc-300">
              Password: <span className="text-white selection:bg-indigo-600">EmbrioneAdmin@2026</span>
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor={emailInputId} className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                id={emailInputId}
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@embrione.pes.edu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor={passwordInputId} className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                id={passwordInputId}
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 mt-2"
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-zinc-800 border border-indigo-500/50 text-white text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin Moderation Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review recruitment applications, approve new team members, or reject submissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMembers}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Quick Counters Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Applications</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-white">{totalCount}</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-amber-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-300">{pendingCount}</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved Members</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-300">{approvedCount}</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-red-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Rejected</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-3xl font-extrabold text-zinc-300">{rejectedCount}</p>
        </div>
      </div>

      {/* Navigation Tabs & Search/Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'approved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'rejected'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'all'
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
        </div>

        {/* Search & Domain Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id={searchInputId}
              type="text"
              aria-label="Search candidates by name, SRN, or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, SRN, email..."
              className="pl-9 pr-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-indigo-500 w-full sm:w-60"
            />
          </div>

          <select
            id={domainFilterId}
            aria-label="Filter candidates by domain"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            {domainsList.map((d) => (
              <option key={d} value={d} className="bg-zinc-900">
                {d === 'All' ? 'All Domains' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions List / Table */}
      {loading ? (
        <div className="p-16 text-center text-zinc-400 text-sm flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
          <span>Loading submissions from Supabase...</span>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="p-16 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl">
          <p className="text-zinc-300 font-medium text-sm">No candidates match your current filter.</p>
          <p className="text-zinc-500 text-xs mt-1">
            {activeTab === 'pending'
              ? 'All caught up! There are no pending applications waiting for review.'
              : 'Try changing your search query or domain filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const isLoadingThis = actionLoadingId === member.id;
            return (
              <div
                key={member.id}
                className="rounded-2xl bg-zinc-900/90 border border-zinc-800/90 p-5 flex flex-col justify-between shadow-xl relative overflow-hidden"
              >
                {/* Status indicator ribbon */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide ${
                      member.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : member.status === 'rejected'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse'
                    }`}
                  >
                    {member.status}
                  </span>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${getPositionBadgeStyle(
                      member.position
                    )}`}
                  >
                    {member.position}
                  </span>
                </div>

                {/* Candidate Info */}
                <div>
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-14 h-14 rounded-xl object-cover border border-zinc-700 bg-zinc-800 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white text-base truncate">{member.name}</h3>
                      <p className="text-xs font-mono text-zinc-400 tracking-wider">
                        {member.srn}
                      </p>
                      <span
                        className={`inline-block mt-1 text-[11px] font-medium px-2 py-0.5 rounded border truncate max-w-full ${getDomainBadgeStyle(
                          member.domain
                        )}`}
                      >
                        {member.domain}
                      </span>
                    </div>
                  </div>

                  {/* Academic & Contact details */}
                  <div className="mt-4 space-y-1.5 text-xs text-zinc-300">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Mail className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{member.branch}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span>Semester {member.semester}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <p className="mt-3 text-xs text-zinc-400 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800 line-clamp-3">
                      &quot;{member.bio}&quot;
                    </p>
                  )}

                  {/* Social links */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-indigo-400">
                    {member.github_url && (
                      <a
                        href={member.github_url.startsWith('http') ? member.github_url : `https://${member.github_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url.startsWith('http') ? member.linkedin_url : `https://${member.linkedin_url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:underline ml-2"
                      >
                        LinkedIn <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Moderation Controls: Approve, Reject, Delete */}
                <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center gap-2">
                  {member.status !== 'approved' && (
                    <button
                      onClick={() => member.id && handleStatusUpdate(member.id, 'approved')}
                      disabled={isLoadingThis}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {member.status !== 'rejected' && (
                    <button
                      onClick={() => member.id && handleStatusUpdate(member.id, 'rejected')}
                      disabled={isLoadingThis}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold text-xs transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    onClick={() => member.id && handleDelete(member.id, member.name)}
                    disabled={isLoadingThis}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
