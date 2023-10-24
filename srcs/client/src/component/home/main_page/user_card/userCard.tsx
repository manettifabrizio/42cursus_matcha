import { User } from '@/feature/user/types';

type UserCardProps = {
	user: User;
};

export default function UserCard({ user }: UserCardProps) {
	const distance = '1km';

	return (
		<div
			className="border relative w-52 h-72 rounded-xl overflow-hidden "
			key={Math.random()}
		>
			<img
				src={`${location.origin}/api/pictures/${user.picture?.path}`}
				className="absolute inset-0 w-full h-full object-cover"
			/>
			<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black from-0% to-70% opacity-70 via-transparent to-transparent text-white p-4 h-full" />
			<div className="absolute inset-x-0 bottom-0 text-white p-4">
				<div className="text-xl font-bold">
					{user.firstname + (user.age ? `, ${user.age}` : '')}
				</div>
				<div>{distance}</div>
			</div>
		</div>
	);
}
