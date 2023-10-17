import type { RegisterError } from './action';
import { useId } from 'react';
import { useNavigation } from 'react-router-dom';
import { useActionData } from 'react-router-dom';
import AccountForm from './forms/accountForm';

// Component -------------------------------------------------------------------
export default function RegisterForm() {
	const id = useId();
	const navigation = useNavigation();
	const data = useActionData() as RegisterError | undefined;

	return <AccountForm id={id} navigation={navigation} data={data} />;
}
