import ActivitiesList from "@/components/ActivitiesPage/ActivitiesList";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset } from "@/components/ui/sidebar";

const ActivitiesListPage = () => {
  return (
    <SidebarInset>
      <SiteHeader pageTitle="Activities" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6"></div>
            <ActivitiesList />
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default ActivitiesListPage;
