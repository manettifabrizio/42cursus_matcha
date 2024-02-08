import { Profile } from '@/feature/user/types';
import { FaChevronLeft } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';

type SideBarPhotoProps = {
	url: 'home' | 'user';
	user: Profile;
	show_notifications: boolean;
};

export default function SideBarPhoto({ url, user }: SideBarPhotoProps) {
	const center = !(url === 'user');
	const navigate = useNavigate();

	return (
		<>
			{url === 'user' && (
				<div className={`absolute top-1/2 -translate-y-1/2 left-0 `}>
					<button
						onClick={() => navigate(-1)}
						className="flex m-3 text-xl"
					>
						<FaChevronLeft />
					</button>
				</div>
			)}
			<Link
				to="/user/profile/edit"
				className={
					'flex items-center transition-all p-1 rounded-xl ' +
					(center ? '' : 'justify-center')
				}
			>
				<img
					src={`${location.origin}/api/pictures/${user.picture?.path}`}
					alt="Profile"
					className={`rounded-full inset-0 object-cover ${
						center ? 'h-12' : 'h-16'
					} ${center ? 'w-12' : 'w-16'}`}
				/>
				{center && (
					<div>
						<p className="font-bold ms-2">{user.firstname}</p>
					</div>
				)}
			</Link>
		</>
	);
}
