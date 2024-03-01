import { Profile } from '@/feature/user/types';
import './user_card.scss';
import { Link } from 'react-router-dom';
import { getDistance } from '@/tool/userTools';
import MImage from '@/component/ui/mImage';

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

	function userCardContent() {
		return (
			<>
				{user.picture == undefined ? (
					<div />
				) : (
					<MImage
						src={`${user.picture?.path}`}
						alt="Avatar"
						className="absolute inset-0 w-full h-full object-cover rounded-xl"
					/>
				)}
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black from-0% to-100% opacity-70 via-transparent text-white p-4 h-full rounded-xl" />
				<div className="absolute inset-x-0 bottom-0 text-white p-4">
					<div className="text-xl">
						<b>{user.firstname}</b>
						{user.birthdate && ', ' + getAge(user.birthdate)}
					</div>
					{<div>{getDistance(user) + ' km'}</div>}
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
			className="user-card relative w-40 h-60 sm:w-52 sm:h-72"
			to={`/user/${user.id}`}
		>
			{userCardContent()}
		</Link>
	);
}
