import { Link } from "react-router-dom";

export function Component() {
	return (
		<div className="flex items-center justify-center flex-col">
			<h2>Password changed successfully!</h2>
			<div className="flex flex-row justify-center items-center mt-5">
				Go to&nbsp;
				<Link to="/auth/login" className="font-bold underline">
					Log In
				</Link>
			</div>
		</div>
	);
}
