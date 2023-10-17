import { useState } from 'react';
import { toast } from 'react-toastify';
import { AiFillCloseSquare } from 'react-icons/ai';
import { PicturesFormProps } from '@/feature/user/forms/picturesForm';

export default function ImageSelector({
	errors,
	setProfile,
	pictures,
}: PicturesFormProps) {
	const MAX_COUNT = 5;

	const [inputValue, setInputValue] = useState<
		string | number | readonly string[] | undefined
	>('');

	const checkFile = (file: File): boolean => {
		if (file.size > 2000000) {
			toast.error('File size must be under 2MB.');
			return false;
		}
		if (file.name.length > 100) {
			toast.error('Field name size must be under 100 bytes.');
			return false;
		}

		return true;
	};

	const handleUploadFiles = (files: File[]) => {
		if (files.length + pictures.length > MAX_COUNT) {
			toast.error('You can upload a maximum of 5 photos.');
			return;
		}
		files.forEach((file) => {
			if (checkFile(file)) {
				const fileName = file.name.replace(/\-/g, '');
				if (pictures.findIndex((p) => p.name === fileName) === -1) {
					setProfile((c) => ({
						...c,
						pictures: [
							...c.pictures,
							new File([file], fileName, {
								type: file.type,
							}),
						],
					}));
				}
			}
		});
	};

	const resetInputOnClick = (
		e: React.MouseEvent<HTMLInputElement, MouseEvent>,
	) => ((e.target as HTMLInputElement).value = '');

	const handleFileEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		const chosenFiles: File[] = Array.prototype.slice.call(e.target.files);
		handleUploadFiles(chosenFiles);
	};

	const rmFile = (name: string) => {
		if (pictures.length === 1) setInputValue('');
		setProfile((c) => ({
			...c,
			pictures: c.pictures.filter((p) => p.name !== name),
		}));
	};

	return (
		<>
			<div className="flex flex-col mb-2 w-full">
				<div className="grid w-full grid-cols-3 gap-3">
					{pictures.map((p) => (
						<div className="relative" key={p.name}>
							<button
								onClick={() => rmFile(p.name)}
								className="absolute right-1 top-3 text-red-500"
							>
								<AiFillCloseSquare />
							</button>
							<img
								src={URL.createObjectURL(p)}
								id={p.name}
								className={
									'border-2 rounded my-2 object-scale-down'
								}
							/>
						</div>
					))}
				</div>

				<>
					{pictures.length < 5 && (
						<label
							htmlFor="files"
							className={`group relative w-full text-white py-2 rounded-full border text-center cursor-pointer hover:text-gray-300`}
						>
							Select Images
						</label>
					)}
					<input
						disabled={pictures.length === 5}
						id="files"
						required
						className="opacity-0 h-1"
						type="file"
						onChange={handleFileEvent}
						onClick={resetInputOnClick}
						accept="image/png, image/gif, image/jpeg"
						multiple={true}
						value={inputValue}
					/>
				</>
				{errors && errors.length > 0 && (
					<ul className="pt-1">
						{errors.map((error, i) => (
							<li
								key={`${error}-${i}`}
								className="text-xs text-red-500"
							>
								{error}
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	);
}
