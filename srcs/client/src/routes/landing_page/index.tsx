import { Link } from 'react-router-dom';
import MatchaLogo from '/matcha.svg';

// Component -------------------------------------------------------------------
export function Component() {
	return (
		<div className="black-background relative h-svh overflow-hidden">
			<div className="ellipse-right absolute top-0 right-0 bg-red-600 rounded-full"></div>
			<div className="ellipse-left absolute bottom-0 left-0 bg-amber-400 rounded-full"></div>

			<div className="flex w-full h-full justify-center">
				<div className="flex justify-center flex-col items-center">
					<img
						src={MatchaLogo}
						alt="MatchaLogo"
						className="w-9/12 sm:w-full"
					/>
					<h6 className="p-4 text-xl sm:text-2xl">
						Dating reinvented
					</h6>
					<Link
						to="/auth/register?redirect=/home"
						className="relative text-lg sm:text-xl"
					>
						<button className="group relative p-4 border border-white text-white font-semibold py-4 px-10 rounded-full overflow-hidden ">
							<div className="relative z-10">
								Authenticate
							</div>
							<div className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
						</button>
					</Link>
					<div className="flex flex-row justify-center items-center mt-5">
						Already have an account?&nbsp;
						<Link to="/auth/login" className="font-bold underline">
							Log In
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
