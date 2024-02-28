import MImage from '@/component/ui/mImage';
import { goToHome, goToProfile } from '@/feature/interactions/utils';
import { URLType } from '@/feature/types';
import { Profile } from '@/feature/user/types';
import { FaChevronLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

type SideBarPhotoProps = {
	url: URLType;
	user: Profile;
	show_notifications: boolean;
};

export default function SideBarPhoto({ url, user }: SideBarPhotoProps) {
	const center = url !== 'user';

	return (
		<>
			{url === 'user' && (
				<div className={`absolute top-1/2 -translate-y-1/2 left-0 `}>
					<Link to="/home" className="flex m-3 text-xl" onClick={goToHome}>
						<FaChevronLeft />
					</Link>
				</div>
			)}
			<Link
				to="/user/profile/edit"
				className={
					'flex items-center transition-all p-1 rounded-xl ' +
					(center ? '' : 'justify-center')
				}
				onClick={goToProfile}
			>
				<MImage
					src={`${user.picture?.path}`}
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
