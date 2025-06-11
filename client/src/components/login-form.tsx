import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useState } from "react";
import { AccountType, type LoginFormInterface } from "@/types/utils";
import { AuthContext } from "@/context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

enum FormFields {
  STUDENT_ID = "studentId",
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
    studentId: "",
    email: "",
    password: "",
    role: accountType,
  });

  const { login, isError } = useContext(AuthContext);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => void = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggingIn(true);
    const response = await login(formData);

    setIsLoggingIn(false);
    if (response == 200) {
      setFormData({
        studentId: "",
        email: "",
        password: "",
        role: accountType,
      });

      if (accountType == AccountType.PRINCIPAL) {
        navigate("/admin/dashboard/accounts");
      } else if (accountType == AccountType.FACULTY) {
        navigate("/faculty/dashboard/accounts");
      } else {
        document.getElementById("userCredentials")?.focus();
      }
    }
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
          <Label htmlFor="userCredentials">
            {accountType === AccountType.STUDENT ? "Student ID" : "Email"}
          </Label>
          <Input
            id="userCredentials"
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
            autoComplete="true"
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
  );
}
