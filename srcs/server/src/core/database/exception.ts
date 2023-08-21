import { Exception } from '../exception';


export type Cause =
	  'Query:ConstraintsViolation:Unique'
	| 'Query:ConstraintsViolation:ForeignKey'
	| 'Pool:Initialization'
	| 'Unknown'
;

type Data =
{
	cause: Cause;
	details?: string|string[];
};

export class DatabaseException
	extends Exception<Data>
{
	constructor(data: Data)
	{
		super(data);
	}
};
