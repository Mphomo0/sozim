'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAction, useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react'

interface Message {
  _id?: string
  role: 'user' | 'assistant'
  message: string
  createdAt?: number
}

function generateSessionId(): string {
  if (typeof window === 'undefined') return ''
  return crypto.randomUUID()
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sessionId] = useState(generateSessionId)
  const [localMessages, setLocalMessages] = useState<Message[]>([
    {
      role: 'assistant',
      message:
        'Hi, I\u2019m Sozim\u2019s assistant. Ask me about our programs, career pathways, or how to contact us.',
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const createSession = useMutation(api.chatbot.createChatSession)
  const sendMessage = useAction(api.chatbot.sendChatMessage)
  const storedMessages = useQuery(
    api.chatbot.getChatHistory,
    sessionId ? { sessionId } : 'skip',
  )

  useEffect(() => {
    if (storedMessages && storedMessages.length > 0) {
      setLocalMessages([
        {
          role: 'assistant',
          message:
            'Hi, I\u2019m Sozim\u2019s assistant. Ask me about our programs, career pathways, or how to contact us.',
        },
        ...storedMessages,
      ])
    }
  }, [storedMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [localMessages, isSending])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isSending || !sessionId) return
    if (trimmed.length > 500) return

    setIsSending(true)
    setInput('')

    setLocalMessages((prev) => [
      ...prev,
      { role: 'user', message: trimmed, createdAt: Date.now() },
    ])

    try {
      const result = await sendMessage({
        sessionId,
        message: trimmed,
      })

      setLocalMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          message: result.message,
          createdAt: Date.now(),
        },
      ])
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Sorry, something went wrong. Please try again later.'
      setLocalMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          message,
          createdAt: Date.now(),
        },
      ])
    } finally {
      setIsSending(false)
    }
  }, [input, isSending, sessionId, sendMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const messageCount = localMessages.filter((m) => m.role === 'user').length
  const atLimit = messageCount >= 15

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
        {isOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-95 max-w-[calc(100vw-2rem)] h-140 max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-4 py-3 bg-blue-900 text-white shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold text-sm">Sozim Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
              {localMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-900 text-white rounded-br-md'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <Loader2 className="w-5 h-5 text-blue-900 animate-spin" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-3 bg-white shrink-0">
              {atLimit && (
                <p className="text-xs text-amber-600 mb-2 text-center">
                  Message limit reached. Start a new chat.
                </p>
              )}
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 500))}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Sozim..."
                  disabled={isSending || atLimit}
                  aria-label="Type your message"
                  className="flex-1 h-10 px-4 text-sm rounded-full border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isSending || !input.trim() || atLimit}
                  aria-label="Send message"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-900 text-white hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            const next = !isOpen
            setIsOpen(next)
            if (next && sessionId) createSession({ sessionId })
          }}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          className="w-14 h-14 rounded-full bg-blue-900 text-white shadow-lg hover:bg-blue-800 transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  )
}
