import { Exception } from '../exception';


type Data =
{
	[field: string]: string[];
};

export class ValidationException
	extends Exception<Data>
{
	constructor(data: Data)
	{
		super(data);
	}
};
