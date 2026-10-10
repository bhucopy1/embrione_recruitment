import { supabase, Member } from './supabase';

export const INITIAL_MOCK_PROFILES: Omit<Member, 'id' | 'created_at'>[] = [
  {
    name: 'Aarav Patel',
    domain: 'Web Development',
    position: 'Head',
    srn: 'PES1UG23CS012',
    email: 'aarav.patel@embrione.pes.edu',
    linkedin_url: 'https://linkedin.com/in/aarav-patel',
    github_url: 'https://github.com/aaravpatel',
    branch: 'CSE',
    semester: 4,
    bio: 'Full-stack builder passionate about Next.js, distributed databases, and high-performance club systems.',
    photo_url:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    status: 'approved',
  },
  {
    name: 'Diya Sharma',
    domain: 'Design',
    position: 'Vice-Head',
    srn: 'PES1UG23CS045',
    email: 'diya.sharma@embrione.pes.edu',
    linkedin_url: 'https://linkedin.com/in/diya-sharma',
    github_url: 'https://github.com/diyasharma',
    branch: 'AIML',
    semester: 4,
    bio: 'UI/UX enthusiast creating intuitive design systems, 3D graphics, and modern aesthetic visual identities.',
    photo_url:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    status: 'approved',
  },
  {
    name: 'Rohan Verma',
    domain: 'Operations',
    position: 'Core Member',
    srn: 'PES1UG23EC088',
    email: 'rohan.verma@embrione.pes.edu',
    linkedin_url: 'https://linkedin.com/in/rohan-verma',
    github_url: 'https://github.com/rohanverma',
    branch: 'ECE',
    semester: 3,
    bio: 'Orchestrating hackathons, speaker sessions, and inter-collegiate technical symposiums across campus.',
    photo_url:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    status: 'approved',
  },
  {
    name: 'Ananya Nair',
    domain: 'Web Development',
    position: 'Core Member',
    srn: 'PES1UG24CS104',
    email: 'ananya.nair@embrione.pes.edu',
    linkedin_url: 'https://linkedin.com/in/ananya-nair',
    github_url: 'https://github.com/ananyanair',
    branch: 'CSE',
    semester: 2,
    bio: 'Frontend enthusiast working on interactive web experiences, Tailwind UI, and client-side performance.',
    photo_url:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    status: 'approved',
  },
  {
    name: 'Karthik Reddy',
    domain: 'Sponsorship',
    position: 'Member',
    srn: 'PES1UG24CS215',
    email: 'karthik.reddy@embrione.pes.edu',
    linkedin_url: 'https://linkedin.com/in/karthik-reddy',
    github_url: 'https://github.com/karthikreddy',
    branch: 'CSE',
    semester: 2,
    bio: 'Connecting student developers with venture accelerators, startup founders, and developer grant sponsors.',
    photo_url:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    status: 'approved',
  },
  {
    name: 'Meera Krishnan',
    domain: 'Social Media',
    position: 'Member',
    srn: 'PES1UG23BT032',
    email: 'meera.krishnan@embrione.pes.edu',
    linkedin_url: 'https://linkedin.com/in/meera-krishnan',
    github_url: 'https://github.com/meerakrishnan',
    branch: 'Biotech',
    semester: 4,
    bio: 'Digital storyteller amplifying technical workshops, recruitment drives, and student project showcases.',
    photo_url:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=80',
    status: 'approved',
  },
];

/**
 * Seeds sample profiles to Supabase if table is empty or has no approved profiles.
 */
export async function seedMockProfiles(): Promise<number> {
  const { error } = await supabase.from('members').insert(INITIAL_MOCK_PROFILES);
  if (error) {
    throw new Error(`Failed to seed data: ${error.message}`);
  }
  return INITIAL_MOCK_PROFILES.length;
}
