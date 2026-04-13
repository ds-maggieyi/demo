'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Bell, HelpCircle, Search, Mic, Send, X, ChevronDown, Plus, FileText } from 'lucide-react'
import { basePath } from './config'

export default function Dashboard() {
  const router = useRouter()
  const [aiInput, setAiInput] = useState('')
  const [isAiExpanded, setIsAiExpanded] = useState(true)

  const handleSendMessage = () => {
    if (aiInput.trim()) {
      router.push(`/chat?message=${encodeURIComponent(aiInput)}`)
    }
  }

  return (
    <div className="h-screen bg-[#F5F5F5] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <img src={`${basePath}/ds-core-logo.png`} alt="DS CORE" className="h-6" />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center ml-1">
            <span className="text-white text-xs font-semibold">UN</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <nav className="p-3">
            <div className="space-y-0.5">
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-[14px] font-medium">Home</span>
              </a>
              <a href={`${basePath}/patients`} className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-[14px] font-medium">Patients</span>
              </a>
              <a href={`${basePath}/orders`} className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-[14px] font-medium">Orders</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-[14px] font-medium">Collaboration</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-[14px] font-medium">Treatments</span>
              </a>
              <a href={`${basePath}/ai-note`} className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <FileText className="w-5 h-5" />
                <span className="text-[14px] font-medium">AI Note</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-[14px] font-medium">Jobs</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-[14px] font-medium">Files</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-[14px] font-medium">Equipment</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[#F5F5F5]">
          <div className="p-6 space-y-6">
            {/* Header Section with AI Assistant and New buttons */}
            {!isAiExpanded && (
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome, Dr. Ada</h1>
                  <p className="text-sm text-gray-600">Welcome to the dashboard of your DS CORE account.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAiExpanded(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm"
                  >
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">AI assistant</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm">
                    <span className="text-sm font-medium">New</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* AI Input Card */}
            {isAiExpanded && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Gradient top border */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 via-orange-500 to-yellow-400"></div>

                <div className="p-6 relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setIsAiExpanded(false)}
                    className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>

                  {/* Header */}
                  <div className="mb-6 pr-10">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <h1 className="text-xl font-bold text-gray-900">Welcome, Dr. Ada</h1>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">How can I help you today?</p>
                  </div>

                {/* Input Area */}
                <div className="border border-gray-300 rounded-lg p-4">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Try the prompt: I need a zr crown for James Smith on tooth 28, see the latest DI Scan"
                    className="w-full text-sm focus:outline-none mb-3 placeholder:italic"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button className="px-2.5 py-1 text-xs bg-gray-200 text-gray-700 font-semibold rounded-full">
                        Create an order
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Mic className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <Send className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  The assistant does not provide medical advice or treatment recommendations.
                </p>
              </div>
            </div>
            )}

            {/* Bottom 4 Cards Row */}
            <div className={`grid grid-cols-4 gap-6 ${!isAiExpanded ? 'h-[calc(100vh-240px)]' : ''}`}>
              {/* Patients Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col overflow-hidden">
                <h2 className="text-base font-bold text-gray-900 mb-4 flex-shrink-0">Patients (57)</h2>
                <div className="mb-4 flex-shrink-0">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-3 overflow-y-auto flex-1">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Briant, Holly</p>
                    <p className="text-xs text-gray-500">Jan 27, 1970</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Cooper, Paige</p>
                    <p className="text-xs text-gray-500">Mar 21, 2016</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">DeMol, John</p>
                    <p className="text-xs text-gray-500">Sep 10, 1999</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Müller, Hans</p>
                    <p className="text-xs text-gray-500">May 5, 1963</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Russel, Effion</p>
                    <p className="text-xs text-gray-500">Feb 21, 2006</p>
                  </div>
                  {!isAiExpanded && (
                    <>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Roe, Jane</p>
                        <p className="text-xs text-gray-500">May 5, 1970</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Smith, James</p>
                        <p className="text-xs text-gray-500">May 22, 1985</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Johnson, Mary</p>
                        <p className="text-xs text-gray-500">Jul 14, 1992</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Williams, Robert</p>
                        <p className="text-xs text-gray-500">Nov 8, 1978</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* All Orders Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h2 className="text-base font-bold text-gray-900">All orders (57)</h2>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4 overflow-y-auto flex-1">
                  <div className="text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">2AA009KP</p>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">Declined</span>
                    </div>
                    <p className="text-xs text-gray-600">Nightguard / Splint</p>
                    <p className="text-xs text-gray-500">Ordered on: May 3, 2023</p>
                    <p className="text-xs text-gray-500">Patient: Briant, Holly</p>
                    <p className="text-xs text-gray-500">Owner: Dr. Ada, Angelina</p>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">2AA00AC3</p>
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-medium rounded">Canceled</span>
                    </div>
                    <p className="text-xs text-gray-600">CEREC Guide</p>
                    <p className="text-xs text-gray-500">Ordered on: May 3, 2023</p>
                    <p className="text-xs text-gray-500">Patient: Briant, Holly</p>
                    <p className="text-xs text-gray-500">Owner: Dr. Ada, Angelina</p>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">2AA00AC2</p>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">Requested</span>
                    </div>
                    <p className="text-xs text-gray-600">CEREC Guide</p>
                    <p className="text-xs text-gray-500">Ordered on: May 3, 2023</p>
                    <p className="text-xs text-gray-500">Patient: Briant, Holly</p>
                    <p className="text-xs text-gray-500">Owner: Dr. Ada, Angelina</p>
                  </div>
                  {!isAiExpanded && (
                    <>
                      <div className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900">2AA009XU</p>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">Completed</span>
                        </div>
                        <p className="text-xs text-gray-600">Temporary Restoration</p>
                        <p className="text-xs text-gray-500">Ordered on: May 10, 2023</p>
                        <p className="text-xs text-gray-500">Patient: Smith, James</p>
                        <p className="text-xs text-gray-500">Owner: Dr. Ada, Angelina</p>
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900">2AA008LJ</p>
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">Requested</span>
                        </div>
                        <p className="text-xs text-gray-600">Custom Abutment</p>
                        <p className="text-xs text-gray-500">Ordered on: Apr 4, 2023</p>
                        <p className="text-xs text-gray-500">Patient: Johnson, Mary</p>
                        <p className="text-xs text-gray-500">Owner: Dr. Ada, Angelina</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Collaboration Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h2 className="text-base font-bold text-gray-900">Collaboration</h2>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4 overflow-y-auto flex-1">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-1">Share of Endo, Tim</p>
                    <p className="text-xs text-gray-500">From with Dr. Ada, Angelina</p>
                    <p className="text-xs text-gray-500">19 days left</p>
                    <p className="text-xs text-gray-600 mt-1">Received</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-1">Share of Holly, Briant</p>
                    <p className="text-xs text-gray-500">Shared with Dr. Ada, Angelina</p>
                    <p className="text-xs text-gray-500">21 days left</p>
                    <p className="text-xs text-gray-600 mt-1">Sent</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-1">Share of Endo, Tim</p>
                    <p className="text-xs text-gray-500">Shared with Dr. Ada, Angelina</p>
                    <p className="text-xs text-gray-500">19 days left</p>
                    <p className="text-xs text-gray-600 mt-1">Received</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-1">Share of Holly, Briant</p>
                    <p className="text-xs text-gray-500">Shared with Dr. Ada, Angelina</p>
                    <p className="text-xs text-gray-500">21 days left</p>
                    <p className="text-xs text-gray-600 mt-1">Sent</p>
                  </div>
                  {!isAiExpanded && (
                    <>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 mb-1">Share of Smith, James</p>
                        <p className="text-xs text-gray-500">Shared with Dr. Ada, Angelina</p>
                        <p className="text-xs text-gray-500">15 days left</p>
                        <p className="text-xs text-gray-600 mt-1">Sent</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 mb-1">Share of Johnson, Mary</p>
                        <p className="text-xs text-gray-500">From with Dr. Ada, Angelina</p>
                        <p className="text-xs text-gray-500">25 days left</p>
                        <p className="text-xs text-gray-600 mt-1">Received</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Treatments Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h2 className="text-base font-bold text-gray-900">Treatments</h2>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4 overflow-y-auto flex-1">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-1">AA0204</p>
                    <p className="text-xs text-gray-600">Treatment name</p>
                    <p className="text-xs text-gray-500">Created on: May 3, 2023</p>
                    <p className="text-xs text-gray-500">Patient: Briant, Holly</p>
                    <p className="text-xs text-gray-500">Owner: Dr. Ada, Angelina</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-1">AA0205</p>
                    <p className="text-xs text-gray-600">Treatment name</p>
                    <p className="text-xs text-gray-500">Created on: May 3, 2023</p>
                    <p className="text-xs text-gray-500">Patient: Briant, Holly</p>
                    <p className="text-xs text-gray-500">Owner: Dr. Ada, Angelina</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-1">AA0206</p>
                    <p className="text-xs text-gray-600">Treatment name</p>
                    <p className="text-xs text-gray-500">Created on: May 3, 2023</p>
                    <p className="text-xs text-gray-500">Patient: Briant, Holly</p>
                    <p className="text-xs text-gray-500">Owner: Dr. Ada, Angelina</p>
                  </div>
                  {!isAiExpanded && (
                    <>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 mb-1">AA0207</p>
                        <p className="text-xs text-gray-600">Treatment name</p>
                        <p className="text-xs text-gray-500">Created on: May 10, 2023</p>
                        <p className="text-xs text-gray-500">Patient: Smith, James</p>
                        <p className="text-xs text-gray-500">Owner: Dr. Ada, Angelina</p>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 mb-1">AA0208</p>
                        <p className="text-xs text-gray-600">Treatment name</p>
                        <p className="text-xs text-gray-500">Created on: Apr 15, 2023</p>
                        <p className="text-xs text-gray-500">Patient: Johnson, Mary</p>
                        <p className="text-xs text-gray-500">Owner: Dr. Ada, Angelina</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
