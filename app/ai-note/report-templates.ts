// HTML Report Templates for AI Dental Note

export const generateSOAPNote = (patient: string, dob: string, practitioner: string, date: string, includeMedia: boolean) => {
  const mediaSection = includeMedia ? `
<h3>CLINICAL MEDIA</h3>
<p><strong>Attached Images:</strong></p>
<ul>
  <li>📸 Intraoral Photo - Tooth #14 <a href="#" style="color: #2563eb;">[View Image]</a></li>
  <li>📸 X-ray - Upper Right Quadrant <a href="#" style="color: #2563eb;">[View Image]</a></li>
  <li>📸 Occlusal View - Decay Detail <a href="#" style="color: #2563eb;">[View Image]</a></li>
</ul>
` : ''

  return `<h2>SOAP NOTE</h2>

<h3>PATIENT INFORMATION</h3>
<p>
  <strong>Date:</strong> ${date}<br/>
  <strong>Patient:</strong> ${patient || '[Patient Name]'}<br/>
  <strong>DOB:</strong> ${dob || '[Date of Birth]'}<br/>
  <strong>Practitioner:</strong> ${practitioner}
</p>

<h3>SUBJECTIVE</h3>

<p><strong>Chief Complaint:</strong></p>
<ul>
  <li>Sensitivity to cold in upper right quadrant</li>
  <li>Duration: 1 week</li>
</ul>

<p><strong>Patient History:</strong></p>
<ul>
  <li>Denies recent trauma</li>
  <li>No previous dental work in affected area</li>
  <li>Pain level: 4/10 (moderate)</li>
</ul>

<h3>OBJECTIVE</h3>

<p><strong>Clinical Examination:</strong></p>

<p style="margin-left: 20px;"><em>Visual Inspection:</em></p>
<ul style="margin-left: 20px;">
  <li>Tooth #14: Occlusal decay observed</li>
  <li>No visible inflammation</li>
  <li>No swelling present</li>
</ul>

<p style="margin-left: 20px;"><em>Tests Performed:</em></p>
<ul style="margin-left: 20px;">
  <li>Percussion test: Negative</li>
  <li>Thermal sensitivity: Positive to cold</li>
  <li>Palpation: No tenderness</li>
</ul>

<h3>ASSESSMENT</h3>

<p><strong>Primary Diagnosis:</strong></p>
<ul>
  <li>Dental caries, tooth #14 (occlusal surface)</li>
  <li>ICD-10: K02.51</li>
</ul>

<p>
  <strong>Severity:</strong> Moderate<br/>
  <strong>Prognosis:</strong> Good with treatment
</p>

<h3>PLAN</h3>

<p><strong>Treatment Plan:</strong></p>
<ul class="checklist">
  <li><input type="checkbox" /> Composite restoration, tooth #14</li>
  <li><input type="checkbox" /> Oral hygiene instruction</li>
  <li><input type="checkbox" /> Schedule 6-month follow-up</li>
</ul>

<p><strong>Procedure Codes:</strong></p>
<ul>
  <li>D2391 - Resin-based composite, one surface, posterior</li>
</ul>

<p><strong>Follow-up:</strong></p>
<ul>
  <li>Next visit: 6 months</li>
  <li>Monitor: Sensitivity improvement</li>
</ul>

${mediaSection}

<hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;"/>
<p style="color: #6b7280;"><strong>Provider:</strong> ${practitioner} | <strong>Date:</strong> ${date}</p>`
}

export const generateReferralLetter = (patient: string, dob: string, practitioner: string, date: string, includeMedia: boolean) => {
  const mediaSection = includeMedia ? `
<h3>CLINICAL MEDIA</h3>
<p><strong>Attached Images:</strong></p>
<ul>
  <li>📸 Intraoral Photo - Tooth #14 <a href="#" style="color: #2563eb;">[View Image]</a></li>
  <li>📸 X-ray - Upper Right Quadrant <a href="#" style="color: #2563eb;">[View Image]</a></li>
  <li>📸 Occlusal View - Decay Detail <a href="#" style="color: #2563eb;">[View Image]</a></li>
</ul>
` : ''

  return `<h2>REFERRAL LETTER</h2>

<p>
  <strong>Date:</strong> ${date}
</p>

<p>
  <strong>TO:</strong><br/>
  <span style="margin-left: 20px;">[Specialist Name]</span><br/>
  <span style="margin-left: 20px;">[Specialty]</span><br/>
  <span style="margin-left: 20px;">[Address]</span><br/>
  <span style="margin-left: 20px;">[Phone/Fax]</span>
</p>

<p>
  <strong>RE:</strong> ${patient || '[Patient Name]'}<br/>
  <strong>DOB:</strong> ${dob || '[Patient Date of Birth]'}<br/>
  <strong>Referred By:</strong> ${practitioner}
</p>

<p>Dear Colleague,</p>

<p>I am referring the above patient for your professional assessment and management regarding the following condition:</p>

<h3>CHIEF COMPLAINT</h3>
<ul>
  <li>Sensitivity to cold in upper right quadrant</li>
  <li>Duration: One week</li>
  <li>Pain level: Moderate (4/10)</li>
</ul>

<h3>CLINICAL FINDINGS</h3>
<p>Examination reveals:</p>
<ul>
  <li>Occlusal decay on tooth #14</li>
  <li>Positive thermal sensitivity test</li>
  <li>No visible inflammation or trauma</li>
  <li>Percussion test: Negative</li>
  <li>No periapical pathology observed</li>
</ul>

<h3>MEDICAL HISTORY</h3>
<ul>
  <li>No significant medical conditions</li>
  <li>No known drug allergies</li>
  <li>No contraindications to dental treatment</li>
</ul>

<h3>REASON FOR REFERRAL</h3>
<p>Please evaluate for:</p>
<ul class="checklist">
  <li><input type="checkbox" /> Possible endodontic involvement</li>
  <li><input type="checkbox" /> Extent of decay assessment</li>
  <li><input type="checkbox" /> Optimal treatment approach recommendation</li>
</ul>

<p>The patient may benefit from your expertise in determining whether endodontic therapy is indicated or if a direct restoration would suffice.</p>

${mediaSection}

<p><strong>URGENCY LEVEL:</strong> Routine</p>

<p>Please contact me if you require any additional information or records.</p>

<p>Thank you for your assistance with this patient's care.</p>

<p>
  Sincerely,<br/><br/>
  ${practitioner}<br/>
  [Contact Information]<br/>
  [License Number]
</p>`
}

