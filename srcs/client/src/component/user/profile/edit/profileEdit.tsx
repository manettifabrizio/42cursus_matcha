import { CompleteProfile, Profile } from '@/feature/user/types';
import CompleteProfileForm from '../../complete-profile/completeProfileForm';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import toast from 'react-hot-toast';

type ProfileEditProps = {
	base_profile: Profile;
};

export default function ProfileEdit({ base_profile }: ProfileEditProps) {
	const [profile, setProfile] = useState<CompleteProfile>();
	const [pictures, setPictures] = useState<File[]>([]);
	const [loading, setLoading] = useState(true);

	const tags = base_profile.tags.map((tag) => tag.name);

	const getPictures = async (profile: Profile) => {
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
						return file;
					} else {
						// Handle error if needed
						toast.error(`Failed to fetch picture ${picture?.path}`);
						console.error(
							`Failed to fetch picture ${picture?.path}`,
						);
						return null;
					}
				}),
			);

			res.forEach((res) => {
				if (res.status === 'fulfilled' && res.value !== null)
					setPictures((pictures) => [...pictures, res.value!]);
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		console.log('useEffect');
		getPictures(base_profile);
	}, []);

	return loading ? (
		<LoadingSpinner />
	) : (
		// <CompleteProfileForm
		// 	profile={{ ...profile, tags, pictures }}
		// 	setProfile={setProfile}
		// />
        <></>
	);
}
