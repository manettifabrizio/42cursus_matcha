import {
	CompleteProfile,
	CompleteProfileError,
	Tag,
	initCompleteProfileErrors,
} from '@/feature/user/types';
import CompleteProfileInputs from '../../complete-profile/completeProfileInputs';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
	checkBeforeSubmitting,
	editProfile,
	hasProfileChanged,
	hasTagsChanged,
	sendTags,
} from '@/feature/user/utils';
import { Form } from 'react-router-dom';
import { setCurrentUser } from '@/tool/userTools';
import LocationButton from '../../complete-profile/locationButton';

type ProfileEditProps = {
	base_profile: CompleteProfile;
	base_profile_tags: Tag[];
	errors: CompleteProfileError;
	setErrors: React.Dispatch<React.SetStateAction<CompleteProfileError>>;
};

export default function ProfileEdit({
	base_profile,
	base_profile_tags,
	errors,
	setErrors,
}: ProfileEditProps) {
	const [profile, setProfile] = useState<CompleteProfile>(base_profile);
	const [submitting, setSubmitting] = useState(false);

	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const id = toast.loading('Editing profile details...', {
			style: { minWidth: '350px' },
		});
		if (!checkBeforeSubmitting(profile, id)) return null;
		setErrors(initCompleteProfileErrors);
		setSubmitting(true);
		if (
			!hasProfileChanged(profile, base_profile) ||
			(await editProfile(profile, setErrors, setSubmitting, id))
		)
			if (
				!hasTagsChanged(profile.tags, base_profile.tags) ||
				(await sendTags(
					profile,
					base_profile_tags,
					setErrors,
					setSubmitting,
					id,
				))
			) {
				toast.success('Profile saved successfully!', { id });
				await setCurrentUser();
				setSubmitting(false);
			}
	};

	return (
		<>
			<div className="text-3xl text-center w-full font-bold mb-3">
				Location
			</div>
			<LocationButton />
			<div className="text-3xl text-center w-full font-bold mb-3">
				Edit Profile
			</div>
			<Form onSubmit={submit} className="w-full">
				<CompleteProfileInputs
					profile={profile}
					base_profile={base_profile}
					setProfile={setProfile}
					submitting={submitting}
					errors={errors}
					id="profile-edit"
				/>
			</Form>
		</>
	);
}
