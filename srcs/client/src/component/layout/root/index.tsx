import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BootLoader from '@/component/boot-loader';
import { Toaster } from 'react-hot-toast';
import { toastOptions } from '@/component/ui/customToasts';

// Component -------------------------------------------------------------------
export default function RootLayout() {
	const [isBooting, setBooting] = useState(true);

	return isBooting ? (
		<BootLoader setBooting={setBooting} />
	) : (
		<>
			<Outlet />
            <Toaster toastOptions={toastOptions}/>
		</>
	);
}
