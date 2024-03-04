import { BackToMenuArrow } from '@/component/home/sidebar/sidebar_main_content/profile_sidebar/backToMenuArrow';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import PicturesEdit from '@/component/user/profile/pictures/picturesEdit';
import { clearAuth } from '@/feature/auth/store.slice';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function Component() {
	const dispatch = useDispatch();
	const {
		data = undefined,
		isFetching,
		isLoading,
		isError,
	} = useGetProfileQuery();

	if (isError) {
		toast.error(`Error: User not found`);
		dispatch(clearAuth());
		return <Navigate to="/" />;
	}

	return data && !isFetching && !isLoading ? (
		<>
			<BackToMenuArrow />
			<div className="text-3xl mb-3 text-center w-full font-bold">
				Edit Pictures
			</div>
			<PicturesEdit profile={data} submitting={isFetching || isLoading} />
		</>
	) : (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<LoadingSpinner message="Loading user..." />
		</div>
	);
}
