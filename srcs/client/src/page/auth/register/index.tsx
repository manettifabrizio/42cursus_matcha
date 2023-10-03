import RegisterForm from '@/feature/auth/register';
import MatchaLogo from '/matcha.svg';
import { Link } from 'react-router-dom';

// Action ----------------------------------------------------------------------
export { action } from '@/feature/auth/register/action';

// Component -------------------------------------------------------------------
export function Component() {
    return (
        <>
            <div className="flex justify-between flex-col items-center w-full">
                <Link to="/" className="flex justify-center">
                    <img src={MatchaLogo} alt="MatchaLogo" className="w-1/3" />
                </Link>
                <div className="flex flex-col h-full justify-center items-center w-1/3">
                    <h4 className="">Welcome to your new dating life!</h4>
                    <h6 className="opacity-80">
                        We need some quick info to start.
                    </h6>
                    <RegisterForm />
                    <div className="flex flex-row justify-center items-center mt-5">
                        Already have an account?&nbsp;
                        <Link to="/auth/login" className="font-bold underline">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

Component.displayName = 'Auth::Register';
