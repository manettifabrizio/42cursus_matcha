import { store } from '@/core/store';
import { setUrl, toggleNotifications, toggleSidebar } from './store.slice';
import { URLType } from '../types';

const toggleSidebarNotifications = (
	sidebar: boolean,
	notifications: boolean,
) => {
	store.dispatch(toggleSidebar(sidebar));
	store.dispatch(toggleNotifications(notifications));
};

const goTo = (url: URLType, sidebar: boolean, notifications?: boolean) => {
	const interactions = store.getState().interactions;

	if (interactions.url !== url) store.dispatch(setUrl(url));
	toggleSidebarNotifications(sidebar, notifications ?? false);
};

export const goToHome = () => goTo('home', false);
export const goToProfileSettings = () => goTo('user', true);
export const goToProfile = () => goTo('user', false);
export const goToMatches = () => goTo('home', true);
export const goToChat = () => goTo('chat', false);
