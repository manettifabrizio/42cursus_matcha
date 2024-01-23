import { Profile } from '@/feature/user/types';
import { getDistance } from '@/tool/userTools';
import { FaChevronLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

type ChatTopProps = {
	other_user: Profile;
};

export default function ChatTop({ other_user }: ChatTopProps) {
	return (
		<div className="flex flex-row w-full px-2 pt-2">
			<Link to="/home" className="flex m-3 text-xl">
				<FaChevronLeft />
			</Link>
			<div className="flex flex-row">
				<img
					src={`${location.origin}/api/pictures/${other_user.picture?.path}`}
					alt="Chat"
					className="mr-2 inset-0 h-12 w-12 object-cover rounded-full"
				/>
				<div>
					<p className="font-bold">{other_user.firstname}</p>
					<p>{getDistance(other_user) + ' km'}</p>
				</div>
			</div>
		</div>
	);
}
