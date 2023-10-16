import { useId, useState } from 'react';
import { Form, Link, useNavigate } from 'react-router-dom';
import MatchaLogo from '/matcha.svg';
import PicturesForm from '@/feature/auth/register/forms/picturesForm';
import {
	useSetUserTagMutation,
	useUploadUserPictureMutation,
	useUserEditMutation,
} from '@/feature/user/api.slice';
import { manageRTKQErrorDetails } from '@/tool/isRTKQError';
import BirthdayForm from '@/feature/auth/register/forms/birthdayForm';
import GenderForm from '@/feature/auth/register/forms/genderForm';
import TagsForm from '@/feature/auth/register/forms/tagsForm';
import { toast } from 'react-toastify';

export type Profile = {
	birthday: string | undefined;
	gender: 'MALE' | 'FEMALE' | undefined;
	pictures: File[];
	tags: string[];
};

export type CompleteProfileError = {
	birthday?: string[];
	gender?: string[];
	tags?: string[];
	pictures?: string[];
};

type UserEditError = { birthday?: string[]; gender?: string[] };
type TagsError = { name: string[] };
type PictureError = { picture: string[] };

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

	const [profile, setProfile] = useState<Profile>({
		birthday: undefined,
		gender: undefined,
		pictures: [],
		tags: [],
	});
	const [errors, setErrors] = useState<CompleteProfileError>(initErrors);

	async function editProfile(): Promise<boolean> {
		try {
			Promise.resolve(
				await editUser({
					birthdate: profile.birthday,
					gender: profile.gender,
				}).unwrap(),
			);

			return true;
		} catch (error: unknown) {
			const editError = manageRTKQErrorDetails<UserEditError>(error);
			setErrors((c) => ({
				...c,
				birthday: editError?.birthday,
				gender: editError?.gender,
			}));

			return false;
		}
	}

	async function sendTags(): Promise<boolean> {
		if (profile.tags.length > 4) {
			toast.error('Too many tags selected. Max is 4.');
			return false;
		}

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
			}
		});

		return (
			!res.length ||
			res.find((r) => r.status === 'rejected') === undefined
		);
	}

	async function uploadImages(): Promise<boolean> {
		if (profile.pictures && profile.pictures.length < 2) {
			toast.error('Select at least 2 images to start.');
			return false;
		}

		const promises = profile.pictures.map(async (p) => {
			const formData = new FormData();

			formData.append('picture', p);

			await uploadUserPicture(formData).unwrap();
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
			}
		});

		return (
			!res.length ||
			res.find((r) => r.status === 'rejected') === undefined
		);
	}

	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setErrors(initErrors);

		if (await editProfile())
			if (await sendTags())
				if (await uploadImages()) {
					toast.success(
						"Profile completed successfully! Let's start matching!!",
					);
					return navigate('/home');
				}
	};

	const id = useId();

	return (
		<>
			<div className="flex justify-between flex-col items-center w-full">
				<Link to="/" className="flex justify-center">
					<img src={MatchaLogo} alt="MatchaLogo" className="w-1/3" />
				</Link>
				<div className="overflow-auto w-full h-full">
					<div className="flex justify-center my-4">
						<div className="flex flex-col justify-center items-center w-10/12 sm:w-3/4 md:w-1/3">
							<h4 className="font-bold">
								Let's complete your profile to start matching
								with people!
							</h4>
							<Form onSubmit={submit} className="w-full">
								<BirthdayForm
									setProfile={setProfile}
									id={id}
									errors={errors?.birthday}
								/>
								<GenderForm
									setProfile={setProfile}
									id={id}
									errors={errors?.gender}
								/>
								<TagsForm
									setProfile={setProfile}
									id={id}
									errors={errors?.tags}
								/>
								<PicturesForm
									setErrors={setErrors}
									setProfile={setProfile}
									errors={errors?.pictures}
									pictures={profile.pictures}
								/>
								<div className="flex justify-center mt-5">
									<button
										type="submit"
										className="group relative w-full text-white font-semibold py-2 rounded-full overflow-hidden bg-gradient-to-b from-red-600 to-amber-400 border border-black hover:opacity-80 transition"
									>
										Save
									</button>
								</div>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
