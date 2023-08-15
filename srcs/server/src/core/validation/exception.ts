export class ValidationException
	extends Error
{
	private _data: Record<string, string[]>;

	constructor(data: Record<string, string[]>)
	{
		super();
		this._data = data;
	}

	public get data()
	{
		return this._data;
	}
};
