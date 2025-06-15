import { type JSX } from "react";
import { LoginForm } from "@/components/login-form";
import DesktopImage from "@/assets/LoginPage/login-desktop.png";
import TabletImage from "@/assets/LoginPage/login-tablet.png";
import { AccountType, ScreenSize } from "@/types/utils";
import Logo from "@/assets/GlobalAssets/Logo.png";


interface props {
  accountType: AccountType;
}

const Login: ({ accountType }: props) => JSX.Element = ({ accountType }) => {
  return (
    <main
      className={`flex justify-center items-center ${
        accountType === AccountType.STUDENT ? "flex-row" : "flex-row-reverse"
      } h-screen`}
    >
      <div className="relative hidden xl:min-h-[56rem] xl:block md:h-fit xl:h-screen xl:w-full ">
        <picture>
          <source
            srcSet={DesktopImage}
            media={`(min-width: ${ScreenSize.DESKTOP})`}
          />
          <source
            srcSet={TabletImage}
            media={`(min-width: ${ScreenSize.TABLET})`}
          />
          <img
            src={TabletImage} // fallback if no source matches
            alt="Cabuyao Central School"
            className="w-full md:h-40 xl:h-full md:object-cover"
          />
        </picture>
      </div>
      <div className="relative flex flex-col w-fit items-center justify-center xl:w-lg">
        <div className="flex justify-center items-center pt-12 flex-col mb-16">
          <div className="w-xs flex justify-center items-center md:w-[32.75rem] xl:w-full xl:flex-col xl:items-start xl:justify-start">
            <a
              href="#"
              className="flex items-center gap-2 font-medium mr-6 xl:mb-6"
            >
              <img
                src={Logo}
                alt="logo"
                className="w-24 h-24 xl:w-32 xl:h-32 object-cover"
              />
            </a>

            <div className="w-full">
              <p className="text-base mb-2">
                {`${accountType.toUpperCase()} LOGIN`}
              </p>
              <div>
                <h1 className="text-3xl font-bold">Cabuyao Central School</h1>
                <p className="text-base">SPED Learning Intervention Plarform</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex  items-start justify-center xl:px-16 !h-fit">
          <div className="p-6 border-border border-2 rounded-2xl w-xs md:w-[32.75rem] xl:w-sm ">
            <LoginForm accountType={accountType} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
