import { useEffect } from 'react';
import { useState } from 'react';
import { useRefreshMutation } from '@/feature/auth/api.slice';
import { setAuthAccessToken } from '@/feature/auth/store.slice';
import { useGetCsrfTokenMutation } from '@/feature/security/api.slice';
import { setCsrfToken } from '@/feature/security/store.slice';
import { useStoreDispatch } from '@/hook/useStore';
import { cookie } from '@/tool/cookie';
import style from './style.module.scss';
import MatchaLogo from '/matcha.svg';
import { setCurrentUser } from '@/tool/userTools';
import { startConnecting } from '@/feature/interactions/store.slice';

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
		// Todo: Remove setTimeout ?
		switch (step) {
			case 'START':
				setTimeout(() => setStep('CSRF'), 500);
				break;
			case 'CSRF':
				(async () => {
					try {
						await getCsrfToken().unwrap();
						dispatch(setCsrfToken(cookie('csrf-token')));
					} catch (err: unknown) {
						// Todo: Handle error
						console.log(`Component::BootLoader::CSRF: Failed.`);
					} finally {
						setTimeout(() => setStep('RELOG'), 500);
					}
				})();
				break;
			case 'RELOG':
				(async () => {
					try {
						await relog().unwrap();
						dispatch(setAuthAccessToken(cookie('access-token')));
						await setCurrentUser();
						dispatch(startConnecting());
					} catch (err: unknown) {
						console.log(`Component::BootLoader::RELOG: Failed.`);
					} finally {
						setTimeout(() => setStep('DONE'), 500);
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
			<div className="flex w-full h-40 justify-center">
				<img
					src={MatchaLogo}
					alt="MatchaLogo"
					className={style['loader']}
				/>
			</div>
			<p>{bootStepMessage[step]}</p>
		</div>
	);
}
