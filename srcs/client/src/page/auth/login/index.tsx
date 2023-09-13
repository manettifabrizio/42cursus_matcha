import LoginForm     from '@/feature/auth/login';

// Action ----------------------------------------------------------------------
export { action } from '@/feature/auth/login/action';

// Component -------------------------------------------------------------------
export function Component()
{
	return (
		<>
			<h1>Auth::Login</h1>

			<LoginForm />
		</>
	);
}

Component.displayName = 'Auth::Login';
