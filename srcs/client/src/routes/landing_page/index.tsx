import { Link } from 'react-router-dom';
import MatchaLogo from '/matcha.svg';

// Component -------------------------------------------------------------------
export function Component() {
	return (
		<div className="black-background relative h-screen overflow-hidden">
			<div className="ellipse absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"></div>
			<div className="ellipse absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 bg-amber-400 rounded-full"></div>

			<div className="flex w-full h-full justify-center">
				<div className="flex justify-center flex-col items-center">
					<img src={MatchaLogo} alt="MatchaLogo" />
					<h6 className="p-4 text-2xl">Dating reinvented</h6>
					<Link
						to="/auth/register?redirect=/home"
						className="relative text-xl"
					>
						<button className="group relative p-4 border border-white text-white font-semibold py-4 px-10 rounded-full overflow-hidden ">
							<div className="relative z-10">
								Create an account
							</div>
							<div className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}
