import { chooseNotificationContent } from '@/feature/interactions/notificationsContent';
import toast, { DefaultToastOptions } from 'react-hot-toast';
import { AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-router-dom';

export const toastOptions: DefaultToastOptions = {};

export function invalidLinkToast(link: string, toast_id?: string) {
	toast.custom(
		(t) => (
			<div
				className={`${
					t.visible ? 'animate-enter' : 'animate-leave'
				} flex flex-row items-center bg-white justify-center rounded-xl p-3 text-black`}
			>
				<div className="pe-3">❌</div>
				<div>
					Link is invalid.{' '}
					<Link
						to={`${location.origin}/${link}`}
						className="underline font-bold"
					>
						Send a new one
					</Link>
				</div>
			</div>
		),
		{ id: toast_id },
	);
}

export function viewToast(firstname: string, id_user: number) {
	toast.custom((t) => (
		<div
			className={`${
				t.visible ? 'animate-enter' : 'animate-leave'
			} flex flex-row items-center justify-center bg-gray-700 text-white rounded-xl p-3`}
		>
			{chooseNotificationContent('view', firstname, id_user)}
			<button className="ps-3" onClick={() => toast.dismiss()}>
				<AiOutlineClose />
			</button>
		</div>
	));
}

export function likeToast(firstname: string, id_user: number) {
	toast.custom((t) => (
		<div
			className={`${
				t.visible ? 'animate-enter' : 'animate-leave'
			} flex flex-row items-center justify-center bg-gray-700 text-white rounded-xl p-3`}
		>
			{chooseNotificationContent('like', firstname, id_user)}
			<button className="ps-3" onClick={() => toast.dismiss()}>
				<AiOutlineClose />
			</button>
		</div>
	));
}

export function unlikeToast(firstname: string, id_user: number) {
	const id = toast.custom((t) => (
		<div
			className={`${
				t.visible ? 'animate-enter' : 'animate-leave'
			} flex flex-row items-center justify-center bg-gray-700 text-white rounded-xl p-3`}
		>
			{chooseNotificationContent('unlike', firstname, id_user)}
			<button className="ps-3" onClick={() => toast.dismiss(id)}>
				<AiOutlineClose />
			</button>
		</div>
	));
}

export function matchToast(firstname: string, id_user: number) {
	toast.custom((t) => (
		<div
			className={`${
				t.visible ? 'animate-enter' : 'animate-leave'
			} flex flex-row items-center justify-center bg-gray-700 text-white rounded-xl p-3`}
		>
			{chooseNotificationContent('match', firstname, id_user)}
			<button className="ps-3" onClick={() => toast.dismiss()}>
				<AiOutlineClose />
			</button>
		</div>
	));
}

export function messageToast(
	firstname: string,
	id_user: number,
	content: string,
	picture: string,
) {
	toast.custom((t) => (
		<div
			className={`${
				t.visible ? 'animate-enter' : 'animate-leave'
			} flex flex-row items-center justify-center bg-gray-700 text-white rounded-xl p-3 max-w-[21rem] box-border`}
		>
			<div className="min-w-0 flex-1">
				{chooseNotificationContent(
					'message',
					firstname,
					id_user,
					content,
					picture,
				)}
			</div>
			<button className="ps-3" onClick={() => toast.dismiss()}>
				<AiOutlineClose />
			</button>
		</div>
	));
}
