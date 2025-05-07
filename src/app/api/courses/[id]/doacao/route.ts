import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/courses/[id]/doacao - Registrar doação
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { valor } = body;

    if (!valor || valor <= 0) {
      return NextResponse.json(
        { error: 'Valor inválido' },
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

    // Atualizar valor arrecadado
    const updatedCourse = await prisma.course.update({
      where: { id: Number(params.id) },
      data: {
        valorArrecadado: course.valorArrecadado + Number(valor)
      }
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao processar doação' },
      { status: 500 }
    );
  }
} 