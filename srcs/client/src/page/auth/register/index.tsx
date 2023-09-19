import RegisterForm from '@/feature/auth/register';

// Action ----------------------------------------------------------------------
export { action } from '@/feature/auth/register/action';

// Component -------------------------------------------------------------------
export function Component()
{
	return (
		<>
			<h1>Auth::Register</h1>

			<RegisterForm />
		</>
	);
}

Component.displayName = 'Auth::Register';
