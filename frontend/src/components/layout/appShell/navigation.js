import {
  LayoutDashboard,
  FileText,
  Briefcase,
  FolderKanban,
  Building2,
  Share2,
  LayoutTemplate,
  Zap,
  Settings,
  Sparkles,
} from 'lucide-react';

/**
 * Recrutely primary navigation model.
 * Organized into clear sections so the sidebar can render a grouped,
 * premium menu with subtle section labels. Icons are map-keyed lucide
 * components for crisp control.
 */
export const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Main' },
      { to: '/resume', label: 'Resume', icon: FileText, section: 'Main' },
      { to: '/jobs', label: 'Jobs', icon: Briefcase, section: 'Main' },
      { to: '/applications', label: 'Applications', icon: FolderKanban, section: 'Main' },
      { to: '/companies', label: 'Companies', icon: Building2, section: 'Main' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { to: '/networking', label: 'Networking', icon: Share2, section: 'Tools' },
      { to: '/templates', label: 'Templates', icon: LayoutTemplate, section: 'Tools' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/upgrade', label: 'Upgrade', icon: Zap, section: 'Account', badge: 'PRO' },
      { to: '/settings', label: 'Settings', icon: Settings, section: 'Account' },
    ],
  },
];

export const CMD_GROUPS = [
  {
    label: 'Navigate',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, hint: 'G' },
      { to: '/resume', label: 'Resume', icon: FileText, hint: 'R' },
      { to: '/jobs', label: 'Jobs', icon: Briefcase, hint: 'J' },
      { to: '/applications', label: 'Applications', icon: FolderKanban, hint: 'A' },
      { to: '/companies', label: 'Companies', icon: Building2, hint: 'C' },
      { to: '/networking', label: 'Networking', icon: Share2, hint: 'N' },
      { to: '/templates', label: 'Templates', icon: LayoutTemplate, hint: 'T' },
      { to: '/upgrade', label: 'Upgrade to Pro', icon: Zap, hint: 'U' },
      { to: '/settings', label: 'Settings', icon: Settings, hint: 'S' },
    ],
  },
  {
    label: 'Actions',
    items: [
      { id: 'new-resume', label: 'Create new resume', icon: Sparkles },
      { id: 'new-job', label: 'Add a job', icon: Briefcase },
    ],
  },
];
