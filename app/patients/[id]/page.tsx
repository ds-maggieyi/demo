'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Menu, Bell, HelpCircle, ChevronLeft, Sparkles, ChevronDown, Plus, Upload } from 'lucide-react'
import { basePath } from '../../config'
import FloatingVoiceWidget from '../components/FloatingVoiceWidget'

export default function PatientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const patientId = params.id

  const [activeTab, setActiveTab] = useState('media')

  // Mock patient data
  const patientsData: Record<string, any> = {
    '1': { name: 'John Smith', dob: 'March 15, 1978', cardId: 'JS12345', birthdate: '03/15/1978' },
    '2': { name: 'Mary Johnson', dob: 'July 22, 1985', cardId: 'MJ67890', birthdate: '07/22/1985' },
    '3': { name: 'Robert Williams', dob: 'November 08, 1992', cardId: 'RW11223', birthdate: '11/08/1992' },
    '4': { name: 'Patricia Brown', dob: 'May 30, 1980', cardId: 'PB44556', birthdate: '05/30/1980' },
  }

  const patient = patientsData[patientId as string] || patientsData['1']

  const tabs = [
    { id: 'media', label: 'Media History' },
    { id: 'orders', label: 'Orders' },
    { id: 'collaboration', label: 'Collaboration' },
    { id: 'treatments', label: 'Treatments' },
  ]

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
              <a href={`${basePath}/`} className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-[14px] font-medium">Home</span>
              </a>
              <a href={`${basePath}/patients`} className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-600">
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
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
          <div className="p-6">
            {/* Breadcrumb */}
            <button
              onClick={() => router.push(`${basePath}/patients`)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              Home
            </button>

            {/* Patient Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{patient.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{patient.dob}</span>
                    <span>•</span>
                    <span>ID: {patient.cardId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                    <Sparkles className="w-4 h-4" />
                    Patient assistant
                  </button>
                  <div className="relative">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                      Create
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex items-center px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'media' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <input
                        type="text"
                        placeholder="Search"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Select Media Type</option>
                          <option>X-Ray</option>
                          <option>Photo</option>
                          <option>Scan</option>
                        </select>
                        <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                          By creation date
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                          New to old
                        </button>
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                          <Upload className="w-4 h-4" />
                          Upload media
                        </button>
                      </div>
                    </div>

                    {/* Media Grid Placeholder */}
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-sm">No media files yet</p>
                      <p className="text-xs mt-1">Upload images, x-rays, or scans to get started</p>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">No orders for this patient</p>
                  </div>
                )}

                {activeTab === 'collaboration' && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">No collaboration history</p>
                  </div>
                )}

                {activeTab === 'treatments' && (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-sm">No treatments recorded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Voice Widget with patient context */}
      <FloatingVoiceWidget patientName={patient.name} patientDOB={patient.birthdate} />
    </div>
  )
}
