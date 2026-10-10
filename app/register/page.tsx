'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import confetti from 'canvas-confetti';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Info,
  FileImage,
} from 'lucide-react';
import MemberCard from '@/components/MemberCard';
import { supabase } from '@/lib/supabase';
import { convertToWebP, formatBytes } from '@/lib/imageUtils';

const DOMAIN_OPTIONS = [
  'Web Development',
  'Design',
  'Logistics',
  'Operations',
  'Sponsorship',
  'Hospitality',
  'Social Media',
  'Event Management',
];

const POSITION_OPTIONS = ['Head', 'Vice-Head', 'Core Member', 'Member'];

const BRANCH_OPTIONS = [
  'CSE',
  'AIML',
  'ECE',
  'EEE',
  'ME',
  'Biotech',
  'Other',
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    domain: 'Web Development',
    position: 'Member',
    srn: '',
    email: '',
    linkedin_url: '',
    github_url: '',
    branch: 'CSE',
    semester: 1,
    bio: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle generic text/select input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'semester' ? parseInt(value) || 1 : value,
    }));
  };

  // Handle file selection (local instant preview via URL.createObjectURL)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (.png, .jpg, .jpeg)');
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);

    // Instant local memory preview without uploading
    const localUrl = URL.createObjectURL(file);
    setPreviewPhotoUrl(localUrl);
    setCompressionInfo(`Selected ${file.name} (${formatBytes(file.size)})`);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.name.trim() || !formData.srn.trim() || !formData.email.trim()) {
      setErrorMessage('Please fill in all required fields (Name, SRN, and Email).');
      return;
    }

    if (!selectedFile && !previewPhotoUrl) {
      setErrorMessage('Please select a profile picture to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanSrn = formData.srn.trim().toUpperCase();

      // 1. Check for Duplicate Submissions
      const { data: existing, error: checkError } = await supabase
        .from('members')
        .select('id, status')
        .ilike('srn', cleanSrn)
        .maybeSingle();

      if (checkError) {
        console.warn('Duplicate check warning:', checkError.message);
      }

      if (existing) {
        setErrorMessage(
          `A member with SRN "${cleanSrn}" has already been submitted (Status: ${existing.status}).`
        );
        setIsSubmitting(false);
        return;
      }

      let uploadedPhotoUrl = previewPhotoUrl;

      // 2. Client-side WebP Conversion and Upload
      if (selectedFile) {
        setCompressionInfo('Converting image to lightweight WebP format...');
        const { blob, originalSize, compressedSize } = await convertToWebP(
          selectedFile,
          800,
          0.8
        );

        const savings = (
          ((originalSize - compressedSize) / originalSize) *
          100
        ).toFixed(1);
        setCompressionInfo(
          `Compressed ${formatBytes(originalSize)} → ${formatBytes(
            compressedSize
          )} (${savings}% saved)`
        );

        // Upload to Supabase Storage bucket 'member-photos'
        const sanitizedSrn = cleanSrn.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${sanitizedSrn}-${Date.now()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from('member-photos')
          .upload(fileName, blob, {
            contentType: 'image/webp',
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Failed to upload photo: ${uploadError.message}`);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('member-photos')
          .getPublicUrl(fileName);

        uploadedPhotoUrl = publicUrlData.publicUrl;
      }

      // 3. Save profile to database with status: 'pending'
      const { error: insertError } = await supabase.from('members').insert([
        {
          name: formData.name.trim(),
          domain: formData.domain,
          position: formData.position,
          srn: cleanSrn,
          email: formData.email.trim(),
          linkedin_url: formData.linkedin_url.trim() || null,
          github_url: formData.github_url.trim() || null,
          branch: formData.branch,
          semester: Number(formData.semester),
          bio: formData.bio.trim() || null,
          photo_url: uploadedPhotoUrl,
          status: 'pending',
        },
      ]);

      if (insertError) {
        throw new Error(`Failed to save application: ${insertError.message}`);
      }

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsSuccess(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      domain: 'Web Development',
      position: 'Member',
      srn: '',
      email: '',
      linkedin_url: '',
      github_url: '',
      branch: 'CSE',
      semester: 1,
      bio: '',
    });
    setSelectedFile(null);
    setPreviewPhotoUrl('');
    setCompressionInfo(null);
    setErrorMessage(null);
    setIsSuccess(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Candidate Onboarding
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Join The Embrione Team
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-400">
          Fill in your details below. Watch your member profile card render in
          real time before submitting for admin review.
        </p>
      </div>

      {isSuccess ? (
        /* Success Screen */
        <div className="max-w-xl mx-auto bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">Application Submitted!</h2>
          <p className="mt-2 text-zinc-300 text-sm">
            Your application for{' '}
            <span className="text-emerald-400 font-semibold">{formData.domain}</span>{' '}
            has been saved with <span className="font-mono bg-zinc-800 px-2 py-0.5 rounded text-xs text-zinc-200">status: &#39;pending&#39;</span>.
          </p>
          <p className="mt-1 text-zinc-500 text-xs">
            An administrator will review your profile shortly on the moderation dashboard.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-sm transition"
            >
              Submit Another Profile
            </button>
            <a
              href="/team"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/30"
            >
              View Team Directory
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      ) : (
        /* Split-Screen Layout: Form (Left) & Real-Time Preview (Right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT: Registration Form (7 columns on desktop) */}
          <div className="lg:col-span-7 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>Member Information</span>
              <span className="text-xs font-normal text-zinc-500">
                (All fields except social links required)
              </span>
            </h2>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name & SRN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    SRN *
                  </label>
                  <input
                    type="text"
                    name="srn"
                    required
                    value={formData.srn}
                    onChange={handleInputChange}
                    placeholder="e.g. PES1UG23CS001"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm uppercase font-mono transition"
                  />
                </div>
              </div>

              {/* Domain & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Domain *
                  </label>
                  <select
                    name="domain"
                    value={formData.domain}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
                  >
                    {DOMAIN_OPTIONS.map((d) => (
                      <option key={d} value={d} className="bg-zinc-900 text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Position *
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
                  >
                    {POSITION_OPTIONS.map((p) => (
                      <option key={p} value={p} className="bg-zinc-900 text-white">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Branch & Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Branch *
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
                  >
                    {BRANCH_OPTIONS.map((b) => (
                      <option key={b} value={b} className="bg-zinc-900 text-white">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    Semester (1 to 8) *
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s} className="bg-zinc-900 text-white">
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@pes.edu or personal email"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
                />
              </div>

              {/* LinkedIn & GitHub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
                  />
                </div>
              </div>

              {/* Bio with character count */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Short Bio (~150-200 chars)
                  </label>
                  <span
                    className={`text-xs font-mono ${
                      formData.bio.length > 250
                        ? 'text-amber-400 font-bold'
                        : 'text-zinc-500'
                    }`}
                  >
                    {formData.bio.length}/250
                  </span>
                </div>
                <textarea
                  name="bio"
                  rows={3}
                  maxLength={250}
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Share a sentence about your passion for technology, coding projects, or design flair..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition resize-none"
                />
              </div>

              {/* Profile Picture Upload & WebP conversion note */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Profile Picture * (.png, .jpg, .jpeg)
                </label>
                <div className="relative border-2 border-dashed border-zinc-700 hover:border-indigo-500/80 rounded-2xl p-4 sm:p-6 transition text-center bg-zinc-800/40">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      {selectedFile ? (
                        <FileImage className="w-5 h-5" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-zinc-200">
                      {selectedFile
                        ? selectedFile.name
                        : 'Click or drag & drop photo here'}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Auto-compressed to WebP in browser before uploading
                    </p>
                  </div>
                </div>

                {compressionInfo && (
                  <div className="mt-2 text-xs text-indigo-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>{compressionInfo}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Optimizing & Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Candidate Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Real-Time Live Preview (5 columns on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Card Preview
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                Updates as you type
              </span>
            </div>

            {/* Member Card Component with live reactive state */}
            <MemberCard
              member={{
                name: formData.name,
                domain: formData.domain,
                position: formData.position,
                srn: formData.srn,
                email: formData.email,
                linkedin_url: formData.linkedin_url,
                github_url: formData.github_url,
                branch: formData.branch,
                semester: formData.semester,
                bio: formData.bio,
                photo_url: previewPhotoUrl,
              }}
              isPreview={true}
            />

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>
                Photos are kept in memory while previewing and converted to{' '}
                <strong className="text-zinc-200">.webp</strong> only upon final submission.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
