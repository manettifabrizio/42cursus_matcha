/* eslint-disable react-refresh/only-export-components */
import FormContainer from '@/component/layout/form/formContainer';

// Loader ----------------------------------------------------------------------
export { loader } from '@/feature/auth/logout/loader';

// Component -------------------------------------------------------------------
export function Component() {
	return (
		<div className="flex content-center h-screen">
			<FormContainer>Logging out...</FormContainer>
		</div>
	);
}