export const generateInsuranceClaim = (patient: string, dob: string, practitioner: string, date: string, includeMedia: boolean) => {
  const mediaSection = includeMedia ? `
<h3>CLINICAL MEDIA</h3>
<p><strong>Attached Images:</strong></p>
<ul>
  <li>📸 Intraoral Photo - Tooth #14 <a href="#" style="color: #2563eb;">[View Image]</a></li>
  <li>📸 X-ray - Upper Right Quadrant <a href="#" style="color: #2563eb;">[View Image]</a></li>
  <li>📸 Occlusal View - Decay Detail <a href="#" style="color: #2563eb;">[View Image]</a></li>
</ul>
` : ''

  return `<h2>INSURANCE CLAIM FORM</h2>

<p>
  <strong>Claim Date:</strong> ${date}<br/>
  <strong>Claim Type:</strong> Dental Services
</p>

<h3>PATIENT INFORMATION</h3>
<p>
  <strong>Name:</strong> ${patient || '[Patient Name]'}<br/>
  <strong>Date of Birth:</strong> ${dob || '[Patient DOB]'}<br/>
  <strong>Date of Service:</strong> ${date}<br/>
  <strong>Provider:</strong> ${practitioner}<br/>
  <strong>Provider NPI:</strong> [Provider NPI]
</p>

<h3>DIAGNOSIS INFORMATION</h3>
<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
  <thead>
    <tr style="background-color: #f3f4f6;">
      <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">ICD-10 Code</th>
      <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #d1d5db; padding: 8px;">K02.51</td>
      <td style="border: 1px solid #d1d5db; padding: 8px;">Dental caries on pit and fissure surface limited to enamel</td>
    </tr>
  </tbody>
</table>

<p>
  <strong>Primary Diagnosis:</strong> Dental caries<br/>
  <strong>Affected Area:</strong> Tooth #14, occlusal surface
</p>

<h3>PROCEDURE INFORMATION</h3>
<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
  <thead>
    <tr style="background-color: #f3f4f6;">
      <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">CPT Code</th>
      <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Description</th>
      <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Tooth</th>
      <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Surface</th>
      <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Fee</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #d1d5db; padding: 8px;">D2391</td>
      <td style="border: 1px solid #d1d5db; padding: 8px;">Resin-based composite, one surface, posterior</td>
      <td style="border: 1px solid #d1d5db; padding: 8px;">#14</td>
      <td style="border: 1px solid #d1d5db; padding: 8px;">Occlusal</td>
      <td style="border: 1px solid #d1d5db; padding: 8px;">$[Amount]</td>
    </tr>
  </tbody>
</table>

<h3>CLINICAL JUSTIFICATION</h3>

<p><strong>Presenting Complaint:</strong></p>
<ul>
  <li>Patient reported one-week history of cold sensitivity</li>
  <li>Pain level: Moderate (4/10)</li>
</ul>

<p><strong>Clinical Findings:</strong></p>
<ul>
  <li>Visual examination revealed occlusal decay on tooth #14</li>
  <li>Thermal sensitivity test: Positive</li>
  <li>Percussion test: Negative</li>
  <li>No periapical pathology observed</li>
</ul>

<p><strong>Medical Necessity:</strong></p>
<ul>
  <li>Decay confined to enamel, early intervention indicated</li>
  <li>Prevent progression to dentin/pulp involvement</li>
  <li>Restore function and alleviate symptoms</li>
</ul>

<p><strong>Treatment Rationale:</strong></p>
<ul>
  <li>Composite restoration appropriate for occlusal decay</li>
  <li>Conservative treatment preserving tooth structure</li>
  <li>Expected outcome: Full restoration of function</li>
</ul>

${mediaSection}

<h3>CLAIM SUMMARY</h3>
<p>
  <strong>Total Estimated Cost:</strong> $[Amount]<br/>
  <strong>Insurance Coverage:</strong> [To be determined]<br/>
  <strong>Patient Responsibility:</strong> [To be determined]
</p>

<p><strong>Claim Status:</strong></p>
<ul class="checklist">
  <li><input type="checkbox" /> Pending</li>
  <li><input type="checkbox" /> Approved</li>
  <li><input type="checkbox" /> Denied</li>
</ul>

<hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;"/>
<p style="color: #6b7280;"><strong>Provider:</strong> ${practitioner} | <strong>Date:</strong> ${date}</p>`
}
