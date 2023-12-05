import AuthEdit from '@/component/user/profile/auth/authEdit';
import { selectUser } from '@/feature/user/store.slice';
import { initAuthProfile } from '@/feature/user/types';
import { useStoreSelector } from '@/hook/useStore';

export function Component() {
	const user = useStoreSelector(selectUser);

	return (
		<AuthEdit base_profile={{ ...initAuthProfile, email: user.email }} />
	);
}
