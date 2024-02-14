
type MImageProps = {
	src: string;
	alt: string;
	id?: string;
	className?: string;
	onClick?: () => void;
};

export default function MImage({ src, alt, className, id, onClick }: MImageProps) {
	if ( ! src.startsWith('/') && ! src.startsWith('http') ) {
		src = `${location.origin}/api/pictures/${src}`;
	}

	return (
		<img src={src} alt={alt} className={className} id={id} onClick={onClick}/>
	);
}
