import { BackToMenuArrow } from '@/component/home/sidebar/sidebar_main_content/profile_sidebar/backToMenuArrow';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import AuthEdit from '@/component/user/profile/auth/authEdit';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import { initAuthProfile } from '@/feature/user/types';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export function Component() {
	const {
		data = undefined,
		isFetching,
		isLoading,
		isError,
	} = useGetProfileQuery();

	if (isError) {
		toast.error(`Error: User not found`);
		return <Navigate to="/auth/logout" />;
	}

	return data && !isFetching && !isLoading ? (
		<>
			<BackToMenuArrow />
			<AuthEdit
				base_profile={{ ...initAuthProfile, email: data.email ?? '' }}
			/>
		</>
	) : (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<LoadingSpinner message="Loading user..." />
		</div>
	);
}
