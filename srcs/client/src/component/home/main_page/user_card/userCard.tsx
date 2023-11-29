import { Profile } from '@/feature/user/types';
import './user_card.scss';
import { Link } from 'react-router-dom';

type UserCardProps = {
	user: Profile;
};

export default function UserCard({ user }: UserCardProps) {
	const distance = Math.floor(user.location.distance);
	const age = Math.floor(
		(Date.now() - new Date(user.birthdate).getTime()) / 31536000000,
	);

	return (
		<Link
			key={user.id}
			className="user-card relative w-52 h-72 rounded-xl"
			to={`${location.origin}/home/${user.id}`}
		>
			<img
				src={`${location.origin}/api/pictures/${user.picture?.path}`}
				className="absolute inset-0 w-full h-full object-cover rounded-xl"
			/>
			<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black from-0% to-100% opacity-70 via-transparent to-transparent text-white p-4 h-full rounded-xl" />
			<div className="absolute inset-x-0 bottom-0 text-white p-4">
				<div className="text-xl">
					<b>{user.firstname}</b>
					{', ' + age}
				</div>
				<div>{distance + ' km'}</div>
			</div>
		</Link>
	);
}
