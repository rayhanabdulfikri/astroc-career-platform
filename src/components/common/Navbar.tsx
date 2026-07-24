import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Briefcase,
  Target,
  BarChart2,
  Compass,
  MessageSquare,
  Bell,
  User,
  Activity,
  ChevronDown,
} from 'lucide-react';
import { AuthUser, NotificationItem } from '../../types';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: AuthUser | null;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  notifications,
  onMarkNotificationsRead,
  isDark,
  onToggleTheme,
  onOpenAuth,
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'cv_analysis', label: 'CV Analysis', icon: FileText },
    { id: 'job_finder', label: 'Job Finder', icon: Briefcase },
    { id: 'matching', label: 'Match Engine', icon: Target },
    { id: 'skill_gap', label: 'Skill Gap', icon: Sparkles },
    { id: 'roadmap', label: 'Career Roadmap', icon: Compass },
    { id: 'interview', label: 'Interview Coach', icon: MessageSquare },
    { id: 'system_logs', label: 'Architecture', icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-[#050507]/80 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
          id="brand_logo_btn"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold italic shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                ASTROC
              </span>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400">Gemini Flash 3.5</span>
              </div>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-none mt-0.5">
              Career Intelligence Engine
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl border border-slate-200/60 bg-slate-100/60 p-1 dark:border-white/10 dark:bg-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav_btn_${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm dark:bg-white/10 dark:text-white font-bold border border-slate-200 dark:border-white/10'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-indigo-500 dark:text-indigo-400' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              id="notif_bell_btn"
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                if (unreadCount > 0) onMarkNotificationsRead();
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-indigo-500/50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-indigo-400 transition-all"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-[#050507]">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#0c0c12] z-50">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-2 mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Notifikasi Lowongan AI
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400">Match Score &gt; 85%</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="p-3 text-center text-xs text-slate-500">Belum ada notifikasi baru.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setActiveTab('matching');
                          setShowNotifDropdown(false);
                        }}
                        className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-2.5 cursor-pointer hover:bg-indigo-500/10 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{n.title}</span>
                          {n.matchScore && (
                            <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              {n.matchScore}% Match
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

          {/* User Profile / Auth Button */}
          <button
            id="user_profile_auth_btn"
            onClick={onOpenAuth}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:border-indigo-500/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 transition-all"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName} className="h-5 w-5 rounded-full object-cover ring-1 ring-white/20" />
            ) : (
              <User className="h-4 w-4 text-indigo-500" />
            )}
            <span className="hidden sm:inline-block max-w-[100px] truncate">{user?.fullName || 'Login'}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-200/60 dark:border-slate-800/60 px-2 py-1.5 no-scrollbar gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex shrink-0 items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-medium ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
