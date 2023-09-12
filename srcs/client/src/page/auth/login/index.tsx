import { useEffect } from 'react';
import LoginForm     from '@/feature/auth/login';
import { useAuth }   from '@/hook/useAuth';

// Action ----------------------------------------------------------------------
export { action } from '@/feature/auth/login/action';

// Component -------------------------------------------------------------------
export function Component()
{
	const { resetStore } = useAuth();

	// Note: Clear from any previous "session" (jwt expired)
	useEffect(() => resetStore(), [ resetStore ]);

	return (
		<>
			<h1>Auth::Login</h1>

			<LoginForm />
		</>
	);
}

Component.displayName = 'Auth::Login';
