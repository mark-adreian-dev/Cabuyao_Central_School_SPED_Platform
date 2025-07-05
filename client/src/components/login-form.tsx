import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState } from "react";
import { AccountType, type LoginFormInterface } from "@/types/utils";
import { AuthContext } from "@/context/Auth/AuthContext";
import { ResponseStatus } from "@/types/Response/AuthResponse";
import { toast, Toaster } from "sonner";

enum FormFields {
  STUDENT_ID = "student_id",
  PASSWORD = "password",
  EMAIL = "email",
}

interface LoginFormProps {
  className?: string;
  accountType: AccountType;
  props?: React.ComponentProps<"form">;
}

export function LoginForm({
  className,
  accountType,
  ...props
}: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormInterface>({
    student_id: "",
    email: "",
    password: "",
    role: accountType,
  });

  const { login, isError, errorMessage } = useContext(AuthContext);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState: LoginFormInterface) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const clearFormData = () => {
    setFormData({
      student_id: "",
      email: "",
      password: "",
      role: accountType,
    });
  }

  const handleSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => void = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggingIn(true);
    const responseStatus = await login(formData)
    setIsLoggingIn(false);
    if (responseStatus === ResponseStatus.SUCCESS) { 
      clearFormData()
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(errorMessage);
    }
  }, [errorMessage, isError])
  
  return (
    <>
      <Toaster position="top-center" richColors />
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
            <label htmlFor="userCredentials">
              {accountType === AccountType.STUDENT ? "Student ID" : "Email"}
            </label>
            <Input
              id="userCredentials"
              type={accountType === AccountType.STUDENT ? "text" : "email"}
              placeholder={`Enter your ${
                accountType === AccountType.STUDENT ? "Student ID" : "Email Address"
              }`}
              required
              name={
                accountType === AccountType.STUDENT
                  ? FormFields.STUDENT_ID
                  : FormFields.EMAIL
              }
              onChange={handleChange}
              autoComplete="true"
              className={`${isError && "border-[1px] border-red-500"}`}
              value={
                accountType == AccountType.STUDENT
                  ? formData.student_id
                  : formData.email
              }
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
              autoComplete="true"
              className={`${isError && "border-[1px] border-red-500"}`}
              value={formData.password}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoggingIn || isError}
          >
            Login
          </Button>
        </div>
      </form>
    </>
  );
}
