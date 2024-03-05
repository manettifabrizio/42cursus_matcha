import { useEffect } from 'react';
import { useState } from 'react';
import { useRefreshMutation } from '@/feature/auth/api.slice';
import { useGetCsrfTokenMutation } from '@/feature/security/api.slice';
import { useStoreDispatch } from '@/hook/useStore';
import { cookie } from '@/tool/cookie';
import style from './style.module.scss';
import MatchaLogo from '/matcha.svg';
import { setCurrentUser } from '@/tool/userTools';
import { startConnecting } from '@/feature/interactions/store.slice';
import toast from 'react-hot-toast';

// Type ------------------------------------------------------------------------
interface Props {
	setBooting: (b: boolean) => void;
}

type BootStep = 'START' | 'CSRF' | 'RELOG' | 'DONE';

// Component -------------------------------------------------------------------
export default function BootLoader({ setBooting }: Props) {
	const dispatch = useStoreDispatch();
	const [step, setStep] = useState<BootStep>('START');
	const [getCsrfToken] = useGetCsrfTokenMutation();
	const [relog] = useRefreshMutation();

	useEffect(() => {
		switch (step) {
			case 'START':
				setStep('CSRF');
				break;
			case 'CSRF':
				(async () => {
					const MAX_RETRY = 5;
					let retry = 0;

					while (retry < MAX_RETRY) {
						try {
							await getCsrfToken().unwrap();
							break;
						} catch (err: unknown) {
							retry += 1;
						}
					}

					if (retry == MAX_RETRY) {
						// console.log(`Component::BootLoader::CSRF: Failed.`);
						toast.error(
							"We can't connect to the server. Please try again later.",
						);
						location.reload();
					} else {
						setStep('RELOG');
					}
				})();
				break;
			case 'RELOG':
				(async () => {
					try {
						if (
							localStorage.getItem('was_autenticated') === 'true'
						) {
							await relog({}).unwrap();
							dispatch({
								type: 'auth/setAuthAccessToken',
								payload: cookie('access-token'),
							});
							await setCurrentUser();
							dispatch(startConnecting());
						}
					} catch (err: unknown) {
						// console.log(`Component::BootLoader::RELOG: Failed.`);
					} finally {
						setStep('DONE');
					}
				})();
				break;
			default:
				setBooting(false);
				break;
		}
	}, [setBooting, step, dispatch, getCsrfToken, relog]);

	const bootStepMessage: Readonly<Record<BootStep, string>> = {
		START: `Starting application`,
		CSRF: `Fetching CSRF Token`,
		RELOG: `Authenticating`,
		DONE: ``,
	};

	return (
		<div className={style['loading-screen']}>
			<div className="flex w-full h-40 justify-center items-center">
				<img
					src={MatchaLogo}
					alt="MatchaLogo"
					className={style['loader']}
				/>
			</div>
			<p className="text-sm sm:text-lg">{bootStepMessage[step]}</p>
		</div>
	);
}
