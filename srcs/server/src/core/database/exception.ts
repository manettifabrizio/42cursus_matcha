export class DatabaseException
	extends Error
{
	private _cause: Record<string, string|string[]>;

	constructor(cause: Record<string, string|string[]>)
	{
		super();
		this._cause = cause;
	}

	public get cause()
	{
		return this._cause;
	}
};
