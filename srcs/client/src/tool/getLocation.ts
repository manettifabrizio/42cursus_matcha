import { Position } from '@/feature/user/types';

// TODO: Check position accuracy

export async function getGeolocation(): Promise<Position | undefined> {
	const getPosition = (): Promise<GeolocationPosition> => {
		return new Promise((res, rej) => {
			navigator.geolocation.getCurrentPosition(res, rej);
		});
	};

	try {
		const position = await getPosition();

		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;

		return { latitude, longitude };
	} catch (e) {
		console.log(
			'Failed to get position using navigator.geolocation, fetching using ip...',
		);

		// TODO: Fix CORS error if to many requests
		const response = await fetch('https://geolocation-db.com/json/');
		const data = await response
			.json()
			.catch((e) =>
				console.error(`Error while getting position through IP: ${e}`),
			);

		return { latitude: data.latitude, longitude: data.longitude };
	}
}
