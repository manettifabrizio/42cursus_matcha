import LoginForm from '@/feature/auth/login/loginForm';
import { Link } from 'react-router-dom';
import MatchaLogo from '/matcha.svg';
import FormContainer from '@/component/layout/form/formContainer';

// Action ----------------------------------------------------------------------
export { action } from '@/feature/auth/login/action';

// Component -------------------------------------------------------------------
export function Component() {
	return (
		<>
			<div className="flex justify-between flex-col items-center w-full h-full">
				<Link to="/" className="flex justify-center">
					<img src={MatchaLogo} alt="MatchaLogo" className="w-1/3" />
				</Link>
				<FormContainer>
					<div className="text-3xl">Welcome back!</div>
					<LoginForm />
					<Link
						to="/auth/reset-password"
						className="group flex justify-center relative w-full text-white font-semibold py-2 mt-2 rounded-full overflow-hidden border"
					>
						Forgot your password?
					</Link>
					<div className="flex flex-row justify-center items-center mt-5">
						You don't have an account?&nbsp;
						<Link
							to="/auth/register"
							className="font-bold underline"
						>
							Sign Up
						</Link>
					</div>
				</FormContainer>
			</div>
		</>
	);
}
