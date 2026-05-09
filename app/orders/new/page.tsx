'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Edit2, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import { basePath } from '../../config'

export default function NewOrderPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [selectedLab, setSelectedLab] = useState('preferred')
  const [selectedService, setSelectedService] = useState<any>(null)
  const [serviceProvider, setServiceProvider] = useState('Preferred Lab')
  const [procedureType, setProcedureType] = useState('')
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([])
  const [applyToAllCrowns, setApplyToAllCrowns] = useState(true)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [crownDetails, setCrownDetails] = useState<any>({})
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [comments, setComments] = useState('')
  const [diScanFile, setDiScanFile] = useState<string | null>('DI_2019-03-05_09-57-06.dxd')
  const [optionalFile, setOptionalFile] = useState<string | null>(null)
  const [selectedFinalProvider, setSelectedFinalProvider] = useState<string | null>(null)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('12:00')
  const [sharePatientInfo, setSharePatientInfo] = useState(true)
  const [isEditingRecipient, setIsEditingRecipient] = useState(false)
  const [recipientInfo, setRecipientInfo] = useState({
    name: 'Dental Implantaloogie Labs',
    contact: 'Mr. John Smith',
    street: 'Albisriederstrasse 253',
    city: '8047 Zürich',
    country: 'Switzerland'
  })
  const [tempRecipientInfo, setTempRecipientInfo] = useState(recipientInfo)
  const [showAIOnboarding, setShowAIOnboarding] = useState(true)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [chatInput, setChatInput] = useState('')
  const [aiFilledFields, setAiFilledFields] = useState<{[key: string]: boolean}>({})
  const [showResetModal, setShowResetModal] = useState(false)
  const [waitingForFile, setWaitingForFile] = useState(false)
  const [missingFields, setMissingFields] = useState<{[key: string]: boolean}>({})
  const [aiIsTyping, setAiIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [scenarioState, setScenarioState] = useState<{
    scenario: number | null
    step: number
    accumulatedData: any
  }>({ scenario: null, step: 0, accumulatedData: {} })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [chatInput])

  // Sample patients
  const patients = [
    { id: 1, name: 'Anderson, Emily', birthdate: '15.03.1985', patientId: 'EA12345' },
    { id: 2, name: 'Brooks, Michael', birthdate: '22.07.1978', patientId: 'BM67890' },
    { id: 3, name: 'Chen, Sarah', birthdate: '08.11.1992', patientId: 'CS54321' },
    { id: 4, name: 'Davis, Robert', birthdate: '30.05.1980', patientId: 'DR11223' },
    { id: 5, name: 'Evans, Jessica', birthdate: '14.09.1988', patientId: 'EJ98765' },
    { id: 6, name: 'Foster, David', birthdate: '28.01.1975', patientId: 'FD44556' },
    { id: 7, name: 'Garcia, Maria', birthdate: '13.05.1990', patientId: 'GM33221' },
    { id: 8, name: 'Henderson, James', birthdate: '07.12.1983', patientId: 'HJ77889' },
    { id: 9, name: 'Ibrahim, Aisha', birthdate: '25.04.1995', patientId: 'IA22334' }
  ]

  // Dental services
  const services = [
    { id: 'restoration', name: 'Restoration', color: 'from-amber-100 to-amber-200' },
    { id: 'nightguard', name: 'Nightguard / Splint', color: 'from-gray-100 to-gray-200' },
    { id: 'custom-abutment', name: 'Custom abutment', color: 'from-slate-100 to-slate-200' },
    { id: 'implant-bridge', name: 'Implant bridge', color: 'from-rose-100 to-rose-200' },
    { id: 'solid-working-model', name: 'Solid working model', color: 'from-yellow-100 to-yellow-200' },
    { id: 'partial-framework', name: 'Partial framework', color: 'from-gray-200 to-gray-300' },
    { id: 'full-denture', name: 'Full denture', color: 'from-pink-100 to-pink-200' },
    { id: 'partial-denture', name: 'Partial denture', color: 'from-red-100 to-red-200' },
    { id: 'custom-impression-tray', name: 'Custom impression tray', color: 'from-blue-100 to-blue-200' },
    { id: 'model-thermoforming', name: 'Model for thermoforming', color: 'from-cyan-100 to-cyan-200' },
    { id: 'implant-planning', name: 'Implant Planning / Surgical Guide', color: 'from-orange-100 to-orange-200' },
    { id: 'cerec-guide', name: 'CEREC Guide', color: 'from-indigo-100 to-indigo-200' },
    { id: 'custom-order', name: 'Custom Order', color: 'from-sky-100 to-sky-200' }
  ]

  const labTabs = [
    { id: 'preferred', name: 'Preferred Lab' },
    { id: 'ds-core', name: 'DS Core Create' },
    { id: 'suresmile', name: 'SureSmile®' },
    { id: 'simplant', name: 'Simplant®' },
    { id: 'atlantis', name: 'Atlantis®' }
  ]

  // AI Parser Function
  const parseAIInput = (input: string) => {
    const lowerInput = input.toLowerCase()
    const extracted: any = {}

    // Extract patient name
    const patientNames = ['sarah chen', 'john martinez', 'maria garcia', 'kim, hannah', 'emily johnson', 'michael brown']
    patientNames.forEach(name => {
      if (lowerInput.includes(name.toLowerCase())) {
        extracted.patientName = name
      }
    })

    // Extract tooth number
    const toothMatch = lowerInput.match(/tooth (\d{1,2})/)
    if (toothMatch) {
      extracted.tooth = parseInt(toothMatch[1])
    } else {
      const numberMatch = lowerInput.match(/on (\d{1,2})/)
      if (numberMatch) {
        extracted.tooth = parseInt(numberMatch[1])
      } else {
        // Also match bare numbers (e.g., just "23" or "12")
        const bareNumberMatch = input.match(/\b(\d{1,2})\b/)
        if (bareNumberMatch) {
          const num = parseInt(bareNumberMatch[1])
          // Valid FDI tooth numbers are 11-18, 21-28, 31-38, 41-48
          if ((num >= 11 && num <= 18) || (num >= 21 && num <= 28) ||
              (num >= 31 && num <= 38) || (num >= 41 && num <= 48)) {
            extracted.tooth = num
          }
        }
      }
    }

    // Extract procedure type
    if (lowerInput.includes('crown')) extracted.procedureType = 'Crown'
    else if (lowerInput.includes('bridge')) extracted.procedureType = 'Bridge'
    else if (lowerInput.includes('veneer')) extracted.procedureType = 'Veneer'
    else if (lowerInput.includes('inlay')) extracted.procedureType = 'Inlay'
    else if (lowerInput.includes('onlay')) extracted.procedureType = 'Onlay'

    // Extract material
    if (lowerInput.includes('zirconia') || lowerInput.includes('zirconium')) {
      extracted.material = 'Zirconium oxide'
    } else if (lowerInput.includes('lithium disilicate')) {
      extracted.material = 'Lithium disilicate'
    } else if (lowerInput.includes('glass ceramic')) {
      extracted.material = 'Glass ceramic'
    }

    // Extract shade
    const shadeMatch = lowerInput.match(/vita (\w\d\.?\d?)/)
    if (shadeMatch) {
      extracted.shade = shadeMatch[1].toUpperCase()
    } else {
      const simpleShadeMatch = lowerInput.match(/\b([abcd]\d\.?\d?)\b/)
      if (simpleShadeMatch) {
        extracted.shade = simpleShadeMatch[1].toUpperCase()
      }
    }

    // Extract service type
    if (lowerInput.includes('design and manufacturing') || lowerInput.includes('design & manufacturing')) {
      extracted.serviceType = 'Design & manufacturing'
    } else if (lowerInput.includes('design only')) {
      extracted.serviceType = 'Design'
    } else if (lowerInput.includes('manufacturing only') || lowerInput.includes('milling only')) {
      extracted.serviceType = 'Manufacturing'
    }

    // Extract production unit
    if (lowerInput.includes('milling')) {
      extracted.productionUnit = 'Milling'
    } else if (lowerInput.includes('printing')) {
      extracted.productionUnit = 'Printing'
    }

    // Extract lab preference
    if (lowerInput.includes('preferred lab')) {
      extracted.lab = 'Preferred Lab'
    } else if (lowerInput.includes('ds core')) {
      extracted.lab = 'DS Core Create'
    }

    // Check for file mention
    if (lowerInput.includes('scan') || lowerInput.includes('di scan') || lowerInput.includes('attach') || lowerInput.includes('file')) {
      extracted.hasFileMention = true
    }

    // AI INFERENCE: If procedure type mentioned but no service type, infer "Design & manufacturing"
    if (extracted.procedureType && !extracted.serviceType) {
      extracted.serviceType = 'Design & manufacturing'
      extracted.inferredServiceType = true
    }

    // AI INFERENCE: If Zirconium oxide mentioned but no production unit, infer "Milling"
    if (extracted.material === 'Zirconium oxide' && !extracted.productionUnit) {
      extracted.productionUnit = 'Milling'
      extracted.inferredProductionUnit = true
    }

    // AI INFERENCE: If Lithium disilicate mentioned but no production unit, infer "Milling"
    if (extracted.material === 'Lithium disilicate' && !extracted.productionUnit) {
      extracted.productionUnit = 'Milling'
      extracted.inferredProductionUnit = true
    }

    return extracted
  }

  // Auto-fill extracted data and route (HARD-CODED DEMO SCENARIOS)
  const handleAIInput = (userInput: string) => {
    const lowerInput = userInput.toLowerCase()
    const extracted = parseAIInput(userInput)
    const newAiFields: {[key: string]: boolean} = {}
    let aiResponse = ''
    let targetStep = currentStep
    const newMissingFields: {[key: string]: boolean} = {}

    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: userInput }])

    // Merge accumulated data with newly extracted data
    const accData = { ...scenarioState.accumulatedData }
    if (extracted.patientName) accData.patientName = extracted.patientName
    if (extracted.tooth) accData.tooth = extracted.tooth
    if (extracted.procedureType) accData.procedureType = extracted.procedureType
    if (extracted.material) accData.material = extracted.material
    if (extracted.shade) accData.shade = extracted.shade
    if (extracted.hasFileMention) accData.hasFileMention = true

    // SCENARIO 1: User fills in almost everything (complete info on first input)
    // Pattern: "zirconia crown on tooth 28 for Sarah Chen, A3, attach her latest DI scan"
    if (scenarioState.scenario === null && extracted.patientName && extracted.tooth && extracted.procedureType && extracted.material && extracted.shade && extracted.hasFileMention) {
      // Apply all extracted data
      const foundPatient = patients.find(p => {
        const patientNameLower = p.name.toLowerCase()
        const searchNameLower = extracted.patientName.toLowerCase()
        return patientNameLower.includes(searchNameLower) ||
               searchNameLower.split(' ').reverse().join(', ').toLowerCase() === patientNameLower ||
               searchNameLower.split(' ').every(part => patientNameLower.includes(part))
      })
      if (foundPatient) {
        setSelectedPatient(foundPatient)
        newAiFields['patient'] = true
      }

      const restorationService = services.find(s => s.id === 'restoration')
      setSelectedService(restorationService)
      newAiFields['service'] = true
      setProcedureType(extracted.procedureType)
      newAiFields['procedureType'] = true
      setSelectedTeeth([extracted.tooth])
      newAiFields['tooth'] = true

      const toothDetails: any = {
        procedureType: extracted.procedureType,
        serviceType: 'Design & manufacturing',
        productionUnit: 'Milling',
        materialClass: extracted.material,
        shadeGuide: 'VITA Classical + Bleached',
        shade: extracted.shade
      }
      setCrownDetails({ [extracted.tooth]: toothDetails })
      newAiFields['material'] = true
      newAiFields['shade'] = true
      newAiFields['serviceType'] = true
      newAiFields['productionUnit'] = true
      newAiFields['shadeGuide'] = true

      setDiScanFile('DI_2019-03-05_09-57-06.dxd')
      newAiFields['diScanFile'] = true
      setServiceProvider('Preferred Lab')
      newAiFields['labPreference'] = true

      aiResponse = `Okay I have captured all info, and I am taking you to the final confirmation page… you can review and finalize your order there`
      targetStep = 5
      newMissingFields['deliveryDate'] = true
      newMissingFields['finalProvider'] = true

      setScenarioState({ scenario: 1, step: 1, accumulatedData: accData })
    }
    // SCENARIO 2: Missing patient name (multi-turn)
    // Turn 1: "Need a zirconia crown on tooth 14, shade A2"
    else if (scenarioState.scenario === null && !extracted.patientName && extracted.tooth && extracted.procedureType && extracted.shade) {
      // Store extracted data
      const restorationService = services.find(s => s.id === 'restoration')
      setSelectedService(restorationService)
      newAiFields['service'] = true
      setProcedureType(extracted.procedureType)
      newAiFields['procedureType'] = true
      setSelectedTeeth([extracted.tooth])
      newAiFields['tooth'] = true

      const toothDetails: any = {
        procedureType: extracted.procedureType,
        serviceType: 'Design & manufacturing',
        productionUnit: 'Milling',
        materialClass: extracted.material || 'Zirconium oxide',
        shadeGuide: 'VITA Classical + Bleached',
        shade: extracted.shade
      }
      setCrownDetails({ [extracted.tooth]: toothDetails })
      if (extracted.material) newAiFields['material'] = true
      newAiFields['shade'] = true
      newAiFields['serviceType'] = true
      newAiFields['productionUnit'] = true
      newAiFields['shadeGuide'] = true
      setServiceProvider('Preferred Lab')
      newAiFields['labPreference'] = true

      aiResponse = `Okay sure but first, can you please tell me which patient it is for?\n\n💡 Tip: You can also select the patient on the right hand side.`
      targetStep = 1
      newMissingFields['patient'] = true

      setScenarioState({ scenario: 2, step: 1, accumulatedData: accData })
    }
    // Turn 2: Patient selected - "I've selected the patient" or user typed patient name
    else if (scenarioState.scenario === 2 && scenarioState.step === 1) {
      let foundPatient = selectedPatient

      // If user typed a patient name, extract and set it
      if (extracted.patientName) {
        foundPatient = patients.find(p => {
          const patientNameLower = p.name.toLowerCase()
          const searchNameLower = extracted.patientName.toLowerCase()
          return patientNameLower.includes(searchNameLower) ||
                 searchNameLower.split(' ').reverse().join(', ').toLowerCase() === patientNameLower ||
                 searchNameLower.split(' ').every(part => patientNameLower.includes(part))
        })
        if (foundPatient) {
          setSelectedPatient(foundPatient)
          newAiFields['patient'] = true
        }
      }
      // If user said "I've selected the patient", use the already selected patient
      // (selectedPatient was set when they clicked on the patient list)

      // Format patient name for display (convert "LastName, FirstName" to "FirstName LastName")
      let patientDisplayName = 'the patient'
      if (foundPatient?.name) {
        const nameParts = foundPatient.name.split(', ')
        if (nameParts.length === 2) {
          patientDisplayName = `${nameParts[1]} ${nameParts[0]}`
        } else {
          patientDisplayName = foundPatient.name
        }
      }

      // Same response and action for both typed name and manual selection
      aiResponse = `Okay I have not found any media file for ${patientDisplayName}, can you please upload your media file on the right hand side?`
      targetStep = 4
      newMissingFields['diScanFile'] = true

      setScenarioState({ scenario: 2, step: 2, accumulatedData: { ...accData, patientName: foundPatient?.name } })
    }
    // Turn 3: File uploaded - "I've uploaded the scan"
    else if (scenarioState.scenario === 2 && scenarioState.step === 2 && lowerInput.includes("uploaded")) {
      setDiScanFile('DI_2019-03-05_09-57-06.dxd')
      newAiFields['diScanFile'] = true

      aiResponse = `Okay I have captured all info, and I am taking you to the final confirmation page… you can review and finalize your order there`
      targetStep = 5
      newMissingFields['deliveryDate'] = true
      newMissingFields['finalProvider'] = true

      setScenarioState({ scenario: 2, step: 3, accumulatedData: { ...accData, hasFileMention: true } })
    }
    // SCENARIO 3: Missing tooth number (multi-turn)
    // Turn 1: "I need a crown for Sarah Chen, see her latest DI scan"
    else if (scenarioState.scenario === null && extracted.patientName && extracted.procedureType && extracted.hasFileMention && !extracted.tooth) {
      // Set patient
      const foundPatient = patients.find(p => {
        const patientNameLower = p.name.toLowerCase()
        const searchNameLower = extracted.patientName.toLowerCase()
        return patientNameLower.includes(searchNameLower) ||
               searchNameLower.split(' ').reverse().join(', ').toLowerCase() === patientNameLower ||
               searchNameLower.split(' ').every(part => patientNameLower.includes(part))
      })
      if (foundPatient) {
        setSelectedPatient(foundPatient)
        newAiFields['patient'] = true
      }

      const restorationService = services.find(s => s.id === 'restoration')
      setSelectedService(restorationService)
      newAiFields['service'] = true
      setProcedureType(extracted.procedureType)
      newAiFields['procedureType'] = true
      setDiScanFile('DI_2019-03-05_09-57-06.dxd')
      newAiFields['diScanFile'] = true
      setServiceProvider('Preferred Lab')
      newAiFields['labPreference'] = true

      aiResponse = `Okay sure, can you please tell me which tooth this is for?`
      targetStep = 3

      setScenarioState({ scenario: 3, step: 1, accumulatedData: accData })
    }
    // Turn 2: Tooth provided - "Tooth 23"
    else if (scenarioState.scenario === 3 && scenarioState.step === 1 && extracted.tooth) {
      setSelectedTeeth([extracted.tooth])
      newAiFields['tooth'] = true

      const toothDetails: any = {
        procedureType: scenarioState.accumulatedData.procedureType || 'Crown',
        serviceType: 'Design & manufacturing',
        productionUnit: 'Milling',
        materialClass: 'Zirconium oxide',
        shadeGuide: 'VITA Classical + Bleached',
        shade: 'A2'
      }
      setCrownDetails({ [extracted.tooth]: toothDetails })
      newAiFields['material'] = true
      newAiFields['shade'] = true
      newAiFields['serviceType'] = true
      newAiFields['productionUnit'] = true
      newAiFields['shadeGuide'] = true

      aiResponse = `Okay I have captured all info, and I am taking you to the final confirmation page… you can review and finalize your order there`
      targetStep = 5
      newMissingFields['deliveryDate'] = true
      newMissingFields['finalProvider'] = true

      setScenarioState({ scenario: 3, step: 2, accumulatedData: { ...accData, tooth: extracted.tooth } })
    }
    // Default: Initial greeting
    else {
      aiResponse = `I can help you create an order. Please tell me what you need, for example:\n\n"Zirconia crown on tooth 28 for Sarah Chen, shade A3, attach her latest DI scan"\n\nor provide details like patient name, procedure type, and tooth number.`
      targetStep = 1
    }

    setAiFilledFields(prev => ({ ...prev, ...newAiFields }))

    // Show typing indicator
    setAiIsTyping(true)

    // Add AI response with 5 second delay
    setTimeout(() => {
      setAiIsTyping(false)
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
      // Set missing fields AFTER AI responds
      setMissingFields(newMissingFields)
      if (targetStep !== currentStep) {
        // Step transition with 2 second delay after AI responds
        setTimeout(() => setCurrentStep(targetStep), 2000)
      }
    }, 5000)

    setChatInput('')
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      // Place order
      alert('Order placed successfully!')
      router.push('/orders')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleResetConversation = () => {
    // Reset all state to initial values
    setCurrentStep(1)
    setSelectedPatient(null)
    setSelectedLab('preferred')
    setSelectedService(null)
    setServiceProvider('Preferred Lab')
    setProcedureType('')
    setSelectedTeeth([])
    setApplyToAllCrowns(true)
    setShowAdvancedOptions(false)
    setCrownDetails({})
    setUploadedFiles([])
    setComments('')
    setDiScanFile(null)
    setOptionalFile(null)
    setSelectedFinalProvider(null)
    setDeliveryDate('')
    setDeliveryTime('12:00')
    setSharePatientInfo(true)
    setChatMessages([])
    setChatInput('')
    setAiFilledFields({})
    setMissingFields({})
    setWaitingForFile(false)
    setAiIsTyping(false)
    setIsRecording(false)
    setScenarioState({ scenario: null, step: 0, accumulatedData: {} })
    setShowResetModal(false)
  }

  // AI Icon Component - small lightning icon for AI-filled elements
  const AIIcon = () => (
    <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: 'Select a patient' },
      { number: 2, label: 'Select service' },
      { number: 3, label: selectedService?.name || 'Define service' },
      { number: 4, label: 'Upload files' },
      { number: 5, label: 'Confirm' }
    ]

    return (
      <div className="flex items-end gap-1">
        {steps.map((step) => {
          // Current step: extended bar
          // Completed steps (before current): short bar
          // Future steps (after current): short bar
          const isCurrent = step.number === currentStep
          const isCompleted = step.number < currentStep
          const barWidth = isCurrent ? 'w-40' : 'w-12'
          const barColor = (isCurrent || isCompleted) ? 'bg-blue-600' : 'bg-gray-300'

          return (
            <div key={step.number} className="flex flex-col items-center">
              {/* Step number and label above the bar */}
              <div className="flex items-center gap-2 mb-2 h-6">
                <span className={`text-sm font-semibold ${
                  isCurrent ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.number}
                </span>
                {isCurrent && (
                  <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{step.label}</span>
                )}
              </div>

              {/* Progress bar segment */}
              <div className={`h-1 transition-all ${barColor} ${barWidth}`} />
            </div>
          )
        })}
      </div>
    )
  }

  const renderStep1 = () => (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Select a patient</h2>
        {missingFields['patient'] && (
          <span className="text-sm text-red-600 font-medium">⚠ Please select a patient</span>
        )}
      </div>

      {/* Search bar and New patient button */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search patient"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          New patient
        </button>
      </div>

      {/* Patient table */}
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3"></th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Patient name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Card ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Birthdate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {patients.map((patient) => (
              <tr
                key={patient.id}
                onClick={() => {
                  setSelectedPatient(patient)
                  // Remove AI indicator when user manually selects
                  setAiFilledFields(prev => ({ ...prev, patient: false }))
                  // Remove missing field indicator
                  setMissingFields(prev => ({ ...prev, patient: false }))
                }}
                className={`cursor-pointer transition-colors ${
                  selectedPatient?.id === patient.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="radio"
                    checked={selectedPatient?.id === patient.id}
                    onChange={() => {
                      setSelectedPatient(patient)
                      // Remove AI indicator when user manually selects
                      setAiFilledFields(prev => ({ ...prev, patient: false }))
                      // Remove missing field indicator
                      setMissingFields(prev => ({ ...prev, patient: false }))
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{patient.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{patient.patientId}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{patient.birthdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const getServiceIcon = (serviceId: string) => {
    switch(serviceId) {
      case 'restoration':
        // Crown/tooth restoration
        return (
          <svg className="w-20 h-20 text-amber-700" viewBox="0 0 100 100" fill="none">
            {/* Crown top */}
            <path d="M50 20L35 30L50 35L65 30L50 20Z" fill="currentColor" opacity="0.4"/>
            {/* Tooth body */}
            <path d="M35 30C35 30 32 35 32 45C32 55 35 65 40 72C43 77 47 82 50 85C53 82 57 77 60 72C65 65 68 55 68 45C68 35 65 30 65 30L50 35L35 30Z" fill="currentColor"/>
            {/* Crown shine */}
            <ellipse cx="45" cy="40" rx="8" ry="12" fill="white" opacity="0.2"/>
          </svg>
        )
      case 'nightguard':
        // Mouthguard/splint
        return (
          <svg className="w-20 h-20 text-gray-600" viewBox="0 0 100 100" fill="none">
            {/* Upper guard */}
            <path d="M20 40C20 35 25 30 30 30H70C75 30 80 35 80 40C80 42 79 44 78 45H22C21 44 20 42 20 40Z" fill="currentColor" opacity="0.3"/>
            {/* Teeth impressions */}
            <rect x="28" y="42" width="5" height="8" rx="2" fill="currentColor"/>
            <rect x="36" y="42" width="5" height="10" rx="2" fill="currentColor"/>
            <rect x="44" y="42" width="5" height="8" rx="2" fill="currentColor"/>
            <rect x="52" y="42" width="5" height="10" rx="2" fill="currentColor"/>
            <rect x="60" y="42" width="5" height="8" rx="2" fill="currentColor"/>
            <rect x="68" y="42" width="5" height="8" rx="2" fill="currentColor"/>
            {/* Guard base */}
            <path d="M25 45C25 45 23 50 23 55C23 58 25 60 30 62H70C75 60 77 58 77 55C77 50 75 45 75 45H25Z" fill="currentColor"/>
          </svg>
        )
      case 'custom-abutment':
        // Implant abutment
        return (
          <svg className="w-20 h-20 text-slate-600" viewBox="0 0 100 100" fill="none">
            {/* Screw head */}
            <circle cx="50" cy="28" r="6" fill="currentColor"/>
            <circle cx="50" cy="28" r="3" fill="white" opacity="0.3"/>
            {/* Abutment body */}
            <path d="M45 34L42 45L42 60C42 65 45 68 50 68C55 68 58 65 58 60V45L55 34H45Z" fill="currentColor"/>
            {/* Thread lines */}
            <line x1="42" y1="48" x2="58" y2="48" stroke="white" strokeWidth="1" opacity="0.2"/>
            <line x1="42" y1="54" x2="58" y2="54" stroke="white" strokeWidth="1" opacity="0.2"/>
            {/* Gum line indicator */}
            <ellipse cx="50" cy="68" rx="10" ry="3" fill="currentColor" opacity="0.3"/>
          </svg>
        )
      case 'implant-bridge':
        // Dental bridge with 3 crowns
        return (
          <svg className="w-20 h-20 text-rose-600" viewBox="0 0 100 100" fill="none">
            {/* Bridge connector */}
            <rect x="22" y="35" width="56" height="8" rx="2" fill="currentColor"/>
            {/* Left tooth */}
            <path d="M25 43C25 43 22 48 22 55C22 62 25 68 28 72C30 75 32 78 34 80C36 78 38 75 40 72C43 68 46 62 46 55C46 48 43 43 43 43H25Z" fill="currentColor" opacity="0.7"/>
            {/* Middle pontic */}
            <path d="M43 43C43 43 40 48 40 55C40 62 43 68 46 72C48 75 50 78 52 80C54 78 56 75 58 72C61 68 64 62 64 55C64 48 61 43 61 43H43Z" fill="currentColor"/>
            {/* Right tooth */}
            <path d="M61 43C61 43 58 48 58 55C58 62 61 68 64 72C66 75 68 78 70 80C72 78 74 75 76 72C79 68 82 62 82 55C82 48 79 43 79 43H61Z" fill="currentColor" opacity="0.7"/>
          </svg>
        )
      case 'solid-working-model':
        // Dental arch model
        return (
          <svg className="w-20 h-20 text-yellow-700" viewBox="0 0 100 100" fill="none">
            {/* Base/platform */}
            <ellipse cx="50" cy="75" rx="35" ry="10" fill="currentColor" opacity="0.3"/>
            {/* Arch with teeth */}
            <path d="M20 55C20 48 25 42 32 38C35 36 40 35 50 35C60 35 65 36 68 38C75 42 80 48 80 55V70H20V55Z" fill="currentColor"/>
            {/* Individual teeth bumps */}
            <rect x="28" y="32" width="4" height="6" rx="2" fill="currentColor"/>
            <rect x="36" y="30" width="4" height="8" rx="2" fill="currentColor"/>
            <rect x="44" y="30" width="4" height="8" rx="2" fill="currentColor"/>
            <rect x="52" y="30" width="4" height="8" rx="2" fill="currentColor"/>
            <rect x="60" y="30" width="4" height="8" rx="2" fill="currentColor"/>
            <rect x="68" y="32" width="4" height="6" rx="2" fill="currentColor"/>
          </svg>
        )
      case 'partial-framework':
        // Metal partial denture framework with clasps
        return (
          <svg className="w-20 h-20 text-gray-700" viewBox="0 0 100 100" fill="none">
            {/* Metal bar */}
            <path d="M25 45C25 45 30 40 40 38H60C70 40 75 45 75 45" stroke="currentColor" strokeWidth="3" fill="none"/>
            {/* Left clasp */}
            <path d="M28 45C28 45 25 48 25 52C25 56 28 60 28 60" stroke="currentColor" strokeWidth="2.5" fill="none"/>
            <circle cx="28" cy="60" r="3" fill="currentColor"/>
            {/* Right clasp */}
            <path d="M72 45C72 45 75 48 75 52C75 56 72 60 72 60" stroke="currentColor" strokeWidth="2.5" fill="none"/>
            <circle cx="72" cy="60" r="3" fill="currentColor"/>
            {/* Artificial teeth */}
            <rect x="38" y="48" width="6" height="14" rx="2" fill="currentColor" opacity="0.8"/>
            <rect x="47" y="48" width="6" height="16" rx="2" fill="currentColor" opacity="0.8"/>
            <rect x="56" y="48" width="6" height="14" rx="2" fill="currentColor" opacity="0.8"/>
          </svg>
        )
      case 'full-denture':
        // Complete denture with full set of teeth
        return (
          <svg className="w-20 h-20 text-pink-600" viewBox="0 0 100 100" fill="none">
            {/* Denture base/gum */}
            <path d="M20 40C20 35 25 30 32 30H68C75 30 80 35 80 40C80 42 79 44 78 45H22C21 44 20 42 20 40Z" fill="currentColor" opacity="0.4"/>
            {/* Full set of teeth */}
            <rect x="23" y="45" width="5" height="16" rx="2" fill="currentColor"/>
            <rect x="31" y="45" width="5" height="18" rx="2" fill="currentColor"/>
            <rect x="39" y="45" width="5" height="16" rx="2" fill="currentColor"/>
            <rect x="47" y="45" width="6" height="18" rx="2" fill="currentColor"/>
            <rect x="56" y="45" width="5" height="16" rx="2" fill="currentColor"/>
            <rect x="64" y="45" width="5" height="18" rx="2" fill="currentColor"/>
            <rect x="72" y="45" width="5" height="16" rx="2" fill="currentColor"/>
          </svg>
        )
      case 'partial-denture':
        // Partial denture with some teeth and pink acrylic base
        return (
          <svg className="w-20 h-20 text-red-600" viewBox="0 0 100 100" fill="none">
            {/* Acrylic base */}
            <path d="M30 38C30 33 33 30 38 30H56C61 30 64 33 64 38C64 40 63 42 62 43H32C31 42 30 40 30 38Z" fill="currentColor" opacity="0.4"/>
            {/* Partial teeth */}
            <rect x="34" y="43" width="5" height="16" rx="2" fill="currentColor"/>
            <rect x="42" y="43" width="5" height="18" rx="2" fill="currentColor"/>
            <rect x="50" y="43" width="5" height="16" rx="2" fill="currentColor"/>
            {/* Metal clasp on left */}
            <path d="M30 45L26 50C26 53 28 56 30 58" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6"/>
            {/* Metal clasp on right */}
            <path d="M64 45L68 50C68 53 66 56 64 58" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6"/>
          </svg>
        )
      case 'custom-impression-tray':
        // Impression tray
        return (
          <svg className="w-20 h-20 text-blue-600" viewBox="0 0 100 100" fill="none">
            {/* Tray handle */}
            <rect x="45" y="25" width="10" height="10" rx="2" fill="currentColor" opacity="0.5"/>
            {/* Tray outer rim */}
            <path d="M25 40C25 37 27 35 30 35H70C73 35 75 37 75 40V45H25V40Z" fill="currentColor" opacity="0.3"/>
            {/* Tray U-shape */}
            <path d="M25 45C25 45 23 50 23 58C23 66 25 72 30 76C35 80 42 82 50 82C58 82 65 80 70 76C75 72 77 66 77 58C77 50 75 45 75 45V48H25V45Z" fill="currentColor"/>
            {/* Inner cavity */}
            <path d="M30 50C30 50 28 54 28 60C28 66 30 70 34 73C38 76 43 77 50 77C57 77 62 76 66 73C70 70 72 66 72 60C72 54 70 50 70 50H30Z" fill="white" opacity="0.2"/>
          </svg>
        )
      case 'model-thermoforming':
        // Thermoforming model/mold
        return (
          <svg className="w-20 h-20 text-cyan-600" viewBox="0 0 100 100" fill="none">
            {/* Base platform */}
            <ellipse cx="50" cy="70" rx="32" ry="8" fill="currentColor" opacity="0.3"/>
            {/* Model arch */}
            <path d="M22 50C22 43 27 37 35 34C40 32 45 31 50 31C55 31 60 32 65 34C73 37 78 43 78 50V65C78 68 70 70 50 70C30 70 22 68 22 65V50Z" fill="currentColor"/>
            {/* Teeth on top */}
            <rect x="30" y="28" width="3" height="6" rx="1" fill="currentColor"/>
            <rect x="37" y="27" width="3" height="7" rx="1" fill="currentColor"/>
            <rect x="44" y="27" width="3" height="7" rx="1" fill="currentColor"/>
            <rect x="51" y="27" width="3" height="7" rx="1" fill="currentColor"/>
            <rect x="58" y="27" width="3" height="7" rx="1" fill="currentColor"/>
            <rect x="65" y="28" width="3" height="6" rx="1" fill="currentColor"/>
          </svg>
        )
      case 'implant-planning':
        // Surgical guide with holes for implants
        return (
          <svg className="w-20 h-20 text-orange-600" viewBox="0 0 100 100" fill="none">
            {/* Guide plate */}
            <path d="M25 40C25 38 27 36 30 36H70C73 36 75 38 75 40V60C75 62 73 64 70 64H30C27 64 25 62 25 60V40Z" fill="currentColor" opacity="0.3"/>
            {/* Drill guide holes */}
            <circle cx="40" cy="50" r="5" fill="currentColor"/>
            <circle cx="40" cy="50" r="2.5" fill="white" opacity="0.5"/>
            <circle cx="60" cy="50" r="5" fill="currentColor"/>
            <circle cx="60" cy="50" r="2.5" fill="white" opacity="0.5"/>
            {/* Guide pins/supports */}
            <rect x="28" y="38" width="3" height="8" fill="currentColor"/>
            <rect x="69" y="38" width="3" height="8" fill="currentColor"/>
            {/* Implant indication */}
            <line x1="40" y1="55" x2="40" y2="70" stroke="currentColor" strokeWidth="2" strokeDasharray="2,2"/>
            <line x1="60" y1="55" x2="60" y2="70" stroke="currentColor" strokeWidth="2" strokeDasharray="2,2"/>
          </svg>
        )
      case 'cerec-guide':
        // Digital/CAD guide
        return (
          <svg className="w-20 h-20 text-indigo-600" viewBox="0 0 100 100" fill="none">
            {/* Digital screen/guide */}
            <rect x="30" y="35" width="40" height="30" rx="3" fill="currentColor" opacity="0.3"/>
            <rect x="33" y="38" width="34" height="24" rx="2" fill="currentColor"/>
            {/* Digital markers/crosshairs */}
            <circle cx="42" cy="50" r="4" fill="white" opacity="0.3"/>
            <circle cx="50" cy="50" r="4" fill="white" opacity="0.5"/>
            <circle cx="58" cy="50" r="4" fill="white" opacity="0.3"/>
            {/* Guide holes */}
            <circle cx="42" cy="50" r="1.5" fill="white"/>
            <circle cx="58" cy="50" r="1.5" fill="white"/>
            {/* Stand/base */}
            <path d="M38 65L44 68H56L62 65V66L56 70H44L38 66V65Z" fill="currentColor" opacity="0.4"/>
          </svg>
        )
      case 'custom-order':
      default:
        // Simple tooth icon
        return (
          <svg className="w-20 h-20 text-sky-600" viewBox="0 0 100 100" fill="none">
            {/* Tooth crown */}
            <path d="M50 28C42 28 36 33 36 40V50C36 58 40 66 44 72C47 76 49 80 50 82C51 80 53 76 56 72C60 66 64 58 64 50V40C64 33 58 28 50 28Z" fill="currentColor"/>
            {/* Tooth roots */}
            <path d="M44 72C44 72 42 78 42 84" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <path d="M56 72C56 72 58 78 58 84" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            {/* Highlight */}
            <ellipse cx="45" cy="42" rx="6" ry="10" fill="white" opacity="0.3"/>
          </svg>
        )
    }
  }

  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select service</h2>

      {/* Lab labels/tags */}
      <div className="flex gap-2 mb-6">
        {labTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedLab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedLab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Service grid - 4 columns */}
      <div className="grid grid-cols-4 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => {
              setSelectedService(service)
              // Remove AI indicator when user manually selects
              setAiFilledFields(prev => ({ ...prev, service: false }))
            }}
            className={`p-4 border rounded-lg flex flex-col items-center gap-3 transition-all ${
              selectedService?.id === service.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className={`w-full h-36 bg-gradient-to-br ${service.color} rounded-lg flex items-center justify-center overflow-hidden`}>
              {getServiceIcon(service.id)}
            </div>
            <span className="text-sm text-gray-900 text-center leading-tight">{service.name}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderToothSelector = () => {
    const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
    const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]

    const toggleTooth = (tooth: number) => {
      if (selectedTeeth.includes(tooth)) {
        setSelectedTeeth(selectedTeeth.filter(t => t !== tooth))
        // Remove from crownDetails
        const newDetails = { ...crownDetails }
        delete newDetails[tooth]
        setCrownDetails(newDetails)
      } else {
        setSelectedTeeth([...selectedTeeth, tooth])
        // Initialize with current procedure type
        if (!crownDetails[tooth]) {
          setCrownDetails({
            ...crownDetails,
            [tooth]: {
              procedureType: procedureType,
              serviceType: 'Design & manufacturing',
              productionUnit: 'Milling',
              materialClass: 'Zirconium oxide',
              shadeGuide: 'VITA Classical + Bleached',
              shade: 'A2'
            }
          })
        }
      }
      // Remove AI indicator when user manually selects tooth
      setAiFilledFields(prev => ({ ...prev, tooth: false }))
    }

    const ToothButton = ({ tooth }: { tooth: number }) => {
      const isSelected = selectedTeeth.includes(tooth)
      const isAIFilled = aiFilledFields['tooth'] && isSelected
      return (
        <button
          onClick={() => toggleTooth(tooth)}
          className={`flex flex-col items-center gap-1 p-2 rounded border transition-all relative ${
            isSelected ? 'bg-blue-50 border-blue-600' : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
          style={{ minWidth: '52px' }}
        >
          {isAIFilled && (
            <div className="absolute top-0.5 right-0.5">
              <AIIcon />
            </div>
          )}
          <div className="w-6 h-8 flex items-center justify-center">
            <svg className="w-4 h-7" viewBox="0 0 16 28" fill="none">
              <path
                d="M8 0C5 0 2.5 2 2.5 5C2.5 8 2.5 20 8 28C13.5 20 13.5 8 13.5 5C13.5 2 11 0 8 0Z"
                fill={isSelected ? '#2563eb' : '#d1d5db'}
              />
            </svg>
          </div>
          <span className="text-[11px] text-gray-700 font-medium">{tooth}</span>
        </button>
      )
    }

    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Location</h3>
        <div className="space-y-2">
          {/* Upper teeth row */}
          <div className="flex gap-1 justify-between">
            {upperTeeth.map(tooth => <ToothButton key={tooth} tooth={tooth} />)}
          </div>
          {/* Lower teeth row */}
          <div className="flex gap-1 justify-between">
            {lowerTeeth.map(tooth => <ToothButton key={tooth} tooth={tooth} />)}
          </div>
        </div>
        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={applyToAllCrowns}
            onChange={(e) => setApplyToAllCrowns(e.target.checked)}
            className="w-11 h-6 appearance-none bg-gray-200 rounded-full relative cursor-pointer transition-colors
                    checked:bg-blue-600
                    before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white
                    before:top-0.5 before:left-0.5 before:transition-transform before:shadow-sm
                    checked:before:translate-x-5"
          />
          <span className="text-sm text-gray-700">Apply the same parameters to all crowns</span>
        </label>
      </div>
    )
  }

  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedService?.name || 'Define the service'}</h2>

      {/* Service provider */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <label className="block text-sm font-semibold text-gray-900">Service provider</label>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setServiceProvider('DS Core Create')
              // Remove AI indicator when user manually selects
              setAiFilledFields(prev => ({ ...prev, labPreference: false }))
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              serviceProvider === 'DS Core Create'
                ? 'bg-blue-50 border-2 border-blue-600'
                : 'bg-white border border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              serviceProvider === 'DS Core Create' ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
              <span className={`font-bold text-sm ${serviceProvider === 'DS Core Create' ? 'text-white' : 'text-gray-600'}`}>DC</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">DS Core Create</p>
            </div>
          </button>
          <button
            onClick={() => {
              setServiceProvider('Preferred Lab')
              // Remove AI indicator when user manually selects
              setAiFilledFields(prev => ({ ...prev, labPreference: false }))
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
              serviceProvider === 'Preferred Lab'
                ? 'bg-blue-50 border-2 border-blue-600'
                : 'bg-white border border-gray-300 hover:border-gray-400'
            }`}
          >
            {aiFilledFields['labPreference'] && (
              <div className="absolute top-2 right-2">
                <AIIcon />
              </div>
            )}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              serviceProvider === 'Preferred Lab' ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
              <svg className={`w-5 h-5 ${serviceProvider === 'Preferred Lab' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">Your preferred lab</p>
            </div>
          </button>
        </div>
      </div>

      {/* Procedure type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">Procedure type</label>
        <div className="grid grid-cols-5 gap-3">
          {[
            { name: 'Bridge', icon: (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                {/* Three connected crowns representing a bridge */}
                <path d="M4 10C4 10 3 11 3 13C3 15 4 16 5 17C6 18 7 18 7 18C7 18 8 18 9 17C10 16 11 15 11 13C11 11 10 10 10 10H4Z" fill="currentColor" opacity="0.3"/>
                <path d="M10 10C10 10 9 11 9 13C9 15 10 16 11 17C12 18 13 18 13 18C13 18 14 18 15 17C16 16 17 15 17 13C17 11 16 10 16 10H10Z" fill="currentColor"/>
                <path d="M16 10C16 10 15 11 15 13C15 15 16 16 17 17C18 18 19 18 19 18C19 18 20 18 21 17C22 16 23 15 23 13C23 11 22 10 22 10H16Z" fill="currentColor" opacity="0.3"/>
              </svg>
            )},
            { name: 'Crown', icon: (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M12 4C10 4 8.5 5 8.5 7C8.5 9 8.5 17 12 22C15.5 17 15.5 9 15.5 7C15.5 5 14 4 12 4Z"
                      fill="currentColor" opacity="0.3"/>
                <path d="M12 4C10 4 8.5 5 8.5 7C8.5 9 8.5 17 12 22C15.5 17 15.5 9 15.5 7C15.5 5 14 4 12 4Z"
                      stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )},
            { name: 'Inlay', icon: (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                {/* Tooth with inlay filling */}
                <path d="M12 4C10 4 8.5 5 8.5 7C8.5 9 8.5 17 12 22C15.5 17 15.5 9 15.5 7C15.5 5 14 4 12 4Z"
                      stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="10" y="8" width="4" height="6" rx="1" fill="currentColor" opacity="0.5"/>
              </svg>
            )},
            { name: 'Onlay', icon: (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                {/* Tooth with onlay covering top */}
                <path d="M12 4C10 4 8.5 5 8.5 7C8.5 9 8.5 17 12 22C15.5 17 15.5 9 15.5 7C15.5 5 14 4 12 4Z"
                      stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M12 4C10.5 4 9 4.5 9 6.5C9 8 9.5 9 10.5 10H13.5C14.5 9 15 8 15 6.5C15 4.5 13.5 4 12 4Z"
                      fill="currentColor" opacity="0.5"/>
              </svg>
            )},
            { name: 'Veneer', icon: (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                {/* Tooth with front veneer layer */}
                <path d="M12 4C10 4 8.5 5 8.5 7C8.5 9 8.5 17 12 22C15.5 17 15.5 9 15.5 7C15.5 5 14 4 12 4Z"
                      fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 4C11 4 10 4.5 10 6C10 8 10 14 12 18C14 14 14 8 14 6C14 4.5 13 4 12 4Z"
                      fill="currentColor" opacity="0.6"/>
              </svg>
            )}
          ].map((type) => (
            <button
              key={type.name}
              onClick={() => {
                setProcedureType(type.name)
                // Remove AI indicator when user manually selects
                setAiFilledFields(prev => ({ ...prev, procedureType: false }))
              }}
              className={`px-4 py-3 text-sm font-medium rounded-md border transition-all flex items-center gap-2 justify-center relative ${
                procedureType === type.name
                  ? 'bg-blue-50 border-blue-600 text-gray-900'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {aiFilledFields['procedureType'] && procedureType === type.name && (
                <div className="absolute top-1.5 right-1.5">
                  <AIIcon />
                </div>
              )}
              {type.icon}
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tooth selector */}
      {renderToothSelector()}

      {/* Procedure details for each selected tooth */}
      <div className="space-y-3">
        {selectedTeeth.map((tooth) => (
          <div key={tooth} className="border border-gray-300 rounded-lg bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">{crownDetails[tooth]?.procedureType || procedureType} · {tooth}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedTeeth(selectedTeeth.filter(t => t !== tooth))}
                  className="p-1.5 hover:bg-gray-100 rounded"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Service type</label>
                <div className="flex gap-2 flex-wrap">
                  {['Design', 'Manufacturing', 'Design & manufacturing'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setCrownDetails({
                          ...crownDetails,
                          [tooth]: { ...crownDetails[tooth], serviceType: type }
                        })
                        // Remove AI indicator when user manually selects
                        setAiFilledFields(prev => ({ ...prev, serviceType: false }))
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded border shadow-sm transition-all relative ${
                        crownDetails[tooth]?.serviceType === type
                          ? 'bg-blue-50 border-blue-600 text-blue-600'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {aiFilledFields['serviceType'] && crownDetails[tooth]?.serviceType === type && (
                        <div className="absolute -top-1 -right-1">
                          <AIIcon />
                        </div>
                      )}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Production unit (optional)</label>
                <div className="flex gap-2 flex-wrap">
                  {['Milling', 'Printing'].map((unit) => (
                    <button
                      key={unit}
                      onClick={() => {
                        setCrownDetails({
                          ...crownDetails,
                          [tooth]: { ...crownDetails[tooth], productionUnit: unit }
                        })
                        // Remove AI indicator when user manually selects
                        setAiFilledFields(prev => ({ ...prev, productionUnit: false }))
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded border shadow-sm transition-all relative ${
                        crownDetails[tooth]?.productionUnit === unit
                          ? 'bg-blue-50 border-blue-600 text-blue-600'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {aiFilledFields['productionUnit'] && crownDetails[tooth]?.productionUnit === unit && (
                        <div className="absolute -top-1 -right-1">
                          <AIIcon />
                        </div>
                      )}
                      {unit}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Material class</label>
                <div className="flex gap-2 flex-wrap">
                  {['Glass ceramic', 'Zirconium oxide', 'Lithium disilicate', 'Precious metal', 'Non precious metal', 'Hybrid ceramics'].map((material) => (
                    <button
                      key={material}
                      onClick={() => {
                        setCrownDetails({
                          ...crownDetails,
                          [tooth]: { ...crownDetails[tooth], materialClass: material }
                        })
                        // Remove AI indicator when user manually selects
                        setAiFilledFields(prev => ({ ...prev, material: false }))
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded border shadow-sm transition-all relative ${
                        crownDetails[tooth]?.materialClass === material
                          ? 'bg-blue-50 border-blue-600 text-blue-600'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {aiFilledFields['material'] && crownDetails[tooth]?.materialClass === material && (
                        <div className="absolute -top-1 -right-1">
                          <AIIcon />
                        </div>
                      )}
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Tooth shade guide</label>
                <div className="flex gap-2 flex-wrap">
                  {['VITA Classical + Bleached', 'VITA 3D-master'].map((guide) => (
                    <button
                      key={guide}
                      onClick={() => {
                        setCrownDetails({
                          ...crownDetails,
                          [tooth]: { ...crownDetails[tooth], shadeGuide: guide }
                        })
                        // Remove AI indicator when user manually selects
                        setAiFilledFields(prev => ({ ...prev, shadeGuide: false }))
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded border shadow-sm transition-all relative ${
                        crownDetails[tooth]?.shadeGuide === guide
                          ? 'bg-blue-50 border-blue-600 text-blue-600'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {aiFilledFields['shadeGuide'] && crownDetails[tooth]?.shadeGuide === guide && (
                        <div className="absolute -top-1 -right-1">
                          <AIIcon />
                        </div>
                      )}
                      {guide}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-900">Tooth shade</label>
                  {missingFields['shade'] && (
                    <span className="text-xs text-red-600 font-medium">Required</span>
                  )}
                </div>
                <div className="relative">
                  <select
                    value={crownDetails[tooth]?.shade || 'A2'}
                    onChange={(e) => {
                      setCrownDetails({
                        ...crownDetails,
                        [tooth]: { ...crownDetails[tooth], shade: e.target.value }
                      })
                      // Remove AI indicator when user manually selects
                      setAiFilledFields(prev => ({ ...prev, shade: false }))
                      // Remove missing field indicator
                      setMissingFields(prev => ({ ...prev, shade: false }))
                    }}
                    className={`w-full py-2 text-sm rounded-md bg-white appearance-none focus:outline-none focus:ring-2 pr-10 ${
                      aiFilledFields['shade'] ? 'pl-9' : 'pl-4'
                    } ${
                      missingFields['shade']
                        ? 'border-2 border-red-500 focus:ring-red-500'
                        : 'border border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="A3">A3</option>
                    <option value="A3.5">A3.5</option>
                    <option value="A4">A4</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="B3">B3</option>
                    <option value="B4">B4</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                    <option value="C3">C3</option>
                    <option value="C4">C4</option>
                    <option value="D2">D2</option>
                    <option value="D3">D3</option>
                    <option value="D4">D4</option>
                  </select>
                  {aiFilledFields['shade'] && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <AIIcon />
                    </div>
                  )}
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAdvancedOptions}
                  onChange={(e) => setShowAdvancedOptions(e.target.checked)}
                  className="w-11 h-6 appearance-none bg-gray-200 rounded-full relative cursor-pointer transition-colors
                          checked:bg-blue-600
                          before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white
                          before:top-0.5 before:left-0.5 before:transition-transform before:shadow-sm
                          checked:before:translate-x-5"
                />
                <span className="text-sm text-gray-700">Show advanced options</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep4 = () => (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload files</h2>

        {/* Dentsply Sirona scanner toggle */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-11 h-6 appearance-none bg-blue-600 rounded-full relative cursor-pointer transition-colors
                            checked:bg-blue-600
                            before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white
                            before:top-0.5 before:left-0.5 before:transition-transform before:shadow-sm
                            checked:before:translate-x-5"
                   defaultChecked />
            <span className="text-sm text-gray-700">I'm using a Dentsply Sirona scanner</span>
          </label>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Upload from mobile device
          </button>
        </div>

        {/* DI Scan (required) */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <label className="block text-sm font-semibold text-gray-900">
              DI Scan
            </label>
            {missingFields['diScanFile'] && (
              <span className="text-sm text-red-600 font-medium">⚠ Please upload a file</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-3">Formats: DXD</p>

          {!diScanFile ? (
            <div
              onClick={() => {
                // Mock file upload - simulate uploading after 1 second
                setTimeout(() => {
                  setDiScanFile('DI_2019-03-05_09-57-06.dxd')
                  setMissingFields(prev => ({ ...prev, diScanFile: false }))
                }, 1000)
              }}
              className={`border-2 border-dashed rounded-lg aspect-square max-w-xs text-center transition-colors bg-white cursor-pointer flex items-center justify-center ${
              missingFields['diScanFile']
                ? 'border-red-500 hover:border-red-600'
                : 'border-gray-300 hover:border-gray-400'
            }`}>
              <div className="p-8">
                <p className="text-sm text-gray-700">Drop file here or <span className="text-blue-600 underline">select media</span></p>
              </div>
            </div>
          ) : (
            <div className="inline-block">
              <div className="relative">
                <div className="w-80 h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  {/* 3D dental scan visualization */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-white flex items-center justify-center">
                    <svg className="w-64 h-64" viewBox="0 0 200 200" fill="none">
                      {/* Tooth scan representation */}
                      <g transform="translate(60, 40)">
                        {/* Left tooth */}
                        <path d="M20 30C15 30 10 35 10 45C10 55 12 70 20 90C28 70 30 55 30 45C30 35 25 30 20 30Z"
                              fill="#D4C5B0" stroke="#A89B85" strokeWidth="1"/>
                        <ellipse cx="18" cy="42" rx="4" ry="7" fill="#F0E8DC" opacity="0.6"/>

                        {/* Middle tooth */}
                        <path d="M45 25C40 25 35 30 35 40C35 52 37 72 45 95C53 72 55 52 55 40C55 30 50 25 45 25Z"
                              fill="#E8DCC8" stroke="#B5A890" strokeWidth="1"/>
                        <ellipse cx="43" cy="38" rx="5" ry="9" fill="#FFFBF0" opacity="0.5"/>

                        {/* Right tooth */}
                        <path d="M70 30C65 30 60 35 60 45C60 55 62 70 70 90C78 70 80 55 80 45C80 35 75 30 70 30Z"
                              fill="#D8CCBA" stroke="#ADA18D" strokeWidth="1"/>
                        <ellipse cx="68" cy="42" rx="4" ry="7" fill="#F5F0E5" opacity="0.6"/>
                      </g>
                      <text x="100" y="25" fontSize="10" fill="#666" textAnchor="middle" fontFamily="monospace">DI</text>
                    </svg>
                  </div>
                </div>
                {aiFilledFields['diScanFile'] && (
                  <div className="absolute top-3 left-3 bg-white rounded-full p-1 shadow-md">
                    <AIIcon />
                  </div>
                )}
                <button
                  onClick={() => {
                    setDiScanFile(null)
                    // Remove AI indicator when user manually deletes file
                    setAiFilledFields(prev => ({ ...prev, diScanFile: false }))
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                >
                  <Trash2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <p className="text-sm text-gray-900 mt-3 text-center font-medium">{diScanFile}</p>
            </div>
          )}
        </div>

        {/* Optional image or file */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Optional image or file (optional)</label>
          <p className="text-xs text-gray-500 mb-3">Formats: JPG, JPEG, PNG, TIFF, TIF, BMP, ST...</p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg aspect-square max-w-xs text-center hover:border-gray-400 transition-colors bg-white cursor-pointer flex items-center justify-center">
            <input type="file" className="hidden" id="optional-files" multiple />
            <label htmlFor="optional-files" className="cursor-pointer p-8">
              <p className="text-sm text-gray-700">Drop file here or <span className="text-blue-600 underline">select media</span></p>
            </label>
          </div>
        </div>
      </div>
    )

  const renderStep5 = () => {
    const providers = [
      { id: 'heidelberg', name: 'Heidelberg Labs', type: 'Preferred lab', icon: 'H' },
      { id: 'sun', name: 'Sun Labs', type: 'Preferred lab', icon: 'SL' },
      { id: 'shanghai', name: 'Shanghai Laboratories', type: 'Preferred lab', icon: '🏆' }
    ]

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Finalize your order</h2>

        {/* Service Provider */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-gray-900">Service provider</h3>
              {missingFields['finalProvider'] && (
                <span className="text-xs font-medium text-red-600">Required</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Share patient info with service provider</label>
              <button
                onClick={() => setSharePatientInfo(!sharePatientInfo)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors relative ${
                  sharePatientInfo ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  sharePatientInfo ? 'translate-x-5' : 'translate-x-0'
                }`}></div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => {
                  setSelectedFinalProvider(provider.id)
                  // Clear missing field indicator when user selects
                  setMissingFields(prev => ({ ...prev, finalProvider: false }))
                }}
                className={`p-4 border rounded-lg flex items-center gap-3 transition-all bg-gray-50 ${
                  missingFields['finalProvider']
                    ? 'border-2 border-red-500'
                    : selectedFinalProvider === provider.id
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
          <h3 className="text-base font-semibold text-gray-900 mb-4">Delivery Details</h3>

          <div className="flex gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                {missingFields['deliveryDate'] && (
                  <span className="text-xs text-red-600 font-medium">Required</span>
                )}
              </div>
              <div className="relative w-64">
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => {
                    setDeliveryDate(e.target.value)
                    // Remove missing field indicator when user fills it
                    setMissingFields(prev => ({ ...prev, deliveryDate: false }))
                  }}
                  className={`w-full px-3 py-2 pr-10 text-sm rounded-md focus:outline-none focus:ring-2 bg-white ${
                    missingFields['deliveryDate']
                      ? 'border-2 border-red-500 focus:ring-red-500'
                      : 'border border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">Your desired delivery date will be in 6 days</p>
            </div>
            <div className="w-40">
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-700">Time</label>
              </div>
              <div className="relative">
                <input
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => {
                    setDeliveryTime(e.target.value)
                  }}
                  className="w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 bg-white border border-gray-300 focus:ring-blue-500"
                />
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
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setTempRecipientInfo(recipientInfo)
                      setIsEditingRecipient(false)
                    }}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4 text-red-600" />
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

        {/* Order Summary */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Order summary</h3>

          <div className="space-y-3">
            {/* Patient Card */}
            <div className="bg-white border border-gray-300 rounded-lg p-4">
              <p className="font-medium text-sm text-gray-900 mb-1 flex items-center gap-1.5">
                Patient
                {aiFilledFields['patient'] && <AIIcon />}
              </p>
              <p className="text-sm text-gray-600">
                {selectedPatient?.name || 'No patient selected'} {selectedPatient && `· ${selectedPatient.birthdate} · ID:${selectedPatient.patientId}`}
              </p>
            </div>

            {/* Files Card */}
            {diScanFile && (
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <p className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-1.5">
                  Files
                  {aiFilledFields['diScanFile'] && <AIIcon />}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded border border-gray-200 bg-gray-100 flex-shrink-0 overflow-hidden relative">
                    {aiFilledFields['diScanFile'] && (
                      <div className="absolute top-0.5 left-0.5 bg-white rounded-full p-0.5 shadow-sm z-10">
                        <AIIcon />
                      </div>
                    )}
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-white flex items-center justify-center">
                      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
                        <path d="M20 8C18 8 16 9 16 11C16 13 16.5 18 20 24C23.5 18 24 13 24 11C24 9 22 8 20 8Z"
                              fill="#D4C5B0" stroke="#A89B85" strokeWidth="0.5"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{diScanFile}</p>
                </div>
              </div>
            )}

            {/* Restoration Card */}
            {selectedTeeth.length > 0 && (
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <p className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-1.5">
                  {selectedService?.name}
                  {aiFilledFields['service'] && <AIIcon />}
                </p>
                {selectedTeeth.map((tooth) => (
                  <div key={tooth} className="text-sm text-gray-600 space-y-1 mb-4 last:mb-0">
                    <p className="flex items-center gap-1.5">
                      {crownDetails[tooth]?.procedureType || procedureType} · {tooth}
                      {(aiFilledFields['procedureType'] || aiFilledFields['tooth']) && <AIIcon />}
                    </p>
                    <p className="flex items-center gap-1.5">
                      Position (FDI): {tooth}
                      {aiFilledFields['tooth'] && <AIIcon />}
                    </p>
                    <p className="flex items-center gap-1.5">
                      Service type: {crownDetails[tooth]?.serviceType || 'Design & manufacturing'}
                      {aiFilledFields['serviceType'] && <AIIcon />}
                    </p>
                    <p className="flex items-center gap-1.5">
                      Production Unit: {crownDetails[tooth]?.productionUnit || 'Milling'}
                      {aiFilledFields['productionUnit'] && <AIIcon />}
                    </p>
                    <p className="flex items-center gap-1.5">
                      Material class: {crownDetails[tooth]?.materialClass || 'Zirconium oxide'}
                      {aiFilledFields['material'] && <AIIcon />}
                    </p>
                    <p className="flex items-center gap-1.5">
                      Tooth shade guide: {crownDetails[tooth]?.shadeGuide || 'VITA Classical + Bleached'}
                      {aiFilledFields['shadeGuide'] && <AIIcon />}
                    </p>
                    <p className="flex items-center gap-1.5">
                      Shade: {crownDetails[tooth]?.shade || 'A2'}
                      {aiFilledFields['shade'] && <AIIcon />}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderOrderSummary = () => (
    <div className="h-full flex flex-col gap-4">
      {currentStep === 5 ? (
        <>
          {/* Your Order Container */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your order</h2>

            {selectedService && selectedTeeth.length > 0 && (
              <div className="mb-4">
                <p className="font-semibold text-sm text-gray-900 mb-1 flex items-center gap-1.5">
                  {selectedService.name}
                  {aiFilledFields['service'] && <AIIcon />}
                </p>
                {selectedTeeth.map((tooth) => (
                  <p key={tooth} className="text-sm text-gray-600 flex items-center gap-1.5">
                    {crownDetails[tooth]?.procedureType || procedureType} · {tooth}
                    {(aiFilledFields['procedureType'] || aiFilledFields['tooth']) && <AIIcon />}
                  </p>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              By placing your order, you are committing to a transaction with your selected third party laboratory. Dentsply Sirona is not assuming any liability for this transaction.
            </p>

            <button
              onClick={handleNext}
              disabled={!selectedFinalProvider || !deliveryDate}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place order
            </button>
          </div>

          {/* Comments Container */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Comments</h3>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Leave a comment about custom options, etc."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              rows={5}
            />
            <p className="text-xs text-gray-500 mt-2">0 / 1200 characters</p>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 flex-1 flex flex-col min-h-0">
          <div className="p-5 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-base font-bold text-gray-900">Order summary</h2>
          </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Patient info */}
          <div className="mb-4">
            {selectedPatient ? (
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900 flex items-center gap-1.5">
                    {selectedPatient.name}
                    {aiFilledFields['patient'] && <AIIcon />}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {selectedPatient.birthdate} · ID:{selectedPatient.patientId}
                  </p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Patient name</p>
            )}
          </div>

          {/* Service */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            {selectedService ? (
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1.5">
                    Services
                    {aiFilledFields['service'] && <AIIcon />}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">Sent to Preferred Lab</p>
                  <p className="text-sm font-medium text-gray-900">{selectedService.name}</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Service</p>
            )}
          </div>
          <div className="border-t border-gray-200 my-4"></div>

          {/* Service details */}
          <div className="mb-4">
            {currentStep >= 3 && selectedTeeth.length > 0 ? (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="space-y-3">
                    {selectedTeeth.map((tooth) => (
                      <div key={tooth} className="text-xs text-gray-600 space-y-0.5">
                        <p className="font-medium text-gray-900 text-sm flex items-center gap-1.5">
                          {crownDetails[tooth]?.procedureType || procedureType}
                          {(aiFilledFields['procedureType'] || aiFilledFields['tooth']) && <AIIcon />}
                        </p>
                        <p className="text-gray-500">Tooth (FDI):</p>
                        <p className="text-gray-900 flex items-center gap-1.5">
                          {tooth}
                          {aiFilledFields['tooth'] && <AIIcon />}
                        </p>
                        <p className="text-gray-500 mt-1">Service type:</p>
                        <p className="text-gray-900 flex items-center gap-1.5">
                          {crownDetails[tooth]?.serviceType || 'Design & manufacturing'}
                          {aiFilledFields['serviceType'] && <AIIcon />}
                        </p>
                        <p className="text-gray-500 mt-1">Production unit:</p>
                        <p className="text-gray-900 flex items-center gap-1.5">
                          {crownDetails[tooth]?.productionUnit || 'Milling'}
                          {aiFilledFields['productionUnit'] && <AIIcon />}
                        </p>
                        <p className="text-gray-500 mt-1">Material class:</p>
                        <p className="text-gray-900 flex items-center gap-1.5">
                          {crownDetails[tooth]?.materialClass || 'Zirconium oxide'}
                          {aiFilledFields['material'] && <AIIcon />}
                        </p>
                        <p className="text-gray-500 mt-1">Shade guide:</p>
                        <p className="text-gray-900 flex items-center gap-1.5">
                          {crownDetails[tooth]?.shadeGuide || 'VITA Classical + Bleached'}
                          {aiFilledFields['shadeGuide'] && <AIIcon />}
                        </p>
                        <p className="text-gray-500 mt-1">Shade:</p>
                        <p className="text-gray-900 flex items-center gap-1.5">
                          {crownDetails[tooth]?.shade || 'A2'}
                          {aiFilledFields['shade'] && <AIIcon />}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Service details</p>
            )}
          </div>
          <div className="border-t border-gray-200 my-4"></div>

          {/* Files */}
          <div className="mb-4">
            {currentStep >= 4 ? (
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-gray-900">Files</p>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Files</p>
            )}
          </div>
          <div className="border-t border-gray-200 my-4"></div>

          {/* Summary */}
          <div className="mb-4">
            <p className="text-sm text-gray-400">Summary</p>
          </div>
        </div>

        {/* Comments - only show from step 3-4 */}
        {currentStep >= 3 && currentStep < 5 && (
          <div className="bg-white rounded-lg border border-gray-200 p-5 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Comments</h3>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Leave a comment about custom options, etc."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              rows={5}
            />
            <p className="text-xs text-gray-500 mt-2">0 / 1200 characters</p>
          </div>
        )}
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Reset conversation?</h3>
            <p className="text-sm text-gray-600 mb-6">
              This will clear all conversation history and form data. You'll start from scratch on Step 1.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConversation}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Onboarding Modal */}
      {showAIOnboarding && currentStep === 1 && !hasSeenOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full mx-4 relative shadow-2xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
            {/* Upper Half - Gradient Background */}
            <div className="h-1/2 bg-gradient-to-br from-purple-200 via-blue-200 to-indigo-200 flex items-center justify-center p-8">
              <div className="text-center">
                <svg className="w-12 h-12 text-purple-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-2xl font-semibold text-gray-800">Hey AI, start an order with...</p>
              </div>
            </div>

            {/* Lower Half - Title and Content */}
            <div className="h-1/2 p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">New AI-assisted orders</h2>
                <p className="text-base text-gray-600 mb-2 text-center leading-relaxed">
                  Create orders by simply describing what you need. The assistant will guide you through the process.
                </p>
                <p className="text-xs text-gray-500 text-center">
                  Currently available for final restoration orders only.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAIOnboarding(false)
                    setHasSeenOnboarding(true)
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowAIOnboarding(false)
                    setHasSeenOnboarding(true)
                    setIsAIChatOpen(true)
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-lg"
                >
                  Try out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="h-14 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/orders')} className="p-1.5 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <span className="text-sm font-medium text-gray-900 block">New order</span>
            </div>
          </div>

          {/* Step indicator */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            {renderStepIndicator()}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setHasSeenOnboarding(true)
                setIsAIChatOpen(true)
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 border-2 border-purple-600 rounded-full hover:bg-purple-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Workflow assistant
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center ml-1">
              <span className="text-white text-xs font-semibold">UN</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={`flex-1 flex overflow-hidden bg-[#FAF9F6] transition-all ${isAIChatOpen ? 'ml-96' : ''}`}>
        {/* Left side - Form */}
        <div className="flex-1 overflow-y-auto p-8 pr-3">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-end mt-6">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mr-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !selectedPatient) ||
                (currentStep === 2 && !selectedService) ||
                (currentStep === 5 && (!selectedFinalProvider || !deliveryDate))
              }
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 5 ? 'Place order' : 'Continue'}
              {currentStep < 5 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right sidebar - Order summary */}
        <div className={`p-8 pl-3 overflow-y-auto transition-all ${isAIChatOpen ? 'w-72' : 'w-96'}`}>
          {renderOrderSummary()}
        </div>
      </div>

      {/* AI Chat Panel */}
      {isAIChatOpen && (
        <div className="fixed left-0 top-14 bottom-0 w-96 bg-gradient-to-br from-purple-50 via-white to-blue-50 border-r border-gray-200 flex flex-col shadow-xl z-40">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-base font-semibold text-gray-900">Workflow assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              {chatMessages.length > 0 && (
                <button
                  onClick={() => setShowResetModal(true)}
                  className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
                  title="Reset conversation"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsAIChatOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center">
                {/* AI Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 mb-6 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 to-blue-400 opacity-70"></div>
                </div>

                {/* Greeting */}
                <p className="text-base text-gray-900 mb-8 text-center">
                  What would you like <span className="text-purple-600 font-semibold">to order today?</span>
                </p>

                {/* Example Prompts */}
                <div className="w-full space-y-3">
                  <p className="text-sm text-gray-600 mb-3">Get started with an example below:</p>

                  <button
                    onClick={() => {
                      setChatInput("Need a zirconia crown on tooth 28 for Sarah Chen, A3, attach her latest DI scan")
                    }}
                    className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4C10 4 8.5 5 8.5 7C8.5 9 8.5 17 12 22C15.5 17 15.5 9 15.5 7C15.5 5 14 4 12 4Z" />
                      </svg>
                      <span className="text-sm text-gray-700">Scenario 1: Need a zirconia crown on tooth 28 for Sarah Chen, A3, attach her latest DI scan</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setChatInput("Need a zirconia crown on tooth 14, shade A2")
                    }}
                    className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4C10 4 8.5 5 8.5 7C8.5 9 8.5 17 12 22C15.5 17 15.5 9 15.5 7C15.5 5 14 4 12 4Z" />
                      </svg>
                      <span className="text-sm text-gray-700">Scenario 2: Need a zirconia crown on tooth 14, shade A2</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setChatInput("I need a crown for Sarah Chen, see her latest DI scan")
                    }}
                    className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4C10 4 8.5 5 8.5 7C8.5 9 8.5 17 12 22C15.5 17 15.5 9 15.5 7C15.5 5 14 4 12 4Z" />
                      </svg>
                      <span className="text-sm text-gray-700">Scenario 3: I need a crown for Sarah Chen, see her latest DI scan</span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{msg.content}</p>
                    </div>
                    {/* AI Suggestions */}
                    {msg.role === 'assistant' && idx === chatMessages.length - 1 && !aiIsTyping && (
                      <div className="flex flex-wrap gap-2 mt-2 max-w-[80%]">
                        {msg.content.includes('can you please tell me which patient') && (
                          <button
                            onClick={() => handleAIInput("I've selected the patient")}
                            className="px-3 py-1.5 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full border border-purple-200 transition-colors"
                          >
                            I've selected the patient
                          </button>
                        )}
                        {msg.content.includes('upload your media file') && (
                          <button
                            onClick={() => handleAIInput("I've uploaded the scan")}
                            className="px-3 py-1.5 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full border border-purple-200 transition-colors"
                          >
                            I've uploaded the scan
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {aiIsTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 bg-white">
            <p className="text-xs text-gray-500 px-4 pt-3 pb-2">
              {isRecording ? (
                <span className="text-red-500 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  Recording...
                </span>
              ) : (
                'For order creation only. No medical or treatment advice.'
              )}
            </p>
            <div className="px-4 pb-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Send a command to start your order"
                  className="w-full pl-4 pr-16 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-y-auto"
                  style={{ minHeight: '44px', maxHeight: '200px' }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && chatInput.trim()) {
                      e.preventDefault()
                      handleAIInput(chatInput)
                    }
                  }}
                />
                <div className="absolute right-2 bottom-3 flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (!isRecording) {
                        setIsRecording(true)
                        // Mock voice recording - auto stop after 2 seconds
                        setTimeout(() => {
                          setIsRecording(false)
                          setChatInput("Zirconia crown on tooth 14 for Sarah Chen")
                        }, 2000)
                      }
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <svg className={`w-4 h-4 ${isRecording ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      if (chatInput.trim()) {
                        handleAIInput(chatInput)
                      }
                    }}
                    className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
