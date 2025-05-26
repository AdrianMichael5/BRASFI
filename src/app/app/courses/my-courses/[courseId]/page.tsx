"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppLayoutWithoutSidebar } from "@/components/app-layout-without-sidebar";
import {
  BookOpen,
  Plus,
  CheckCircle,
  Play,
  Lock,
  Edit,
  Trash,
  Award,
  Youtube,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  completed: boolean;
}

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  modules: Module[];
  progress: number;
}

export default function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [addLessonDialogOpen, setAddLessonDialogOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: "",
  });
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [ratings, setRatings] = useState<{[lessonId: number]: number}>({});
  const [comments, setComments] = useState<{[lessonId: number]: {user: string, text: string, date: string}[]}>({});
  const [commentText, setCommentText] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAdmin(parsedUser.email === "admin@brasfi.com");
      } catch (e) {
        console.error("Erro ao analisar dados do usuário:", e);
        router.push("/auth/login");
        return;
      }
    } else {
      router.push("/auth/login");
      return;
    }

    // Load course data from localStorage
    const courses = JSON.parse(localStorage.getItem("cursos") || "[]");
    const courseData = courses.find((c: any) => c.id === parseInt(params.courseId));
    
    if (courseData) {
      // Initialize modules if they don't exist
      if (!courseData.modules || courseData.modules.length === 0) {
        courseData.modules = [
          {
            id: 1,
            title: "Módulo 1",
            description: "Introdução ao curso",
            lessons: []
          }
        ];
      }

      // Transform the course data to match our Course interface
      const transformedCourse: Course = {
        id: courseData.id,
        title: courseData.titulo,
        description: courseData.descricao,
        thumbnailUrl: courseData.thumbnailUrl || "https://via.placeholder.com/1280x720",
        modules: courseData.modules,
        progress: courseData.progress || 0
      };
      setCourse(transformedCourse);

      // Update localStorage with initialized modules
      const updatedCourses = courses.map((c: any) =>
        c.id === courseData.id ? {
          ...c,
          modules: courseData.modules
        } : c
      );
      localStorage.setItem("cursos", JSON.stringify(updatedCourses));
    } else {
      // If course not found, redirect to courses page
      router.push("/app/courses");
    }
    
    setIsLoading(false);
  }, [params.courseId, router]);

  useEffect(() => {
    if (course && !selectedLesson) {
      const firstLesson = course.modules[0]?.lessons[0] || null;
      setSelectedLesson(firstLesson);
    }
  }, [course]);

  useEffect(() => {
    const savedRatings = JSON.parse(localStorage.getItem("lessonRatings") || "{}") || {};
    setRatings(savedRatings);
    const savedComments = JSON.parse(localStorage.getItem("lessonComments") || "{}") || {};
    setComments(savedComments);
  }, []);

  const handleAddLesson = () => {
    if (!course || selectedModuleId === null) return;
    
    if (!newLesson.title || !newLesson.videoUrl) {
      alert("Por favor, preencha o título e a URL do vídeo.");
      return;
    }

    const updatedModules = course.modules.map(module => {
      if (module.id === selectedModuleId) {
        const newLessonId = Math.max(0, ...module.lessons.map(l => l.id)) + 1;
        return {
          ...module,
          lessons: [
            ...module.lessons,
            {
              id: newLessonId,
              ...newLesson,
              completed: false,
            },
          ],
        };
      }
      return module;
    });
    
    const updatedCourse = {
      ...course,
      modules: updatedModules,
    };
    
    setCourse(updatedCourse);
    // Update localStorage
    const courses = JSON.parse(localStorage.getItem("cursos") || "[]");
    const updatedCourses = courses.map((c: any) =>
      c.id === course.id ? {
        ...c,
        modules: updatedModules
      } : c
    );
    localStorage.setItem("cursos", JSON.stringify(updatedCourses));
    
    setAddLessonDialogOpen(false);
    setNewLesson({
      title: "",
      description: "",
      videoUrl: "",
      duration: "",
    });
  };

  const toggleCompleteLesson = (moduleId: number, lessonId: number) => {
    if (!course) return;
    const updatedModules = course.modules.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.id === lessonId
              ? { ...lesson, completed: !lesson.completed }
              : lesson
          ),
        };
      }
      return module;
    });
    const updatedCourse = {
      ...course,
      modules: updatedModules,
      progress: calculateProgress(updatedModules),
    };
    setCourse(updatedCourse);
    // Atualiza localStorage
    const courses = JSON.parse(localStorage.getItem("cursos") || "[]");
    const updatedCourses = courses.map((c: any) =>
      c.id === course.id ? {
        ...c,
        modules: updatedModules,
        progress: calculateProgress(updatedModules)
      } : c
    );
    localStorage.setItem("cursos", JSON.stringify(updatedCourses));
    // Atualiza a selectedLesson se for a mesma
    if (selectedLesson && selectedLesson.id === lessonId) {
      setSelectedLesson({
        ...selectedLesson,
        completed: !selectedLesson.completed
      });
    }
  };

  const calculateProgress = (modules: Module[]) => {
    const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = modules.reduce(
      (acc, module) => acc + module.lessons.filter(lesson => lesson.completed).length,
      0
    );
    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const handleRateLesson = (lessonId: number, rating: number) => {
    const newRatings = {...ratings, [lessonId]: rating};
    setRatings(newRatings);
    localStorage.setItem("lessonRatings", JSON.stringify(newRatings));
  };

  const handleAddComment = (lessonId: number) => {
    if (!commentText.trim()) return;
    const newComment = {
      user: user?.name || user?.email || "Usuário",
      text: commentText,
      date: new Date().toLocaleString("pt-BR")
    };
    const updatedComments = {
      ...comments,
      [lessonId]: [...(comments[lessonId] || []), newComment]
    };
    setComments(updatedComments);
    localStorage.setItem("lessonComments", JSON.stringify(updatedComments));
    setCommentText("");
    if (commentInputRef.current) commentInputRef.current.value = "";
  };

  const allLessonsCompleted = course && course.modules[0]?.lessons.length > 0 && course.modules[0].lessons.every(l => l.completed);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!course || !user) {
    return <div>Curso não encontrado</div>;
  }

  return (
    <AppLayoutWithoutSidebar user={user}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Esquerda: Vídeo e progresso */}
          <div className="w-2/3 flex flex-col items-center">
            <div className="w-full bg-black rounded-lg flex items-center justify-center mb-4" style={{height: 400}}>
              <span className="text-white text-2xl font-bold">VIDEO DO YOUTUBE</span>
            </div>
            {/* Barra de progresso */}
            <div className="w-full mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">Progresso do Curso</span>
                <span className="text-sm">{Math.round(course.progress)}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
            {/* Certificado */}
            {allLessonsCompleted && (
              <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white" onClick={() => setShowCertificate(true)}>
                Gerar Certificado
              </Button>
            )}
            {/* Modal do certificado */}
            {showCertificate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/50" onClick={() => setShowCertificate(false)}></div>
                <div className="relative z-50 bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                  <h2 className="text-2xl font-bold mb-4">Certificado de Conclusão</h2>
                  <p className="mb-2">Certificamos que <span className="font-semibold">{user?.name || user?.email}</span></p>
                  <p className="mb-2">concluiu o curso</p>
                  <p className="font-semibold mb-4">{course.title}</p>
                  <p className="text-sm text-gray-500 mb-4">Data: {new Date().toLocaleDateString("pt-BR")}</p>
                  <Button onClick={() => setShowCertificate(false)} className="bg-blue-600 hover:bg-blue-700 text-white">Fechar</Button>
                </div>
              </div>
            )}
            {/* Avaliação e comentários da aula selecionada */}
            {selectedLesson && (
              <div className="w-full mt-6 bg-white rounded-lg shadow p-4">
                <div className="mb-2 flex items-center">
                  <span className="font-semibold mr-2">Avalie esta aula:</span>
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => handleRateLesson(selectedLesson.id, star)}>
                      <Star className={`h-5 w-5 ${ratings[selectedLesson.id] >= star ? 'text-yellow-400' : 'text-gray-300'}`} fill={ratings[selectedLesson.id] >= star ? '#facc15' : 'none'} />
                    </button>
                  ))}
                  {ratings[selectedLesson.id] && (
                    <span className="ml-2 text-sm text-gray-500">{ratings[selectedLesson.id]} de 5</span>
                  )}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Comentários:</span>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto mb-2">
                  {(comments[selectedLesson.id] || []).map((c, idx) => (
                    <div key={idx} className="bg-gray-100 rounded p-2 text-sm">
                      <span className="font-semibold">{c.user}</span> <span className="text-xs text-gray-400">({c.date})</span>
                      <div>{c.text}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    ref={commentInputRef}
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="flex-1"
                    onKeyDown={e => { if (e.key === 'Enter') handleAddComment(selectedLesson.id); }}
                  />
                  <Button onClick={() => handleAddComment(selectedLesson.id)} className="bg-blue-600 hover:bg-blue-700 text-white">Enviar</Button>
                </div>
              </div>
            )}
          </div>

          {/* Direita: Lista de aulas */}
          <div className="w-1/3">
            <div className="bg-white rounded-lg shadow p-4">
              {course.modules[0]?.lessons.length === 0 && (
                <div className="text-center text-gray-400">Nenhuma aula cadastrada</div>
              )}
              {course.modules[0]?.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between border-b last:border-b-0 py-3">
                  {/* Botão de concluído */}
                  <button
                    onClick={() => toggleCompleteLesson(course.modules[0].id, lesson.id)}
                    className={`rounded-full border-2 w-7 h-7 flex items-center justify-center mr-2 ${lesson.completed ? 'border-green-500 bg-green-100' : 'border-gray-300 bg-gray-100'}`}
                    title={lesson.completed ? 'Aula concluída' : 'Marcar como concluída'}
                  >
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <span className="text-xl text-gray-400">✗</span>
                    )}
                  </button>
                  {/* Título e descrição */}
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedLesson(lesson)}>
                    <div className="font-semibold text-sm truncate">{lesson.title}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {lesson.description?.slice(0, 30)}{lesson.description && lesson.description.length > 30 ? '...' : ''}
                    </div>
                  </div>
                  {/* Botão play */}
                  <button
                    onClick={() => setSelectedLesson(lesson)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    title="Assistir aula"
                  >
                    <Play className="h-6 w-6" />
                  </button>
                </div>
              ))}
              {/* Botão adicionar aula (admin) */}
              {isAdmin && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {
                    setSelectedModuleId(course.modules[0].id);
                    setAddLessonDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Aula
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Modal de adicionar aula */}
        <Dialog open={addLessonDialogOpen} onOpenChange={setAddLessonDialogOpen}>
          <DialogContent className="bg-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">Adicionar Nova Aula</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="lessonTitle" className="text-gray-700">Título da Aula</Label>
                <Input
                  id="lessonTitle"
                  value={newLesson.title}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, title: e.target.value })
                  }
                  placeholder="Ex: Introdução ao Tema"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lessonDescription" className="text-gray-700">Descrição</Label>
                <Textarea
                  id="lessonDescription"
                  value={newLesson.description}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, description: e.target.value })
                  }
                  placeholder="Descreva o conteúdo da aula..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="videoUrl" className="text-gray-700">URL do Vídeo (YouTube)</Label>
                <Input
                  id="videoUrl"
                  value={newLesson.videoUrl}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, videoUrl: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-gray-700">Duração</Label>
                <Input
                  id="duration"
                  value={newLesson.duration}
                  onChange={(e) =>
                    setNewLesson({ ...newLesson, duration: e.target.value })
                  }
                  placeholder="ex: 15:30"
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleAddLesson} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Adicionar Aula
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayoutWithoutSidebar>
  );
} 