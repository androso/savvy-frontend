import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PaperclipIcon, ArrowUpIcon } from "lucide-react";
import { useSuggestedTopics } from "@/lib/useSuggestedTopics";
import { Course } from "@/types/types";

// ! TODO: Show list of suggested topics
// ! TODO: Generate list of suggested topics by making a call to openai

export default function TutorChat() {
	const location = useLocation();
	const course: Course = location.state?.course;
	const [messages, setMessages] = useState([
		{
			role: "assistant",
			content: `Hablemos sobre ${course.course_name}. ¿Qué te gustaría saber al respecto?`,
		},
	]);
	const [input, setInput] = useState("");
	const { suggestedTopics } = useSuggestedTopics(course.course_id);

	const handleSendMessage = () => {
		if (input.trim()) {
			setMessages([...messages, { role: "user", content: input }]);
			setInput("");
			// Here you would typically call your API to get the AI's response
			// For now, we'll just add a placeholder response
			setTimeout(() => {
				setMessages((prev) => [
					...prev,
					{
						role: "assistant",
						content:
							"I'm processing your question. Please wait for my response.",
					},
				]);
			}, 1000);
		}
	};

	const handleTopicClick = (topic: string) => {
		setMessages([...messages, { role: "user", content: topic }]);
		// Here you would typically call your API to get the AI's response
		// For now, we'll just add a placeholder response
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					content: `Let's discuss ${topic}. What would you like to know about it?`,
				},
			]);
		}, 1000);
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		// This is a placeholder for file upload functionality
		if (event.target?.files) {
			console.log("File selected:", event.target.files[0]);
			// Here you would typically handle the file upload
		}
	};

	return (
		<div className="flex flex-col h-full bg-gray-100 items-center ">
			{/* <header className="bg-white shadow-sm py-4 px-6 w-full">
				<h1 className="text-xl font-semibold text-center ">AI Tutor</h1>
			</header> */}
			<div className="flex-1 overflow-auto p-6 h-full  w-full overflow-y-scroll">
				<div className="max-w-2xl mx-auto pb-10">
					{messages.map((message, index) => (
						<Card
							key={index}
							className={`mb-4 p-4 ${
								message.role === "assistant" ? "bg-white" : "bg-blue-100"
							}`}
						>
							{message.role === "assistant" && (
								<div className="flex items-center mb-2">
									<div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
									<span className="font-semibold">Gizmo</span>
								</div>
							)}
							<p className="whitespace-pre-wrap">{message.content}</p>
						</Card>
					))}
					{messages.length === 1 && (
						<div className="mt-6">
							<h2 className="text-lg font-semibold mb-4">Suggested topics</h2>
							<div className="flex flex-wrap gap-3">
								{suggestedTopics &&
									suggestedTopics?.map((topic, index) => (
										<Button
											key={index}
											variant={"outline"}
											className="justify-start text-left h-auto py-2 px-3 flex-[0_1_auto] min-w-[40%] max-w-full border border-gray-500"
											onClick={() => handleTopicClick(topic)}
										>
											{topic}
										</Button>
									))}
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="fixed bottom-[69px] bg-white  p-4 shadow-md w-full max-w-2xl mx-auto ">
				<div className="flex items-center">
					<label htmlFor="file-upload" className="mr-2">
						<Button
							variant="outline"
							size="icon"
							className="cursor-pointer"
							tabIndex={0}
							role="button"
							aria-label="Attach file"
						>
							<PaperclipIcon className="h-4 w-4" />
						</Button>
					</label>
					<Input
						id="file-upload"
						type="file"
						className="hidden"
						onChange={(event) => handleFileUpload(event)}
						aria-label="File upload"
					/>
					<Input
						placeholder="Enter a question or topic"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
						className="flex-1"
					/>
					<Button onClick={handleSendMessage} className="ml-2">
						<ArrowUpIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
