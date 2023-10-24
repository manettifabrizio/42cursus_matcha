import { Form, useActionData } from 'react-router-dom';
import LabelInput from '@/component/ui/labelInput';
import { useId } from 'react';
import { NewPasswordError } from '@/feature/auth/new-password/action';
import MatchaLogo from '@/component/ui/matchaLogo';

// Action ----------------------------------------------------------------------
export { action } from '@/feature/auth/new-password/action';

// Component -------------------------------------------------------------------
export function Component() {
	const id = useId();
	// Use action data
	const data = useActionData() as NewPasswordError | undefined;

	return (
		<>
			<div className="flex justify-between flex-col items-center w-full">
				<MatchaLogo />
				<div className="flex flex-col h-full justify-center items-center w-1/3">
					<div className="text-3xl m-3">Choose your new password</div>
					<Form method="post" className="w-full my-4">
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
							errors={data?.password}
						/>
						<LabelInput
							input_props={{
								required: true,
								type: 'password',
								name: 'password_confirm',
								placeholder: 'Password Confirmation',
								id: `${id}-password_confirm`,
							}}
							errors={data?.password_confirm}
						/>
						<button className="group flex justify-center relative w-full text-white font-semibold py-2 mt-4 rounded-full overflow-hidden border">
							<div className="relative z-10">Save</div>
							<div className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
						</button>
					</Form>
				</div>
			</div>
		</>
	);
}
