import LabelInput from '@/component/ui/labelInput';
import { LoginFormErrors } from '@/feature/user/types';
import { useId } from 'react';
import { Form } from 'react-router-dom';
import { useNavigation } from 'react-router-dom';
import { useActionData } from 'react-router-dom';

// Component -------------------------------------------------------------------
export default function LoginForm() {
	const id = useId();
	const navigation = useNavigation();
	const data = useActionData() as LoginFormErrors | undefined;

	return (
		<>
			<Form method="post" className="grid gap-2 w-full my-8">
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
						type: 'password',
						name: 'password',
						placeholder: 'Password',
						id: `${id}-password`,
					}}
					errors_props={data?.password}
				/>
				<button
					type="submit"
					id={`${id}-auth-login`}
					disabled={navigation.state === 'submitting'}
					className="group relative w-full text-white font-semibold py-2 rounded-full overflow-hidden bg-gradient-to-b from-red-600 to-amber-400 "
				>
					Log In
				</button>
			</Form>
		</>
	);
}
