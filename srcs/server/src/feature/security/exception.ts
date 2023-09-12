import { Exception } from '@/core/exception';

// Type ------------------------------------------------------------------------
export type Cause =
	'InvalidCsrfToken'
;

type Data =
{
	cause: Cause;
	details?: string|string[];
};

// Class -----------------------------------------------------------------------
export class SecurityException
	extends Exception<Data>
{
	constructor(data: Data)
	{
		super(data);
	}
};
