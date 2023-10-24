import { Form, Link } from 'react-router-dom';
import LabelInput from '@/component/ui/labelInput';
import { SlArrowLeft } from 'react-icons/sl';
import MatchaLogo from '@/component/ui/matchaLogo';

// Action ----------------------------------------------------------------------
export { action } from '@/feature/auth/reset-password/action';

// Component -------------------------------------------------------------------
export function Component() {
	return (
		<>
			<div className="flex justify-between flex-col items-center w-full">
				<MatchaLogo />
				<div className="flex flex-col h-full justify-center items-center w-1/3">
					<Link
						to="/auth/login"
						className="w-full justify-start flex flex-row items-center"
					>
						<SlArrowLeft class="me-1" />
					</Link>
					<div className="text-3xl m-3">Let's find your account</div>
					<div className="text-sm opacity-80 my-2">
						Enter the email and username associated with your
						account to change your password.
					</div>
					<Form method="post" className="w-full my-4">
						<input
							name="form-id"
							hidden
							defaultValue="username-email"
						/>
						<LabelInput
							input_props={{
								required: true,
								type: 'text',
								name: 'username',
								placeholder: 'Username',
								id: 'username',
							}}
						/>
						<LabelInput
							input_props={{
								required: true,
								type: 'email',
								name: 'email',
								placeholder: 'Email',
								id: 'email',
							}}
						/>
						<button
							type="submit"
							className="group relative w-full text-white font-semibold py-2 mt-2 rounded-full overflow-hidden bg-gradient-to-b from-red-600 to-amber-400 "
						>
							Next
						</button>
					</Form>
				</div>
			</div>
		</>
	);
}
