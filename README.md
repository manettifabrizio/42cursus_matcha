# 42 - Web - Matcha

Description ...

## Todo

- ...

## Requirements

- [Docker](https://docs.docker.com/desktop/)
- [Docker Compose](https://docs.docker.com/compose/)

## Get Started

1. Setup environment

	```sh
	cd dockers
	cp .env.template .env
	vim .env
	cd -
	```

2. Generate _self-signed_ certificates

	```sh
	cd dockers/nginx/ssl
	openssl req -newkey rsa:2048 -nodes -keyout matcha.key -x509 -days 365 -out matcha.crt
	cd -
	```

3. Start containers

	```sh
	docker compose -f dockers/docker-compose.yml up
	```

4. Access website: [https://localhost](https://localhost)

## Notes

- Open terminal in client/server container

	```sh
	docker compose -f dockers/docker-compose.yml exec -it client sh
	```

## Troubleshooting

- Port 80 / 443 are not available

	1. Update `dockers/docker-compose.yml`

		```docker
		nginx:
		  ports:
		    - "8080:80"
		    - "4443:443"
		```

	2. Update `dockers/nginx/config/default.conf`

		```nginx
		server
		{
			listen      80;
			listen [::]:80;

			return 301 https://$host:4443$request_uri;
		}
		```

	3. Update `srcs/client/vite.config.ts`

		```ts
		server: {
			hmr: {
				path: "/hmr",
				port: 443,
				clientPort: 4443,
			},
		}
		```

## Authors

- [BOISNIER Thomas](https://github.com/KuroBayashi)
- [MANETTI Fabrizio](https://github.com/manettifabrizio)
