import React from "react";
import { useNavigate } from "react-router-dom";
import { Course } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { TrashIcon } from "lucide-react";

interface CoursesListProps {
	courses: Course[];
	createCourse: ({
		courseName,
		description,
	}: {
		courseName: string;
		description: string;
	}) => void;
	deleteCourse: (courseId: string) => void;
}

const Courses: React.FC<CoursesListProps> = ({
	courses,
	createCourse,
	deleteCourse,
}) => {
	const [courseName, setCourseName] = React.useState("");
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const [description, setDescription] = React.useState("");
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
	const [courseToDelete, setCourseToDelete] = React.useState<string | null>(
		null
	);
	const navigate = useNavigate();

	const handleCreateCourse = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await createCourse({ courseName, description });
			setIsDialogOpen(false);
			setCourseName("");
		} catch (e) {
			console.error(e);
		}
	};

	const handleDeleteCourse = async () => {
		if (courseToDelete) {
			try {
				await deleteCourse(courseToDelete);
				setIsConfirmDialogOpen(false);
				setCourseToDelete(null);
			} catch (e) {
				console.error(e);
			}
		}
	};

	const handleCourseClick = (course: Course) => {
		navigate("/tutor", { state: { course } });
	};

	return (
		<>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<div className="space-y-4 mb-6">
					<div className="flex justify-between">
						<DialogTrigger asChild>
							<Button onClick={() => setIsDialogOpen(true)}>
								Agregar Curso
							</Button>
						</DialogTrigger>
					</div>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Crear Curso</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleCreateCourse}>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="name" className="text-right">
										Name
									</Label>
									<Input
										id="name"
										className="col-span-3"
										required
										value={courseName}
										onChange={(e) => setCourseName(e.target.value)}
									/>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="username" className="text-right">
										Description
									</Label>
									<Textarea
										id="username"
										className="col-span-3"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit">Guardar</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</div>
			</Dialog>

			<Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Confirmar Eliminación</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<p>¿Estás seguro de que deseas eliminar este curso?</p>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsConfirmDialogOpen(false)}
						>
							Cancelar
						</Button>
						<Button variant="destructive" onClick={handleDeleteCourse}>
							Eliminar
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div className="space-y-4 mb-6">
				{courses &&
					courses.map((course: Course) => (
						<div key={course.course_id} className="flex items-center space-x-2">
							<Button
								className="p-2 hover:bg-red-600 active:bg-red-600"
								onClick={() => {
									setCourseToDelete(course.course_id);
									setIsConfirmDialogOpen(true);
								}}
							>
								<TrashIcon className="w-4 h-4" />
							</Button>
							<Button
								variant="outline"
								className="w-full py-6 text-lg font-medium bg-card hover:bg-accent"
								onClick={() => handleCourseClick(course)}
							>
								{course.course_name}
							</Button>
						</div>
					))}
				<p className="text-center text-sm text-muted-foreground">
					Selecciona un curso para estudiarlo
				</p>
			</div>
		</>
	);
};

export default Courses;
