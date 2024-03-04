import {
	AuthProfileError,
	AuthProfile,
	initAuthProfileError,
} from '@/feature/user/types';
import { useState } from 'react';
import { editUserAuth } from '@/feature/user/utils';
import { Form } from 'react-router-dom';
import { setCurrentUser } from '@/tool/userTools';
import AuthForm from '../edit/authForm';
import toast from 'react-hot-toast';

type ProfileEditProps = {
	base_profile: AuthProfile;
};

export default function AuthEdit({ base_profile }: ProfileEditProps) {
	const [profile, setProfile] = useState<AuthProfile>(base_profile);
	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] =
		useState<AuthProfileError>(initAuthProfileError);

	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors(initAuthProfileError);
		setSubmitting(true);
		if (await editUserAuth(profile, setErrors, setSubmitting)) {
			if (profile.email !== base_profile.email)
				toast('Please confirm your new email to use Matcha', {
					icon: '❗️',
				});
			await setCurrentUser();
			setProfile((c) => ({
				...c,
				password: '',
				password_confirm: '',
			}));
			setSubmitting(false);
		}
	};

	return (
		<>
			<div className="text-3xl mb-3 text-center w-full font-bold">
				Edit Authentication
			</div>
			<Form onSubmit={submit} className="w-full">
				<AuthForm
					base_profile={base_profile}
					setProfile={setProfile}
					profile={profile}
					errors={errors}
					submitting={submitting}
				/>
			</Form>
		</>
	);
}
