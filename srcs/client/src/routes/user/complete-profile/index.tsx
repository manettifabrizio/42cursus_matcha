import { useEffect, useId, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import {
	useSetUserTagMutation,
	useUserEditMutation,
} from '@/feature/user/api.slice';
import toast from 'react-hot-toast';
import {
	CompleteProfile,
	CompleteProfileError,
	initCompleteProfile,
	initCompleteProfileErrors,
} from '@/feature/user/types';
import { isProfileCompleted, setCurrentUser } from '@/tool/userTools';
import FormContainer from '@/component/layout/form/formContainer';
import MatchaLogo from '@/component/ui/matchaLogo';
import CompleteProfileForm from '@/component/user/complete-profile/completeProfileForm';
import {
	checkBeforeSubmitting,
	editProfile,
	sendTags,
} from '@/feature/user/utils';
import { uploadImages } from '@/feature/user/imagesUpload';

export function Component() {
	const [editUser] = useUserEditMutation();
	const [setTag] = useSetUserTagMutation();
	const navigate = useNavigate();

	// TODO: move this in the route loader
	useEffect(() => {
		if (isProfileCompleted()) {
			navigate('/home');
		}
	}, [isProfileCompleted()]);

	const [submitting, setSubmitting] = useState(false);
	const [profile, setProfile] =
		useState<CompleteProfile>(initCompleteProfile);
	const [errors, setErrors] = useState<CompleteProfileError>(
		initCompleteProfileErrors,
	);

	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const id = toast.loading('Editing profile details...', {
			style: { minWidth: '350px' },
		});
		if (!checkBeforeSubmitting(profile, id)) return null;

		setErrors(initCompleteProfileErrors);
		setSubmitting(true);

		if (await editProfile(profile, editUser, setErrors, setSubmitting, id))
			if (await sendTags(profile, setTag, setErrors, setSubmitting, id))
				if (
					await uploadImages(
						profile,
						editUser,
						setErrors,
						setSubmitting,
						id,
					)
				) {
					await setCurrentUser();
					toast.success(
						"Profile completed successfully! Let's start matching!!",
					);

					return navigate('/home');
				}
	};

	const id = useId();

	return (
		<div className="flex justify-between flex-col items-center w-full h-full">
			<MatchaLogo />
			<FormContainer>
				<h4 className="font-bold">
					Let's complete your profile to start matching with people!
				</h4>
				<Form onSubmit={submit} className="w-full">
					<CompleteProfileForm
						submitting={submitting}
						setProfile={setProfile}
						setErrors={setErrors}
						id={id}
						errors={errors}
						profile={profile}
					/>
				</Form>
			</FormContainer>
		</div>
	);
}
