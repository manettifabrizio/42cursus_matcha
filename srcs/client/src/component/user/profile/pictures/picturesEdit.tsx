import {
	Profile,
	PicturesProfileError,
	initPicturesProfileError,
} from '@/feature/user/types';
import { useState } from 'react';
import PicturesInput from '../../complete-profile/inputs/picturesInput';

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

	return (
		<PicturesInput
			key={profile.pictures.length}
			setErrors={setErrors}
			errors={errors?.pictures}
			base_pictures={profile.pictures}
			profile_picture={profile.pictures.find(
				(p) => p.id === profile.picture?.id,
			)}
			profile={profile}
			loading={submitting}
		/>
	);
}
