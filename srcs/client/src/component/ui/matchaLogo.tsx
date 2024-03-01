import { Link } from 'react-router-dom';
import Logo from '/matcha.svg';

type MatchaLogoProps = {
	to?: string;
};

export default function MatchaLogo({ to = '/' }: MatchaLogoProps) {
	return (
		<Link to={to} className="flex justify-center py-1">
			<img src={Logo} alt="MatchaLogo" className="w-1/3 sm:w-1/6" />
		</Link>
	);
}
