import { User } from '@/feature/user/types';
import UserCard from './user_card/userCard';

type AvailableUsersProps = {
	users: User[];
};

export default function AvailableUsers({ users }: AvailableUsersProps) {
	return (
		<div className="w-full h-full overflow-auto">
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
		</div>
	);
}
