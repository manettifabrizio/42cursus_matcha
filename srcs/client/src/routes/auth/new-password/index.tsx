/* eslint-disable react-refresh/only-export-components */
import { Form, useActionData } from 'react-router-dom';
import LabelInput from '@/component/ui/labelInput';
import { useId } from 'react';
import { NewPasswordError } from '@/feature/auth/new-password/action';
import MatchaLogo from '@/component/ui/matchaLogo';
import FormContainer from '@/component/layout/form/formContainer';

// Action ----------------------------------------------------------------------
export { action } from '@/feature/auth/new-password/action';

// Component -------------------------------------------------------------------
export function Component() {
	const id = useId();
	// Use action data
	const data = useActionData() as NewPasswordError | undefined;

	return (
		<div className="flex justify-between flex-col items-center w-full h-full">
			<MatchaLogo />
			<FormContainer>
				<div className="text-3xl m-3">Choose your new password</div>
				<Form method="post" className="w-full my-4 grid gap-2">
					<input
						name="form-id"
						hidden
						defaultValue="username-email"
					/>
					<LabelInput
						input_props={{
							required: true,
							type: 'password',
							name: 'password',
							placeholder: 'Password',
							id: `${id}-password`,
						}}
						errors_props={data?.password}
					/>
					<LabelInput
						input_props={{
							required: true,
							type: 'password',
							name: 'password_confirm',
							placeholder: 'Password Confirmation',
							id: `${id}-password_confirm`,
						}}
						errors_props={data?.password_confirm}
					/>
					<button
						type="submit"
						className={
							'group relative w-full text-white font-semibold py-2 rounded-full overflow-hidden bg-gradient-to-b from-red-600 to-amber-400 border border-black hover:opacity-80 transition mt-3'
						}
					>
						Save
					</button>
				</Form>
			</FormContainer>
		</div>
	);
}
