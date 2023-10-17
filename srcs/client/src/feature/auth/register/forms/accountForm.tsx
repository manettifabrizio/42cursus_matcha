import { Form, Navigation } from 'react-router-dom';
import LabelInput from '../../../../component/ui/labelInput';

import { ReactElement } from 'react';
import { RegisterError } from '../action';

type AccountFormProps = {
	id: string;
	navigation: Navigation;
	data?: RegisterError;
};

export default function AccountForm({
	id,
	navigation,
	data,
}: AccountFormProps): ReactElement {
	return (
		<>
			<Form method="post" className="w-full">
				<LabelInput
					input_props={{
						required: true,
						type: 'text',
						name: 'username',
						placeholder: 'Username',
						id: `${id}-username`,
					}}
					errors={data?.username}
				/>
				<LabelInput
					input_props={{
						required: true,
						type: 'text',
						name: 'firstname',
						placeholder: 'First Name',
						id: `${id}-firstname`,
					}}
					errors={data?.firstname}
				/>
				<LabelInput
					input_props={{
						required: true,
						type: 'text',
						name: 'lastname',
						placeholder: 'Last Name',
						id: `${id}-lastname`,
					}}
					errors={data?.lastname}
				/>
				<LabelInput
					input_props={{
						required: true,
						type: 'email',
						name: 'email',
						placeholder: 'Email',
						id: `${id}-email`,
					}}
					errors={data?.email}
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
		</>
	);
}
