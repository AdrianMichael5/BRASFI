export function WelcomeScreen() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-white">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Bem-vindo à Plataforma BRASFI
        </h1>
        <p className="text-gray-600 mb-6">
          Selecione um canal na barra lateral para começar a conversar com sua
          equipe.
        </p>
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-100 text-left">
          <h2 className="text-lg font-medium text-blue-800 mb-2">
            Dicas para começar:
          </h2>
          <ul className="text-blue-700 space-y-2">
            <li>
              • Canais são organizados por categorias para facilitar a navegação
            </li>
            <li>
              • Use o canal <strong>general</strong> para discussões gerais da
              equipe
            </li>
            <li>
              • Canais de projeto são específicos para discussões de trabalho
            </li>
            <li>
              • Apenas administradores podem enviar mensagens em canais de
              anúncios
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
