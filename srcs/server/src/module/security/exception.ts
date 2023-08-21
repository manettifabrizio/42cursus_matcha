import { Exception } from '@/core/exception';


export type Cause =
	'InvalidCsrfToken'
;

type Data =
{
	cause: Cause;
	details?: string|string[];
};

export class SecurityException
	extends Exception<Data>
{
	constructor(data: Data)
	{
		super(data);
	}
};
