export class Exception<T>
	extends Error
{
	private _data: T;

	constructor(data: T)
	{
		super();
		this._data = data;
	}

	public get data()
	{
		return this._data;
	}
};
