import React, { ReactElement, ReactNode } from 'react';

type FormContainerProps = {
	children: typeof React.Children | ReactNode | ReactElement;
};

export default function FormContainer({ children }: FormContainerProps) {
	return (
		<div className="overflow-auto w-full h-fit m-auto">
			<div className="flex justify-center my-4">
				<div className="flex flex-col h-full justify-center items-center w-10/12 sm:w-3/4 md:w-1/3">
					<>{children}</>
				</div>
			</div>
		</div>
	);
}
