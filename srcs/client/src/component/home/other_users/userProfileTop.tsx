import { store } from '@/core/store';
import { Profile } from '@/feature/user/types';
import { formatDateTime } from '@/tool/userTools';
import { LuDot } from 'react-icons/lu';

type UserProfileProps = {
	user: Profile;
	status: boolean | Date | undefined;
};

export default function UserInfo({ user, status }: UserProfileProps) {
	const age = user.birthdate
		? Math.floor(
				(Date.now() - new Date(user.birthdate).getTime()) / 31536000000,
		  )
		: undefined;
	const current_user_tags = store.getState().user.tags;

	return (
		<div className="flex flex-col pe-2 w-full mb-2">
			<div className="mb-0 me-4 text-4xl">{user.firstname}</div>
			<div className={`flex flex-row items-center mb-5`}>
				<div className="text-xl whitespace-nowrap">{age} yrs</div>{' '}
				<LuDot className="m-1" />
				{status != undefined ? (
					<div
						className={
							`no-scrollbar h-full w-full italic whitespace-nowrap overflow-x-scroll ` +
							(typeof status === 'boolean'
								? 'text-green-500'
								: 'text-gray-300')
						}
					>
						{typeof status === 'boolean'
							? 'online'
							: 'last seen at ' +
							  formatDateTime(new Date(status))}
					</div>
				) : (
					<div className="italic text-gray-300">loading...</div>
				)}
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

			<div className="flex flex-wrap flex-row auto-cols-auto gap-2 text-sm mb-5 text-center">
				{user.tags.map((tag) => (
					<span
						className={
							`rounded-xl px-2 text-lg                                                                                                                                                                                                                                                                                       ` +
							(current_user_tags.some((t) => t.id === tag.id)
								? 'bg-gradient-to-r from-red-600 to-amber-400 '
								: 'border')
						}
						key={tag.id}
					>
						{tag.name}
					</span>
				))}
			</div>
		</div>
	);
}
