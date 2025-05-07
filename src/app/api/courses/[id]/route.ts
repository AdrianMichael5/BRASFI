import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/courses/[id] - Buscar curso específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(params.id) }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar curso' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Atualizar curso
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { titulo, descricao, icone, metaArrecadacao } = body;

    const course = await prisma.course.update({
      where: { id: Number(params.id) },
      data: {
        titulo,
        descricao,
        icone,
        metaArrecadacao: Number(metaArrecadacao)
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar curso' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Excluir curso
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.course.delete({
      where: { id: Number(params.id) }
    });

    return NextResponse.json(
      { message: 'Curso excluído com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir curso' },
      { status: 500 }
    );
  }
} 