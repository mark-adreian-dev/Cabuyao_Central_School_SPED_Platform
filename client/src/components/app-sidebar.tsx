import * as React from "react";
import Logo from "@/assets/GlobalAssets/Logo.png";

// import { NavDocuments } from "@/components/nav-documents";
// import { NavSecondary } from "@/components/nav-secondary";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { SidebarType } from "@/types/sidebar";
import type { Faculty, Principal, Student } from "@/types/models";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: SidebarType; // or use a specific type instead of `any`
  userData: Student | Faculty | Principal | null;
}

export function AppSidebar({ data, userData, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 h-fit"
            >
              <a href="#">
                <img
                  src={Logo}
                  alt="logo"
                  className="object-contain w-14 h-14"
                />
                <span className="text-base font-bold">
                  Cabuyao Central School
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>{userData && <NavUser user={userData} />}</SidebarFooter>
    </Sidebar>
  );
}
