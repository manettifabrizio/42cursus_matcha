import { Profile } from '@/feature/user/types';
import UserCard from './user_card/userCard';
import LoadingSpinner from '@/component/ui/loadingSpinner';

type AvailableUsersProps = {
	users: Profile[];
	isLoading: boolean;
	isFetching: boolean;
};

export default function AvailableUsers({
	users,
	isLoading,
	isFetching,
}: AvailableUsersProps) {
	return (
		<div className="w-full h-full overflow-auto">
			{isLoading || isFetching ? (
				<div className="w-full h-full flex flex-col justify-center items-center">
					<LoadingSpinner message="Loading Users..." />
				</div>
			) : (
				<>
					{users.length > 0 ? (
						<div className="grid auto-rows-auto auto-cols-max gap-9 grid-cols-[repeat(auto-fill,minmax(200px,1fr))] mx-5 my-3 transition">
							{users.map((u) => (
								<UserCard user={u} />
							))}
						</div>
					) : (
						<div className="flex justify-center items-center h-full">
							<div className="text-3xl">No users found</div>
						</div>
					)}
				</>
			)}
		</div>
	);
}
