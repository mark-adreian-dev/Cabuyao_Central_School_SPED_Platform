// import { DataTable } from "@/components/data-table";
import Sections from "@/components/FacultyPage/Section/Sections";
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


const SectionPage = () => {
  return (
    <SidebarInset>
      <SiteHeader pageTitle="Sections" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6"></div>
            <Sections />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default SectionPage;
