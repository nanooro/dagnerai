'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send, Bot, User } from "lucide-react"
import Link from "next/link"

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const character = searchParams.get('character') || 'Ai Hoshino'
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showInput, setShowInput] = useState(true)
  const [modalPosition, setModalPosition] = useState({ x: 50, y: 50 })
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    if (modalRef.current) {
      setIsDragging(true)
      // Don't recalculate position on drag start, just start dragging from current position
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const newX = Math.max(15, Math.min(85, ((e.clientX - centerX) / window.innerWidth) * 100 + 50))
      const newY = Math.max(20, Math.min(80, ((e.clientY - centerY) / window.innerHeight) * 100 + 50))

      setModalPosition({ x: newX, y: newY })
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    if (modalRef.current && e.touches.length === 1) {
      setIsDragging(true)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && modalRef.current && e.touches.length === 1) {
      e.preventDefault()
      const touch = e.touches[0]
      const rect = modalRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const newX = Math.max(15, Math.min(85, ((touch.clientX - centerX) / window.innerWidth) * 100 + 50))
      const newY = Math.max(20, Math.min(80, ((touch.clientY - centerY) / window.innerHeight) * 100 + 50))

      setModalPosition({ x: newX, y: newY })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging])

  // Oshi no Ko character knowledge base
  const characterKnowledge = {
    'Ai Hoshino': {
      fullName: 'Ai Hoshino',
      age: '20 (deceased)',
      occupation: 'Idol, singer, actress',
      personality: 'Energetic, bubbly, kind-hearted, loves making people happy',
      relationships: {
        'Aqua Hoshino': 'Her son (also her reincarnation)',
        'Ruby Hoshino': 'Her daughter (also her reincarnation)',
        'Hikaru Kamiki': 'Her former boyfriend and father of her children',
        'Ichigo Saitou': 'Her manager and president of Strawberry Productions'
      },
      backstory: 'Former child actress who became a famous idol. She was killed at age 20. She was secretly a mother to twins who were reincarnated.',
      keyFacts: [
        'Former member of the idol group B-Komachi',
        'Starred in the drama series "My Favorite Child"',
        'Had a secret relationship with Hikaru Kamiki',
        'Was murdered by a stalker fan',
        'Her children Aqua and Ruby were reincarnated with memories of their past life'
      ]
    },
    'Aqua Hoshino': {
      fullName: 'Aqua Hoshino',
      age: '18-19',
      occupation: 'Actor, high school student',
      personality: 'Intelligent, manipulative, cold, analytical, protective',
      relationships: {
        'Ruby Hoshino': 'His twin sister',
        'Ai Hoshino': 'His mother (reincarnated)',
        'Kana Arima': 'Close friend and co-star',
        'Akane Kurokawa': 'Girlfriend (dating)',
        'Hikaru Kamiki': 'His biological father (seeks revenge against)'
      },
      backstory: 'Reincarnation of Goro Amamiya. Works in entertainment industry to find his mother\'s killer.',
      keyFacts: [
        'Reincarnated doctor who remembers his past life',
        'Works as an actor to investigate the entertainment industry',
        'Has a complex relationship with his father Hikaru Kamiki',
        'Is dating Akane Kurokawa',
        'Has exceptional acting abilities and manipulation skills'
      ]
    },
    'Ruby Hoshino': {
      fullName: 'Ruby Hoshino',
      age: '18-19',
      occupation: 'Idol, high school student',
      personality: 'Energetic, determined, passionate, optimistic, hardworking',
      relationships: {
        'Aqua Hoshino': 'Her twin brother',
        'Ai Hoshino': 'Her mother (reincarnated)',
        'Kana Arima': 'Close friend and fellow idol',
        'Mem-cho': 'Fellow idol and friend',
        'Frill Shiranui': 'Rival idol'
      },
      backstory: 'Reincarnation of Sarina Tendouji. Aspires to become an idol like her mother.',
      keyFacts: [
        'Reincarnated patient who remembers her past life',
        'Member of the idol group B-Komachi',
        'Has incredible singing talent',
        'Works extremely hard to achieve her dreams',
        'Has a strong bond with her brother Aqua'
      ]
    },
    'Kana Arima': {
      fullName: 'Kana Arima',
      age: '18-19',
      occupation: 'Actress, idol, high school student',
      personality: 'Professional, mature, emotional, talented, dedicated',
      relationships: {
        'Aqua Hoshino': 'Close friend and co-star (has feelings for)',
        'Akane Kurokawa': 'Rival and fellow actress',
        'Ruby Hoshino': 'Fellow idol and friend',
        'Ai Hoshino': 'Met briefly before Ai\'s death'
      },
      backstory: 'Former child actress who transitioned to become an idol. Has deep emotional struggles.',
      keyFacts: [
        'Former child actress with exceptional talent',
        'Struggles with emotional vulnerability',
        'Has complex feelings for Aqua Hoshino',
        'Very professional about her work',
        'Has been in the entertainment industry since childhood'
      ]
    },
    'Akane Kurokawa': {
      fullName: 'Akane Kurokawa',
      age: '18-19',
      occupation: 'Actress, idol, high school student',
      personality: 'Intelligent, analytical, strategic, caring, perceptive',
      relationships: {
        'Aqua Hoshino': 'Boyfriend (dating)',
        'Kana Arima': 'Rival and fellow actress',
        'Taiki Himekawa': 'Former boyfriend (abusive relationship)',
        'Aqua\'s family': 'Close with Aqua and Ruby'
      },
      backstory: 'Talented actress who analyzes everything strategically. Survived an abusive relationship.',
      keyFacts: [
        'Exceptional acting and analytical abilities',
        'Formerly dated Taiki Himekawa who was abusive',
        'Has a genius-level understanding of psychology',
        'Is dating Aqua Hoshino',
        'Very strategic in her approach to life and work'
      ]
    },
    'Mem-cho': {
      fullName: 'Mem-cho (Nino)',
      age: '19-20',
      occupation: 'Idol, social media influencer',
      personality: 'Energetic, fun-loving, playful, social, entertaining',
      relationships: {
        'Ruby Hoshino': 'Fellow idol and friend',
        'Kana Arima': 'Fellow idol and friend',
        'Frill Shiranui': 'Rival idol',
        'B-Komachi members': 'Group members'
      },
      backstory: 'Popular idol and social media personality known for her bubbly personality.',
      keyFacts: [
        'Member of the idol group B-Komachi',
        'Popular social media influencer',
        'Known for her energetic and fun personality',
        'Has a large online following',
        'Brings energy and entertainment to the group'
      ]
    }
  }

  const getCharacterInfo = (characterName: string, infoType: 'relationships' | 'backstory' | 'personality' | 'keyFacts' | 'all') => {
    const char = characterKnowledge[characterName as keyof typeof characterKnowledge]
    if (!char) return 'I don\'t have information about that character.'

    if (infoType === 'all') {
      return {
        ...char,
        relationships: Object.entries(char.relationships).map(([name, relation]) => `${name}: ${relation}`).join('\n'),
        keyFacts: char.keyFacts.join('\n• ')
      }
    }

    return char[infoType]
  }

  useEffect(() => {
    // Auto scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Get character-specific knowledge
      const charInfo = getCharacterInfo(character, 'all')

      // Create comprehensive prompt with character knowledge
      const characterPrompt = `
You are ${character} from the anime Oshi no Ko. Here is your complete information:

FULL NAME: ${charInfo.fullName}
AGE: ${charInfo.age}
OCCUPATION: ${charInfo.occupation}
PERSONALITY: ${charInfo.personality}

RELATIONSHIPS:
${charInfo.relationships}

BACKSTORY:
${charInfo.backstory}

KEY FACTS:
${charInfo.keyFacts}

You must respond as ${character} would in the Oshi no Ko universe. Stay in character at all times, using appropriate personality traits, speaking style, and mannerisms. Reference your relationships and backstory naturally when relevant.

When users ask about other characters or relationships, use the knowledge provided above to give accurate information. For example:
- If asked "Who's your boyfriend/girlfriend?", reference your actual relationships
- If asked about your past, reference your backstory
- If asked about other characters, provide accurate information from the series

Current conversation context: The user is asking: "${input.trim()}"
      `.trim()

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBQlfjKJ2UVYjgweS748mIT8gnmu0dwdUY`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: characterPrompt
            }]
          }]
        })
      })

      const data = await response.json()

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text

        const assistantMessage: Message = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          role: 'assistant',
          content: `Sorry, I encountered an error. Please try again!`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error:', error)

      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error. Please try again!`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Add initial greeting message based on character personality
    let greeting = ''

    switch (character) {
      case 'Ai Hoshino':
        greeting = `Hello there! I'm Ai Hoshino, the amazing idol from Oshi no Ko! ✨ I'm super excited to chat with you! What's on your mind? I love talking about anything and everything - music, dreams, love... you name it! 💕`
        break
      case 'Aqua Hoshino':
        greeting = `...Hello. I'm Aqua Hoshino. I don't talk much, but I'll listen if you have something to say. Just don't waste my time.`
        break
      case 'Ruby Hoshino':
        greeting = `Hi! I'm Ruby Hoshino, and I'm going to be the greatest idol ever! 🌟 I work really hard and I'm super passionate about my dreams. What about you? Do you have any big goals? Let's talk about them!`
        break
      case 'Kana Arima':
        greeting = `Oh, hello. I'm Kana Arima. I've been acting since I was a kid, so I'm pretty used to being on stage. It's nice to meet you. What brings you here today?`
        break
      case 'Akane Kurokawa':
        greeting = `Good day. I'm Akane Kurokawa, an actress and idol. I approach everything with careful consideration and analysis. It's a pleasure to make your acquaintance. Shall we have a meaningful conversation?`
        break
      case 'Mem-cho':
        greeting = `Hey hey! I'm Mem-cho, the super energetic and fun idol from Oshi no Ko! 🎉 I love having a good time and making people smile! What's up? Let's chat about something awesome!`
        break
      default:
        greeting = `Hello! I'm ${character} from Oshi no Ko. I'm excited to chat with you! What would you like to talk about?`
    }

    setMessages([
      {
        role: 'assistant',
        content: greeting,
        timestamp: new Date()
      }
    ])

    // Simulate loading delay for initial message
    setTimeout(() => {
      setIsInitialLoading(false)
    }, 800)
  }, [character])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {isInitialLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="text-center">
            <div className="mb-4">
              <Avatar className="h-16 w-16 mx-auto mb-4">
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-2xl">
                  {character.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">
              Loading {character}...
            </h2>
            <div className="flex justify-center space-x-1">
              <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="w-full flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold">
                    {character.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-white font-semibold">{character}</h1>
                  <p className="text-white/70 text-sm">AI Chat Assistant</p>
                </div>
              </div>
            </div>
          </div>

          <div className="fixed top-20 left-0 right-0 bottom-0 w-full h-[calc(100vh-80px)] overflow-hidden">
            <div className="h-full w-full">
              <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
                <div className="px-4 pt-4 pb-32 min-h-full">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 mb-4 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-white backdrop-blur-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">{message.content}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                          <AvatarFallback className="bg-blue-500 text-white text-sm">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white/10 text-white backdrop-blur-sm rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div
            ref={modalRef}
            className={`fixed transition-all duration-200 ease-out cursor-move z-50 ${
              showInput ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              left: `${modalPosition.x}%`,
              top: `${modalPosition.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20 max-w-md w-full mx-4 relative">
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600/80 rounded-full flex items-center justify-center cursor-move shadow-lg border-2 border-white/20">
                <div className="relative w-4 h-4">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/80 transform -translate-y-1/2"></div>
                  <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/80 transform -translate-x-1/2"></div>
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </div>

              <form onSubmit={sendMessage} className="flex flex-col gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70 rounded-xl backdrop-blur-sm text-center"
                  disabled={isLoading}
                  autoFocus
                />
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    onClick={() => setShowInput(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white rounded-xl px-4"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <button
            onClick={() => setShowInput(!showInput)}
            className={`fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full shadow-xl transition-all duration-300 ${
              showInput
                ? 'bg-red-500 hover:bg-red-600 scale-100'
                : 'bg-blue-500 hover:bg-blue-600 scale-100'
            }`}
            aria-label={showInput ? 'Close input' : 'Open input'}
          >
            {showInput ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-white">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-white">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <line x1="9" y1="10" x2="15" y2="10"></line>
                <line x1="12" y1="7" x2="12" y2="13"></line>
              </svg>
            )}
          </button>
        </>
      )}
    </div>
  )
}
