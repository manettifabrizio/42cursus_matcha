import { Link } from 'react-router-dom';
import Logo from '/matcha.svg';

type MatchaLogoProps = {
	to?: string;
};

export default function MatchaLogo({ to = '/' }: MatchaLogoProps) {
	return (
		<Link to={to} className="flex justify-center">
			<img src={Logo} alt="MatchaLogo" className="w-1/5" />
		</Link>
	);
}
