import UserProfile from '@/component/home/other_users/userProfile';
import LoadingSpinner from '@/component/ui/loadingSpinner';
import { useGetProfileQuery } from '@/feature/user/api.slice';
import { Navigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Component() {
	const { id } = useParams<{ id: string }>();

	const {
		data = undefined,
		isFetching,
		isLoading,
	} = useGetProfileQuery({ id: id ? parseInt(id) : undefined });

	if (id) {
		if (isLoading) {
			return (
				<div className="w-full h-full flex flex-col justify-center items-center">
					<LoadingSpinner message="Loading User" />
				</div>
			);
		}

		if (!data) {
			toast.error(`Error: User n.${id} not found`);
			return <Navigate to="/home" />;
		}

		return (
			<div className="h-full w-full flex justify-center items-center">
				<UserProfile user={data} isFetching={isFetching} />
			</div>
		);
	}
	return (
		<div className="w-full h-full flex flex-col justify-center items-center">
			<LoadingSpinner message="Loading User" />
		</div>
	);
}
