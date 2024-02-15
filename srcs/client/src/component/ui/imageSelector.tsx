import toast from 'react-hot-toast';
import { AiFillCloseSquare } from 'react-icons/ai';

import { useEffect, useState } from 'react';
import { FileWithId } from '@/feature/user/types';
import {
	deletePicture,
	uploadPicture,
	uploadProfilePicture,
} from '@/feature/user/imagesUpload';
import { PicturesInputProps } from '../user/complete-profile/inputs/picturesInput';
import LoadingSpinner from './loadingSpinner';
import MImage from './mImage';

export default function ImageSelector({
	errors,
	setErrors,
	base_pictures,
	profile_picture,
	loading,
}: PicturesInputProps) {
	const [profilePicture, setProfilePicture] = useState<FileWithId>();
	const [submitting, setSubmitting] = useState(false);
	const [pictures, setPictures] = useState<FileWithId[]>(base_pictures ?? []);

	const MAX_COUNT = 5;

	useEffect(() => {
		setProfilePicture(profile_picture);
	}, [profile_picture]);

	useEffect(() => {
		if (base_pictures) setPictures(base_pictures);
	}, [base_pictures]);

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

	const handleUploadFiles = async (files: File[]) => {
		if (files.length + pictures.length > MAX_COUNT) {
			toast.error('You can upload a maximum of 5 photos.');
			return;
		}

		const toast_id = toast.loading('Uploading pictures...');

		let pictures_uploaded = 0;

		for (const file of files) {
			if (checkFile(file)) {
				const fileName = file.name.replace(/-/g, '');
				if (
					pictures.findIndex((p) => p.file.name === fileName) === -1
				) {
					const id = await uploadPicture(
						file,
						setErrors,
						setSubmitting,
						toast_id,
					);

					if (id) pictures_uploaded++;
				}
			}
		}

		if (pictures_uploaded > 0) {
			toast.success(
				`${pictures_uploaded} pictures uploaded successfully!`,
				{
					id: toast_id,
				},
			);
		} else toast.dismiss(toast_id);
	};

	const resetInputOnClick = (
		e: React.MouseEvent<HTMLInputElement, MouseEvent>,
	) => ((e.target as HTMLInputElement).value = '');

	const handleFileEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
		const chosenFiles: File[] = Array.prototype.slice.call(e.target.files);
		handleUploadFiles(chosenFiles);
	};

	const handleImageClick = async (picture: FileWithId) => {
		if (picture.file.name === profilePicture?.file.name || submitting)
			return;

		if (await uploadProfilePicture(picture, setErrors, setSubmitting)) {
			setProfilePicture(picture);
		}
	};

	const isProfilePicture = (picture: FileWithId) =>
		picture.file.name === profilePicture?.file.name;

	const rmFile = async (picture: FileWithId) => {
		if (
			picture.id === undefined ||
			(await deletePicture(picture.id, setErrors, setSubmitting))
		) {
			setPictures((c) =>
				c.filter((p) => p.file.name !== picture.file.name),
			);
		}
	};

	return (
		<>
			<div className="flex flex-col mb-2 w-full">
				{loading ? (
					<div className="w-full h-40 mt-2 mb-4 flex flex-col justify-center items-center">
						<LoadingSpinner message="Loading Pictures..." />
					</div>
				) : (
					<div className="grid w-full grid-cols-3 gap-3 mt-2 mb-4 justify-evenly">
						{pictures.map((p) => (
							<div
								className="w-full h-full flex justify-evenly items-center"
								key={p.file.name}
							>
								<div
									className={
										'relative w-full aspect-square ' +
										(submitting && 'opacity-50')
									}
								>
									{isProfilePicture(p) && (
										<div className="absolute bottom-0 rounded-b-lg text-center text-white bg-red-500 w-full italic">
											Profile Picture
										</div>
									)}
									{!isProfilePicture(p) &&
										pictures.length > 2 && (
											<button
												type="button"
												disabled={submitting}
												onClick={async () =>
													await rmFile(p)
												}
												className="absolute right-1 top-1 text-red-500"
											>
												<AiFillCloseSquare />
											</button>
										)}
									<MImage
										src={URL.createObjectURL(p.file)}
										alt="Picture"
										id={p.file.name}
										onClick={async () =>
											await handleImageClick(p)
										}
										className={`border-2 rounded-lg object-cover w-full h-full ${
											isProfilePicture(p)
												? 'border-red-500 '
												: ''
										} ${
											!submitting && !isProfilePicture(p)
												? 'cursor-pointer'
												: ''
										}`}
									/>
								</div>
							</div>
						))}
					</div>
				)}
				<>
					{pictures.length < 5 && (
						<label
							htmlFor="files"
							className={`group relative w-full text-white py-2 rounded-full border text-center ${
								loading
									? 'opacity-50'
									: 'cursor-pointer hover:text-gray-300'
							}`}
						>
							Add Images
						</label>
					)}
					<input
						disabled={
							pictures.length === 5 || submitting || loading
						}
						id="files"
						className="opacity-0 h-1"
						type="file"
						onChange={handleFileEvent}
						onClick={resetInputOnClick}
						accept="image/png, image/gif, image/jpeg"
						multiple={true}
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
