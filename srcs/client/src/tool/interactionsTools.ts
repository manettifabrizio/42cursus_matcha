export function getTimeElapsedString(creationDate: string): string {
	const now: Date = new Date();
	const elapsedMilliseconds: number =
		now.getTime() - new Date(creationDate).getTime();

	// Convert milliseconds to seconds
	const elapsedSeconds: number = Math.floor(elapsedMilliseconds / 1000);

	if (elapsedSeconds < 60) {
		// Display in seconds
		return `${elapsedSeconds} s`;
	} else if (elapsedSeconds < 3600) {
		// Display in minutes
		const elapsedMinutes: number = Math.floor(elapsedSeconds / 60);
		return `${elapsedMinutes} min`;
	} else {
		// Display in hours
		const elapsedHours: number = Math.floor(elapsedSeconds / 3600);
		return `${elapsedHours} h`;
	}
}
