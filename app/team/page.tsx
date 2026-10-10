'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Sparkles,
  ArrowRight,
  Database,
  RefreshCw,
} from 'lucide-react';
import MemberCard from '@/components/MemberCard';
import { supabase, Member } from '@/lib/supabase';
import { seedMockProfiles } from '@/lib/seedData';

const DOMAINS = [
  'All',
  'Web Development',
  'Design',
  'Operations',
  'Logistics',
  'Sponsorship',
  'Hospitality',
  'Social Media',
  'Event Management',
];

const POSITIONS = ['All', 'Head', 'Vice-Head', 'Core Member', 'Member'];

export default function TeamDirectoryPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Generate unique IDs for accessibility
  const searchInputId = useId();
  const domainFilterId = useId();
  const positionFilterId = useId();

  const fetchApprovedMembers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMembers((data as Member[]) || []);
    } catch (err: unknown) {
      console.error('Failed to load team members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedMembers();
  }, [fetchApprovedMembers]);

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      await seedMockProfiles();
      setNotification('Seeded 6 sample Embrione profiles successfully!');
      await fetchApprovedMembers();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Seeding failed';
      setNotification(`Error: ${msg}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Filter approved members
  const filteredMembers = members.filter((member) => {
    const matchesDomain =
      selectedDomain === 'All' ? true : member.domain === selectedDomain;
    const matchesPosition =
      selectedPosition === 'All' ? true : member.position === selectedPosition;
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.srn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.bio && member.bio.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesDomain && matchesPosition && matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          The Embrione Directory
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Meet The Team
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          The passionate designers, builders, coordinators, and leaders powering
          The Embrione, PES University.
        </p>

        {/* Action Link to Register */}
        <div className="pt-2">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>Want to be part of the team? Submit your registration</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id={searchInputId}
              type="text"
              aria-label="Search team members by name, SRN, or skill"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team members by name, SRN, or skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Quick Stats or Seed Button */}
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
              title="Populates 6 sample Embrione profiles into the database"
            >
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isSeeding ? 'Seeding...' : 'Seed Sample Profiles'}</span>
            </button>

            <button
              onClick={fetchApprovedMembers}
              disabled={loading}
              className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
              title="Refresh team"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="space-y-3 pt-2 border-t border-zinc-800/80">
          {/* Domain Filters */}
          <div className="space-y-1.5">
            <label htmlFor={domainFilterId} className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
              Filter By Domain
            </label>
            {/* Hidden select for accessible label pairing */}
            <select
              id={domainFilterId}
              aria-label="Filter By Domain"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="sr-only"
            >
              {DOMAINS.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1.5">
              {DOMAINS.map((domain) => {
                const isActive = selectedDomain === domain;
                return (
                  <button
                    key={domain}
                    onClick={() => setSelectedDomain(domain)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80'
                    }`}
                  >
                    {domain}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Position Filters */}
          <div className="space-y-1.5">
            <label htmlFor={positionFilterId} className="block text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
              Filter By Position
            </label>
            {/* Hidden select for accessible label pairing */}
            <select
              id={positionFilterId}
              aria-label="Filter By Position"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="sr-only"
            >
              {POSITIONS.map((position) => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
            <div className="flex flex-wrap gap-1.5">
              {POSITIONS.map((position) => {
                const isActive = selectedPosition === position;
                return (
                  <button
                    key={position}
                    onClick={() => setSelectedPosition(position)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/80'
                    }`}
                  >
                    {position}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>
          Showing{' '}
          <strong className="text-white">{filteredMembers.length}</strong> of{' '}
          <strong className="text-white">{members.length}</strong> approved team member{members.length === 1 ? '' : 's'}
        </span>
        {(selectedDomain !== 'All' || selectedPosition !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedDomain('All');
              setSelectedPosition('All');
              setSearchQuery('');
            }}
            className="text-indigo-400 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-zinc-400 text-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
          <span>Loading approved members...</span>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="py-20 text-center bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No members found</h3>
          <p className="text-xs text-zinc-400">
            {members.length === 0
              ? 'There are no approved profiles in the database yet. You can click the button below to seed 6 realistic sample team profiles, or approve pending applicants from the admin dashboard.'
              : 'No team members match your current filter criteria. Try selecting another domain or position.'}
          </p>
          {members.length === 0 && (
            <button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30"
            >
              <Database className="w-4 h-4" />
              <span>{isSeeding ? 'Seeding Profiles...' : 'Seed 6 Sample Profiles'}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
