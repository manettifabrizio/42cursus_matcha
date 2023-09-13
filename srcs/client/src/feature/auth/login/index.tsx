import type { LoginError }    from './action';
import { useId }              from 'react';
import { Form }               from 'react-router-dom';
import { useNavigation }      from 'react-router-dom';
import { useActionData }      from 'react-router-dom';

// Component -------------------------------------------------------------------
export default function LoginForm()
{
	const id = useId();
	const navigation = useNavigation();
	const data = useActionData() as LoginError|null;

	return (
		<>
			<Form method="post">
				{
					data &&
					<ul>
						{ data.username?.map((error) =>
							<li key={ error }>{ error }</li>
						)}
					</ul>
				}
				<label htmlFor={`${id}-username`}>Username</label>
				<input type="text" name="username" id={`${id}-username`} />
				<br />
				{
					data &&
					<ul>
						{ data.password?.map((error) =>
							<li key={ error }>{ error }</li>
						)}
					</ul>
				}
				<label htmlFor={`${id}-password`}>Password</label>
				<input type="password" name="password" id={`${id}-password`} />
				<br />
				<button type="submit" id={`${id}-auth-login`} disabled={navigation.state === 'submitting'}>
					Login
				</button>
			</Form>
		</>
	);
}
