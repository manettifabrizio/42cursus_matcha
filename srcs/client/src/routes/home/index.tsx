import SideBar from '@/component/home/sidebar/sideBar';
import FormContainer from '@/component/layout/form/formContainer';
import MatchaLogo from '@/component/ui/matchaLogo';
import { Outlet } from 'react-router-dom';

type SidebarMainContentProps = {
	form?: boolean;
	logo?: boolean;
};

export default function SidebarMainContent({
	form = true,
	logo = true,
}: SidebarMainContentProps) {
	return (
		<>
			<SideBar />
			<div className="ml-72 h-full">
				{form ? (
					<div className="flex justify-between flex-col items-center w-full h-full">
						{logo && <MatchaLogo to="/home" />}
						<FormContainer size="sm">
							<Outlet />
						</FormContainer>
					</div>
				) : (
					<div className="flex justify-between flex-col w-full h-full">
						{logo && <MatchaLogo to="/home" />}
						<Outlet />
					</div>
				)}
			</div>
		</>
	);
}
