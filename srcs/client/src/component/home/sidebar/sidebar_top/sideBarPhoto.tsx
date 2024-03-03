import MImage from '@/component/ui/mImage';
import { goToProfile } from '@/feature/interactions/utils';
import { URLType } from '@/feature/types';
import { Profile } from '@/feature/user/types';
import { Link } from 'react-router-dom';

type SideBarPhotoProps = {
	url: URLType;
	user: Profile;
	show_notifications: boolean;
};

export default function SideBarPhoto({ url, user }: SideBarPhotoProps) {
	const center = url === 'user';

	return (
		<>
			<Link
				to="/user/profile/edit"
				className={
					center
						? 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-1 '
						: 'flex items-center'
				}
				onClick={goToProfile}
			>
				<MImage
					src={`${user.picture?.path}`}
					alt="Profile"
					className={`rounded-full inset-0 object-cover ${
						center ? 'h-16' : 'h-12'
					} ${center ? 'w-16' : 'w-12'}`}
				/>
				{!center && (
					<div>
						<p className="font-bold ms-2">{user.firstname}</p>
					</div>
				)}
			</Link>
		</>
	);
}
