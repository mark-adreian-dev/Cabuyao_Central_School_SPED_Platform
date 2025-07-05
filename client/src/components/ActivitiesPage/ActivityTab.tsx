import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PenSquareIcon, Trash } from "lucide-react";
import { useContext } from "react";
import { Badge } from "@/components/ui/badge";
import { ActivityContext } from "@/context/Activities/ActivitiesContext";

interface Props {
  activityDescription: string;
  activityId: number;
  passingScore: number;
  perfectScore: number;
  dateCreated: Date;
  fileCount: number;
}

const ActivityTab = ({
  activityDescription,
  activityId,
  passingScore,
  perfectScore,
  dateCreated,
  fileCount,
}: Props) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };
  const formatted = dateCreated.toLocaleDateString("en-US", options);

  const { deleteActivity } = useContext(ActivityContext);

  const handleDeleteSection = async (sectionId: number) => {
    await deleteActivity(sectionId);
  };

  return (
    <Card>
      <CardHeader className="mr-4">
        <CardTitle className="flex flex-col-reverse lg:flex-row lg:items-center">
          <h3 className="mr-4 text-5xl font-bold">{activityDescription}</h3>
        </CardTitle>
        <div className="flex flex-row-reverse">
          <CardAction>
            <Button className="mr-2">
              <PenSquareIcon />
            </Button>
            <Button
              size={"icon"}
              className="bg-red-500"
              onClick={() => handleDeleteSection(activityId)}
            >
              <Trash />
            </Button>
          </CardAction>
          <CardAction className="hidden mr-24 lg:block">
            <div className="mb-6">
              <p className="text-md text-accent-foreground mb-1.5">
                Highest possible score:
              </p>
              <Badge
                variant={"default"}
                className="text-lg font-bold rounded-full px-3"
              >
                {perfectScore} points
              </Badge>
            </div>

            <p className="text-md text-accent-foreground mb-1.5">
              Passing score:
            </p>
            <Badge
              variant={"outline"}
              className="text-md font-bold rounded-full px-3 border-accent-foreground"
            >
              {passingScore} points
            </Badge>
          </CardAction>
        </div>
      </CardHeader>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground">
          Date Posted: {formatted}
        </p>
        <p className="text-sm text-muted-foreground">{fileCount} file attachments</p>

        <div className="lg:hidden">
          <p className="text-sm text-muted-foreground">
            Highest possible score: {perfectScore} points
          </p>
          <p className="text-sm text-muted-foreground">
            Passing score: {passingScore}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActivityTab;
