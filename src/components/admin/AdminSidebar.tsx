import {
  LayoutDashboard, FileText, MessageSquare,
  Link2, Layout, Shield, CalendarClock, Layers, Download
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, useSidebar,
} from '@/components/ui/sidebar';
import zapLogo from '@/assets/zap-logo.png';

const menuItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Blog', url: '/admin/blog', icon: FileText },
  { title: 'Landing Pages', url: '/admin/landing-pages', icon: Layers },
  { title: 'Resources', url: '/admin/resources', icon: Download },
  { title: 'Queries', url: '/admin/queries', icon: MessageSquare },
  { title: 'Links', url: '/admin/links', icon: Link2 },
  { title: 'Content', url: '/admin/content', icon: Layout },
  { title: 'Bookings', url: '/admin/bookings', icon: CalendarClock },
  { title: 'Security', url: '/admin/security', icon: Shield },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <img src={zapLogo} alt="Zap" className="h-8 w-8 object-contain" />
          {!collapsed && <span className="font-bold text-sm">Zap Admin</span>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
