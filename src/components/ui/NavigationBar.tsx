import { Book, Clipboard, User } from "lucide-react";
import { Button } from "./button";

export default function BottomNavigation() {
	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-4">
			<div className="flex justify-around">
				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground"
				>
					<User className="h-6 w-6" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground"
				>
					<Clipboard className="h-6 w-6" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground"
				>
					<Book className="h-6 w-6" />
				</Button>
			</div>
		</nav>
	);
}
