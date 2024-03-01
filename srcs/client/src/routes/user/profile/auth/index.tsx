import { BackToMenuArrow } from '@/component/home/sidebar/sidebar_main_content/profile_sidebar/backToMenuArrow';
import AuthEdit from '@/component/user/profile/auth/authEdit';
import { selectUser } from '@/feature/user/store.slice';
import { initAuthProfile } from '@/feature/user/types';
import { useStoreSelector } from '@/hook/useStore';

export function Component() {
	const user = useStoreSelector(selectUser);

	return (
		<>
			<BackToMenuArrow />
			<AuthEdit
				base_profile={{ ...initAuthProfile, email: user.email }}
			/>
		</>
	);
}
