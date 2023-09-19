import { Exception } from '@/core/exception';

// Type ------------------------------------------------------------------------
export type Cause =
	'NotFound'
;

type Data =
{
	cause: Cause;
	details?: string|string[];
};

// Class -----------------------------------------------------------------------
export class NotFoundException
	extends Exception<Data>
{
	constructor(data: Data)
	{
		super(data);
	}
};
