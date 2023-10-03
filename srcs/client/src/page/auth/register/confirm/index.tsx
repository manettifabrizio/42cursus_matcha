import { store } from "@/core/store";
import { authApi } from "@/feature/auth/api.slice";
import { Link } from "react-router-dom";

export function Component() {
	const urlParams = new URLSearchParams(window.location.search);

	const fields = {
		id: urlParams.get("id") as string,
		secret: urlParams.get("secret") as string,
	};

	store.dispatch(authApi.endpoints.confirm.initiate(fields));

	return (
		<div className="flex items-center justify-center flex-col">
			<h2>Email confirmed successfully!</h2>
			<div className="flex flex-row justify-center items-center mt-5">
				Go to&nbsp;
				<Link to="/auth/login" className="font-bold underline">
					Log In
				</Link>
			</div>
		</div>
	);
}
