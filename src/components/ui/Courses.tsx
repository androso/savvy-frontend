import { Book, Clipboard, User } from "lucide-react"
import { Button } from "@/components/ui/button"

function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] py-4">
      <div className="flex justify-around">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-300">
          <User className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-300">
          <Clipboard className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-300">
          <Book className="h-6 w-6" />
        </Button>
      </div>
    </nav>
  )
}

export default function CourseApp() {
  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 flex flex-col">
      <div className="flex-grow">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-600 rounded-full"></div>
        </div>
        <h1 className="text-2xl font-semibold text-center mb-8">Bienvenido, androso</h1>
        <div className="space-y-4 mb-6">
          <Button 
            variant="outline" 
            className="w-full py-6 text-lg font-medium bg-[#1a1a1a] border-[#1a1a1a] hover:bg-[#252525] hover:border-[#252525] text-white"
          >
            Materia I
          </Button>
          <Button 
            variant="outline" 
            className="w-full py-6 text-lg font-medium bg-[#1a1a1a] border-[#1a1a1a] hover:bg-[#252525] hover:border-[#252525] text-white"
          >
            Materia II
          </Button>
        </div>
        <p className="text-center text-sm text-gray-400">
          Selecciona un curso para estudiarlo
        </p>
      </div>
      <BottomNavigation />
    </div>
  )
}