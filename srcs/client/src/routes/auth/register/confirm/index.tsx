import LoadingSpinner from '@/component/ui/loadingSpinner';
import { useConfirmMutation } from '@/feature/auth/api.slice';
import { isLinkInvalidError } from '@/tool/isRTKQError';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export function Component() {
	const [confirm] = useConfirmMutation();
	const [confirmed, setConfirmed] = useState<boolean>(false);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const fields = {
			id: urlParams.get('id') as string,
			secret: urlParams.get('secret') as string,
		};

		const confirmEmail = async (fields: { id: string; secret: string }) => {
			try {
				await confirm(fields).unwrap();
				toast.success('Email confirmed successfully!');
			} catch (err: unknown) {
				if (!isLinkInvalidError(err))
					toast.error(
						'Failed confirming the mail: Invalid credentials.',
					);
			}
			setConfirmed(true);
		};

		confirmEmail(fields);
	}, [confirm]);

	if (confirmed === false) {
		return (
			<div className="w-full h-full flex flex-col justify-center items-center">
				<LoadingSpinner message="Confirming..." />
			</div>
		);
	}

	return <Navigate to="/auth/login" />;
}
