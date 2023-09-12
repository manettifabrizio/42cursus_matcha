import { useEffect }        from 'react';
import { useState }         from 'react';
import { useCsrfMutation }  from '@/feature/security/api.slice';
import { setCsrfToken }     from '@/feature/security/store.slice';
import { useStoreDispatch } from '@/hook/useStore';
import { cookie }           from '@/tool/cookie';
import style                from './style.module.scss';

// Type ------------------------------------------------------------------------
type Props =
{
	setBooting: (b: boolean) => void;
};

type BootStep = 'START' | 'CSRF' | 'LOGIN' | 'DONE';

// Component -------------------------------------------------------------------
export default function BootLoader({ setBooting }: Props)
{
	const [ step, setStep ] = useState<BootStep>('START');
	const [ fetchCsrfToken ] = useCsrfMutation();
	const dispatch = useStoreDispatch();

	useEffect(() =>
	{
		// Todo: Remove setTimeout ?
		switch (step)
		{
			case 'START':
				setTimeout(() => setStep('CSRF'), 500);
				break;
			case 'CSRF':
				(async () =>
				{
					try
					{
						await fetchCsrfToken().unwrap();
						dispatch(setCsrfToken(cookie('csrf-token')));
					}
					catch (err: unknown)
					{
						// Todo: Handle error
						console.log(`Component::Layout::Root`, err)
					}
					finally
					{
						setTimeout(() => setStep('LOGIN'), 500);
					}
				})();
				break;
			case 'LOGIN':
				// Todo: Handle relog if already authenticated from previous visit
				setTimeout(() => setStep('DONE'), 500);
				break;
			default:
				setBooting(false);
				break;
		}
	}, [ dispatch, fetchCsrfToken, step, setBooting ]);

	const bootStepMessage: Readonly<Record<BootStep, string>> =
	{
		'START': `Starting application`,
		'CSRF':  `Fetching CSRF Token`,
		'LOGIN': `Authenticating`,
		'DONE':  ``,
	};

	return (
		<div className={ style['loading-screen'] }>
			<div className={ style['loader'] }></div>
			<h1>M a t c h a</h1>
			<p>{ bootStepMessage[step] }</p>
		</div>
	);
}
