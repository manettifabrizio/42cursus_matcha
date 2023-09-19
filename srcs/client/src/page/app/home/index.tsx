import { Link } from 'react-router-dom';

// Component -------------------------------------------------------------------
export function Component()
{
	return (
		<>
			<h1>Page::Home</h1>

			<ul>
				<li><Link to="/user/profile">Profile</Link></li>
				<li><Link to="/auth/logout">Logout</Link></li>
			</ul>
		</>
	);
}

Component.displayName = 'App::Home';
