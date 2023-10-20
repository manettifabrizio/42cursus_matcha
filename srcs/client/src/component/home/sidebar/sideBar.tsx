import { store } from '@/core/store';
import { Link } from 'react-router-dom';

export default function SideBar() {
	const user = store.getState().user;

	return (
		<div className="w-72 h-screen fixed left-0 border-r ">
			<div className="flex flex-col p-4 h-full">
				{/* Profile section */}
				<Link to="/user/profile" className="flex items-center mb-4">
					<img
						src={`${location.origin}/api/pictures/${user.picture?.path}`}
						alt="Profile"
						className="rounded-full mr-2 h-12 w-12"
					/>
					<div>
						<p className="font-bold mb-0">{user.firstname}</p>
					</div>
				</Link>

				{/* Your Matches section */}
				<div className="mb-4">
					<p className="font-bold mb-2 text-2xl">Your Matches</p>
					<ul className="flex list-none p-0 flex-row">
						<li className="mb-1">
							<a href="#" className="flex items-center">
								<img
									src="https://via.placeholder.com/40"
									alt="Match"
									className="mr-2 rounded-full"
								/>
							</a>
						</li>
					</ul>
				</div>

				{/* Conversations section */}
				<div className="flex-1 overflow-auto">
					<p className="font-bold mb-2 text-2xl">Conversations</p>
					<ul className="list-none p-0">
						<li className="mb-1">
							<a href="#" className="flex items-center">
								<img
									src="https://via.placeholder.com/50"
									alt="Chat"
									className="mr-2 rounded-full"
								/>
								<div className="flex flex-col justify-end">
									<p>Tanya</p>
									<p className="text-gray-400">
										Hello! How are you?
									</p>
								</div>
							</a>
						</li>
					</ul>
				</div>
				<Link to="/auth/logout" className="text-center underline">
					Logout
				</Link>
			</div>
		</div>
	);
}
