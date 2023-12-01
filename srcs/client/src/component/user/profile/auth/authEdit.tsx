import {
	CompleteProfile,
	CompleteProfileError,
	initCompleteProfileErrors,
} from '@/feature/user/types';
import CompleteProfileForm from '../../complete-profile/completeProfileForm';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
	checkBeforeSubmitting,
	editProfile,
	editUserAuth,
	sendTags,
	uploadImages,
} from '@/feature/user/utils';
import FormContainer from '@/component/layout/form/formContainer';
import MatchaLogo from '@/component/ui/matchaLogo';
import AccountForm from './accountForm';
import { Form } from 'react-router-dom';
import { setCurrentUser } from '@/tool/userTools';
import {
	useUserEditMutation,
	useSetUserTagMutation,
	useUploadUserPictureMutation,
} from '@/feature/user/api.slice';
import { useEditAuthMutation } from '@/feature/auth/api.slice';

type ProfileEditProps = {
	base_profile: CompleteProfile;
};

export default function AuthEdit({ base_profile }: ProfileEditProps) {
	const [profile, setProfile] = useState<CompleteProfile>(base_profile);
	const [submitting, setSubmitting] = useState(false);
	const [editAuth] = useEditAuthMutation();
	const [editUser] = useUserEditMutation();
	const [setTag] = useSetUserTagMutation();
	const [uploadUserPicture] = useUploadUserPictureMutation();
	const [errors, setErrors] = useState<CompleteProfileError>(
		initCompleteProfileErrors,
	);
	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!checkBeforeSubmitting(profile)) return null;
		setErrors(initCompleteProfileErrors);
		setSubmitting(true);
		if (await editUserAuth(profile, editAuth, setErrors, setSubmitting))
			if (await editProfile(profile, editUser, setErrors, setSubmitting))
				if (await sendTags(profile, setTag, setErrors, setSubmitting))
					if (
						await uploadImages(
							profile,
							editUser,
							uploadUserPicture,
							setErrors,
							setSubmitting,
						)
					) {
						await setCurrentUser();
						toast.success('Profile saved successfully!');
					}
	};

	return (
		<div className="flex justify-between flex-col items-center w-full h-full">
			<MatchaLogo to="/home" />
			<FormContainer size="sm">
				<div className="text-3xl mb-3 text-center w-full font-bold">
					Edit Profile
				</div>
				<Form onSubmit={submit} className="w-full">
					<AccountForm profile={profile} errors={errors} />
					<CompleteProfileForm
						profile={profile}
						setProfile={setProfile}
						submitting={submitting}
						errors={errors}
						setErrors={setErrors}
						id="profile-edit"
                        complete={false}
					/>
				</Form>
			</FormContainer>
		</div>
	);
}
