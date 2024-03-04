import React, { ReactElement, ReactNode } from 'react';

type FormContainerProps = {
	children: typeof React.Children | ReactNode | ReactElement;
	size?: 'sm' | 'lg';
};

export default function FormContainer({
	children,
	size = 'lg',
}: FormContainerProps) {
	const getSize = () => {
		switch (size) {
			case 'sm':
				return 'w-10/12 sm:w-3/4 md:w-1/2';
			case 'lg':
				return 'w-10/12 sm:w-3/4 md:w-1/3';
		}
	};

	return (
		<div className="overflow-auto w-full m-auto no-scrollbar">
			<div className="flex justify-center my-4">
				<div
					className={
						'flex flex-col h-full justify-center items-center ' +
						getSize()
					}
				>
					<>{children}</>
				</div>
			</div>
		</div>
	);
}
