import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileIcon } from "lucide-react";

interface FileAttachmentProps {
    fileName: string,
    fileSize: number
}

const computeFileSize = (bytes: number) => {
    if (bytes < 1024) {
    return `${bytes} bytes`;
    } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
}

const FileAttachment = ({ fileName, fileSize }: FileAttachmentProps) => {
   
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <div className="p-4 border-[1px] border-accent-foreground rounded-md mr-2">
            <FileIcon />
          </div>

          <div>
            <CardTitle>{fileName}</CardTitle>
            <CardDescription>{computeFileSize(fileSize)}</CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default FileAttachment
