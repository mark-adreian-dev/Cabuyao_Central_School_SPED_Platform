import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";
// import {
//   IconCamera,
//   IconDatabase,
//   IconFileAi,
//   IconFileDescription,
//   IconFileWord,
//   IconHelp,
//   IconListDetails,
//   IconReport,
//   IconSearch,
//   IconSettings,
//   IconUsers,
// } from "@tabler/icons-react";

// import type { SidebarType } from "@/types/sidebar";

// const data: SidebarType = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   navMain: [
//     {
//       title: "Accounts",
//       url: "/admin/dashboard/accounts",
//       icon: IconUsers,
//     },
//     {
//       title: "Students",
//       url: "/login",
//       icon: IconListDetails,
//     },
//   ],
//   navClouds: [
//     {
//       title: "Capture",
//       icon: IconCamera,
//       isActive: true,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Proposal",
//       icon: IconFileDescription,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Prompts",
//       icon: IconFileAi,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//   ],
//   navSecondary: [
//     {
//       title: "Settings",
//       url: "#",
//       icon: IconSettings,
//     },
//     {
//       title: "Get Help",
//       url: "#",
//       icon: IconHelp,
//     },
//     {
//       title: "Search",
//       url: "#",
//       icon: IconSearch,
//     },
//   ],
//   documents: [
//     {
//       name: "Data Library",
//       url: "#",
//       icon: IconDatabase,
//     },
//     {
//       name: "Reports",
//       url: "#",
//       icon: IconReport,
//     },
//     {
//       name: "Word Assistant",
//       url: "#",
//       icon: IconFileWord,
//     },
//   ],
// };
import data from "@/app/dashboard/data.json";
const AccountsPage = () => {
  return (
    <SidebarInset>
      <SiteHeader pageTitle="Accounts" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6"></div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default AccountsPage;
