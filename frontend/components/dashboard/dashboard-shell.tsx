'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { AuthUser, clearAuth, getAuthToken, getAuthUser } from '@/lib/auth';

type DashboardShellProps = {
  children: ReactNode;
};

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/dashboard/products', label: 'Products', icon: 'inventory_2' },
  { href: '/dashboard/categories', label: 'Categories', icon: 'category' },
  { href: '/dashboard/users', label: 'Users', icon: 'group' },
  { href: '/dashboard/audits', label: 'Audit Logs', icon: 'history_edu' },
  { href: '/dashboard/reports', label: 'Reports', icon: 'assessment' },
];

export function DashboardShell({ children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const authUser = getAuthUser();

    if (!token || !authUser) {
      clearAuth();
      router.replace('/login');
      return;
    }

    const initTimer = window.setTimeout(() => {
      setUser(authUser);
      setReady(true);
    }, 0);

    return () => {
      window.clearTimeout(initTimer);
    };
  }, [router]);

  const roleLabel = useMemo(() => {
    if (!user) return '';
    return user.role === 'ADMIN' ? 'Admin User' : 'Common User';
  }, [user]);

  function handleLogout() {
    clearAuth();
    router.replace('/login');
  }

  if (!ready || !user) {
    return (
      <main className="min-h-screen bg-[#f7f9ff] flex items-center justify-center text-[#434751]">
        Loading...
      </main>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#f7f9ff] text-[#181c20]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-[#fdc003] shadow-sm h-[72px]">
        <div className="flex items-center justify-between px-4 md:px-6 w-full max-w-[1280px] mx-auto h-full">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#004085]">account_balance</span>
            <span className="text-lg md:text-xl font-bold text-[#004085]">GovPE Management System</span>
          </div>
          <button
            className="rounded border border-[#0c458b] text-[#0c458b] px-4 py-2 text-sm font-semibold hover:bg-[#d7e3ff] transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="pt-[72px] flex flex-1">
        <aside className="hidden md:flex md:flex-col fixed left-0 top-[72px] h-[calc(100vh-72px)] w-64 border-r border-[#c3c6d2] bg-[#f8f9fa]">
          <div className="p-6 border-b border-[#e0e3e8]">
            <div className="w-12 h-12 rounded-lg bg-[#004085] text-white flex items-center justify-center mb-3">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
            <p className="font-bold text-[#004085] leading-tight">{roleLabel}</p>
            <p className="text-xs text-[#737782]">{user.name}</p>
            <p className="text-xs text-[#737782]">{user.email}</p>
          </div>

          <nav className="py-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={[
                        'flex items-center gap-3 px-6 py-3 text-sm transition-colors',
                        active
                          ? 'bg-white text-[#004085] border-l-4 border-[#fdc003] font-semibold'
                          : 'text-[#434751] hover:bg-[#ebeef3] hover:text-[#0c458b]',
                      ].join(' ')}
                    >
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="w-full md:ml-64 p-4 md:p-8 flex flex-col">
          <div className="max-w-[1280px] mx-auto w-full flex-1">{children}</div>
        </main>
      </div>

      <footer className="bg-[#004085] border-t border-[#fdc003]">
        <div className="max-w-[1280px] mx-auto px-6 py-5 text-white text-xs uppercase tracking-widest flex flex-col md:flex-row gap-3 md:gap-6 md:items-center md:justify-between">
          <span>© 2024 State Government. All rights reserved.</span>
          <div className="flex gap-6 text-[#d7e3ff]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Transparency Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
