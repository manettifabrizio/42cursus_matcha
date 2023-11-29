import { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	useSetUserTagMutation,
	useUploadUserPictureMutation,
	useUserEditMutation,
} from '@/feature/user/api.slice';
import { manageRTKQErrorDetails } from '@/tool/isRTKQError';
import toast from 'react-hot-toast';
import { getGeolocation } from '@/tool/getLocation';
import {
	CompleteProfile,
	CompleteProfileError,
	PictureError,
	TagsError,
	UserEditError,
} from '@/feature/user/types';
import { isProfileCompleted, setCurrentUser } from '@/tool/userTools';
import FormContainer from '@/component/layout/form/formContainer';
import MatchaLogo from '@/component/ui/matchaLogo';
import CompleteProfileForm from '@/component/user/complete-profile/completeProfileForm';

const initErrors: CompleteProfileError = {
	birthday: [],
	gender: [],
	pictures: [],
	tags: [],
};

export function Component() {
	const [editUser] = useUserEditMutation();
	const [setTag] = useSetUserTagMutation();
	const [uploadUserPicture] = useUploadUserPictureMutation();
	const navigate = useNavigate();

	// TODO: move this in the route loader
	useEffect(() => {
		if (isProfileCompleted()) {
			navigate('/home');
		}
	}, [isProfileCompleted()]);

	const [submitting, setSubmitting] = useState(false);
	const [profile, setProfile] = useState<CompleteProfile>({
		birthday: undefined,
		gender: undefined,
		orientation: undefined,
		biography: '',
		location: undefined,
		pictures: [],
		tags: [],
	});
	const [errors, setErrors] = useState<CompleteProfileError>(initErrors);

	function checkBeforeSubmitting() {
		if (profile.pictures && profile.pictures.length < 2) {
			toast.error('Select at least 2 images to start.');
			return false;
		}

		if (profile.tags.length > 4) {
			toast.error('Too many tags selected. Max is 4.');
			return false;
		}

		if (profile.biography.trim().length === 0) {
			toast.error("Biography can't be only spaces.");
			return false;
		}

		return true;
	}

	async function editProfile(): Promise<boolean> {
		const location = await getGeolocation();

		try {
			await editUser({
				birthdate: profile.birthday,
				gender: profile.gender,
				orientation: profile.orientation,
				biography: profile.biography,
				location,
			}).unwrap();

			return true;
		} catch (error: unknown) {
			const editError = manageRTKQErrorDetails<UserEditError>(error);

			setErrors((c) => ({
				...c,
				birthday: editError?.birthday,
				gender: editError?.gender,
			}));
			setSubmitting(false);

			return false;
		}
	}

	async function sendTags(): Promise<boolean> {
		const promises = profile.tags.map(
			async (t) => await setTag({ name: t }).unwrap(),
		);
		const res = await Promise.allSettled(promises);

		res.forEach((r) => {
			if (r.status === 'rejected') {
				const tagsError = manageRTKQErrorDetails<TagsError>(r.reason);

				setErrors((c) => ({
					...c,
					tags: c.tags?.concat(tagsError?.name ?? []),
				}));
				setSubmitting(false);
			}
		});

		return (
			!res.length ||
			res.find((r) => r.status === 'rejected') === undefined
		);
	}

	async function uploadImages(): Promise<boolean> {
		const promises = profile.pictures.map(async (p) => {
			const formData = new FormData();

			formData.append('picture', p);

			return await uploadUserPicture(formData).unwrap();
		});

		const res = await Promise.allSettled(promises);

		res.forEach((r) => {
			if (r.status === 'rejected') {
				const imageError = manageRTKQErrorDetails<PictureError>(
					r.reason,
				);

				setErrors((c) => ({
					...c,
					pictures: c.pictures?.concat(imageError?.picture ?? []),
				}));
				setSubmitting(false);
			}
		});

		// Set first picture as profile picture

		const first_picture = res.find((r) => r.status === 'fulfilled');

		if (first_picture && first_picture.status === 'fulfilled')
			await editUser({ id_picture: first_picture.value.id }).unwrap();

		return (
			!res.length ||
			res.find((r) => r.status === 'rejected') === undefined
		);
	}

	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!checkBeforeSubmitting()) return null;

		setErrors(initErrors);
		setSubmitting(true);

		if (await editProfile())
			if (await sendTags())
				if (await uploadImages()) {
					await setCurrentUser();

					toast.success(
						"Profile completed successfully! Let's start matching!!",
					);

					return navigate('/home');
				}
	};

	const id = useId();

	return (
		<>
			<div className="flex justify-between flex-col items-center w-full h-full">
				<MatchaLogo to="/home" />
				<FormContainer>
					<h4 className="font-bold">
						Let's complete your profile to start matching with
						people!
					</h4>
					<CompleteProfileForm
						submit={submit}
						submitting={submitting}
						setProfile={setProfile}
						setErrors={setErrors}
						id={id}
						errors={errors}
						profile={profile}
					/>
				</FormContainer>
			</div>
		</>
	);
}
