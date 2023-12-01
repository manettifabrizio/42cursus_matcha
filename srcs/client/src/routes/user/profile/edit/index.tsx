import LoadingSpinner from '@/component/ui/loadingSpinner';
import ProfileEdit from '@/component/user/profile/edit/profileEdit';
import { selectUser } from '@/feature/user/store.slice';
import { Profile } from '@/feature/user/types';
import { useStoreSelector } from '@/hook/useStore';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function Component() {
	const user = useStoreSelector(selectUser);
	const [pictures, setPictures] = useState<File[]>([]);
	const [loading, setLoading] = useState(true);

	const tags = user.tags.map((tag) => tag.name);

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
		getPictures(user);
	}, []);

	return loading ? (
		<LoadingSpinner />
	) : (
		<ProfileEdit base_profile={{ ...user, tags, pictures }} />
	);
}
