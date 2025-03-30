import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center pt-8 md:pt-16 min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 px-4">
      <div className="text-center max-w-3xl">
        <div className="mb-4 flex justify-center">
          <Logo size={180} className="w-36 h-36 md:w-48 md:h-48" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-indigo-800">ESG Lens</h1>
        <p className="text-lg md:text-xl mb-6 md:mb-8 text-gray-700">
          Analice, compare y extraiga información valiosa de informes ESG utilizando NLP avanzado. Realice seguimiento de
          métricas de sostenibilidad, genere puntuaciones ESG y tome decisiones basadas en datos.
        </p>
        <Link href="/dashboard">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 md:px-8 md:py-6 text-lg rounded-lg">
            Comenzar
          </Button>
        </Link>
      </div>
    </div>
  )
}

