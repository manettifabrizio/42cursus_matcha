import { Profile } from '@/feature/user/types';
import { formatDateTime } from '@/tool/userTools';
import { LuDot } from 'react-icons/lu';
import FameIndicator from './fameIndicator';

type UserProfileProps = {
	my_user: Profile;
	other_user: Profile;
	status: boolean | Date | undefined;
};

export default function UserInfo({
	my_user,
	other_user,
	status,
}: UserProfileProps) {
	const age = other_user.birthdate
		? Math.floor(
				(Date.now() - new Date(other_user.birthdate).getTime()) /
					31536000000,
		  )
		: undefined;

	return (
		<div className="flex flex-col pe-2 w-full mb-2">
			<div className="mb-0 me-4 text-4xl">{other_user.firstname}</div>
			<div className={`flex flex-row items-center mb-1`}>
				<div className="text-xl whitespace-nowrap">{age} yrs</div>{' '}
				<LuDot />
				{status != undefined ? (
					<div
						className={
							`flex items-center no-scrollbar h-full w-full italic whitespace-nowrap overflow-x-scroll ` +
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
			<div className={`mb-4`}>
				{other_user.gender.toLowerCase()} -{' '}
				{other_user.orientation.toLowerCase()}
			</div>

			<FameIndicator fame={Number(other_user.fame ?? 0)} />

			<div className="flex flex-wrap flex-row auto-cols-auto gap-2 text-sm mb-5 text-center">
				{other_user.tags.map((tag) => (
					<span
						className={
							`rounded-xl px-2 text-lg                                                                                                                                                                                                                                                                                       ` +
							(my_user.tags.some((t) => t.id === tag.id)
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
