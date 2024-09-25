import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { StarIcon, PaperclipIcon, ArrowUpIcon } from 'lucide-react'

export default function AITutorChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "I'll help you understand anything!\n\nEnter an exam question, a homework problem, or anything you don't understand"
    }
  ])
  const [input, setInput] = useState('')

  const suggestedTopics = [
    "Cognitive-behavioral therapy techniques",
    "Humanistic vs. psychodynamic approaches",
    "Mental health stigma reduction strategies",
    "Self-care practices for therapists",
    "Attachment theory and adult relationships",
    "Abnormal psychology case studies",
    "Cultural competence in psychotherapy",
    "Couples therapy models and techniques"
  ]

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }])
      setInput('')
      // Here you would typically call your API to get the AI's response
      // For now, we'll just add a placeholder response
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm processing your question. Please wait for my response." }])
      }, 1000)
    }
  }

  const handleTopicClick = (topic) => {
    setMessages([...messages, { role: 'user', content: topic }])
    // Here you would typically call your API to get the AI's response
    // For now, we'll just add a placeholder response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: `Let's discuss ${topic}. What would you like to know about it?` }])
    }, 1000)
  }

  const handleFileUpload = (event) => {
    // This is a placeholder for file upload functionality
    console.log('File selected:', event.target.files[0])
    // Here you would typically handle the file upload
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-xl font-semibold text-center">AI Tutor</h1>
      </header>
      <div className="flex-1 overflow-auto p-6">
        {messages.map((message, index) => (
          <Card key={index} className={`mb-4 p-4 ${message.role === 'assistant' ? 'bg-white' : 'bg-blue-100'}`}>
            {message.role === 'assistant' && (
              <div className="flex items-center mb-2">
                <StarIcon className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="font-semibold">Gizmo</span>
              </div>
            )}
            <p className="whitespace-pre-wrap">{message.content}</p>
          </Card>
        ))}
        {messages.length === 1 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Suggested topics</h2>
            <div className="flex flex-wrap gap-3">
              {suggestedTopics.map((topic, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-2 px-3 flex-[0_1_auto] min-w-[40%] max-w-full"
                  onClick={() => handleTopicClick(topic)}
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="bg-white p-4 shadow-md">
        <div className="flex items-center">
          <label htmlFor="file-upload" className="mr-2">
            <Button variant="outline" size="icon" className="cursor-pointer" tabIndex={0} role="button" aria-label="Attach file">
              <PaperclipIcon className="h-4 w-4" />
            </Button>
          </label>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            aria-label="File upload"
          />
          <Input
            placeholder="Enter a question or topic"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} className="ml-2">
            <ArrowUpIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}