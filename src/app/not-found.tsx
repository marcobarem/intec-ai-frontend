import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const logoPath = "/chatbot.png";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200 p-4">
      <div className="text-center space-y-6">
        <div className="mb-8">
          <Image
            src={logoPath}
            alt="Logo do Chatbot"
            width={150}
            height={150}
            className="mx-auto"
            priority
          />
        </div>

        <h1 className="text-7xl md:text-9xl font-extrabold text-blue-600 dark:text-blue-400 drop-shadow-lg">
          404
        </h1>
        <p className="text-2xl md:text-3xl font-semibold">
          Ops! Página não encontrada.
        </p>
        <p className="text-lg md:text-xl max-w-prose mx-auto">
          Parece que a página que você está procurando não existe ou foi movida.
          Não se preocupe, estamos aqui para te ajudar!
        </p>
        <Link href="/" passHref>
          <Button className="mt-8 px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95">
            Voltar para a Página Inicial
          </Button>
        </Link>
      </div>
    </div>
  );
}
