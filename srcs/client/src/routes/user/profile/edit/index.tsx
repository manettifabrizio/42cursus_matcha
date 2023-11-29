import ProfileEdit from '@/component/user/profile/edit/profileEdit';
import { selectUser } from '@/feature/user/store.slice';
import { useStoreSelector } from '@/hook/useStore';

export function Component() {
	const user = useStoreSelector(selectUser);

	return <ProfileEdit profile={user} />;
}
