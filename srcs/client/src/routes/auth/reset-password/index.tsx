/* eslint-disable react-refresh/only-export-components */
import { Form, Link, useActionData } from 'react-router-dom';
import LabelInput from '@/component/ui/labelInput';
import { SlArrowLeft } from 'react-icons/sl';
import MatchaLogo from '@/component/ui/matchaLogo';
import FormContainer from '@/component/layout/form/formContainer';
import { ResetPasswordFormErrors } from '@/feature/user/types';

// Action ----------------------------------------------------------------------
export { action } from '@/feature/auth/reset-password/action';

// Component -------------------------------------------------------------------
export function Component() {
	const data = useActionData() as ResetPasswordFormErrors | undefined;

	return (
		<>
			<div className="flex justify-between flex-col items-center w-full h-full">
				<MatchaLogo />
				<FormContainer>
					<Link
						to="/auth/login"
						className="w-full justify-start flex flex-row items-center"
					>
						<SlArrowLeft className="me-1" />
					</Link>
					<div className="text-3xl m-3">Let's find your account</div>
					<div className="text-sm opacity-80 my-2">
						Enter the email and username associated with your
						account to change your password.
					</div>
					<Form method="post" className="w-full my-4 grid gap-2 ">
						<LabelInput
							input_props={{
								required: true,
								type: 'text',
								name: 'username',
								placeholder: 'Username',
								id: 'username',
							}}
                            errors_props={data?.username}
						/>

						<LabelInput
							input_props={{
								required: true,
								type: 'email',
								name: 'email',
								placeholder: 'Email',
								id: 'email',
							}}
							errors_props={data?.email}
						/>
						<button
							type="submit"
							className="group relative w-full text-white font-semibold py-2 mt-2 rounded-full overflow-hidden bg-gradient-to-b from-red-600 to-amber-400 "
						>
							Send Reset Link
						</button>
					</Form>
				</FormContainer>
			</div>
		</>
	);
}
