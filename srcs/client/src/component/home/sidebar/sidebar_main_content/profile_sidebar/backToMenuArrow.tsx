import { toggleSidebar } from '@/feature/interactions/store.slice';
import { FaChevronLeft } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

type BackToMenuArrowProps = {
	chat?: boolean;
};

export function BackToMenuArrow({ chat = false }: BackToMenuArrowProps) {
	const dispatch = useDispatch();
	const isDesktop = useMediaQuery({ query: '(min-width: 640px)' });

	return (
		!isDesktop && (
			<div
				className={
					chat ? 'flex m-3 text-xl' : 'w-full justify-start flex mb-2'
				}
			>
				<button
					className="text-xl"
					onClick={() => dispatch(toggleSidebar(true))}
				>
					<FaChevronLeft className="me-1" />
				</button>
			</div>
		)
	);
}
