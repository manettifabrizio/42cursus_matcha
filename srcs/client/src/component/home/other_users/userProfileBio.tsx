import { Profile } from '@/feature/user/types';

type UserBioProps = {
	user: Profile;
};

export default function UserBio({ user }: UserBioProps) {
	return (
		<div className="overflow-y-auto no-scrollbar w-full h-full">
			<div className="whitespace-pre-line break-words w-full h-full">
				{user.biography}
			</div>
		</div>
	);
}
