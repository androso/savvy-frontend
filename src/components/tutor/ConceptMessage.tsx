import { Card } from "../ui/card";

export default function ConceptMessage({
	stepNumber,
	title,
	content,
}: {
	stepNumber: number;
	title: string;
	content: string;
}) {
	return (
		<Card className="p-6 bg-white shadow-sm">
			<div className="flex items-start mb-4">
				<div className="flex-shrink-0 w-8 h-8 mr-3 bg-blue-100 rounded-lg flex items-center justify-center">
					<span className="text-blue-600 font-semibold text-lg">
						{stepNumber}
					</span>
				</div>
				<h2 className="text-xl font-bold flex-grow">{title}</h2>
			</div>
			<hr className="border-t border-gray-200 mb-4" />
			<p className="text-gray-700 leading-relaxed">{content}</p>
		</Card>
	);
}
