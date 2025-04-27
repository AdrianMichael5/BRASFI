"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { CountUp } from "@/components/count-up";
import { Briefcase, GraduationCap, Leaf, Brain, Users, Facebook, Linkedin, Twitter, Instagram } from "lucide-react";
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';

const logos = ["logo1.png", "logo2.svg", "logo3.jpg", "logo4.svg"];


export default function Home() {
  useEffect(() => {
    AOS.init({ once: true }); // aqui inicializa o AOS
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section id="hero" className="relative h-[700px] overflow-hidden">
        <Image
          src="/backg.jpg"
          alt="Imagem de fundo com natureza"
          width={1920}
          height={1080}
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
            <Button className="bg-white text-black font-medium cursor-pointer">
              CONHEÇA O BRASFI
            </Button>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div data-aos="fade-right" data-aos-duration="1000">
              <Image
                src="/amazonia3.jpg"
                alt="Imagem institucional"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
              <div className="text-red-600 font-medium mb-2">COMO ATUAMOS</div>
              <p className="text-gray-800 text-lg">
                Atuamos como catalisadores no desenvolvimento de lideranças e
                soluções em finanças e sustentabilidade. Nosso objetivo é
                identificar e capacitar uma nova geração de líderes que
                impulsionem mudanças positivas, contribuindo para um futuro mais
                sustentável e próspero.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Impact Section */}
      <section id="impact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-red-600 font-medium mb-8" data-aos="fade-up" data-aos-duration="1000">NOSSO IMPACTO</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {/* Alocação Profissional */}
            <div className="flex flex-col items-center text-center" data-aos="zoom-in">
              <div className="bg-white p-4 rounded-full mb-4 shadow-md border border-green-500">
                <Briefcase className="w-10 h-10 text-gray-700" />
              </div>
              <div className="text-sm uppercase font-medium mb-2">
                Alocação Profissional
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                <CountUp end={20} prefix="+" />
              </div>
              <div className="text-xs text-gray-600">
                JOVENS PROFISSIONAIS ALOCADOS NO MERCADO PROFISSIONAL
              </div>
            </div>

            {/* Formação */}
            <div className="flex flex-col items-center text-center" data-aos="zoom-in">
              <div className="bg-white p-4 rounded-full mb-4 shadow-md border border-green-500">
                <GraduationCap className="w-10 h-10 text-gray-700" />
              </div>
              <div className="text-sm uppercase font-medium mb-2">Formação</div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                <CountUp end={20} prefix="+" />
              </div>
              <div className="text-xs text-gray-600">BOLSAS DE ESTUDO</div>
            </div>

            {/* Eventos de Impacto */}
            <div className="flex flex-col items-center text-center" data-aos="zoom-in">
              <div className="bg-white p-4 rounded-full mb-4 shadow-md border border-green-500">
                <Leaf className="w-10 h-10 text-gray-700" />
              </div>
              <div className="text-sm uppercase font-medium mb-2">
                Eventos de Impacto
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                <CountUp end={40} prefix="+" />
              </div>
              <div className="text-xs text-gray-600">
                ESG E TEMAS SOBRE SUSTENTABILIDADE
              </div>
            </div>
            {/* Produção Intelectual */}
            <div className="flex flex-col items-center text-center" data-aos="zoom-in">
              <div className="bg-white p-4 rounded-full mb-4 shadow-md border border-green-500">
                <Brain className="w-10 h-10 text-gray-700" />
              </div>
              <div className="text-sm uppercase font-medium mb-2">
                Produção Intelectual
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                <CountUp end={10} prefix="+" />
              </div>
              <div className="text-xs text-gray-600">PESQUISAS PUBLICADAS</div>
            </div>

            {/* Cursos e Workshops */}
            <div className="flex flex-col items-center text-center" data-aos="zoom-in">
              <div className="bg-white p-4 rounded-full mb-4 shadow-md border border-green-500">
                <Users className="w-10 h-10 text-gray-700" />
              </div>
              <div className="text-sm uppercase font-medium mb-2">
                Cursos e Workshops
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                <CountUp end={50} prefix="+" />
              </div>
              <div className="text-xs text-gray-600">
                TREINAMENTOS REALIZADOS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-10 bg-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="bg-white rounded-full p-2 mr-4"></div>
            </div>
            <div className="flex-1">
              <p className="italic mb-2">
                "Estar parte deste rede implica muito mais que aprender e estar
                constantemente atento com o nível de networking de outros
                líderes financeiros sustentáveis."
              </p>
              <p className="font-medium">Marcelo Gomes, CEO da XY</p>
            </div>
          </div>
        </div>
      </section>
      {/* Partners */}
<section id="partners" className="py-12 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-red-600 font-medium mb-8">PARCEIROS</div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
      {logos.map((logo, i) => (
        <div key={i} className="flex justify-center" data-aos="zoom-in" data-aos-delay={i * 100}>
          <Image
            src={`/parceiros/${logo}`}
            alt={`Logo parceiro ${i + 1}`}
            width={140}
            height={60}
          />
        </div>
      ))}
    </div>
  </div>
</section>
      {/* CTA Section */}
      <section className="relative h-[300px] overflow-hidden" data-aos="zoom-in" data-aos-duration="1000">
        <Image
          src="/amazonia4.png"
          alt="Imagem de fundo"
          width={1200}
          height={300}
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            QUER FAZER PARTE?
          </h2>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition-all hover:scale-105">
            CLIQUE AQUI!
          </Button>
        </div>
      </section>
      {/* Footer */}
      <footer id="footer" className="bg-gray-900 text-white py-8">
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
        {[
          { name: "facebook", icon: <Facebook size={24} />, link: "https://www.facebook.com" },
          { name: "linkedin", icon: <Linkedin size={24} />, link: "https://www.linkedin.com" },
          { name: "twitter", icon: <Twitter size={24} />, link: "https://www.twitter.com" },
          { name: "instagram", icon: <Instagram size={24} />, link: "https://www.instagram.com" },
        ].map(({ name, icon, link }) => (
          <a
            key={name}
            href={link} // Aqui o link real
            target="_blank" // Abre o link em uma nova aba
            rel="noopener noreferrer" // Melhora a segurança
            className="text-gray-400 hover:text-white"
            aria-label={name}
          >
            <span className="sr-only">{name}</span>
            <div className="w-6 h-6 flex items-center justify-center rounded-full">
              {icon}
            </div>
          </a>
        ))}
      </div>
    </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            <p>BRASFI</p>
            <p className="mt-2">
              © {new Date().getFullYear()} Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
