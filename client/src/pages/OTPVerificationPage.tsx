import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/Auth/AuthContext";
import axios from "axios";
import { ResponseStatus } from "@/types/response";
import { useNavigate } from "react-router-dom";
import { AccountType } from "@/types/utils";
import Logo from "@/assets/GlobalAssets/Logo.png";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters",
  }),
});

const OTP_DURATION: number = 30;

export function OTPVerificationPage() {
  const { userData, sendEmailVerification, verifyAccount, authDispatch } =
    useContext(AuthContext);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });
  const navigate = useNavigate();
  const [timer, setTimer] = useState(OTP_DURATION);
  const [isAllowedToSendOTP, setIsAllowedToSendOtp] = useState(true);
  const [isFirstOTP, setIsFirstOtp] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      setIsAllowedToSendOtp(true);
      setTimer(OTP_DURATION);
    } else if (!isAllowedToSendOTP) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [timer, authDispatch, isAllowedToSendOTP]);

  const sendEmailConfirmation = async () => {
    setIsAllowedToSendOtp(false);
    setIsFirstOtp(true);
    if (userData) {
      try {
        await sendEmailVerification(userData.id);
        console.log("OTP Confirmation sent");
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const errorMsg =
            err.response?.data?.message || "Something went wrong";

          // Set the error on the "pin" field
          form.setError("pin", {
            type: "manual",
            message: errorMsg,
          });
        }
      }
    }
  };
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (userData) {
      const response = await verifyAccount(userData, data.pin);

      if (response.status === ResponseStatus.SUCCESS) {
        authDispatch({ type: "RESET_AUTH_STATUS" });
        if (userData.role == AccountType.PRINCIPAL) {
          navigate("/admin/dashboard/accounts");
        } else if (userData.role == AccountType.FACULTY) {
          navigate("/faculty/dashboard/accounts");
        }
      }

      if (axios.isAxiosError(response)) {
        const errorData = response.response?.data as { message?: string };
        form.setError("pin", {
          type: "manual",
          message: errorData?.message || "Something went Wrong",
        });
      }
    }
  };

  const redirect = () => {
    if (userData) {
      if (userData.role == AccountType.PRINCIPAL) {
        navigate("/login/admin");
      } else if (userData.role == AccountType.FACULTY) {
        navigate("/login/faculty");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <header className="h-fit absolute left-0 top-0 w-full py-6 px-64">
        <div className=" flex justify-between items-center mb-6">
          <a href="#" className="flex justify-start items-center">
            <img
              src={Logo}
              alt="logo"
              className="object-contain w-14 h-14 mr-4"
            />
            <span className="text-xl font-bold">Cabuyao Central School</span>
          </a>
          <Button onClick={redirect}>Back To Login</Button>
        </div>
      </header>
      <main className="w-full h-screen flex flex-col justify-center items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6 flex flex-col justify-center items-center"
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="w-full lg:w-lg">
                  <FormLabel className="text-2xl font-bold">
                    OTP Verification
                  </FormLabel>
                  <FormDescription className="mb-6">
                    {isFirstOTP
                      ? `One-time password was sent to ${userData?.email}`
                      : 'To send confimation email click the "Send Email Verification" below'}
                  </FormDescription>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="w-full mb-3">
                        <InputOTPSlot
                          index={0}
                          className="w-full h-16 lg:h-24 text-xl font-bold lg:text-3xl border-accent-foreground"
                        />
                        <InputOTPSlot
                          index={1}
                          className="w-full h-16 lg:h-24 text-xl font-bold lg:text-3xl border-accent-foreground"
                        />
                        <InputOTPSlot
                          index={2}
                          className="w-full h-16 lg:h-24 text-xl font-bold lg:text-3xl border-accent-foreground"
                        />
                        <InputOTPSlot
                          index={3}
                          className="w-full h-16 lg:h-24 text-xl font-bold lg:text-3xl border-accent-foreground"
                        />
                        <InputOTPSlot
                          index={4}
                          className="w-full h-16 lg:h-24 text-xl font-bold lg:text-3xl border-accent-foreground"
                        />
                        <InputOTPSlot
                          index={5}
                          className="w-full h-16 lg:h-24 text-xl font-bold lg:text-3xl border-accent-foreground"
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>

                  <FormMessage />
                  <Button type="submit">Submit</Button>
                  <Button
                    type="button"
                    disabled={!isAllowedToSendOTP}
                    onClick={sendEmailConfirmation}
                    className="text-accent-foreground bg-transparent border-2 border-accent-foreground hover:text-accent hover:bg-accent-foreground"
                  >
                    Send Email Verification
                  </Button>
                  <FormDescription className="mt-6">
                    {!isAllowedToSendOTP &&
                      `Didn't receive the code? Try resending in ${timer} seconds.`}
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </main>
    </>
  );
}

export default OTPVerificationPage;
