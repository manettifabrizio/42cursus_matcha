import { Profile } from '@/feature/user/types';
import './user_card.scss';
import { Link } from 'react-router-dom';

type UserCardProps = {
	user: Profile;
	preview?: boolean;
};

export default function UserCard({ user, preview = false }: UserCardProps) {
	function getAge(birthdate: string) {
		const age = Math.floor(
			(Date.now() - new Date(birthdate).getTime()) / 31536000000,
		);
		return age;
	}

	function getDistance() {
		if (user.location?.distance) return Math.floor(user.location.distance);
		else return 10;
	}

	function userCardContent() {
		return (
			<>
				{user.picture == undefined ? (
					<div />
				) : (
					<img
						src={`${location.origin}/api/pictures/${user.picture?.path}`}
						className="absolute inset-0 w-full h-full object-cover rounded-xl"
					/>
				)}
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black from-0% to-100% opacity-70 via-transparent to-transparent text-white p-4 h-full rounded-xl" />
				<div className="absolute inset-x-0 bottom-0 text-white p-4">
					<div className="text-xl">
						<b>{user.firstname}</b>
						{user.birthdate && ', ' + getAge(user.birthdate)}
					</div>
					{<div>{getDistance() + ' km'}</div>}
				</div>
			</>
		);
	}

	if (preview)
		return (
			<div className="border-2 border-white relative w-52 h-72 rounded-xl">
				{userCardContent()}
			</div>
		);

	return (
		<Link
			key={user.id}
			className="user-card relative w-52 h-72 rounded-xl"
			to={`${location.origin}/user/${user.id}`}
		>
			{userCardContent()}
		</Link>
	);
}
