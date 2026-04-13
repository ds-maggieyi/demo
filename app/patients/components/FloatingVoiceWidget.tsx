'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Mic, X, Send, Square } from 'lucide-react'
import { basePath } from '../../config'

interface FloatingVoiceWidgetProps {
  patientName?: string
  patientDOB?: string
}

export default function FloatingVoiceWidget({ patientName, patientDOB }: FloatingVoiceWidgetProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')

  const handleToggle = () => {
    if (!isExpanded) {
      setIsExpanded(true)
    } else if (!isRecording && !transcript) {
      setIsExpanded(false)
    }
  }

  const handleRecord = () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      // Simulate recording and transcription
      setTimeout(() => {
        setTranscript("Patient presents with discomfort in the upper right quadrant. Reports sensitivity to cold beverages for the past week. No visible swelling or redness observed during examination.")
        setIsRecording(false)
      }, 3000)
    }
  }

  const handleSend = () => {
    // Navigate to AI Note with pre-filled data
    const params = new URLSearchParams()
    params.set('transcript', transcript)
    if (patientName) {
      params.set('patient', patientName)
      if (patientDOB) {
        params.set('dob', patientDOB)
      }
    }

    router.push(`${basePath}/ai-note?${params.toString()}`)
  }

  const handleCancel = () => {
    setIsExpanded(false)
    setIsRecording(false)
    setTranscript('')
  }

  if (!isExpanded) {
    // Collapsed floating button
    return (
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
      >
        <Mic className="w-6 h-6" />
      </button>
    )
  }

  // Expanded widget
  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-sm font-medium text-gray-900">
            {isRecording ? 'Recording...' : 'Quick Note'}
          </span>
        </div>
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Patient Info */}
      {patientName && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
          <div className="text-xs font-medium text-blue-900">Patient:</div>
          <div className="text-sm text-blue-700">
            {patientName} {patientDOB && `(${patientDOB})`}
          </div>
        </div>
      )}

      {/* Transcript Area */}
      <div className="p-4">
        <div className="min-h-[120px] max-h-[200px] overflow-y-auto">
          {transcript ? (
            <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
          ) : (
            <p className="text-sm text-gray-400 italic">
              Click the microphone to start recording...
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 p-4 border-t border-gray-200">
        <button
          onClick={handleRecord}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              Stop
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Record
            </>
          )}
        </button>
        <button
          onClick={handleSend}
          disabled={!transcript}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
        >
          <Send className="w-4 h-4" />
          Send
        </button>
      </div>
    </div>
  )
}
