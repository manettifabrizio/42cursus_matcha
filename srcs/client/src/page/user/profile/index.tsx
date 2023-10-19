import { selectUser } from '@/feature/user/store.slice';
import { useStoreSelector } from '@/hook/useStore';

// Component -------------------------------------------------------------------
export function Component() {
	const user = useStoreSelector(selectUser);

	return (
		<>
			<h1>User::Profile</h1>
			Id: {user.id} <br />
			Firstname: {user.firstname} <br />
			Lastname: {user.lastname} <br />
		</>
	);
}

Component.displayName = 'User::Profile';
