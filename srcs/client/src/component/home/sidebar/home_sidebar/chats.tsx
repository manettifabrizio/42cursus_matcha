export default function ChatsList() {
	return (
		<div className="flex-1 overflow-auto">
			<p className="font-bold mb-2 text-2xl">Conversations</p>
			<ul className="list-none p-0">
				{
					<li className="mb-1">
						<a href="#" className="flex items-center">
							<img
								src="https://via.placeholder.com/50"
								alt="Chat"
								className="mr-2 rounded-full"
							/>
							<div className="flex flex-col justify-end">
								<p>Tanya</p>
								<p className="text-gray-400">
									Hello! How are you?
								</p>
							</div>
						</a>
					</li>
				}
			</ul>
		</div>
	);
}
