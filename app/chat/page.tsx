'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Send, Mic, X, Check } from 'lucide-react'
import { basePath } from '../config'

function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMessage = searchParams.get('message') || ''
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('chatMessages')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [orderData, setOrderData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('orderData')
      return saved ? JSON.parse(saved) : {
        patient: '',
        patientDOB: '',
        patientID: '',
        procedureType: '',
        teethLocation: '',
        serviceType: '',
        productionUnit: '',
        material: '',
        shadeGuide: '',
        shade: '',
        files: [] as string[],
        deliveryDate: '',
        deliveryTime: '',
        address: ''
      }
    }
    return {
      patient: '',
      patientDOB: '',
      patientID: '',
      procedureType: '',
      teethLocation: '',
      serviceType: '',
      productionUnit: '',
      material: '',
      shadeGuide: '',
      shade: '',
      files: [] as string[],
      deliveryDate: '',
      deliveryTime: '',
      address: ''
    }
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (initialMessage && !hasInitialized.current) {
      // Clear storage when coming from page 1 with a new message
      sessionStorage.removeItem('chatMessages')
      sessionStorage.removeItem('orderData')
      setMessages([])
      setOrderData({
        patient: '',
        patientDOB: '',
        patientID: '',
        procedureType: '',
        teethLocation: '',
        serviceType: '',
        productionUnit: '',
        material: '',
        shadeGuide: '',
        shade: '',
        files: [] as string[],
        deliveryDate: '',
        deliveryTime: '',
        address: ''
      })
      hasInitialized.current = true
      handleSend(initialMessage, true)
    }
  }, [])

  useEffect(() => {
    sessionStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    sessionStorage.setItem('orderData', JSON.stringify(orderData))
  }, [orderData])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAIResponse = (userMessage: string, isFirstMessage = false) => {
    const lowerMessage = userMessage.toLowerCase()
    let aiResponse = ''
    let newOrderData: typeof orderData

    if (isFirstMessage || messages.length === 0) {
      // First response - only set patient, procedure, and files
      newOrderData = {
        patient: '',
        patientDOB: '',
        patientID: '',
        procedureType: '',
        teethLocation: '',
        serviceType: '',
        productionUnit: '',
        material: '',
        shadeGuide: '',
        shade: '',
        files: [] as string[],
        deliveryDate: '',
        deliveryTime: '',
        address: ''
      }

      aiResponse = `Sure! I understand you want to create a **Final Restoration Order** sending to your **Preferred Lab**\n\n`

      if (lowerMessage.includes('james smith')) {
        newOrderData.patient = 'James Smith'
        newOrderData.patientDOB = '22.05.1985'
        newOrderData.patientID = '84620539'
        aiResponse += `• Patient Name: **James Smith**\n`
      }

      if (lowerMessage.includes('crown')) {
        newOrderData.procedureType = 'Crown'
        newOrderData.teethLocation = '28'
        newOrderData.serviceType = 'Design & manufacturing'
        newOrderData.productionUnit = 'Milling'
        newOrderData.material = 'Zirconia'
        aiResponse += `• Procedure Details: **Crown**, **28 (FDI)**, **Zirconia**, **Design & Manufacturing**, **Milling**\n`
      }

      if (lowerMessage.includes('scan') || lowerMessage.includes('di scan')) {
        newOrderData.files = ['2026_02_28_scan.DI']
        aiResponse += `• Media Files retrieved: **2026_02_28_scan.DI**\n\n[MEDIA:2026_02_28_scan.DI]\n`
      }

      aiResponse += `\nWhen do you want it to be delivered? Shall we deliver it to your usual address?`
    } else {
      // Second response - add delivery and shade details
      newOrderData = { ...orderData }

      aiResponse = `Great, I have updated the following:\n\n`

      newOrderData.deliveryDate = 'Mar, 3 2026'
      newOrderData.deliveryTime = '3PM'
      newOrderData.shadeGuide = 'Vita Classical + Bleached'
      newOrderData.shade = 'A3'
      newOrderData.address = 'User Default'

      aiResponse += `• Due Date is **Mar, 3 2026 at 3PM**\n`
      aiResponse += `• Shade Guide to **Vita Classical + Bleached**\n`
      aiResponse += `• Shade to **A3**\n\n`
      aiResponse += `✅ You are now ready to proceed! You will select service provider before submission.`
    }

    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { content: aiResponse, isUser: false }])
      setOrderData(newOrderData)
      setIsTyping(false)
    }, 1500)
  }

  const handleSend = (messageText?: string, isFirstMessage = false) => {
    const textToSend = messageText || input
    if (!textToSend.trim() || isTyping) return

    setMessages(prev => [...prev, { content: textToSend, isUser: true }])
    setInput('')
    simulateAIResponse(textToSend, isFirstMessage)
  }

  const isComplete = orderData.patient && orderData.procedureType && orderData.files.length > 0 && orderData.deliveryDate

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header with Step Indicator */}
      <header className="bg-white border-b border-gray-200">
        <div className="h-14 flex items-center justify-between px-4 relative">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="p-1.5 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <span className="text-sm font-medium text-gray-900">New AI-assisted order</span>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">1</span>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">Create your order</span>
            <div className="h-0.5 bg-gray-300 mx-4 w-20"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-sm font-semibold">2</span>
            </div>
          </div>
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">UN</span>
          </div>
        </div>
        {/* Gradient Progress Bar */}
        <div className="h-1 bg-gradient-to-r from-[#9D7FF5] via-[#5B9FF5] via-[#4FC9F5] to-[#FFF45C]"></div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-xs text-gray-500 mb-6">Today 15:14</p>

            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} items-start gap-3 ${msg.isUser ? 'ml-60' : 'mr-60'}`}>
                  {!msg.isUser && (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )}
                  <div className={`max-w-2xl ${msg.isUser ? 'rounded-lg px-4 py-3 bg-white border border-gray-200 shadow-sm' : ''}`}>
                    <div className={`text-sm leading-relaxed ${msg.isUser ? 'text-gray-900' : 'text-gray-900'}`}>
                      {msg.content.split('\n').map((line, lineIdx) => {
                        // Check for media placeholder
                        if (line.startsWith('[MEDIA:')) {
                          return (
                            <div key={lineIdx} className="my-3">
                              <img src={`${basePath}/dental-scan.png`} alt="Dental scan" className="w-24 h-24 rounded-lg border border-gray-200 bg-white object-cover" />
                            </div>
                          )
                        }
                        // Parse bold text **text**
                        const parts = line.split(/(\*\*.*?\*\*)/)
                        return (
                          <p key={lineIdx} className="mb-1">
                            {parts.map((part, partIdx) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={partIdx}>{part.slice(2, -2)}</strong>
                              }
                              return <span key={partIdx}>{part}</span>
                            })}
                          </p>
                        )
                      })}
                      {/* Add button if message contains ready to proceed */}
                      {!msg.isUser && msg.content.includes('ready to proceed') && (
                        <button
                          onClick={() => router.push('/finalize')}
                          className="mt-4 px-4 py-2 bg-white border border-gray-300 text-gray-900 text-sm font-medium rounded-md hover:bg-gray-50 shadow-sm"
                        >
                          Proceed to Final Step
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start items-start gap-3 mr-60">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="max-w-4xl mx-auto flex gap-3 bg-white rounded-lg shadow-md border border-gray-200 p-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 text-sm border-0 resize-none focus:outline-none"
                rows={1}
                disabled={isTyping}
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping}
                className="p-2.5 hover:bg-gray-100 rounded disabled:opacity-50"
              >
                <Send className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2.5 hover:bg-gray-100 rounded">
                <Mic className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-96 bg-gray-50 border-l border-gray-200 p-6 flex flex-col overflow-hidden">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col overflow-hidden flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex-shrink-0">Order summary</h2>

            {/* Patient Section */}
            <div className="mb-6 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                {orderData.patient && (
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <h3 className="text-sm font-semibold text-gray-900">{orderData.patient || 'Patient'}</h3>
              </div>
              {orderData.patient && (
                <div className="ml-7">
                  <p className="text-sm text-gray-600">{orderData.patientDOB}</p>
                </div>
              )}
            </div>

            {/* Files */}
            {orderData.files.length > 0 && (
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Files</h3>
                </div>
                <div className="ml-7 space-y-2">
                  {orderData.files.map((file: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img src={`${basePath}/dental-scan.png`} alt={file} className="w-14 h-14 rounded border border-gray-200 bg-white object-cover flex-shrink-0" />
                      <span className="text-sm text-gray-900">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Details - Scrollable */}
            {orderData.procedureType && (
              <div className="mb-6 flex-1 flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Service details</h3>
                </div>
                <div className="ml-7 space-y-3 text-sm overflow-y-auto flex-1">
                  <div>
                    <p className="text-gray-600 mb-0.5">Procedure type</p>
                    <p className="text-gray-900 font-medium">{orderData.procedureType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-0.5">Teeth Location (FDI)</p>
                    <p className="text-gray-900 font-medium">{orderData.teethLocation}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-0.5">Service Provider</p>
                    <p className="text-gray-900 font-medium">Preferred Lab</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-0.5">Service type</p>
                    <p className="text-gray-900 font-medium">{orderData.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-0.5">Production unit</p>
                    <p className="text-gray-900 font-medium">{orderData.productionUnit}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-0.5">Material class</p>
                    <p className="text-gray-900 font-medium">{orderData.material}</p>
                  </div>
                  {orderData.shadeGuide && (
                    <div>
                      <p className="text-gray-600 mb-0.5">Tooth shade guide</p>
                      <p className="text-gray-900 font-medium">{orderData.shadeGuide}</p>
                    </div>
                  )}
                  {orderData.shade && (
                    <div>
                      <p className="text-gray-600 mb-0.5">Tooth shade</p>
                      <p className="text-gray-900 font-medium">{orderData.shade}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Details */}
            {orderData.deliveryDate && (
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Delivery Details</h3>
                </div>
                <div className="ml-7 space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 mb-0.5">Delivery Date & Time</p>
                    <p className="text-gray-900 font-medium">{orderData.deliveryDate}, {orderData.deliveryTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-0.5">Shipping Address</p>
                    <p className="text-gray-900 font-medium">{orderData.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Proceed Button */}
            {isComplete && (
              <button
                onClick={() => router.push('/finalize')}
                className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 flex-shrink-0"
              >
                Proceed to Final Step
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatContent />
    </Suspense>
  )
}
