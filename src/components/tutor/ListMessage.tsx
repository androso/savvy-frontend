import { Card } from "../ui/card";
import { Step } from "./types";

export default function ListMessage({
	headerText,
	steps,
}: {
	headerText: string;
	steps: Step[];
}) {
	return (
		<Card className="mb-4 p-4 bg-white">
			<div className="flex items-center mb-2">
				<div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
				<span className="font-semibold">Gizmo</span>
			</div>
			<p className="whitespace-pre-wrap">{headerText}</p>
			<div className="space-y-2">
				{steps.map((step) => (
					<div
						key={step.order}
						className="flex items-start bg-gray-50 rounded-md p-3 mt-3"
					>
						<span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-3 text-sm font-medium text-gray-600">
							{step.order}
						</span>
						<p className="text-gray-700">{step.title}</p>
					</div>
				))}
			</div>
		</Card>
	);
}
