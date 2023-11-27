import SideBar from '@/component/home/sidebar/sideBar';
import { Outlet } from 'react-router-dom';

export default function Home() {
	return (
		<>
			<SideBar />
			<div className="ml-72 h-full">
				<Outlet />
			</div>
		</>
	);
}
