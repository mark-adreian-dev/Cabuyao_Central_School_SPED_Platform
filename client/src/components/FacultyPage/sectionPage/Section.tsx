import { SectionContext } from "@/context/Sections/SectionContext"
import type { SectionDataResponse } from "@/types/Response/SectionResponse";
import { useContext, useState } from "react"
import { useParams, Link } from "react-router-dom"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


const Section = () => {
  const { section_id } = useParams();
  const { sections } = useContext(SectionContext)
  const [targetSection] = useState<SectionDataResponse>(
    sections.filter((section) => section.id === Number(section_id))[0]
  );
  
  return (
    <div>
      <div className="w-full px-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/faculty/dashboard/sections">Section</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{targetSection.section_name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-6xl font-bold">{targetSection.section_name}</h1>
      </div>
    </div>
  );
}

export default Section
