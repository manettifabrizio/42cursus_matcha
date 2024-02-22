import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/core/router';
import { store } from '@/core/store';
import '@/style/global.scss';

// Application -----------------------------------------------------------------
ReactDOM.createRoot(document.getElementById('root')!).render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>,
);
