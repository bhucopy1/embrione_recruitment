# The Embrione — Web Development Recruitment Challenge

A modern, full-stack **Meet The Team** Onboarding & Moderation System built for **The Embrione**, Department of Computer Science & Engineering, PES University.

---

## 🌟 Live Demo & Deployment
- **Live Vercel Application:** [https://bhuvan-embrione-task.vercel.app](https://bhuvan-embrione-task.vercel.app) *(or your assigned subdomain)*
- **GitHub Repository:** [https://github.com/bhuvan123567/embrione-recruitment](https://github.com/bhuvan123567/embrione-recruitment)

---

## 🚀 Key Features

### 1. Member Registration with Live Card Preview (`/register`)
- **Real-Time Reactive Preview:** Instant card rendering driven by React state as candidates type their details with zero server lag.
- **Client-Side WebP Conversion:** Converts heavy mobile camera photos (`.png`, `.jpg`, `.jpeg`) down to lightweight modern `.webp` format in the browser using HTML5 Canvas (`quality: 0.8`, `maxWidth: 800px`) before uploading to Supabase Storage.
- **In-Memory Local Preview:** Uses `URL.createObjectURL(file)` to preview photos locally without unnecessary network requests prior to submission.
- **Duplicate Prevention:** Validates candidates by SRN against the Supabase database to prevent duplicate registrations.
- **Delightful UX:** Interactive bio character counter, custom file picker, and confetti celebration upon submission with `status: 'pending'`.

### 2. Admin Moderation Dashboard (`/admin`)
- **Protected Login Gate:** Configured to accept the universal recruitment credentials:
  - **Email:** `admin@embrione.pes.edu`
  - **Password:** `EmbrioneAdmin@2026`
- **Live Analytics Counters:** Instant metrics for *Total Submissions*, *Pending Review*, and *Approved Members*.
- **Moderation Workflow:**
  - **Approve:** Updates status to `'approved'` (instantly visible on `/team`).
  - **Reject:** Marks status as `'rejected'`.
  - **Delete (Bonus):** Permanently removes submission records.
- **Search & Filters:** Search applicants by name, SRN, or email, with status tabs (`Pending`, `Approved`, `Rejected`, `All`).

### 3. Public "Meet The Team" Directory (`/team`)
- **Approved Members Only:** Queries Supabase PostgreSQL to display only authenticated, approved club members.
- **Dual Dynamic Filtering:** Filter team members seamlessly by:
  - **Domain:** Web Development, Design, Operations, Logistics, Sponsorship, Hospitality, Social Media, Event Management.
  - **Position:** Head, Vice-Head, Core Member, Member.
- **One-Click Mock Seeding:** Built-in seed engine to populate 6 realistic Embrione profiles (with high-res avatars and bios) so the directory is immediately lively.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Language** | TypeScript (Strict type checking) |
| **Styling** | Tailwind CSS v4 (Sleek tech club dark aesthetic) |
| **Database** | Supabase (PostgreSQL with Row Level Security) |
| **Object Storage** | Supabase Storage (`member-photos` public bucket) |
| **Icons & Effects**| Lucide React & Canvas Confetti |
| **Deployment** | Vercel CI/CD |

---

## 🗄️ Database Schema & Storage Setup

### SQL Schema (`members` table)
```sql
create table public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null,
  position text not null,
  srn text not null,
  email text not null,
  linkedin_url text,
  github_url text,
  branch text not null,
  semester integer not null,
  bio text,
  photo_url text not null,
  status text not null default 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) policies
alter table public.members enable row level security;
create policy "Allow public insert" on public.members for insert with check (true);
create policy "Allow public read" on public.members for select using (true);
create policy "Allow admin updates" on public.members for update using (true);
create policy "Allow admin deletes" on public.members for delete using (true);
```

### Storage Bucket
- **Bucket Name:** `member-photos`
- **Visibility:** Public

---

## 💻 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhuvan123567/embrione-recruitment.git
   cd embrione-recruitment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📜 Progressive Git Commits Log
1. `setup: project init and supabase client`
2. `feat: register form with live card preview and webp compression`
3. `feat: admin moderation dashboard with login gate, metrics, and approval workflow`
4. `feat: meet the team directory with domain/position filters and mock data seeding`
5. `docs: comprehensive architecture and setup documentation`

---

## 👨‍💻 Author
- **Bhuvan Venkatesh Y**
- Department of Computer Science & Engineering, PES University
