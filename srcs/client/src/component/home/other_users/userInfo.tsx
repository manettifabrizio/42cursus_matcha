import { store } from '@/core/store';
import { Profile } from '@/feature/user/types';
import { LuDot } from 'react-icons/lu';

type UserProfileProps = {
	user: Profile;
	isOnline: boolean;
};

export default function UserInfo({ user, isOnline }: UserProfileProps) {
	console.log(user);
	const distance = Math.floor(user.location.distance);
	const age = Math.floor(
		(Date.now() - new Date(user.birthdate).getTime()) / 31536000000,
	);
	const current_user_tags = store.getState().user.tags;

	return (
		<div className="flex flex-col overflow-y-auto h-full pe-2">
			<div className="mb-0 me-4 text-4xl">{user.firstname}</div>
			<div className={`flex flex-row items-center mb-5`}>
				<div className="text-xl">{age} yrs</div> <LuDot className="" />
				<div
					className={
						`italic ` +
						(isOnline ? 'text-green-500' : 'text-gray-500')
					}
				>
					{isOnline ? 'online' : ''}
				</div>
			</div>

			<div className="flex flex-col mb-9 text-xl">
				<div className="relative mt-2" title={`Fame: ${user.fame}`}>
					<input
						type="range"
						className={
							'absolute h-1 w-full outline-none z-40 pointer-events-none'
						}
						min="1"
						max="100"
						value={user.fame}
						disabled
					/>
					<div className="relative w-full bg-white">
						{/* Slider */}
						<div className="absolute h-2 bg-gradient-to-r to-red-600 from-amber-400 z-20 rounded-md w-full" />
					</div>
				</div>
			</div>

			<div className="grid grid-cols-5 gap-2 text-sm mb-5 text-center">
				{user.tags.map((tag) => (
					<span
						className={
							`rounded-md px-1                                                                                                                                                                                                                                                                                       ` +
							(current_user_tags.includes(tag)
								? 'bg-gradient-to-r from-red-600 to-amber-400 '
								: 'border')
						}
						key={tag.id}
					>
						{tag.name}
					</span>
				))}
			</div>
			<div>{user.biography}</div>
			<div className="mb-4">Distance: {distance} km</div>
		</div>
	);
}
