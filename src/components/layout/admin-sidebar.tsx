"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { CteiNexusLogo } from "../icons";
import { LayoutDashboard, Package, Folder, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/projects", icon: Folder, label: "Proyectos" },
  { href: "/products", icon: Package, label: "Productos" },
  { href: "/users", icon: Users, label: "Usuarios" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const getBasePath = (path: string) => {
    const segments = path.split("/").filter(Boolean);
    return `/${segments[1]}`;
  }

  const currentBasePath = getBasePath(pathname);
  
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <CteiNexusLogo className="w-8 h-8 text-primary" />
          {state === 'expanded' && <h1 className="text-xl font-headline font-semibold">CTei Nexus</h1>}
        </Link>
      </SidebarHeader>
      
      <SidebarMenu className="flex-1 justify-start">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={`/(admin)${item.href}`} legacyBehavior passHref>
              <SidebarMenuButton
                isActive={currentBasePath === item.href}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      
      <SidebarFooter>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://picsum.photos/seed/avatar/100/100" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          {state === 'expanded' && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Admin</span>
              <span className="text-xs text-muted-foreground">admin@ctei.com</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
