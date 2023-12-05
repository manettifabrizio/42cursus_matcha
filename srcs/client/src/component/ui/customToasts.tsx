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

export function likeToast(firstname: string, id_user: number) {
	toast.custom((t) => (
		<div
			className={`${
				t.visible ? 'animate-enter' : 'animate-leave'
			} flex flex-row items-center justify-center bg-gray-700 text-white rounded-xl p-3`}
		>
			<div className="text-2xl pe-3">❤️‍🔥</div>
			<div>
				You received a like from{' '}
				<Link
					to={`${location.origin}/home/${id_user}`}
					className="underline font-bold"
				>
					{firstname}
				</Link>
			</div>
			<button className="ps-3" onClick={() => toast.dismiss()}>
				<AiOutlineClose />
			</button>
		</div>
	));
}

export function unlikeToast(firstname: string) {
	const id = toast.custom((t) => (
		<div
			className={`${
				t.visible ? 'animate-enter' : 'animate-leave'
			} flex flex-row items-center justify-center bg-gray-700 text-white rounded-xl p-3`}
		>
			<div className="text-2xl pe-3">💔</div>
			<div>{firstname} unliked you...</div>
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
			<div className="text-2xl pe-3">🔥</div>
			<div>
				<strong className="text-xl">It's a match!</strong>
				<div>
					You matched with{' '}
					<Link
						to={`${location.origin}/home/${id_user}`}
						className="underline font-bold"
					>
						{firstname}
					</Link>
					.
				</div>
			</div>
			<button className="ps-3" onClick={() => toast.dismiss()}>
				<AiOutlineClose />
			</button>
		</div>
	));
}
