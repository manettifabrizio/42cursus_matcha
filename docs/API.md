# Matcha

-   Except `'GET'|'HEAD'|'OPTIONS'` Requests, `csrf-token` Header is Required

-   Error Response format:
    ```ts
    {
    	status:
    	{
    		code: number;
    		text: string;
    	};
    	error:
    	{
    		cause: string;
    		details?:
    		{
    			[field: string]: string[];
    		};
    	};
    }
    ```

## Security

-   GET `/security/csrf`
    ```ts
    Request:
    	void
    Response:
    	void
    Exception:
    	void
    Note:
    	Send CSRF Token as Cookie
    ```

## Auth

-   POST `/auth/register`

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
    	email: string;
    }
    Note:
    	Send an Email with a Link to Confirm the Registration
    ```

-   POST `/auth/confirm?id={account_id}&secret={account_secret}`

    ```ts
    Request:
    	void
    Response:
    	void
    ```

-   POST `/auth/login`

    ```ts
    Request:
    {
    	username: string;
    	password: string;
    }
    Response:
    {
    	id: number;
    	username: string;
    	firstname: string;
    	lastname: string;
    	birthdate: Date | null;
    	gender: 'MALE'|'FEMALE';
    	orientation: 'HOMOSEXUAL'|'HETEROSEXUAL'|'BISEXUAL';
    	biography: string;
    	picture: { id: number; path: string; } | null;
    	location: { latitude: number; longitude: number; } | null;
    	pictures: { id: number; path: string; }[];
    	tags: { id: number; name: string; }[];
    }
    Note:
    	Send Access and Refresh JWT as Cookies
    ```

-   POST `/auth/refresh`

    ```ts
    Request:
    	void
    Response:
    	void
    Note:
    	Update Access JWT Cookie
    ```

-   POST `/auth/logout`

    ```ts
    Request:
    	void
    Response:
    	void
    Note:
    	Delete Access and Refresh JWT Cookies
    ```

-   POST `/auth/reset-password`

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

-   POST `/auth/update-password?id={account_id}&secret={account_secret}`

    ```ts
    Request:
    {
    	password: string;
    	password_confirm: string;
    }
    Response:
    	void
    ```

-   PATCH `/auth/edit`
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

-   GET `/user/:user_id?`

    ```ts
    Request:
    	void
    Response:
    {
    	id: number;
    	username: string;
    	firstname: string;
    	lastname: string;
    	birthdate: Date;
    	gender: 'MALE'|'FEMALE';
    	orientation: 'HETEROSEXUAL'|'HOMOSEXUAL'|'BISEXUAL';
    	biography: string;
    	picture: { id: number; path: string; };
    	location: { latitude: number; longitude: number; } | { distance: number; };
    }
    ```

-   GET `/user/:user_id?/profile`

    ```ts
    Request:
    	void
    Response:
    {
    	id: number;
    	username: string;
    	firstname: string;
    	lastname: string;
    	birthdate: Date;
    	gender: 'MALE'|'FEMALE';
    	orientation: 'HETEROSEXUAL'|'HOMOSEXUAL'|'BISEXUAL';
    	biography: string;
    	picture: { id: number; path: string; };
    	location: { latitude: number; longitude: number; } | { distance: number; };
    	pictures: { id: number; path: string; }[];
    	tags: { id: number; name: string; }[];
    	likes?: { by_me: boolean; to_me: boolean; };
    	blocks?: { by_me: boolean; };
    	reports?: { by_me: boolean; };
    }
    ```

-   PATCH `/user/edit`
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
    	location?: { latitude: number; longitude: number; };
    }
    Response:
    {
    	picture?: { id: number; path: string; };
    	firstname?: string;
    	lastname?: string;
    	birthdate?: Date;
    	gender?: 'MALE'|'FEMALE';
    	orientation?: 'HETEROSEXUAL'|'HOMOSEXUAL'|'BISEXUAL';
    	biography?: string;
    	location?: { latitude: number; longitude: number; };
    }
    ```

### Activities

-   GET `/user/activities`
    ```ts
    Request:
    	void
    Response:
    {
    	by_me: { id_user_to: number; action: 'WATCHED_PROFILE'; created_at: Date; }[];
    	to_me: { id_user_from: number; action: 'WATCHED_PROFILE'; created_at: Date; }[];
    }
    ```

### Pictures

-   GET `/user/:user_id?/pictures`

    ```ts
    Request:
    	void
    Response:
    {
    	pictures: { id: number; path: string; }[];
    }
    ```

-   POST `/user/pictures`

```ts
Request: FormData,
Response: {
  id: number;
  path: string;
}
```

-   DELETE `/user/pictures/:picture_id`
    ```ts
    Request:
    	void
    Response:
    	void
    ```

### Tags

-   GET `/user/:user_id?/tags`

    ```ts
    Request:
    	void
    Response:
    {
    	tags: { id: number; name: string; }[];
    }
    ```

-   POST `/user/tags`

    ```ts
    Request: {
    	name: string;
    }
    Response: {
    	id: number;
    	name: string;
    }
    ```

-   DELETE `/user/tags/:tag_id`
    ```ts
    Request:
    	void
    Response:
    	void
    ```

### Like

-   GET `/user/likes`

    ```ts
    Request:
    	void
    Response:
    {
    	by_me: { id_user_to: number; created_at: Date; }[];
    	to_me: { id_user_from: number; created_at: Date; }[];
    }
    ```

-   POST `/user/:user_id/like`

    ```ts
    Request:
    	void
    Response:
    	void
    Note:
    	Deny if Blocked or Reported
    ```

-   DELETE `/user/:user_id/like`
    ```ts
    Request:
    	void
    Response:
    	void
    ```

### Block

-   GET `/user/blocks`

    ```ts
    Request:
    	void
    Response:
    {
    	blocks: { id_user_to: number; created_at: Date; }[];
    }
    ```

-   POST `/user/:user_id/block`

    ```ts
    Request:
    	void
    Response:
    	void
    Note:
    	Delete Like if exists
    ```

-   DELETE `/user/:user_id/block`
    ```ts
    Request:
    	void
    Response:
    	void
    ```

### Report

-   GET `/user/reports`

    ```ts
    Request:
    	void
    Response:
    {
    	reports: { id_user_to: number; created_at: Date; }[];
    }
    ```

-   POST `/user/:user_id/report`

    ```ts
    Request:
    	void
    Response:
    	void
    Note:
        Create Block too
    	Delete Like if exists
    ```

-   DELETE `/user/:user_id/report`
    ```ts
    Request:
    	void
    Response:
    	void
    ```

## Search

-   GET `/search?{...filter}`

    ```ts
    Filters:
        page: number;
        age_min: number;
        age_max: number;
        distance_min: number;
        distance_max: number;
        tags_min: number;
        tags_max: number;
        fame_min: number;
        fame_max: number;
        gender: Gender(','Gender)*;
        orientation: Orientation(','Orientation)*;
        sort: ('age'|'distance'|'tags'|'fame')','('asc'|'desc');
    Request:
      void
    Response:
    {
        // Note: See User Profile for more details
    	users: { ...profile }[];
    }
    Note:
      - Every filter is optional
      - If `gender` and `orientation` are not defined, will search using recommendation algorithm.
      - `sort` can be defined multiple times
    ```
