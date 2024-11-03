import { Card } from "../ui/card";

export default function NormalMessage({
	role,
	content,
}: {
	role: string;
	content: string;
}) {
	return (
		<Card
			className={`mb-4 p-4 ${
				role === "assistant" ? "bg-white" : "bg-blue-100"
			}`}
		>
			{role === "assistant" && (
				<div className="flex items-center mb-2">
					<div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
					<span className="font-semibold">Gizmo</span>
				</div>
			)}
			<p className="whitespace-pre-wrap">{content}</p>
		</Card>
	);
}
