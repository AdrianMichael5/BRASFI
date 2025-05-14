"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ArrowLeft, PlusCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Lesson {
  _id: string;
  title: string;
  videoUrl?: string;
  description?: string;
  completed?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
}

export default function CourseDetailMock() {
  const params = useParams();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: "", description: "" });

  useEffect(() => {
    const savedCourses = localStorage.getItem("cursos");
    if (savedCourses) {
      const cursos = JSON.parse(savedCourses);
      const current = cursos.find((c: any) => String(c.id) === courseId);
      setCourse(current || null);
    }
    const savedLessons = localStorage.getItem(`lessons-${courseId}`);
    if (savedLessons) setLessons(JSON.parse(savedLessons));
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      localStorage.setItem(`lessons-${courseId}`, JSON.stringify(lessons));
    }
  }, [lessons, courseId]);

  const handleAddLesson = () => {
    if (!newLesson.title) return;
    const newL: Lesson = {
      _id: crypto.randomUUID(),
      title: newLesson.title,
      description: newLesson.description,
      completed: false,
    };
    setLessons([...lessons, newL]);
    setNewLesson({ title: "", description: "" });
    setShowModal(false);
  };

  const toggleComplete = (id: string) => {
    const updated = lessons.map((lesson) =>
      lesson._id === id ? { ...lesson, completed: !lesson.completed } : lesson
    );
    setLessons(updated);
  };

  const completedLessons = lessons.filter((l) => l.completed).length;
  const progressValue = lessons.length ? (completedLessons / lessons.length) * 100 : 0;

  if (!course) return <div className="p-6">Carregando curso...</div>;

  return (
    <div className="p-6">
      <Button variant="ghost" className="mb-6 text-gray-600">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
      </Button>

      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Conteúdo do Curso</h2>
                <Button onClick={() => setShowModal(true)} className="bg-green-600 text-white">
                  <PlusCircle className="w-4 h-4 mr-2" /> Nova Aula
                </Button>
              </div>
              {lessons.length === 0 ? (
                <p className="text-gray-500">Este curso ainda não possui aulas.</p>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson, idx) => (
                    <div
                      key={lesson._id}
                      className="border p-4 rounded-md flex gap-4 items-start cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleComplete(lesson._id)}
                    >
                      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${lesson.completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                        {lesson.completed ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-gray-600">{lesson.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Progresso do Curso</h2>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Aulas Concluídas</span>
                  <span>{completedLessons} de {lessons.length}</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> {lessons.length} aulas
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Aula</h2>
            <Input
              placeholder="Título da aula"
              className="mb-3"
              value={newLesson.title}
              onChange={(e) => setNewLesson((p) => ({ ...p, title: e.target.value }))}
            />
            <Textarea
              placeholder="Descrição da aula"
              className="mb-4"
              value={newLesson.description}
              onChange={(e) => setNewLesson((p) => ({ ...p, description: e.target.value }))}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddLesson} className="bg-blue-600 text-white">
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}