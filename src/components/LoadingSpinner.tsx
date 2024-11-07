import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center h-full">
			<Loader2 className="h-8 w-8 animate-spin text-blue-500" />
			<span className="ml-2 text-gray-600">Cargando ...</span>
		</div>
	);
}
