# Matcha - API Schema

## Security
- Get CSRF Token: `GET /security/csrf`
	- Request:
		```ts
		```
	- Response:
		```ts
		```
	- Note: Send CSRF TOken as Cookie

## Auth
- Create Account: `POST /auth/register`
	- Request:
		```ts
		{
			username: string;
			password: string;
			password_confirm: string;
			email: string;
			firstname: string;
			lastname: string;
		}
		```
	- Response:
		```ts
		{
			id: number;
		}
		```
	- Note:
		Send an Email to confirm registration

- Confirm Registration: `POST /auth/confirm`
	- Request:
		```ts
		{
			id: number;
			secret: string;
		}
		```
	- Response:
		```ts
		```

- Login: `POST /auth/login`
	- Request:
		```ts
		{
			username: string;
			password: string;
		}
		```
	- Response:
		```ts
		{
			id: number;
		}
		```
	- Note:
		Send Access and Refresh JWT as Cookies

- Refresh: `POST /auth/refresh`
	- Request:
		```ts
		```
	- Response:
		```ts
		```
	- Note:
		Send new Access JWT as Cookie

- Logout: `POST /auth/logout`
	- Request:
		```ts
		```
	- Response:
		```ts
		```
	- Note:
		Delete Access and Refresh JWT Cookies

- Edit password: `PATCH /auth/edit-password`
	- Request:
		```ts
		{
			password: string;
			password_confirm: string;
		}
		```
	- Response:
		```ts
		```

- Edit email: `PATCH /auth/edit-email`
	- Request:
		```ts
		{
			email: string;
		}
		```
	- Response:
		```ts
		```
	- Note:
		Send an Email to confirm

## User
- Get my profile: `GET /user/me`
	- Request:
		```ts
		```
	- Response:
		```ts
		{
			id: number;
			firstname: string;
			lastname: string;
			birthdate: Date;
			gender: string;
			orientation: string;
			biography: string;
			created_at: Date;
			updated_at: Date;

			famous_rate: number;

			location: {
				latitude: number;
				longitude: number;
			};

			tags: [
				... { id: number; name: string; }
			];
			pictures: [
				... { id: number; name: string; }
			];
		}
		```

- Get target profile: `GET /user/:id`
	- Request:
		```ts
		```
	- Response:
		```ts
		{
			id: number;
			firstname: string;
			lastname: string;
			birthdate: Date;
			gender: string;
			orientation: string;
			biography: string;
			created_at: Date;
			updated_at: Date;

			famous_rate: number;

			location: {
				distance: number;
			}

			like: {
				from_me: boolean;
				to_me: boolean;
			};

			tags: [
				... { id: number; name: string; }
			];
			pictures: [
				... { id: number; name: string; }
			];
		}
		```
	- Note: Add requesting user to requested profile viewer history

- Edit my profile: `PATCH /user/edit-profile`
	- Request:
		```ts
		{
			firstname: string;
			lastname: string;
			birthdate: Date;
			gender: string;
			orientation: string;
			biography: string;
		}
		```
	- Response:
		```ts
		{
			id: number;
			firstname: string;
			lastname: string;
			birthdate: Date;
			gender: string;
			orientation: string;
			biography: string;
			updated_at: Date;
		}
		```

- Update location: `PATCH /user/edit-location`
	- Request:
		```ts
		{
			latitude: number;
			longitude: number;
		}
		```
	- Response:
		```ts
		{
			location: {
				latitude: number;
				longitude: number;
			};
			updated_at: Date;
		}
		```

- Update picture: `PATCH /user/edit-picture`
	- Request:
		```ts
		{
			id_picture: number;
		}
		```
	- Response:
		```ts
		{
			id_picture: number;
			updated_at: Date;
		}
		```

## Report
- Create: `POST /user/:id/report`
	- Request:
		```ts
		```
	- Response:
		```ts
		```

- Delete: `DELETE /user/:id/report`
	- Request:
		```ts
		```
	- Response:
		```ts
		```

## Like
- Like target: `POST /user/:id/like`
	- Request:
		```ts
		```
	- Response:
		```ts
		```

- Unlike target: `DELETE /user/:id/like`
	- Request:
		```ts
		```
	- Response:
		```ts
		```

## Block
- Create: `POST /user/:id/block`
	- Request:
		```ts
		```
	- Response:
		```ts
		```

- Delete: `DELETE /user/:id/block`
	- Request:
		```ts
		```
	- Response:
		```ts
		```

## Tag
- Add tag: `POST /tag`
	- Request:
		```ts
		{
			name: string;
		}
		```
	- Response:
		```ts
		{
			id: number;
			name: string;
		}
		```
	- Note: Create if not exists, then link to user

- Delete tag: `DELETE /tag/:id`
	- Request:
		```ts
		```
	- Response:
		```ts
		```
	- Note: Only remove link to user

## Picture
- Add picture: `POST /picture`
	- Request:
		```ts
		{
			picture: File;
		}
		```
	- Response:
		```ts
		{
			id: number;
			name: string;
		}
		```
	- Note: Maximum 5 / user

- Delete picture: `DELETE /picture/:id`
	- Request:
		```ts
		```
	- Response:
		```ts
		```
	- Note: Allowed only if yours
