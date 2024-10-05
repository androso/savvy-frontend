import React from "react";
import { Course } from "@/types/types"; // Adjust the import path as necessary
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

const CoursesList: React.FC<CoursesListProps> = ({ courses, createCourse }) => {
	const [courseName, setCourseName] = React.useState("");
	const [isDialogOpen, setIsDialogOpen] = React.useState(false);
	const [description, setDescription] = React.useState("");

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

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<div className="space-y-4 mb-6">
				<DialogTrigger asChild>
					<Button onClick={() => setIsDialogOpen(true)}>Agregar Curso</Button>
				</DialogTrigger>
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
							<Button type="submit">Save</Button>
						</DialogFooter>
					</form>
				</DialogContent>

				{/*  LISTING THE COURSES */}
				{courses &&
					courses.map((course: Course) => (
						<Button
							variant="outline"
							className="w-full py-6 text-lg font-medium bg-card hover:bg-accent"
							key={course.course_id}
						>
							{course.course_name}
						</Button>
					))}
				<p className="text-center text-sm text-muted-foreground">
					Selecciona un curso para estudiarlo
				</p>
			</div>
		</Dialog>
	);
};

export default CoursesList;
