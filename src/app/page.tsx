import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <Image
          src="/placeholder.svg?height=500&width=1200"
          alt="Imagem de fundo com natureza"
          width={1200}
          height={500}
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-3xl">
            <div className="inline-block bg-red-600 text-white px-3 py-1 text-sm font-medium mb-4">
              CONHEÇA O SEU FUTURO
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              FORMANDO LÍDERES E VIABILIZANDO SOLUÇÕES
            </h1>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">CONHEÇA O BRASFI</Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Imagem institucional"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div>
              <div className="text-red-600 font-medium mb-2">CASE LIDERANÇA</div>
              <p className="text-gray-800 text-lg">
                Atuamos como catalisadores no desenvolvimento de lideranças e soluções em finanças e sustentabilidade.
                Nosso objetivo é identificar e capacitar uma nova geração de líderes que impulsionem mudanças positivas,
                contribuindo para um futuro mais sustentável e próspero.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-red-600 font-medium mb-8">NOSSO IMPACTO</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-white p-4 rounded-full mb-4 shadow-md">
                <Image src="/placeholder.svg?height=50&width=50" alt="Ícone de pessoas" width={50} height={50} />
              </div>
              <div className="text-sm uppercase font-medium mb-2">Atuação Profissional</div>
              <div className="text-3xl font-bold text-green-600 mb-2">+20</div>
              <div className="text-xs text-gray-600">PROFISSIONAIS FORMADOS EM ATUAÇÃO PROFISSIONAL</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-white p-4 rounded-full mb-4 shadow-md">
                <Image src="/placeholder.svg?height=50&width=50" alt="Ícone de formação" width={50} height={50} />
              </div>
              <div className="text-sm uppercase font-medium mb-2">Formação</div>
              <div className="text-3xl font-bold text-green-600 mb-2">+20</div>
              <div className="text-xs text-gray-600">PESSOAS EM PROCESSO DE FORMAÇÃO</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-white p-4 rounded-full mb-4 shadow-md">
                <Image src="/placeholder.svg?height=50&width=50" alt="Ícone de impacto" width={50} height={50} />
              </div>
              <div className="text-sm uppercase font-medium mb-2">Eventos de Impacto</div>
              <div className="text-3xl font-bold text-green-600 mb-2">+40</div>
              <div className="text-xs text-gray-600">EVENTOS REALIZADOS COM LÍDERES NACIONAIS</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-white p-4 rounded-full mb-4 shadow-md">
                <Image src="/placeholder.svg?height=50&width=50" alt="Ícone de produção" width={50} height={50} />
              </div>
              <div className="text-sm uppercase font-medium mb-2">Produção Intelectual</div>
              <div className="text-3xl font-bold text-green-600 mb-2">+10</div>
              <div className="text-xs text-gray-600">PESQUISAS PUBLICADAS</div>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-white p-4 rounded-full mb-4 shadow-md">
                <Image src="/placeholder.svg?height=50&width=50" alt="Ícone de mentoria" width={50} height={50} />
              </div>
              <div className="text-sm uppercase font-medium mb-2">Cursos e Mentorias</div>
              <div className="text-3xl font-bold text-green-600 mb-2">+50</div>
              <div className="text-xs text-gray-600">TREINAMENTOS REALIZADOS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-10 bg-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="bg-white rounded-full p-2 mr-4">
                <Image
                  src="/placeholder.svg?height=60&width=60"
                  alt="Foto do depoimento"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="italic mb-2">
                "Estar parte deste rede implica muito mais que aprender e estar constantemente atento com o nível de
                networking de outros líderes financeiros sustentáveis."
              </p>
              <p className="font-medium">Marcelo Gomes, CEO da XY</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-red-600 font-medium mb-8">PARCEIROS</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-center">
                <Image
                  src={`/placeholder.svg?height=60&width=120&text=LOGO${i}`}
                  alt={`Logo parceiro ${i}`}
                  width={120}
                  height={60}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative h-[300px] overflow-hidden">
        <Image
          src="/placeholder.svg?height=300&width=1200"
          alt="Imagem de fundo"
          width={1200}
          height={300}
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl font-bold text-white mb-6">QUER FAZER PARTE?</h2>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">CLIQUE AQUI!</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-medium uppercase mb-4">Contato</h3>
              <p className="text-sm text-gray-400">contato@brasfi.com.br</p>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase mb-4">Endereço</h3>
              <p className="text-sm text-gray-400">São Paulo, SP - Brasil</p>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase mb-4">Redes Sociais</h3>
              <div className="flex space-x-4">
                {["facebook", "linkedin", "twitter", "instagram"].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">{social}</span>
                    <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            <p>BRASFI</p>
            <p className="mt-2">© {new Date().getFullYear()} Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
