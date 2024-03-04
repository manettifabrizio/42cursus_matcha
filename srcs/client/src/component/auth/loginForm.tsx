import LabelInput from '@/component/ui/labelInput';
import { useResendEmailMutation } from '@/feature/auth/api.slice';
import { LoginFormErrors } from '@/feature/user/types';
import { useEffect, useId, useState } from 'react';
import toast from 'react-hot-toast';
import { Form } from 'react-router-dom';
import { useNavigation } from 'react-router-dom';
import { useActionData } from 'react-router-dom';
import { isLinkInvalidError } from '@/tool/isRTKQError';

// Component -------------------------------------------------------------------
export default function LoginForm() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const id = useId();
	const navigation = useNavigation();
	const data = useActionData() as LoginFormErrors | undefined;
	const [resendEmailMutation] = useResendEmailMutation();

	useEffect(() => {}, [username, password]);

	const isEmailNotConfirmedError = (error?: string[]) =>
		error && error[0] === "Account email hasn't been confirmed.";

	async function resendEmail() {
		const toast_id = toast.loading('Resending email...');

		try {
			await resendEmailMutation({
				username,
				password,
			}).unwrap();
			toast.success('Email sent!', { id: toast_id });
		} catch (error: unknown) {
			isLinkInvalidError(error, undefined, toast_id);
		}
	}

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
						onChange: (e) => setUsername(e.target.value),
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
						onChange: (e) => setPassword(e.target.value),
					}}
					errors_props={data?.password}
				/>
				{isEmailNotConfirmedError(data?.password) && (
					<button
						type="button"
						onClick={resendEmail}
						className="w-full text-center underline font-bold"
					>
						Resend email
					</button>
				)}
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
