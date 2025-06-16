import { IconDotsVertical, IconLogout } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useContext } from "react";
import { AuthContext } from "@/context/Auth/AuthContext";
import type { Student, Faculty, Principal } from "@/types/models";
import { Navigate } from "react-router-dom";
import { AccountType } from "@/types/utils";

export function NavUser({ user }: { user: Student | Faculty | Principal | null }) {
  const { isMobile } = useSidebar();
  const { logout } = useContext(AuthContext);
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return <Navigate to={"/"} />
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                  src={user.profile_picture || ""}
                  alt={user.first_name}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{`${user.first_name} ${user.last_name}`}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.role === AccountType.STUDENT
                    ? `Student No: ${(user as Student).student_id}`
                    : user.role === AccountType.FACULTY
                    ? (user as Faculty).email
                    : user.role === AccountType.PRINCIPAL
                    ? (user as Principal).email
                    : null}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 cursor-pointer" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.profile_picture || ""}
                    alt={user.first_name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{`${user.first_name} ${user.last_name}`}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.role === AccountType.STUDENT
                      ? `Student No: ${(user as Student).student_id}`
                      : user.role === AccountType.FACULTY
                      ? (user as Faculty).email
                      : user.role === AccountType.PRINCIPAL
                      ? (user as Principal).email
                      : null}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:!bg-red-500">
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
