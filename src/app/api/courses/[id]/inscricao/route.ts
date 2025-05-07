import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/courses/[id]/inscricao - Inscrever usuário no curso
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: Number(params.id) }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se o usuário já está inscrito
    if (course.inscritos.includes(email)) {
      return NextResponse.json(
        { error: 'Usuário já inscrito neste curso' },
        { status: 400 }
      );
    }

    // Adicionar usuário à lista de inscritos
    const updatedCourse = await prisma.course.update({
      where: { id: Number(params.id) },
      data: {
        inscritos: [...course.inscritos, email]
      }
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao realizar inscrição' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id]/inscricao - Cancelar inscrição
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { id: Number(params.id) }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    // Remover usuário da lista de inscritos
    const updatedCourse = await prisma.course.update({
      where: { id: Number(params.id) },
      data: {
        inscritos: course.inscritos.filter(e => e !== email)
      }
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao cancelar inscrição' },
      { status: 500 }
    );
  }
} 