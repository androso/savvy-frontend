import { Book, CircleX, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";

export default function FlashcardMessage({
	question,
	options,
	correctOption,
}: {
	question: string;
	options: string[];
	correctOption: string;
}) {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [isRevealed, setIsRevealed] = useState<boolean>(false);

	const handleOptionClick = (option: string) => {
		if (option === correctOption) {
			setIsRevealed(true);
		} else {
			setIsRevealed(false);
			setSelectedOptions([...selectedOptions, option]);
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
			<div className="p-6">
				<CardHeader className="pb-4">
					<CardTitle className="text-center text-xl font-bold text-gray-800 px-4">
						{question}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{options.map((option, index) => (
						<Button
							key={index}
							variant="outline"
							className={`w-full justify-center h-auto py-4 px-6 text-center text-gray-700 bg-blue-50 ${
								(isRevealed || selectedOptions.includes(option)) &&
								"pointer-events-none"
							} border-gray-200 hover:bg-blue-100 ${
								isRevealed && option === correctOption
									? "bg-green-300"
									: selectedOptions.includes(option)
									? "bg-red-300"
									: " "
							}`}
							onClick={() => handleOptionClick(option)}
							disabled={isRevealed ? option !== correctOption : false}
						>
							{option}
						</Button>
					))}
					<div className="flex justify-center space-x-4 mt-2">
						<Button
							variant="outline"
							className="w-full py-3 bg-blue-50 hover:bg-green-300 border-gray-200"
						>
							<Download className="mr-2 h-5 w-5" /> Save
						</Button>
						<Button
							variant="outline"
							className="w-full py-3 bg-blue-50 hover:bg-blue-100 border-gray-200"
							disabled={isRevealed}
							onClick={() => setIsRevealed(true)}
						>
							<Book className="mr-2 h-5 w-5" /> Reveal
						</Button>
						<Button
							variant="outline"
							className="w-full py-3 bg-blue-50 hover:bg-red-400 border-gray-200"
						>
							<CircleX className="mr-2 h-5 w-5" /> Discard
						</Button>
					</div>
				</CardContent>
			</div>
		</Card>
	);
}
