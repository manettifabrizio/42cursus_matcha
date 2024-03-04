import LabelInput from '@/component/ui/labelInput';
import { AuthProfileError, AuthProfile } from '@/feature/user/types';
import { useId } from 'react';

type AccountFormProps = {
	profile: AuthProfile;
	errors: AuthProfileError;
	submitting: boolean;
	setProfile: React.Dispatch<React.SetStateAction<AuthProfile>>;
	base_profile: AuthProfile;
};

export default function AuthForm({
	profile,
	errors,
	submitting,
	setProfile,
	base_profile,
}: AccountFormProps) {
	const id = useId();

	function hasSomethingChanged(profile: AuthProfile): boolean {
		return (
			profile.email !== base_profile.email ||
			(profile.password != null && profile.password !== '') ||
			(profile.password_confirm != null &&
				profile.password_confirm !== '')
		);
	}

	return (
		<>
			<div className="mb-5 w-full">
				<h5 className="mb-1"></h5>

				<LabelInput
					title={true}
					input_props={{
						required: true,
						type: 'email',
						name: 'email',
						placeholder: 'Email',
						id: `${id}-email`,
						value: profile.email,
						onChange: (e) =>
							setProfile((current) => ({
								...current,
								email: e.target.value,
							})),
					}}
					// TODO: Manage the Already in use email error
					errors_props={errors?.email}
				/>
				<LabelInput
					title={true}
					input_props={{
						required:
							profile.password_confirm !== '' &&
							profile.password_confirm != null,
						type: 'password',
						name: 'password',
						placeholder: 'New Password',
						id: `${id}-password`,
						value: profile.password,
						onChange: (e) => {
							if (e.target.value !== '')
								setProfile((current) => ({
									...current,
									password: e.target.value,
								}));
							else
								setProfile((current) => ({
									...current,
									password: '',
								}));
						},
					}}
					errors_props={errors?.password}
				/>
				<LabelInput
					title={true}
					input_props={{
						required:
							profile.password !== '' && profile.password != null,
						type: 'password',
						name: 'password_confirm',
						placeholder: 'Confirm Password',
						id: `${id}-password_confirm`,
						value: profile.password_confirm,
						onChange: (e) => {
							if (e.target.value !== '')
								setProfile((current) => ({
									...current,
									password_confirm: e.target.value,
								}));
							else
								setProfile((current) => ({
									...current,
									password_confirm: '',
								}));
						},
					}}
					errors_props={errors?.password_confirm}
				/>
				<div className="flex justify-center mt-5">
					<button
						disabled={submitting || !hasSomethingChanged(profile)}
						type="submit"
						className={
							'group relative w-full text-white font-semibold py-2 rounded-full overflow-hidden bg-gradient-to-b from-red-600 to-amber-400 border border-black hover:opacity-80 transition ' +
							(submitting || !hasSomethingChanged(profile)
								? 'opacity-80'
								: '')
						}
					>
						{submitting ? 'Submitting...' : 'Save'}
					</button>
				</div>
			</div>
		</>
	);
}
