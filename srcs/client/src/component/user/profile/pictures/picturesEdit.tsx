import {
	FileWithId,
	Profile,
	PicturesProfileError,
	initPicturesProfileError,
} from '@/feature/user/types';
import { useState, useEffect } from 'react';
import PicturesInput from '../../complete-profile/inputs/picturesInput';
import toast from 'react-hot-toast';

type PicturesEditProps = {
	profile: Profile;
	submitting: boolean;
};

export default function PicturesEdit({
	profile,
	submitting,
}: PicturesEditProps) {
	const [errors, setErrors] = useState<PicturesProfileError>(
		initPicturesProfileError,
	);
	const [pictures, setPictures] = useState<FileWithId[]>([]);
	const [loading, setLoading] = useState(false);

	const getPictures = async (profile: Profile) => {
		const res_pictures: FileWithId[] = [];

		setLoading(true);

		try {
			const res = await Promise.allSettled(
				profile.pictures.map(async (picture) => {
					const response = await fetch(
						`${location.origin}/api/pictures/${picture?.path}`,
					);

					if (response.ok) {
						const blob = await response.blob();
						const file = new File(
							[blob],
							picture?.path || 'unknown',
							{
								type:
									response.headers.get('content-type') ||
									'application/octet-stream',
							},
						);
						return { file, id: picture.id };
					} else {
						const error = `Failed to fetch picture ${picture?.path}`;

						toast.error(error);
						console.error(error);
						return null;
					}
				}),
			);

			res.forEach((res) => {
				if (
					res.status === 'fulfilled' &&
					res.value !== null &&
					!res_pictures.some(
						(p) => res.value?.file.name === p.file.name,
					)
				)
					res_pictures.push(res.value!);
			});
		} finally {
			console.log('faffa');
			setPictures(res_pictures);
			setLoading(false);
		}
	};

	useEffect(() => {
		console.log('profile', profile);
		if (profile) {
			getPictures(profile);
		}
	}, [profile]);

	return (
		<PicturesInput
			key={pictures.length}
			setErrors={setErrors}
			errors={errors?.pictures}
			base_pictures={pictures}
			profile_picture={pictures.find((p) => p.id === profile.picture?.id)}
			profile={profile}
			loading={submitting || loading}
		/>
	);
}
