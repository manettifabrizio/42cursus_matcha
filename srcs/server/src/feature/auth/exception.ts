import { Exception } from '@/core/exception';

// Type ------------------------------------------------------------------------
type Data =
{
	cause: string;
};

// Class -----------------------------------------------------------------------
export class AuthException
	extends Exception<Data>
{
	constructor(data: Data)
	{
		super(data);
	}
};
