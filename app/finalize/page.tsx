'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Check, ChevronDown, Calendar, Edit2, Check as CheckIcon, X as XIcon } from 'lucide-react'
import { basePath } from '../config'

export default function FinalizePage() {
  const router = useRouter()
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [deliveryDate, setDeliveryDate] = useState('03/03/2026')
  const [deliveryTime, setDeliveryTime] = useState('15:00')
  const [isEditingRecipient, setIsEditingRecipient] = useState(false)
  const [recipientInfo, setRecipientInfo] = useState({
    name: 'Dental Implantaloogie Labs',
    contact: 'Mr. John Smith',
    street: 'Albisriederstrasse 253',
    city: '8047 Zürich',
    country: 'Switzerland'
  })
  const [tempRecipientInfo, setTempRecipientInfo] = useState(recipientInfo)

  const providers = [
    { id: 'heidelberg', name: 'Heidelberg Labs', type: 'Preferred lab', icon: 'H' },
    { id: 'sun', name: 'Sun Labs', type: 'Preferred lab', icon: 'SL' },
    { id: 'shanghai', name: 'Shanghai Laboratories', type: 'Preferred lab', icon: '🏆' }
  ]

  const handlePlaceOrder = () => {
    alert('Order placed successfully!')
    router.push('/')
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header with Step Indicator */}
      <header className="bg-white border-b border-gray-200">
        <div className="h-14 flex items-center justify-between px-4 relative">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="p-1.5 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <span className="text-sm font-medium text-gray-900 block">New AI-assisted order</span>
              <span className="text-xs text-gray-500">James Smith · 05.22.1985 · ID: 12345678</span>
            </div>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">Create your order</span>
            <div className="h-0.5 bg-blue-600 mx-4 w-20"></div>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">2</span>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-900">Finalize your order</span>
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
        {/* Left Side - Form */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Finalize your order</h1>

            {/* Service Provider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Service provider</h2>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Share patient info with service provider</label>
                  <button
                    className="w-11 h-6 bg-blue-600 rounded-full p-0.5 transition-colors relative"
                  >
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm transform translate-x-5 transition-transform"></div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`p-4 border rounded-lg flex items-center gap-3 transition-all bg-gray-50 ${
                      selectedProvider === provider.id
                        ? 'border-blue-600 border-2 shadow-sm'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-bold text-gray-700">{provider.icon}</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-sm text-gray-900">{provider.name}</p>
                      <p className="text-xs text-gray-500">{provider.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Delivery Details</h2>

              <div className="flex gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <div className="relative w-64">
                    <input
                      type="text"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">Your desired delivery date will be in 6 days</p>
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <div className="relative">
                    <select
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                <div className="p-4 border border-gray-300 rounded-lg bg-white relative">
                  {isEditingRecipient ? (
                    <div className="absolute top-3 right-3 flex gap-1">
                      <button
                        onClick={() => {
                          setRecipientInfo(tempRecipientInfo)
                          setIsEditingRecipient(false)
                        }}
                        className="p-1 hover:bg-green-100 rounded"
                      >
                        <CheckIcon className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => {
                          setTempRecipientInfo(recipientInfo)
                          setIsEditingRecipient(false)
                        }}
                        className="p-1 hover:bg-red-100 rounded"
                      >
                        <XIcon className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setTempRecipientInfo(recipientInfo)
                        setIsEditingRecipient(true)
                      }}
                      className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  )}
                  {isEditingRecipient ? (
                    <div className="space-y-2 pr-16">
                      <input
                        type="text"
                        value={tempRecipientInfo.name}
                        onChange={(e) => setTempRecipientInfo({...tempRecipientInfo, name: e.target.value})}
                        className="w-full px-2 py-1 text-sm font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={tempRecipientInfo.contact}
                        onChange={(e) => setTempRecipientInfo({...tempRecipientInfo, contact: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={tempRecipientInfo.street}
                        onChange={(e) => setTempRecipientInfo({...tempRecipientInfo, street: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={tempRecipientInfo.city}
                        onChange={(e) => setTempRecipientInfo({...tempRecipientInfo, city: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={tempRecipientInfo.country}
                        onChange={(e) => setTempRecipientInfo({...tempRecipientInfo, country: e.target.value})}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <>
                      <p className="font-semibold text-sm text-gray-900 mb-0.5">{recipientInfo.name}</p>
                      <p className="text-sm text-gray-600">{recipientInfo.contact}</p>
                      <p className="text-sm text-gray-600">{recipientInfo.street}</p>
                      <p className="text-sm text-gray-600">{recipientInfo.city}</p>
                      <p className="text-sm text-gray-600">{recipientInfo.country}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Order summary</h3>

              <div className="space-y-3">
                {/* Patient Card */}
                <div className="bg-white border border-gray-300 rounded-lg p-4">
                  <p className="font-medium text-sm text-gray-900 mb-1">Patient</p>
                  <p className="text-sm text-gray-600">James Smith · 05.22.1985 · ID:12345678</p>
                </div>

                {/* Files Card */}
                <div className="bg-white border border-gray-300 rounded-lg p-4">
                  <p className="font-medium text-sm text-gray-900 mb-3">Files</p>
                  <div className="flex items-center gap-3">
                    <img src={`${basePath}/dental-scan.png`} alt="Dental scan" className="w-14 h-14 rounded border border-gray-200 bg-white object-cover flex-shrink-0" />
                    <p className="text-sm text-gray-600">2026_02_28_scan.DI</p>
                  </div>
                </div>

                {/* Restoration Card */}
                <div className="bg-white border border-gray-300 rounded-lg p-4">
                  <p className="font-medium text-sm text-gray-900 mb-2">Restoration</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Crown · 28</p>
                    <p>Position (FDI): 28</p>
                    <p>Service type: Design & manufacturing</p>
                    <p>Production Unit: Milling</p>
                    <p>Material class: Zirconia</p>
                    <p>Tooth shade guide: Vita Classical + Bleached</p>
                    <p>Shade: A3</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => router.push('/chat')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-md shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
        </div>

        {/* Right Side - Two Containers */}
        <div className="w-96 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto flex flex-col gap-6">
          {/* Your Order Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your order</h2>

            <div className="mb-4">
              <p className="font-semibold text-sm text-gray-900 mb-1">Restoration</p>
              <p className="text-sm text-gray-600">Crown · 28</p>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              By placing your order, you are committing to a transaction with your selected third party laboratory. Dentsply Sirona is not assuming any liability for this transaction.
            </p>

            <button
              onClick={handlePlaceOrder}
              disabled={!selectedProvider}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place order
            </button>
          </div>

          {/* Comments Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Comments</h3>
            <textarea
              placeholder="Leave a comment about custom options, etc."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
