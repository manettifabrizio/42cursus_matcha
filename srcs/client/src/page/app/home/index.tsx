import { Link } from 'react-router-dom';

// Component -------------------------------------------------------------------
export function Component()
{
	return (
		<>
			<h1>Page::Home</h1>
			<Link to="/user/profile">Profile</Link>
			<Link to="/auth/logout">Logout</Link>
		</>
	);
}

Component.displayName = 'App::Home';
