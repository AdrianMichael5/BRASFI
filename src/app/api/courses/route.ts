import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/courses - Listar todos os cursos
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar cursos' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Criar novo curso
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, descricao, icone, metaArrecadacao } = body;

    // Validação básica
    if (!titulo || !descricao || !icone || !metaArrecadacao) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        titulo,
        descricao,
        icone,
        metaArrecadacao: Number(metaArrecadacao),
        valorArrecadado: 0,
        inscritos: []
      }
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar curso' },
      { status: 500 }
    );
  }
} 