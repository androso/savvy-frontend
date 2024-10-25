import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Search, 
  SortAsc,
  SortDesc, 
  Grid, 
  List, 
  Calendar,
  Check,
  X,
  Trash2,
  Download
} from 'lucide-react';
import { useCourses } from '@/lib/useCourses';
import { useUser } from '@/lib/useUser';

type ViewType = 'grid' | 'list' | 'compact';
type FilterType = 'all' | 'favorite' | 'archived';

const NotesPage = () => {
  const { user } = useUser();
  const { courses } = useCourses(user?.user_id || "");
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewType>('list');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [archived, setArchived] = useState<string[]>([]);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState<string | null>(null);

  // Filter courses
  const filteredCourses = courses.filter((course: { course_name: string; description: string; course_id: string; }) => {
    const matchesSearch = 
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'all') {
      return matchesSearch && !archived.includes(course.course_id);
    }
    if (filterType === 'favorite') {
      return matchesSearch && favorites.includes(course.course_id);
    }
    if (filterType === 'archived') {
      return matchesSearch && archived.includes(course.course_id);
    }
    return matchesSearch;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    return sortOrder === 'asc' 
      ? a.course_name.localeCompare(b.course_name)
      : b.course_name.localeCompare(a.course_name);
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleFavorite = (courseId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
    showNotification(
      favorites.includes(courseId) 
        ? 'Curso removido de favoritos' 
        : 'Curso añadido a favoritos',
      'success'
    );
  };

  const handleArchive = (courseId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowArchiveConfirm(courseId);
  };

  const confirmArchive = (courseId: string) => {
    setArchived(prev => [...prev, courseId]);
    setShowArchiveConfirm(null);
    showNotification('Curso archivado', 'success');
  };

  const unarchive = (courseId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setArchived(prev => prev.filter(id => id !== courseId));
    showNotification('Curso restaurado', 'success');
  };

  const downloadCourses = () => {
    const coursesToDownload = selectedCourses.length > 0 
      ? courses.filter((course: { course_id: string; }) => selectedCourses.includes(course.course_id))
      : filteredCourses;

    const content = coursesToDownload.map((course: { course_name: any; description: any; course_id: string; }) => `
Curso: ${course.course_name}
Descripción: ${course.description || 'Sin descripción'}
Estado: ${archived.includes(course.course_id) ? 'Archivado' : favorites.includes(course.course_id) ? 'Favorito' : 'Activo'}
Creado por: ${user?.name || 'Desconocido'}
----------------------------------------
    `).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cursos.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Cursos descargados exitosamente', 'success');
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        {notification && (
          <div 
            className={`mb-4 p-3 rounded-md flex items-center justify-between ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
              {notification.message}
            </div>
          </div>
        )}

        {showArchiveConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">¿Archivar curso?</h3>
              <p className="text-muted-foreground mb-6">
                ¿Estás seguro de que deseas archivar este curso? Podrás restaurarlo más tarde.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowArchiveConfirm(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => confirmArchive(showArchiveConfirm)}
                >
                  Archivar
                </Button>
              </div>
            </div>
          </div>
        )}

        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Notas del Curso
                  {selectedCourses.length > 0 && (
                    <span className="text-sm font-normal ml-2">
                      ({selectedCourses.length} seleccionados)
                    </span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadCourses}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Descargar
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterType('all')}
                  className={`${filterType === 'all' ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  Todos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterType('favorite')}
                  className={`${filterType === 'favorite' ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  Favoritos +{favorites.length}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterType('archived')}
                  className={`${filterType === 'archived' ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  Archivados +{archived.length}
                </Button>
              </div>

              <div className="flex justify-between items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar cursos..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setViewMode(prev => {
                        if (prev === 'list') return 'grid';
                        if (prev === 'grid') return 'compact';
                        return 'list';
                      });
                    }}
                  >
                    {viewMode === 'list' ? (
                      <List className="h-4 w-4" />
                    ) : viewMode === 'grid' ? (
                      <Grid className="h-4 w-4" />
                    ) : (
                      <Calendar className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[calc(100vh-300px)] w-full rounded-md border overflow-y-auto">
              <div className={`p-4 ${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-4' 
                  : viewMode === 'compact'
                    ? 'space-y-2'
                    : 'space-y-4'
              }`}>
                {sortedCourses.length > 0 ? (
                  sortedCourses.map((course) => (
                    <div
                      key={course.course_id}
                      onClick={() => setSelectedCourses(prev => 
                        prev.includes(course.course_id)
                          ? prev.filter(id => id !== course.course_id)
                          : [...prev, course.course_id]
                      )}
                      className={`bg-card rounded-lg ${
                        viewMode === 'compact' ? 'p-2' : 'p-4'
                      } space-y-2 border cursor-pointer
                        ${selectedCourses.includes(course.course_id) 
                          ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                          : 'hover:border-primary transition-colors'}`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className={`font-medium text-primary ${
                          viewMode === 'compact' ? 'text-sm' : 'text-lg'
                        }`}>
                          {course.course_name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => toggleFavorite(course.course_id, e)}
                            className={`text-yellow-500 hover:text-yellow-600 ${
                              favorites.includes(course.course_id) ? 'opacity-100' : 'opacity-30'
                            }`}
                          >
                            ★
                          </button>
                          {filterType === 'archived' ? (
                            <button
                              onClick={(e) => unarchive(course.course_id, e)}
                              className="text-blue-500 hover:text-blue-600"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => handleArchive(course.course_id, e)}
                              className="text-gray-500 hover:text-gray-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      {viewMode !== 'compact' && course.description && (
                        <p className="text-sm text-muted-foreground">
                          {course.description}
                        </p>
                      )}
                      <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Creado por: {user?.name || 'Desconocido'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    {searchTerm ? 'No se encontraron cursos' : 'No hay cursos agregados'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotesPage;