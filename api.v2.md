# Matcha

## Security

- GET `/security/csrf`
	```ts
	Request:
		void
	Response:
		void
	Note:
		Send CSRF Token as Cookie
	```

## Auth

- POST `/auth/register`
	```ts
	Request:
	{
		username: string;
		password: string;
		password_confirm: string;
		email: string;
		firstname: string;
		lastname: string;
	}
	Response:
	{
		id: number;
	}
	Note:
		Send an Email with a Link to Confirm the Registration
	```

- POST `/auth/confirm`
	```ts
	Request:
	{
		id: number;
		secret: string;
	}
	Response:
		void
	```

- POST `/auth/login`
	```ts
	Request:
	{
		username: string;
		password: string;
	}
	Response:
	{
		id: number;
	}
	Note:
		Send Access and Refresh JWT as Cookies
	```

- POST `/auth/refresh`
	```ts
	Request:
		void
	Response:
		void
	Note:
		Update Access JWT Cookie
	```

- POST `/auth/logout`
	```ts
	Request:
		void
	Response:
		void
	Note:
		Delete Access and Refresh JWT Cookies
	```

- POST `/auth/reset-password`
	```ts
	Request:
	{
		username: string;
		email: string;
	}
	Response:
		void
	Note:
		Send an Email with a Link to Update Password
	```

- POST `/auth/update-password`
	```ts
	Request:
	{
		id: number;
		secret: string;
		password: string;
		password_confirm: string;
	}
	Response:
		void
	```

- PATCH `/auth/edit`
	```ts
	Request:
	{
		email?: string;
		password?: string;
		password_confirm?: string;
	}
	Response:
	{
		email?: string;
	}
	Note:
		Send an Email with a Link to Confirm Edit, only if Email has been Edited
	```

## User

- GET `/user/me`
	```ts
	Request:
		void
	Response:
	{
		id: number;
		id_picture: number|null;
		username: string;
		firstname: string;
		lastname: string;
		birthdate: Date|null;
		gender: 'MALE'|'FEMALE';
		orientation: 'HETEROSEXUAL'|'HOMOSEXUAL'|'BISEXUAL';
		biography: string;
		location: {
			latitude: number|null;
			longitude: number|null;
		};
	}
	```

- GET `/user/:id`
	```ts
	Request:
		void
	Response:
	{
		id: number;
		id_picture: number;
		username: string;
		firstname: string;
		lastname: string;
		birthdate: Date;
		gender: 'MALE'|'FEMALE';
		orientation: 'HETEROSEXUAL'|'HOMOSEXUAL'|'BISEXUAL';
		biography: string;
		location: {
			distance: number;
		};
	}
	```

- PATCH `/user/edit`
	```ts
	Request:
	{
		id_picture?: number;
		firstname?: string;
		lastname?: string;
		birthdate?: Date;
		gender?: 'MALE'|'FEMALE';
		orientation?: 'HETEROSEXUAL'|'HOMOSEXUAL'|'BISEXUAL';
		biography?: string;
		location?: {
			latitude: number;
			longitude: number;
		};
	}
	Response:
	{
		id_picture?: number;
		firstname?: string;
		lastname?: string;
		birthdate?: Date;
		gender?: 'MALE'|'FEMALE';
		orientation?: 'HETEROSEXUAL'|'HOMOSEXUAL'|'BISEXUAL';
		biography?: string;
		location?: {
			latitude: number;
			longitude: number;
		};
	}
	```

### Pictures

- GET `/user/:id?/pictures`
	```ts
	Request:
		void
	Response:
	{
		pictures: { id: number; id_user: number; path: string; }[];
	}
	```

- POST `/user/picture`
	```ts
	Request:
	{
		picture: File;
	}
	Response:
	{
		id: number;
		id_user: number;
		path: string;
	}
	```

- DELETE `/user/picture/:id`
	```ts
	Request:
		void
	Response:
		void
	```

### Tags

- GET `/user/:id?/tags`
	```ts
	Request:
		void
	Response:
	{
		tags: { id: number; name: string; }[];
	}
	```

- POST `/user/tag`
	```ts
	Request:
	{
		name: string;
	}
	Response:
	{
		id: number;
		name: string;
	}
	```

- DELETE `/user/tag/:id`
	```ts
	Request:
		void
	Response:
		void
	```

### Like

- GET `/user/likes`
	```ts
	Request:
		void
	Response:
	{
		likes_to: number[];
		likes_from: number[];
	}
	```

- POST `/user/:id/like`
	```ts
	Request:
		void
	Response:
		void
	```

- DELETE `/user/:id/like`
	```ts
	Request:
		void
	Response:
		void
	```

### Block

- GET `/user/blocks`
	```ts
	Request:
		void
	Response:
	{
		blocks: number[];
	}
	```

- POST `/user/:id/block`
	```ts
	Request:
		void
	Response:
		void
	Note:
		Delete Like if exists
	```

- DELETE `/user/:id/block`
	```ts
	Request:
		void
	Response:
		void
	```

### Report

- GET `/user/reports`
	```ts
	Request:
		void
	Response:
	{
		reports: number[];
	}
	```

- POST `/user/:id/report`
	```ts
	Request:
		void
	Response:
		void
	Note:
		Delete Like if exists
	```

- DELETE `/user/:id/report`
	```ts
	Request:
		void
	Response:
		void
	```
