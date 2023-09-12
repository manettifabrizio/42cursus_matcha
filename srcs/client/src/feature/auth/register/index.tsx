import type { RegisterError } from './action';
import { useId }              from 'react';
import { Form }               from 'react-router-dom';
import { useNavigation }      from 'react-router-dom';
import { useActionData }      from 'react-router-dom';

// Component -------------------------------------------------------------------
export default function RegisterForm()
{
	const id = useId();
	const navigation = useNavigation();
	const data = useActionData() as RegisterError;

	return (
		<>
			<Form method="post">
				{
					data?.username &&
					<ul>
						{
							data.username.map((error) => <li key={ error }>{ error }</li>)
						}
					</ul>
				}
				<label htmlFor={`${id}-username`}>Username</label>
				<input type="text" name="username" id={`${id}-username`} />
				<br />
				{
					data?.password &&
					<ul>
						{
							data.password.map((error) => <li key={ error }>{ error }</li>)
						}
					</ul>
				}
				<label htmlFor={`${id}-password`}>Password</label>
				<input type="password" name="password" id={`${id}-password`} />
				<br />
				{
					data?.password_confirm &&
					<ul>
						{
							data.password_confirm.map((error) => <li key={ error }>{ error }</li>)
						}
					</ul>
				}
				<label htmlFor={`${id}-password_confirm`}>Password confirmation</label>
				<input type="password" name="password_confirm" id={`${id}-password_confirm`} />
				<br />
				{
					data?.email &&
					<ul>
						{
							data.email.map((error) => <li key={ error }>{ error }</li>)
						}
					</ul>
				}
				<label htmlFor={`${id}-email`}>Email</label>
				<input type="email" name="email" id={`${id}-email`} />
				<br />
				{
					data?.firstname &&
					<ul>
						{
							data.firstname.map((error) => <li key={ error }>{ error }</li>)
						}
					</ul>
				}
				<label htmlFor={`${id}-firstname`}>Firstname</label>
				<input type="text" name="firstname" id={`${id}-firstname`} />
				<br />
				{
					data?.lastname &&
					<ul>
						{
							data.lastname.map((error) => <li key={ error }>{ error }</li>)
						}
					</ul>
				}
				<label htmlFor={`${id}-lastname`}>Lastname</label>
				<input type="text" name="lastname" id={`${id}-lastname`} />
				<br />
				<button type="submit" id={`${id}-auth-register`} disabled={navigation.state === 'submitting'}>
					Register
				</button>
			</Form>
		</>
	);
}
