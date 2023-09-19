import type { LoaderFunction } from 'react-router-dom';
import { store }               from '@/core/store';
import { userApi }             from '@/feature/user/api.slice';
import { setUser }             from '@/feature/user/store.slice';
import { selectUser }          from '@/feature/user/store.slice';
import { useStoreSelector }    from '@/hook/useStore';

// Loader ----------------------------------------------------------------------
export const loader: LoaderFunction = async () =>
{
	const request = store.dispatch(userApi.endpoints.getProfile.initiate());

	try
	{
		const response = await request.unwrap();

		store.dispatch(setUser(response));
	}
	catch (err: unknown)
	{
		console.log(`User::Profile: Loader failed.`);
		console.log(err);
	}
	finally
	{
		request.unsubscribe();
	}

	return null;
};

// Component -------------------------------------------------------------------
export function Component()
{
	const user = useStoreSelector(selectUser);

	return (
		<>
			<h1>User::Profile</h1>

			Id: { user.id } <br />
			Firstname: { user.firstname } <br />
			Lastname: { user.lastname } <br />
		</>
	);
}

Component.displayName = 'User::Profile';
