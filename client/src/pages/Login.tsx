import { type JSX } from "react";
import { LoginForm } from "@/components/login-form";
import DesktopImage from "@/assets/LoginPage/login-desktop.png";
import TabletImage from "@/assets/LoginPage/login-tablet.png";
import { ScreenSize } from "@/types/utils";
import Logo from "@/assets/GlobalAssets/Logo.png";
const Login: () => JSX.Element = () => {
  return (
    <main className="grid min-h-screen md:grid-cols-1 md:grid-row-2 xl:grid-row-1 xl:grid-cols-2">
      <div className="flex flex-col md:row-[2] xl:row-[1] xl:col-[2]">
        <div className="flex justify-center items-center pl-6 pt-6 pr-6 flex-col mb-16 lg:mb-0">
          <div className="w-xs md:w-[32.75rem]">
            <a href="#" className="flex items-center gap-2 font-medium mb-6">
              <img src={Logo} alt="logo" className="w-32 h-32 object-cover" />
            </a>

            <div className="w-full">
              <p className="text-base mb-2">ADMIN LOGIN</p>
              <div>
                <h1 className="text-3xl font-bold">Cabuyao Central School</h1>
                <p className="text-base">SPED Learning Intervention Plarform</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-start justify-center">
          <div className="w-full p-6 border-border border-2 rounded-2xl w-xs md:w-[32.75rem]">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted md:block">
        <picture className="h-screen">
          {/* Desktop should be first since it is more specific */}
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
    </main>
  );
};

export default Login;
