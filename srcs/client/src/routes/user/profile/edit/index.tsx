import LoadingSpinner from '@/component/ui/loadingSpinner';
import ProfileEdit from '@/component/user/profile/edit/profileEdit';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export function Component() {
	const { data = undefined, isFetching, isLoading } = useGetProfileQuery();
	const [tags, setTags] = useState<string[]>([]);

	useEffect(() => {
		if (data) {
			const tags = data.tags.map((tag) => tag.name);
			setTags(tags);
		}
	}, [data]);

	if (isLoading || isFetching) {
		return (
			<div className="w-full h-full flex flex-col justify-center items-center">
				<LoadingSpinner message="Loading User" />
			</div>
		);
	}

	if (!data) {
		toast.error(`Error: User not found`);
		return <Navigate to="/home" />;
	}

	return (
		<ProfileEdit
			key={tags.join(' ')}
			base_profile={{
				...data,
				tags,
			}}
		/>
	);
}
