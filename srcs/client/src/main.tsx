import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/core/router';
import { store } from '@/core/store';
import '@/style/global.scss';
import 'react-datepicker/dist/react-datepicker.css';

// Application -----------------------------------------------------------------
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<div className="w-screen h-screen">
				<RouterProvider router={router} />
			</div>
		</Provider>
	</React.StrictMode>,
);
