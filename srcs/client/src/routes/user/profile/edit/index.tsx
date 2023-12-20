import LoadingSpinner from '@/component/ui/loadingSpinner';
import ProfileEdit from '@/component/user/profile/edit/profileEdit';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import { profileToCompleteProfile } from '@/tool/userTools';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export function Component() {
	const {
		data = undefined,
		isFetching,
		isLoading,
		isError,
	} = useGetProfileQuery();

	if (isLoading || isFetching) {
		return (
			<div className="w-full h-full flex flex-col justify-center items-center">
				<LoadingSpinner message="Loading User" />
			</div>
		);
	}

	if (isError) {
		toast.error(`Error: User not found`);
		return <Navigate to="/" />;
	}

	return data ? (
		<ProfileEdit
			key={data.tags.join(' ')}
			base_profile={profileToCompleteProfile(data)}
		/>
	) : (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<LoadingSpinner message="Loading user..." />
		</div>
	);
}
