import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AccountType } from "@/types/utils";

interface FormData {
  studentId?: string;
  email?: string;
  password: string;
}

enum FormFields {
  STUDENT_ID = "studentId",
  PASSWORD = "password",
  EMAIL = "email",
}

interface LoginFormProps {
  className?: string;
  accountType: string;
  props?: React.ComponentProps<"form">;
}

export function LoginForm({
  className,
  accountType,
  ...props
}: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    studentId: "",
    email: "",
    password: "",
  });

  const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState: FormData) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <div className="pb-6 flex flex-col items-start gap-2 text-start">
        <h1 className="text-2xl font-bold">Login</h1>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">
            {accountType === AccountType.STUDENT ? "Student ID" : "Email"}
          </Label>
          <Input
            id={
              accountType === AccountType.STUDENT
                ? FormFields.STUDENT_ID
                : "email"
            }
            type={accountType === AccountType.STUDENT ? "text" : "email"}
            placeholder={`Enter your ${
              accountType === AccountType.STUDENT ? "student ID" : "email"
            }`}
            required
            name={
              accountType === AccountType.STUDENT
                ? FormFields.STUDENT_ID
                : FormFields.EMAIL
            }
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            name={FormFields.PASSWORD}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
    </form>
  );
}
