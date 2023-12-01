import AuthEdit from '@/component/user/profile/auth/authEdit';
import { selectUser } from '@/feature/user/store.slice';
import { useStoreSelector } from '@/hook/useStore';

export function Component() {
	const user = useStoreSelector(selectUser);

	const tags = user.tags.map((tag) => tag.name);

	// return <AuthEdit base_profile={{ ...user, tags }} />;
	return <></>;
}
