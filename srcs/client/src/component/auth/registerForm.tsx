import type { RegisterError } from '@/feature/auth/register/action';
import { useId } from 'react';
import { Form, useNavigation } from 'react-router-dom';
import { useActionData } from 'react-router-dom';
import LabelInput from '@/component/ui/labelInput';

// Component -------------------------------------------------------------------
export default function RegisterForm() {
	const id = useId();
	const navigation = useNavigation();
	const data = useActionData() as RegisterError | undefined;

	return (
		<Form method="post" className="w-full grid gap-2">
			<LabelInput
				input_props={{
					required: true,
					type: 'text',
					name: 'username',
					placeholder: 'Username',
					id: `${id}-username`,
				}}
				errors_props={data?.username}
			/>
			<LabelInput
				input_props={{
					required: true,
					type: 'text',
					name: 'firstname',
					placeholder: 'First Name',
					id: `${id}-firstname`,
				}}
				errors_props={data?.firstname}
			/>
			<LabelInput
				input_props={{
					required: true,
					type: 'text',
					name: 'lastname',
					placeholder: 'Last Name',
					id: `${id}-lastname`,
				}}
				errors_props={data?.lastname}
			/>
			<LabelInput
				input_props={{
					required: true,
					type: 'email',
					name: 'email',
					placeholder: 'Email',
					id: `${id}-email`,
				}}
				errors_props={data?.email}
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
			<div className="flex justify-center mt-5">
				<button
					type="submit"
					id={`${id}-auth-register`}
					disabled={navigation.state === 'submitting'}
					className="group relative w-full text-white font-semibold py-2 rounded-full overflow-hidden bg-gradient-to-b from-red-600 to-amber-400 "
				>
					Create Account
				</button>
			</div>
		</Form>
	);
}
