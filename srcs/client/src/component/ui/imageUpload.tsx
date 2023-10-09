import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AiFillCloseSquare } from 'react-icons/ai';
import { Profile } from '@/page/user/complete-profile';

type FileObject = {
	name: string;
};

type ImageSelectorProps = {
	id: string;
	errors?: string[];
	setProfile: React.Dispatch<React.SetStateAction<Profile>>;
};

export default function ImageSelector({
	id,
	errors,
	setProfile,
}: ImageSelectorProps) {
	const MAX_COUNT = 6;

	const [uploadedFiles, setUploadedFiles] = useState<FileObject[]>([]);
	const [fileLimit, setFileLimit] = useState(false);

	const handleUploadFiles = (files: File[]) => {
		const uploaded = [...uploadedFiles];
		let limitExceeded = false;
		files.some((file) => {
			if (uploaded.findIndex((f) => f.name === file.name) === -1) {
				uploaded.push({ name: URL.createObjectURL(file) });
				if (uploaded.length === MAX_COUNT) setFileLimit(true);
				if (uploaded.length > MAX_COUNT) {
					toast.error('You can upload a maximum of 5 photos.');
					setFileLimit(false);
					limitExceeded = true;
					return true;
				}
			}
		});
		if (!limitExceeded) setUploadedFiles(uploaded);
	};

	const handleFileEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
		const chosenFiles: File[] = Array.prototype.slice.call(e.target.files);
		handleUploadFiles(chosenFiles);
	};

	const rmFile = (file: FileObject) => {
		setUploadedFiles((current) =>
			current.filter((f) => f.name !== file.name),
		);
	};

	useEffect(() => {
		setProfile((current) => ({
			...current,
			pictures: uploadedFiles.map((f) => f.name),
		}));
	}, [uploadedFiles]);

	return (
		<div className="flex flex-col mb-2 w-full">
			<h6>Please upload at least 2 images to start:</h6>
			<div className="grid w-full grid-cols-3 gap-3">
				{uploadedFiles.map((file) => (
					<div className="relative">
						<button
							onClick={() => rmFile(file)}
							className="absolute -right-2 top-0 rounded-full text-red-500"
						>
							<AiFillCloseSquare />
						</button>
						<img
							src={file.name}
							id={file.name}
							key={file.name}
							className="border-2 rounded my-2 object-scale-down"
						/>
					</div>
				))}
			</div>
			<>
				<label
					htmlFor="files"
					className="group relative w-full text-white py-2 rounded-full border text-center"
				>
					Select Images
				</label>
				<input
					id="files"
					className="hidden"
					type="file"
					onChange={handleFileEvent}
					accept="image/png, image/gif, image/jpeg"
					multiple={true}
				/>
			</>
			{errors && (
				<ul className="pt-1">
					{errors.map((error) => (
						<li key={error} className="text-xs text-red-500">
							{error}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
