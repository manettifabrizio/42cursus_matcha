import { Profile } from '@/feature/user/types';
import { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import UserInfo from './userInfo';
import UserActions from './userActions';

type UserProfileProps = {
	user: Profile;
	isFetching: boolean;
};

export default function UserProfile({ user, isFetching }: UserProfileProps) {
	const [isOnline, setIsOnline] = useState(false);

	const user_pictures = user.pictures;

	return (
		<div className="relative w-full h-full flex justify-center items-center">
			<div className={`absolute top-0 left-0 `}>
				<Link
					to="/home"
					className="w-full justify-start flex flex-row items-center m-3 text-xl"
				>
					<FaChevronLeft />
				</Link>
			</div>
			<div
				// TODO: Better color when match
				className={
					'flex flex-row border-4 w-3/4 h-5/6 rounded-xl overflow-hidden ' +
					(user.likes?.by_me && user.likes?.to_me
						? 'border-red-500'
						: '')
				}
			>
				<div className="bg-orange-500 w-1/2 h-full overflow-y-auto">
					<img
						src={`${location.origin}/api/pictures/${user.picture?.path}`}
						className="inset-0 w-full h-full object-cover"
						key={user.picture?.id}
					/>
					{user_pictures.map((picture) => (
						<img
							src={`${location.origin}/api/pictures/${picture.path}`}
							className="inset-0 w-full"
							key={picture.id}
						/>
					))}
				</div>
				<div className="flex flex-col w-1/2 h-full p-10 relative">
					{user.blocks?.by_me && (
						<div className="absolute top-0 left-0 text-red-500 italic font-light border-red-500 border-b w-full text-center">
							User is blocked
						</div>
					)}
					<UserInfo user={user} isOnline={isOnline} />
					<UserActions user={user} isFetching={isFetching} />
				</div>
			</div>
		</div>
	);
}
