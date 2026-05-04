
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Users, FileText, LayoutDashboard, TrendingUp, Settings, Baby } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export function AppSidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: <LayoutDashboard /> },
    { href: '/actors', label: 'Talent', icon: <Users /> },
    { href: '/script-analysis', label: 'Script Analysis', icon: <FileText /> },
    { href: '/child-lookalike', label: 'Child Lookalike', icon: <Baby /> },
    { href: '/analytics', label: 'Analytics', icon: <TrendingUp /> },
    { href: '/settings', label: 'Settings', icon: <Settings /> },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
          >
            <Link href={item.href}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
