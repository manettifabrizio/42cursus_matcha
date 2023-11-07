import { Profile } from '@/feature/user/types';

type UserCardProps = {
	user: Profile;
};

export default function UserCard({ user }: UserCardProps) {
	const distance = Math.floor(user.location.distance);
	const age = Math.floor(
		(Date.now() - new Date(user.birthdate).getTime()) / 31536000000,
	);

	return (
		<div
			className="border-2 relative w-52 h-72 rounded-xl overflow-hidden "
			key={Math.random()}
		>
			<img
				src={`${location.origin}/api/pictures/${user.picture?.path}`}
				className="absolute inset-0 w-full h-full object-cover"
			/>
			<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black from-0% to-70% opacity-70 via-transparent to-transparent text-white p-4 h-full" />
			<div className="absolute inset-x-0 bottom-0 text-white p-4">
				<div className="text-xl font-bold">
					{user.firstname + ', ' + age}
				</div>
				<div>{distance + ' km'}</div>
			</div>
		</div>
	);
}
