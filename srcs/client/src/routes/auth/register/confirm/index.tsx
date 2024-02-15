import LoadingSpinner from '@/component/ui/loadingSpinner';
import { useConfirmMutation } from '@/feature/auth/api.slice';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate } from 'react-router-dom';

export function Component() {
	const [confirm] = useConfirmMutation();
	const [confirmed, setConfirmed] = useState<boolean | null>(null);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const fields = {
			id: urlParams.get('id') as string,
			secret: urlParams.get('secret') as string,
		};

		const confirmEmail = async (fields: { id: string; secret: string }) => {
			try {
				await confirm(fields).unwrap();
				setConfirmed(true);
				toast.success('Email confirmed successfully!');
			} catch (err: unknown) {
				setConfirmed(false);
				toast.error('Failed to confirm email: ' + JSON.stringify(err));
			}
		};

		confirmEmail(fields);
	}, [confirm]);

	if (confirmed === null) {
		return (
			<div className="w-full h-full flex flex-col justify-center items-center">
				<LoadingSpinner message="Confirming..." />
			</div>
		);
	}

	if (confirmed === false) {
		return (
			<div className="flex items-center justify-center flex-col w-full h-full">
				<h2 className="text-red-500">Failed to confirm email.</h2>
				<Link to="/auth/register" className="font-bold underline">
					Resend
				</Link>
			</div>
		);
	}

	return <Navigate to="/auth/login" />;
}
