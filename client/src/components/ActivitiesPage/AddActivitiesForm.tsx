import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import React, { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import FileAttachment from "./FileAttachment";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ActivityContext } from "@/context/Activities/ActivitiesContext";

// ✅ Schema
const formSchema = z.object({
  activity_description: z.string().min(10, {
    message: "Activity name should not be empty and at least 10 characters",
  }),
  activity_question: z.string().min(10, {
    message:
      "Activity instruction must not be empty and at least 10 characters",
  }),
  deadline: z.date(),
  time: z.string().nonempty({ message: "Time is required" }),
  perfect_score: z.number().min(1, { message: "HPS must be specified" }),
  activity_files: z.any(),
});

interface SelectedFile {
  file_name: string;
  file_type: string;
  file_size: number;
}

export function AddActivitiesForm({ children }: { children: React.ReactNode }) {
  const { addActivity } = useContext(ActivityContext)
  const [open, setOpen] = useState(false);
  const [fileSelected, setFileSelected] = useState<SelectedFile[]>([]);
  const [openCalendar, setOpenCalendar] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activity_description: "",
      activity_question: "",
      perfect_score: 0,
      time: "",
    },
  });

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    if (fileSelected.length !== 0) setFileSelected([]);
    const filesArray = Array.from(files);

    const newSelectedFiles: SelectedFile[] = filesArray.map((file) => ({
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
    }));

    setFileSelected((prevState) => [...prevState, ...newSelectedFiles]);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {

     // Combine date and time
     const [hours, minutes] = values.time.split(":").map(Number);
     const finalDeadline = new Date(values.deadline);
     finalDeadline.setHours(hours);
     finalDeadline.setMinutes(minutes);
     finalDeadline.setSeconds(0);
     finalDeadline.setMilliseconds(0);

     // Convert FileList to Array
     const files = values.activity_files as FileList;
     const filesArray = files ? Array.from(files) : [];

     // Compute passing score
     const passingScore = Math.floor(values.perfect_score * 0.6);

     // Create FormData
     const formData = new FormData();
     formData.append("activity_description", values.activity_description);
     formData.append("activity_question", values.activity_question);
     formData.append("deadline", finalDeadline.toISOString());
     formData.append("perfect_score", String(values.perfect_score));
     formData.append("passing_score", String(passingScore));

     // Append each file individually
     filesArray.forEach((file) => {
       formData.append("activity_files[]", file); // brackets if Laravel expects array
     });

     // ✅ Log FormData contents for debugging
    //  for (const [key, value] of formData.entries()) {
    //    console.log(`${key}:`, value);
    //  }

    try {
      await addActivity(formData)
      // Reset form after success
      form.reset();
      setFileSelected([]);
      setOpen(false);
    } catch (error) {
      console.error("❌ Submission failed:", error);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        setFileSelected([]);
        if (!isOpen) {
          form.reset({
            activity_description: "",
            activity_question: "",
            perfect_score: 0,
            time: "",
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)}>{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] lg:max-w-[70%]">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-3xl font-bold">Add Activity</DialogTitle>
          <DialogDescription>
            Adding new activity to the activities pool
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex">
              <div className="w-full mr-6">
                <FormField
                  control={form.control}
                  name="activity_description"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Activity Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Activity title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activity_question"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>Activity Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your activity notes and instructions here"
                          className="h-[calc(100vh-80vh)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="perfect_score"
                  render={({ field }) => (
                    <FormItem className="w-full mb-6">
                      <FormLabel>Highest possible score: </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? String(field.value) : ""}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="HPS" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <ScoreSelection />
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-start items-center">
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="w-full mr-6">
                        <FormLabel>Deadline Date</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-3 w-full">
                            <Popover
                              open={openCalendar}
                              onOpenChange={setOpenCalendar}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date"
                                  className="w-full justify-between font-normal"
                                >
                                  {field.value
                                    ? new Date(field.value).toLocaleDateString()
                                    : "Select date"}
                                  <ChevronDownIcon />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  captionLayout="dropdown"
                                  onSelect={(selectedDate) => {
                                    if (selectedDate) {
                  
                                      field.onChange(selectedDate);
                                      setOpenCalendar(false);
                                    }
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="activity_files"
                  render={({ field }) => (
                    <FormItem className="mb-6">
                      <FormLabel>File Attachments</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          onChange={(e) => {
                            if (e.target.files) {
                              handleFileSelection(e);
                              field.onChange(e.target.files);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ScrollArea className="h-[calc(100%-17%)] overflow-scroll w-full border">
                  <div className="absolute left-0 w-full grid h-fit gap-2 p-2">
                    {fileSelected.map((file) => (
                      <FileAttachment
                        key={file.file_name}
                        fileName={file.file_name}
                        fileSize={file.file_size}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setFileSelected([]);
                    form.reset({
                      activity_description: "",
                      activity_question: "",
                      perfect_score: 0,
                      time: "",
                    });
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const ScoreSelection = () => {
  const components = [];
  for (let score = 5; score <= 100; score += 5) {
    components.push(
      <SelectItem key={score} value={String(score)}>
        {score} Points
      </SelectItem>
    );
  }
  return <>{components.reverse()}</>;
};
