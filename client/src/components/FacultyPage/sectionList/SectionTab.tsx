import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionContext } from "@/context/Sections/SectionContext";
import { EyeIcon, Trash } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

interface Props {
  sectionName: string;
  sectionId: number;
  description: string;
  dateCreated: Date;
    isActive: boolean;
    studentCount: number
}

const SectionTab = ({
  sectionName,
  description,
  sectionId,
  isActive,
    dateCreated,
  studentCount,
}: Props) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };
    const formatted = dateCreated.toLocaleDateString("en-US", options);
    
    const { deleteSection } = useContext(SectionContext) 

  const handleDeleteSection = async (sectionId: number) => {
    await deleteSection(sectionId)
  }

  return (
    <Card>
      <CardHeader className="mr-4">
        <CardTitle className="flex flex-col-reverse lg:flex-row lg:items-center">
          <h3 className="mr-4 text-3xl font-bold">{sectionName}</h3>
          <Badge
            variant={"outline"}
            className={`mb-4 ${
              isActive
                ? "border-lime-500 text-lime-500"
                : "border-muted-foreground text-muted-foreground"
            } lg:mb-0`}
          >
            {isActive ? "Active" : "Not Active"}
          </Badge>
        </CardTitle>
        <CardDescription className="max-w-md text-accent-foreground">
          {description}
        </CardDescription>
        <CardAction className="">
          <Link to={`/faculty/dashboard/sections/${sectionId}`}>
            <Button className="mr-2">
              <EyeIcon />
              Manage
            </Button>
          </Link>

          <Button
            size={"icon"}
            className="bg-red-500"
            onClick={() => handleDeleteSection(sectionId)}
          >
            <Trash />
          </Button>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex flex-col items-start">
        <p className="text-xs text-muted-foreground">
          Date created: {formatted}
        </p>
        <p className="text-xs text-muted-foreground">{studentCount} Students</p>
      </CardFooter>
    </Card>
  );
};

export default SectionTab;
