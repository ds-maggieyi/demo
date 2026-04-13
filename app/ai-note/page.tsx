'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Menu, Bell, HelpCircle, Mic, Upload, History, ChevronDown, FileText, Download, Send, Plus, Sparkles, Square, Image as ImageIcon, MoreVertical, FileDown, Copy, Check, X, Paperclip } from 'lucide-react'
import { basePath } from '../config'
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from 'docx'
import { saveAs } from 'file-saver'
import { generateSOAPNote, generateReferralLetter, generateInsuranceClaim } from './report-templates'

type TabType = 'transcript' | 'summary'
type ReportType = 'soap' | 'referral' | 'insurance'

export default function AINotePage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>('transcript')
  const [transcript, setTranscript] = useState('')
  const [summary, setSummary] = useState('')
  const [summaryTitle, setSummaryTitle] = useState('')
  const [selectedReport, setSelectedReport] = useState<ReportType>('soap')
  const [generatedReports, setGeneratedReports] = useState<Record<ReportType, string>>({
    soap: '',
    referral: '',
    insurance: ''
  })
  const [suggestedCodes, setSuggestedCodes] = useState({ icd10: '', cpt: '' })
  const [isRecording, setIsRecording] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState('')
  const [patientDOB, setPatientDOB] = useState('')
  const [practitioner, setPractitioner] = useState('Dr. Ada')
  const [dateCreated, setDateCreated] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }))
  const [includeMedia, setIncludeMedia] = useState(false)
  const [copied, setCopied] = useState(false)
  const [linkedTreatments, setLinkedTreatments] = useState<string[]>([])
  const [mediaFiles, setMediaFiles] = useState<Array<{ id: string; name: string; type: string }>>([])
  const [showTreatmentSelector, setShowTreatmentSelector] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  // Handle URL parameters from FloatingVoiceWidget
  useEffect(() => {
    const transcriptParam = searchParams.get('transcript')
    const patientParam = searchParams.get('patient')
    const dobParam = searchParams.get('dob')

    if (transcriptParam) {
      setTranscript(transcriptParam)
    }

    if (patientParam) {
      setSelectedPatient(patientParam)
      if (dobParam) {
        setPatientDOB(dobParam)
      }
    }
  }, [searchParams])

  // Mock treatments list
  const availableTreatments = [
    'Crown - Tooth #14',
    'Root Canal - Tooth #14',
    'Composite Filling - Tooth #14',
    'Tooth Extraction - Tooth #18',
    'Dental Cleaning',
    'Whitening Treatment'
  ]

  // Mock patient list with DOB
  const patients = [
    { name: 'Select a patient...', dob: '', display: 'Select a patient...' },
    { name: 'John Smith', dob: '03/15/1978', display: 'John Smith (03/15/1978)' },
    { name: 'Mary Johnson', dob: '07/22/1985', display: 'Mary Johnson (07/22/1985)' },
    { name: 'Robert Williams', dob: '11/08/1992', display: 'Robert Williams (11/08/1992)' },
    { name: 'Patricia Brown', dob: '05/30/1980', display: 'Patricia Brown (05/30/1980)' }
  ]

  const handlePatientChange = (value: string) => {
    const patient = patients.find(p => p.display === value)
    if (patient) {
      setSelectedPatient(patient.name)
      setPatientDOB(patient.dob)
    }
  }

  // Mock history records
  const historyRecords = [
    { id: 1, patient: 'John Smith', date: '2026-04-09 10:30 AM', type: 'SOAP Note' },
    { id: 2, patient: 'Mary Johnson', date: '2026-04-08 2:15 PM', type: 'Referral Letter' },
    { id: 3, patient: 'Robert Williams', date: '2026-04-07 9:00 AM', type: 'Insurance Claim' },
  ]

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate recording and transcription
      setTimeout(() => {
        setTranscript("Patient presents with discomfort in the upper right quadrant. Reports sensitivity to cold beverages for the past week. No visible swelling or redness observed during examination. Tooth 14 shows signs of decay on the occlusal surface. Patient denies any recent trauma or previous dental work in this area. Pain level rated 4 out of 10.")
        setIsRecording(false)
      }, 3000)
    }
  }

  const handleGenerateSummary = () => {
    setSummaryTitle('Cold Sensitivity - Tooth #14 Decay')
    setSummary(`<h3>CHIEF COMPLAINT</h3>
<ul>
  <li>Sensitivity to cold in upper right quadrant</li>
  <li>Duration: 1 week</li>
</ul>

<h3>HISTORY</h3>
<ul>
  <li>No recent trauma</li>
  <li>No previous dental work in affected area</li>
  <li>Pain level: 4/10 (moderate)</li>
</ul>

<h3>CLINICAL FINDINGS</h3>
<ul>
  <li>Tooth #14: Occlusal decay observed</li>
  <li>No visible inflammation or swelling</li>
  <li>Percussion test: Negative</li>
  <li>Thermal sensitivity: Positive to cold</li>
</ul>

<h3>ASSESSMENT</h3>
<ul>
  <li>Dental caries, tooth #14 (occlusal surface)</li>
  <li>Requires restorative intervention</li>
</ul>

<h3>RECOMMENDED ACTIONS</h3>
<ul class="checklist">
  <li><input type="checkbox" /> Schedule composite restoration</li>
  <li><input type="checkbox" /> Provide oral hygiene instructions</li>
  <li><input type="checkbox" /> Schedule 6-month follow-up</li>
</ul>`)

    // Auto-suggest codes based on summary
    setSuggestedCodes({
      icd10: 'K02.51 - Dental caries on pit and fissure surface limited to enamel',
      cpt: 'D2391 - Resin-based composite, one surface, posterior'
    })

    setActiveTab('summary')
  }

  const handleNew = () => {
    // Auto-save current content to history if there's content
    if (transcript || summary) {
      // In a real app, this would save to a database/history
      console.log('Auto-saving to history...')
    }
    // Clear all content
    setTranscript('')
    setSummary('')
    setSummaryTitle('')
    setGeneratedReports({ soap: '', referral: '', insurance: '' })
    setSuggestedCodes({ icd10: '', cpt: '' })
    setActiveTab('transcript')
    setSelectedPatient('')
    setPatientDOB('')
    setLinkedTreatments([])
    setMediaFiles([])
    setDateCreated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }))
  }

  const handleAddTreatment = (treatment: string) => {
    if (!linkedTreatments.includes(treatment)) {
      setLinkedTreatments([...linkedTreatments, treatment])
    }
    setShowTreatmentSelector(false)
  }

  const handleRemoveTreatment = (treatment: string) => {
    setLinkedTreatments(linkedTreatments.filter(t => t !== treatment))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type
      }))
      setMediaFiles([...mediaFiles, ...newFiles])
    }
  }

  const handleRemoveMedia = (fileId: string) => {
    setMediaFiles(mediaFiles.filter(f => f.id !== fileId))
  }

  const handleGenerateReport = () => {
    let newReport = ''

    if (selectedReport === 'soap') {
      newReport = generateSOAPNote(selectedPatient, patientDOB, practitioner, dateCreated, includeMedia)
    } else if (selectedReport === 'referral') {
      newReport = generateReferralLetter(selectedPatient, patientDOB, practitioner, dateCreated, includeMedia)
    } else {
      newReport = generateInsuranceClaim(selectedPatient, patientDOB, practitioner, dateCreated, includeMedia)
    }

    // TEMP - keep old version for comparison
    /*
    if (selectedReport === 'soap') {
      newReport = `SOAP NOTE

PATIENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date:           ${dateCreated}
Patient:        ${selectedPatient || '[Patient Name]'}
DOB:            ${patientDOB || '[Date of Birth]'}
Practitioner:   ${practitioner}


SUBJECTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Chief Complaint:
  • Sensitivity to cold in upper right quadrant
  • Duration: 1 week

Patient History:
  • Denies recent trauma
  • No previous dental work in affected area
  • Pain level: 4/10 (moderate)


OBJECTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clinical Examination:

  Visual Inspection:
    • Tooth #14: Occlusal decay observed
    • No visible inflammation
    • No swelling present

  Tests Performed:
    • Percussion test: Negative
    • Thermal sensitivity: Positive to cold
    • Palpation: No tenderness


ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary Diagnosis:
  • Dental caries, tooth #14 (occlusal surface)
  • ICD-10: K02.51

Severity: Moderate
Prognosis: Good with treatment


PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Treatment Plan:
  ☐ 1. Composite restoration, tooth #14
  ☐ 2. Oral hygiene instruction
  ☐ 3. Schedule 6-month follow-up

Procedure Codes:
  • D2391 - Resin-based composite, one surface, posterior

Follow-up:
  • Next visit: 6 months
  • Monitor: Sensitivity improvement${mediaSection}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Provider: ${practitioner}                    Date: ${dateCreated}`
    } else if (selectedReport === 'referral') {
      newReport = `REFERRAL LETTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: ${dateCreated}

TO:           [Specialist Name]
              [Specialty]
              [Address]
              [Phone/Fax]

RE:           ${selectedPatient || '[Patient Name]'}
DOB:          ${patientDOB || '[Patient Date of Birth]'}
Referred By:  ${practitioner}


Dear Colleague,

I am referring the above patient for your professional assessment and management regarding the following condition:


CHIEF COMPLAINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • Sensitivity to cold in upper right quadrant
  • Duration: One week
  • Pain level: Moderate (4/10)


CLINICAL FINDINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Examination reveals:
  • Occlusal decay on tooth #14
  • Positive thermal sensitivity test
  • No visible inflammation or trauma
  • Percussion test: Negative
  • No periapical pathology observed


MEDICAL HISTORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • No significant medical conditions
  • No known drug allergies
  • No contraindications to dental treatment


REASON FOR REFERRAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please evaluate for:
  ☐ Possible endodontic involvement
  ☐ Extent of decay assessment
  ☐ Optimal treatment approach recommendation

The patient may benefit from your expertise in determining whether endodontic therapy is indicated or if a direct restoration would suffice.${mediaSection}


URGENCY LEVEL: Routine

Please contact me if you require any additional information or records.

Thank you for your assistance with this patient's care.


Sincerely,

${practitioner}
[Contact Information]
[License Number]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
    } else {
      newReport = `INSURANCE CLAIM FORM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Claim Date: ${dateCreated}
Claim Type: Dental Services


PATIENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:                ${selectedPatient || '[Patient Name]'}
Date of Birth:       ${patientDOB || '[Patient DOB]'}
Date of Service:     ${dateCreated}
Provider:            ${practitioner}
Provider NPI:        [Provider NPI]


DIAGNOSIS INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────┬────────────────────────────────────────────────────┐
│ ICD-10 Code │ Description                                        │
├─────────────┼────────────────────────────────────────────────────┤
│ K02.51      │ Dental caries on pit and fissure surface         │
│             │ limited to enamel                                  │
└─────────────┴────────────────────────────────────────────────────┘

Primary Diagnosis: Dental caries
Affected Area: Tooth #14, occlusal surface


PROCEDURE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────┬──────────────────────────────┬───────┬─────────┬──────────┐
│ CPT Code │ Description                  │ Tooth │ Surface │ Fee      │
├──────────┼──────────────────────────────┼───────┼─────────┼──────────┤
│ D2391    │ Resin-based composite       │ #14   │ Occlusal│ $[Amount]│
│          │ One surface, posterior       │       │         │          │
└──────────┴──────────────────────────────┴───────┴─────────┴──────────┘


CLINICAL JUSTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Presenting Complaint:
  • Patient reported one-week history of cold sensitivity
  • Pain level: Moderate (4/10)

Clinical Findings:
  • Visual examination revealed occlusal decay on tooth #14
  • Thermal sensitivity test: Positive
  • Percussion test: Negative
  • No periapical pathology observed

Medical Necessity:
  • Decay confined to enamel, early intervention indicated
  • Prevent progression to dentin/pulp involvement
  • Restore function and alleviate symptoms

Treatment Rationale:
  • Composite restoration appropriate for occlusal decay
  • Conservative treatment preserving tooth structure
  • Expected outcome: Full restoration of function${mediaSection}


CLAIM SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Estimated Cost:     $[Amount]
Insurance Coverage:       [To be determined]
Patient Responsibility:   [To be determined]

Claim Status: ☐ Pending  ☐ Approved  ☐ Denied

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Provider: ${practitioner}                          Date: ${dateCreated}`
    }
    */

    // Cache the report for this type
    setGeneratedReports(prev => ({
      ...prev,
      [selectedReport]: newReport
    }))
  }

  const handleExportPDF = () => {
    // Create a print-friendly version
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const reportContent = generatedReports[selectedReport]
      const reportTitle = selectedReport === 'soap' ? 'SOAP Note' :
                         selectedReport === 'referral' ? 'Referral Letter' :
                         'Insurance Claim'

      // Convert content to HTML with proper formatting
      const lines = reportContent.split('\n')
      const formattedHTML = lines.map(line => {
        const trimmed = line.trim()

        if (!trimmed) return '<br>'

        // Section headers (all caps)
        const isSectionTitle = trimmed === trimmed.toUpperCase() &&
                              trimmed.length > 0 &&
                              trimmed.length < 50 &&
                              !trimmed.startsWith('•') &&
                              !trimmed.match(/^(TO:|RE:|DOB:|Name:|Date|ICD|CPT|Description|Tooth|Surface|Provider|NPI|Estimated|Insurance)/)

        if (isSectionTitle) {
          return `<h2 style="margin-top: 20px; margin-bottom: 10px; font-size: 14px;">${trimmed}</h2>`
        }

        // Bullets
        if (trimmed.startsWith('•') || trimmed.match(/^\d+\./)) {
          return `<p style="margin: 5px 0; margin-left: 20px;">${trimmed}</p>`
        }

        // Labels (Name:, Date:, etc.)
        const labelMatch = trimmed.match(/^([A-Z][A-Za-z\s]+):(.*)/)
        if (labelMatch) {
          return `<p style="margin: 5px 0;"><strong>${labelMatch[1]}:</strong>${labelMatch[2]}</p>`
        }

        return `<p style="margin: 5px 0;">${trimmed}</p>`
      }).join('\n')

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${reportTitle} - ${selectedPatient || 'Patient'}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
                font-size: 12px;
                line-height: 1.6;
                color: #000;
              }
              h1 {
                text-align: center;
                font-size: 18px;
                margin-bottom: 30px;
                font-weight: bold;
              }
              h2 {
                font-size: 14px;
                font-weight: bold;
                margin-top: 20px;
                margin-bottom: 10px;
              }
              p {
                margin: 5px 0;
              }
              @media print {
                body { padding: 20px; }
              }
            </style>
          </head>
          <body>
            <h1>${reportTitle}</h1>
            ${formattedHTML}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
    setShowExportMenu(false)
  }

  const handleExportWord = async () => {
    const reportContent = generatedReports[selectedReport]
    const lines = reportContent.split('\n')

    const reportTitle = selectedReport === 'soap' ? 'SOAP Note' :
                       selectedReport === 'referral' ? 'Referral Letter' :
                       'Insurance Claim'

    // Create document with formatted paragraphs
    const paragraphs = lines.map(line => {
      const isEmpty = line.trim() === ''

      if (isEmpty) {
        return new Paragraph({ text: '' })
      }

      // Check if it's a section title (all caps, not too long, no colon at start)
      const trimmed = line.trim()
      const isSectionTitle = trimmed === trimmed.toUpperCase() &&
                            trimmed.length > 0 &&
                            trimmed.length < 50 &&
                            !trimmed.startsWith('•') &&
                            !trimmed.match(/^(TO:|RE:|DOB:|Name:|Date|ICD|CPT|Description|Tooth|Surface|Provider|NPI|Estimated|Insurance)/)

      if (isSectionTitle) {
        return new Paragraph({
          children: [
            new TextRun({
              text: trimmed,
              bold: true,
              size: 24
            })
          ],
          spacing: { before: 300, after: 200 }
        })
      }

      // Check if line starts with bullet
      const isBullet = trimmed.startsWith('•') || trimmed.match(/^\d+\./)

      if (isBullet) {
        return new Paragraph({
          text: trimmed,
          spacing: { after: 100 }
        })
      }

      // Check if it's a label line (Name:, Date:, etc.)
      const isLabel = trimmed.match(/^[A-Z][A-Za-z\s]+:/)

      if (isLabel) {
        const [label, ...rest] = trimmed.split(':')
        return new Paragraph({
          children: [
            new TextRun({
              text: label + ':',
              bold: true
            }),
            new TextRun({
              text: rest.join(':')
            })
          ],
          spacing: { after: 100 }
        })
      }

      return new Paragraph({
        text: trimmed,
        spacing: { after: 100 }
      })
    })

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: reportTitle,
                bold: true,
                size: 32
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          ...paragraphs
        ]
      }]
    })

    const blob = await Packer.toBlob(doc)
    const fileName = `${reportTitle}_${selectedPatient || 'Patient'}_${dateCreated.replace(/\//g, '-')}.docx`
    saveAs(blob, fileName)
    setShowExportMenu(false)
  }

  const handleCopyToClipboard = async () => {
    const reportHTML = generatedReports[selectedReport]
    // Strip HTML tags for clipboard
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = reportHTML
    const plainText = tempDiv.textContent || tempDiv.innerText || ''
    await navigator.clipboard.writeText(plainText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
              <a href={`${basePath}/`} className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
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
              <a href={`${basePath}/ai-note`} className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-50 text-blue-600">
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
          <div className="p-6">
            {/* Page Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">AI Clinical Note</h1>
                <p className="text-sm text-gray-600">Voice-powered clinical documentation</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                >
                  <History className="w-4 h-4" />
                  History
                </button>
                <button
                  onClick={handleNew}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  New
                </button>
              </div>
            </div>

            {/* Patient and Metadata Section */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                <div className="relative">
                  <select
                    value={patients.find(p => p.name === selectedPatient)?.display || ''}
                    onChange={(e) => handlePatientChange(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
                  >
                    {patients.map((patient) => (
                      <option key={patient.display} value={patient.display}>
                        {patient.display}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Practitioner</label>
                <input
                  type="text"
                  value={practitioner}
                  onChange={(e) => setPractitioner(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter practitioner name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Created</label>
                <input
                  type="text"
                  value={dateCreated}
                  readOnly
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
                />
              </div>
            </div>

            {/* Treatments and Media Section */}
            <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
              {/* Linked Treatments */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Linked Treatments</label>
                <div className="flex flex-wrap gap-2 items-center">
                  {linkedTreatments.map((treatment) => (
                    <span
                      key={treatment}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      {treatment}
                      <button
                        onClick={() => handleRemoveTreatment(treatment)}
                        className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <div className="relative">
                    <button
                      onClick={() => setShowTreatmentSelector(!showTreatmentSelector)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full border border-gray-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Treatment
                    </button>
                    {showTreatmentSelector && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowTreatmentSelector(false)}
                        />
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                          <div className="py-1">
                            {availableTreatments.filter(t => !linkedTreatments.includes(t)).map((treatment) => (
                              <button
                                key={treatment}
                                onClick={() => handleAddTreatment(treatment)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Paperclip className="w-4 h-4 text-gray-400" />
                                {treatment}
                              </button>
                            ))}
                            {availableTreatments.filter(t => !linkedTreatments.includes(t)).length === 0 && (
                              <div className="px-4 py-2 text-sm text-gray-500 italic">All treatments linked</div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Media Files */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Files</label>
                <div className="flex flex-wrap gap-2 items-center">
                  {mediaFiles.map((file) => (
                    <span
                      key={file.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-sm rounded-full border border-purple-200"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      {file.name}
                      <button
                        onClick={() => handleRemoveMedia(file.id)}
                        className="ml-1 hover:bg-purple-100 rounded-full p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full border border-gray-300 transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* History Modal */}
            {showHistory && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Voice Recording History</h2>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <span className="text-2xl text-gray-500">&times;</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {historyRecords.map((record) => (
                      <div
                        key={record.id}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{record.patient}</div>
                            <div className="text-sm text-gray-600">{record.type}</div>
                          </div>
                          <div className="text-sm text-gray-500">{record.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ height: 'calc(100vh - 320px)' }}>
              {/* Left Section - Transcript/Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 flex-shrink-0">
                  <button
                    onClick={() => setActiveTab('transcript')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeTab === 'transcript'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Transcript
                  </button>
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex-1 px-4 py-3 text-sm font-medium ${
                      activeTab === 'summary'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Summary
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 overflow-hidden">
                  {activeTab === 'transcript' ? (
                    <>
                      {/* Transcript Text Area */}
                      <div className="flex-1 mb-4 overflow-hidden">
                        <textarea
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          placeholder="Your voice transcript will appear here..."
                          className="w-full h-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white hover:border-blue-300 transition-colors text-sm leading-relaxed"
                        />
                      </div>

                      {/* Action Buttons at Bottom */}
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={handleVoiceInput}
                          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm ${
                            isRecording
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isRecording ? (
                            <>
                              <Square className="w-4 h-4 fill-current" />
                              Stop Recording
                            </>
                          ) : (
                            <>
                              <Mic className="w-4 h-4" />
                              Voice Input
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowUpload(!showUpload)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm"
                        >
                          <Upload className="w-4 h-4" />
                          Upload
                        </button>
                        <button
                          onClick={handleGenerateSummary}
                          disabled={!transcript}
                          className="ml-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm"
                        >
                          <Sparkles className="w-4 h-4" />
                          Generate Summary
                        </button>
                      </div>

                      {/* Upload Dialog */}
                      {showUpload && (
                        <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:border-blue-500 transition-colors relative">
                          <button
                            onClick={() => setShowUpload(false)}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded"
                          >
                            <span className="text-gray-500 text-xl">&times;</span>
                          </button>
                          <div className="text-center">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Drag and drop audio file here
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                              or click to browse (MP3, WAV, M4A)
                            </p>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium">
                              Select File
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {summaryTitle && (
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">{summaryTitle}</h3>
                      )}
                      <div className="flex-1 overflow-auto">
                        {summary ? (
                          <div
                            contentEditable
                            dangerouslySetInnerHTML={{ __html: summary }}
                            onBlur={(e) => setSummary(e.currentTarget.innerHTML)}
                            className="w-full h-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-blue-300 transition-colors text-sm leading-relaxed prose prose-sm max-w-none"
                            style={{
                              minHeight: '100%'
                            }}
                          />
                        ) : (
                          <div className="w-full h-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-400 italic text-sm">
                            Generated summary will appear here...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Section - Report Generation */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
                {/* Header - styled like tabs */}
                <div className="border-b border-gray-200 px-6 py-3 flex-shrink-0">
                  <h3 className="text-sm font-medium text-gray-900">Report Generation</h3>
                </div>

                <div className="p-6 flex flex-col flex-1 overflow-hidden">
                  {/* Report Type Selection */}
                  <div className="mb-4">
                    <div className="flex gap-3 items-center mb-3">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Report Type</label>
                      <div className="relative flex-1">
                        <select
                          value={selectedReport}
                          onChange={(e) => setSelectedReport(e.target.value as ReportType)}
                          className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8"
                        >
                          <option value="soap">SOAP Note</option>
                          <option value="referral">Referral Letter</option>
                          <option value="insurance">Insurance Claim</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="includeMedia"
                          checked={includeMedia}
                          onChange={(e) => setIncludeMedia(e.target.checked)}
                          disabled={mediaFiles.length === 0}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <label htmlFor="includeMedia" className={`text-sm font-medium whitespace-nowrap ${mediaFiles.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                          Include media
                        </label>
                      </div>
                    </div>

                    {/* Prominent Generate Button */}
                    <button
                      onClick={handleGenerateReport}
                      disabled={!transcript && !summary}
                      className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Sparkles className="w-5 h-5" />
                      {generatedReports[selectedReport] ? 'Regenerate Report' : 'Generate Report'}
                    </button>
                    {(!transcript && !summary) && (
                      <p className="text-xs text-gray-500 mt-2 text-center italic">
                        Generate a summary first to create reports
                      </p>
                    )}
                  </div>

                  {/* Auto-suggested Codes - Only for Insurance Claims */}
                  {selectedReport === 'insurance' && suggestedCodes.icd10 && suggestedCodes.cpt && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-xs font-semibold text-blue-900 mb-2">💡 Suggested Codes</div>
                      <div className="space-y-1 text-xs text-blue-800">
                        <div><span className="font-medium">ICD-10:</span> {suggestedCodes.icd10}</div>
                        <div><span className="font-medium">CPT:</span> {suggestedCodes.cpt}</div>
                      </div>
                    </div>
                  )}

                  {/* Report Display - Editable Rich Text */}
                  <div className="flex-1 overflow-auto mb-3">
                    <div
                      contentEditable
                      dangerouslySetInnerHTML={{ __html: generatedReports[selectedReport] || '<p style="color: #9ca3af; font-style: italic;">Generated report will appear here...</p>' }}
                      onBlur={(e) => setGeneratedReports(prev => ({ ...prev, [selectedReport]: e.currentTarget.innerHTML }))}
                      className="w-full h-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-blue-300 transition-colors text-sm leading-relaxed prose prose-sm max-w-none"
                      style={{
                        minHeight: '100%'
                      }}
                    />
                  </div>

                  {/* Export and Copy Options */}
                  {generatedReports[selectedReport] && (
                    <div className="relative flex items-center gap-2">
                      <button
                        onClick={handleCopyToClipboard}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                      >
                        <FileDown className="w-4 h-4" />
                        Export
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {showExportMenu && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowExportMenu(false)}
                          />
                          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            <div className="py-1">
                              <button
                                onClick={handleExportPDF}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
                              >
                                <Download className="w-4 h-4" />
                                Export as PDF
                              </button>
                              <button
                                onClick={handleExportWord}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-900"
                              >
                                <Download className="w-4 h-4" />
                                Export as Word
                              </button>
                              <div className="border-t border-gray-200 my-1"></div>
                              <button
                                disabled
                                className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-gray-400 cursor-not-allowed"
                              >
                                <Send className="w-4 h-4" />
                                Send to PMS <span className="ml-auto text-xs">(Soon)</span>
                              </button>
                              <button
                                disabled
                                className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-gray-400 cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4" />
                                Create Treatment Plan <span className="ml-auto text-xs">(Soon)</span>
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
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
