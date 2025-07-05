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
import { ResponseStatus } from "@/types/Response/AuthResponse";
import { Navigate, useNavigate } from "react-router-dom";
import { AccountType } from "@/types/utils";
import Logo from "@/assets/GlobalAssets/Logo.png";
import { toast, Toaster } from "sonner";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters",
  }),
});

const OTP_DURATION: number = 30;

export function OTPVerificationPage() {
  const {
    userData,
    sendEmailVerification,
    verifyAccount,
    successMessage,
    errorMessage,
    isError,
    authDispatch,
    loadUser
    
  } = useContext(AuthContext);
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
  const [isDisabled, setIsDisabled] = useState(false)

  //Handles the OTP Timer
  useEffect(() => {
  
    if (timer === 0) {
      //Allows user to send another verification and resets the timer
      setIsAllowedToSendOtp(true);
      setIsDisabled(false)
      setTimer(OTP_DURATION);
    } else if (!isAllowedToSendOTP) {
      //Reduces timer by 1 after a second
      const timeout = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      //Prevent stacking up of setTimeout functions
      return () => {
        clearTimeout(timeout);
      };
    }
    
  }, [timer, authDispatch, isAllowedToSendOTP]);

  useEffect(() => {
    if (isError) {
      form.setError("pin", {
        type: "manual",
        message: errorMessage,
      });
    }

  }, [errorMessage, isError, form])

  const sendEmailConfirmation = async () => {
    setIsAllowedToSendOtp(false);
    setIsDisabled(true)
    form.clearErrors()
    if (userData) {
      toast.info(`Sending verification code to ${userData.email}`);
      const responseStatus = await sendEmailVerification(userData.id);
      if (responseStatus === ResponseStatus.SUCCESS) {
        setIsDisabled(true)
        setIsFirstOtp(true);
        return toast.success("OTP Successfully Sent", {
          description: successMessage,
        });
              

      } else {
        // Set the error on the "pin" field
        setIsAllowedToSendOtp(true);
        setIsDisabled(false)
        setTimer(OTP_DURATION);
        form.setError("pin", {
          type: "manual",
          message: errorMessage,
        });
        return toast.error("Something went wrong", {
          description: errorMessage,
        });
      }
    } 
  };
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (userData) {
      const responseStatus = await verifyAccount(userData, data.pin);
      console.log(responseStatus)
      if (responseStatus === ResponseStatus.SUCCESS) {
        await loadUser()
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

  if (!userData) {
    return <Navigate to={"/login"} />
  }

  return (
    <>

      <Toaster position="top-center" richColors />

      <header className="h-fit absolute left-0 top-0 w-full py-6 px-8 lg:px-64">
        <div className=" flex justify-between items-center mb-6">
          <a href="#" className="flex justify-start items-center">
            <img
              src={Logo}
              alt="logo"
              className="object-contain w-14 h-14 mr-4"
            />
            <span className="text-md lg:text-xl font-bold">
              Cabuyao Central School
            </span>
          </a>
          <Button onClick={redirect}>Login</Button>
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
                    disabled={isDisabled}
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
