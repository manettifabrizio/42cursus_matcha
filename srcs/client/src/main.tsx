import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/core/router';
import { store } from '@/core/store';
import { ToastContainer } from 'react-toastify';
import '@/asset/style/global.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

const contextProprieties = {
	success: { className: 'bg-green-600', icon: '✅' },
	error: { className: 'bg-red-600', icon: '⛔️' },
	info: { className: 'bg-gray-600', icon: 'ℹ️' },
	warning: { className: 'bg-orange-400', icon: '❕' },
	default: {
		className:
			'bg-gradient-to-r to-red-600 from-amber-400 text-white text-xl font-bold',
		icon: '🔥',
	}
};

// Application -----------------------------------------------------------------
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<div className="w-screen h-screen">
				<RouterProvider router={router} />
				<ToastContainer
					toastClassName={(data) =>
						contextProprieties[data?.type || 'default'].className +
						' relative text-lg flex p-2 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer mb-1'
					}
					theme="colored"
                    icon={(data) => contextProprieties[data.type || 'default'].icon}
				/>
			</div>
		</Provider>
	</React.StrictMode>,
);
