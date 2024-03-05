/* eslint-disable react-refresh/only-export-components */
import FormContainer from '@/component/layout/form/formContainer';
import { api } from '@/core/api';
import { useLogoutMutation } from '@/feature/auth/api.slice';
import { clearAuth } from '@/feature/auth/store.slice';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Component -------------------------------------------------------------------
export function Component() {
	const [logout] = useLogoutMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		async function logoutUser() {
			try {
				await logout().unwrap();

				dispatch(clearAuth());
				// Reset store state on logout
				dispatch({ type: 'resetAll' });
				dispatch(api.util.resetApiState());

				navigate('/auth/login');
			} catch (error: unknown) {
				toast.error(`Error: logout failed.`);
				// console.error(`Error logout failed: ${JSON.stringify(error)}`);
			}

			return null;
		}

		logoutUser();
	}, [dispatch, logout, navigate]);

	return (
		<div className="flex content-center h-svh">
			<FormContainer>Logging out...</FormContainer>
		</div>
	);
}
