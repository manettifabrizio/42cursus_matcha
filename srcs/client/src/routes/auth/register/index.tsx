/* eslint-disable react-refresh/only-export-components */
import RegisterForm from '@/component/auth/registerForm';
import { Link } from 'react-router-dom';
import FormContainer from '@/component/layout/form/formContainer';
import MatchaLogo from '@/component/ui/matchaLogo';

// Action ----------------------------------------------------------------------
export { action } from '@/feature/auth/register/action';

// Component -------------------------------------------------------------------
export function Component() {
	return (
		<>
			<div className="flex justify-between flex-col items-center w-full h-full">
				<MatchaLogo />
				<FormContainer>
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
				</FormContainer>
			</div>
		</>
	);
}

Component.displayName = 'Auth::Register';
