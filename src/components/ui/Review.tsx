import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useUser } from '@/lib/useUser';
import { useCourses } from '@/lib/useCourses';

interface Review {
  id: string;
  name: string;
  text: string;
  course_id: string;
  course_name: string;
}

const ReviewForm: React.FC<{
  review?: Review;
  onSubmit: (review: Omit<Review, 'id'>) => void;
  onCancel: () => void;
}> = ({ review, onSubmit, onCancel }) => {
  const { user } = useUser();
  const { courses } = useCourses(user?.user_id || "");
  
  const [formData, setFormData] = useState({
    text: review?.text || '',
    course_id: review?.course_id || '',
    course_name: review?.course_name || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const selectedCourse = courses.find((course: { course_name: string; }) => course.course_name.toLowerCase() === formData.course_name.toLowerCase());
    if (!selectedCourse) {
      alert('Por favor ingresa un nombre de curso válido');
      return;
    }

    onSubmit({
      ...formData,
      name: user.name,
      course_id: selectedCourse.course_id,
      course_name: selectedCourse.course_name,
    });
  };

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p>Inicia sesión para enviar una review.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="course" className="text-right">
            Nombre del Curso
          </Label>
          <Input
            id="course"
            className="col-span-3"
            list="coursesList"
            value={formData.course_name}
            onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
            placeholder="Ingresa el nombre del curso"
            required
          />
          <datalist id="coursesList">
            {courses.map((course: { course_id: React.Key | null | undefined; course_name: string | number | readonly string[] | undefined; }) => (
              <option key={course.course_id} value={course.course_name} />
            ))}
          </datalist>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="review" className="text-right">
            Review
          </Label>
          <Textarea
            id="review"
            className="col-span-3"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Comparte tu experiencia con este curso..."
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {review ? 'Actualizar' : 'Añadir'} Review
        </Button>
      </DialogFooter>
    </form>
  );
};

const Reviews: React.FC = () => {
  const { user } = useUser();
  const { courses } = useCourses(user?.user_id || "");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | undefined>();
  const [notification, setNotification] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const handleAdd = (newReview: Omit<Review, 'id'>) => {
    const review = {
      ...newReview,
      id: Math.random().toString(36).substr(2, 9),
    };
    setReviews([...reviews, review]);
    setIsDialogOpen(false);
    setNotification('¡Review añadida con éxito!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEdit = (updatedReview: Omit<Review, 'id'>) => {
    if (!editingReview) return;
    setReviews(reviews.map((t) =>
      t.id === editingReview.id
        ? { ...updatedReview, id: editingReview.id }
        : t
    ));
    setEditingReview(undefined);
    setIsDialogOpen(false);
    setNotification('¡Review actualizada con éxito!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = () => {
    if (reviewToDelete) {
      setReviews(reviews.filter((t) => t.id !== reviewToDelete));
      setNotification('¡Review eliminada con éxito!');
      setTimeout(() => setNotification(null), 3000);
      setIsDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const reviewsByCourse = reviews.reduce((acc, review) => {
    if (!acc[review.course_id]) {
      acc[review.course_id] = [];
    }
    acc[review.course_id].push(review);
    return acc;
  }, {} as Record<string, Review[]>);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {notification && (
        <div className="bg-green-500 text-white p-4 mb-4 rounded">
          {notification}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Reviews de Cursos</h2>
        {user && courses.length > 0 ? (
          <Button
            onClick={() => {
              setEditingReview(undefined);
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Añadir Review
          </Button>
        ) : user ? (
          <p className="text-sm text-gray-500">Crea un curso para añadir reviews</p>
        ) : (
          <p className="text-sm text-gray-500">Inicia sesión para añadir reviews</p>
        )}
      </div>

      <div className="space-y-8">
        {courses.map((course: { course_id: React.Key | null | undefined; course_name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => {
          const courseReviews = reviewsByCourse[String(course.course_id)] || [];
          return (
            <div key={course.course_id} className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{course.course_name}</h3>
              <div className="space-y-4">
                {courseReviews.length > 0 ? (
                  courseReviews.map((review) => (
                    <Card key={review.id} className="border shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {review.name}
                            </h4>
                          </div>
                          {user?.name === review.name && (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingReview(review);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setReviewToDelete(review.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <p className="mt-4 text-gray-600">{review.text}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Aún no hay reviews para este curso</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingReview ? 'Editar Review' : 'Añadir Review'}
            </DialogTitle>
          </DialogHeader>
          <ReviewForm
            review={editingReview}
            onSubmit={editingReview ? handleEdit : handleAdd}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
	          open={isDeleteDialogOpen}
			  onOpenChange={setIsDeleteDialogOpen}
			>
			  <DialogContent>
				<DialogHeader>
				  <DialogTitle>¿Eliminar Review?</DialogTitle>
				</DialogHeader>
				<p>¿Estás seguro de que quieres eliminar esta review? Esta acción no se puede deshacer.</p>
				<DialogFooter>
				  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
					Cancelar
				  </Button>
				  <Button variant="destructive" onClick={handleDelete}>
					Eliminar
				  </Button>
				</DialogFooter>
			  </DialogContent>
			</Dialog>
		  </div>
		);
	  };
	  
	  export default Reviews;
	  
