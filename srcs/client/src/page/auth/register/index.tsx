import RegisterForm from "@/feature/auth/register";
import MatchaLogo from "/matcha.svg";
import { Link } from "react-router-dom";

// Action ----------------------------------------------------------------------
export { action } from "@/feature/auth/register/action";

// Component -------------------------------------------------------------------
export function Component() {
  return (
    <>
      <div className="black-background relative h-screen overflow-hidden">
        <div className="ellipse absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 bg-red-600 rounded-full"></div>
        <div className="ellipse absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-amber-400 rounded-full"></div>

        <div className="flex w-full h-full justify-center">
          <div className="flex justify-between flex-col items-center w-full">
            <Link to="/" className="flex justify-center">
              <img src={MatchaLogo} alt="MatchaLogo" className="w-1/3" />
            </Link>
            <div className="flex flex-col h-full justify-center items-center w-1/3">
              <h4 className="">Welcome to your new dating life!</h4>
			  <h6 className="opacity-80">We need some quick info to start.</h6>
              <RegisterForm />
              <div className="flex flex-row justify-center items-center mt-5">
                Already have an account?&nbsp;
                <Link to="/auth/login" className="font-bold underline">
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Component.displayName = "Auth::Register";
