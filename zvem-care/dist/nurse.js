export const examinationSteps = [
 {id:'identity',label:'Confirm patient identity',detail:'Check the patient against the appointment record.',required:true},
 {id:'passport',label:'Review the Patient Passport',detail:'Review recorded allergies, medicines and previous procedures.',required:true},
 {id:'symptoms',label:'Confirm the patient’s answers',detail:'Review the reason for the visit and the questionnaire.',required:true},
 {id:'observations',label:'Record examination observations',detail:'Confirm that relevant observations have been documented.',required:false},
 {id:'vitals',label:'Confirm vital signs documented',detail:'Check that the relevant measurements are in the clinical record.',required:false},
 {id:'medicines',label:'Review current medicines',detail:'Confirm the medication list was reviewed with the patient.',required:false},
 {id:'sample',label:'Collect requested samples',detail:'For an approved blood or urine collection only.',required:false},
 {id:'blood',label:'Label blood sample',detail:'Confirm any collected blood sample was labelled.',required:false},
 {id:'urine',label:'Label urine sample',detail:'Confirm any collected urine sample was labelled.',required:false},
 {id:'followup',label:'Confirm follow-up plan',detail:'Confirm the next appointment or recurring plan was reviewed.',required:false},
 {id:'nextstep',label:'Explain the next step to the patient',detail:'Confirm that the patient knows what happens next.',required:true}
];
export const nurseTemplateDefaults = [
 {id:'routine',name:'Routine examination',description:'A usual nurse visit',steps:['identity','passport','symptoms','observations','vitals','nextstep']},
 {id:'samples',name:'Blood / urine collection',description:'Approved sample collection',steps:['identity','passport','symptoms','sample','blood','urine','nextstep']},
 {id:'followup',name:'Chronic follow-up',description:'Regular condition review',steps:['identity','passport','symptoms','observations','medicines','followup','nextstep']}
];
const requiredIds=examinationSteps.filter(s=>s.required).map(s=>s.id);
const knownIds=new Set(examinationSteps.map(s=>s.id));
function normalizedStepIds(ids,lab=false){return [...new Set([...requiredIds,...(Array.isArray(ids)?ids:[]),...(lab?['sample']:[])])].filter(id=>knownIds.has(id));}
export function stepsForExam(exam){const ids=normalizedStepIds([...(exam.templateSteps||[]),...Object.keys(exam.steps||{})],!!exam.appointmentId);return examinationSteps.filter(s=>ids.includes(s.id));}
export function canFinishExamination(exam){return stepsForExam(exam).every(s=>{const value=exam.steps[s.id]?.value;return (s.required||(exam.appointmentId&&s.id==='sample'))?value==='Done':value==='Done'||value==='Not applicable';});}
export function applyTemplateToExam(exam,template){exam.templateId=template.id;exam.templateSteps=normalizedStepIds(template.steps,!!exam.appointmentId);}
export function automaticRoute(r){if(r.category==='Urgent'||r.type==='Prescription'||r.type==='Tests'||r.category==='Medical'&&r.type==='Administrative')return 'Doctor';if(r.category==='Administrative')return 'Administration';if(r.type==='Walk-in')return 'Nurse';const concern=r.answers?.find(([q])=>q==='Main concern')?.[1]||'';return /cold|throat|urinar/i.test(concern)?'Nurse':'Doctor';}
export function ensureExaminations(state){
 state.examinations??=[];
 state.nurseTemplates??=structuredClone(nurseTemplateDefaults);
 for(const fallback of nurseTemplateDefaults){let template=state.nurseTemplates.find(t=>t.id===fallback.id);if(!template){template=structuredClone(fallback);state.nurseTemplates.push(template);}template.steps=normalizedStepIds(template.steps,template.id==='samples');}
 for(const x of state.examinations){
  x.steps??={};x.history??=[];
  if(x.appointmentId&&x.status==='In progress'&&state.appointments.some(a=>a.id===x.appointmentId&&a.status==='Cancelled'))x.status='Cancelled';
  const fallbackId=x.appointmentId?'samples':'routine';
  if(!x.templateId||!state.nurseTemplates.some(t=>t.id===x.templateId))x.templateId=fallbackId;
  if(!Array.isArray(x.templateSteps))x.templateSteps=normalizedStepIds([...state.nurseTemplates.find(t=>t.id===x.templateId).steps,...Object.keys(x.steps)],!!x.appointmentId);
 }
 for(const r of state.requests){
  r.route=automaticRoute(r);
  if(r.route==='Nurse'&&['Pending','Appointment needed'].includes(r.status)&&!state.examinations.some(x=>x.requestId===r.id)){
   const exam={id:'exam-'+r.id,patient:r.patient,requestId:r.id,title:r.title,status:'In progress',steps:{},history:[]};
   applyTemplateToExam(exam,state.nurseTemplates.find(t=>t.id==='routine'));state.examinations.push(exam);
  }
 }
 for(const a of state.appointments.filter(a=>a.status==='Booked'&&a.kind==='Laboratory'&&a.orderId)){
  if(!state.examinations.some(x=>x.appointmentId===a.id)){
   const exam={id:'exam-'+a.id,patient:a.patient,requestId:a.orderId,appointmentId:a.id,title:'Sample collection · '+a.title,status:'In progress',steps:{},history:[]};
   applyTemplateToExam(exam,state.nurseTemplates.find(t=>t.id==='samples'));state.examinations.push(exam);
  }
 }
}
export function nursingTimestamp(value){return value?new Date(value).toLocaleString('en-GB',{timeZone:'Europe/Ljubljana',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'';}
export function nursingRecordHTML(state,person,{icon,escapeHTML:e}){
 const records=(state.examinations||[]).filter(x=>x.patient===person&&Object.keys(x.steps).length);
 return `<section class="panel nursing-summary"><div class="panel-head"><div><p class="eyebrow">SHARED EXAMINATION RECORD</p><h2>Steps recorded by the nurse</h2></div>${icon('checkCircle')}</div>${records.length?records.map(x=>{
  const steps=stepsForExam(x),template=state.nurseTemplates.find(t=>t.id===x.templateId);
  return `<article class="nursing-record"><div class="status-top"><h3>${e(x.title)}</h3><span class="pill ${x.status==='Completed'?'':'amber'}">${e(x.status)}</span></div><p class="small muted">${e(template?.name||'Nurse checklist')} · Nurse Maja Petrič${x.completedAt?' · Finished '+nursingTimestamp(x.completedAt):''}</p>${steps.filter(s=>x.steps[s.id]).map(s=>{const entry=x.steps[s.id];return `<div class="nursing-summary-step">${icon(entry.value==='Done'?'checkCircle':'clock')}<div><strong>${e(s.label)} · ${e(entry.value)}</strong><small>${e(entry.by)} · ${nursingTimestamp(entry.at)}</small></div></div>`;}).join('')}<p class="small muted">${steps.length-steps.filter(s=>x.steps[s.id]).length} steps not yet recorded</p></article>`;
 }).join(''):'<p class="empty">No examination steps have been recorded for this patient yet. Saved nurse steps appear here automatically.</p>'}</section>`;
}
export function renderNurse(state,{icon,escapeHTML:e,passportHTML}){
 const active=state.nurseFilter!=='Completed';
 const exams=state.examinations.filter(x=>active?x.status==='In progress':x.status==='Completed');
 const exam=exams.find(x=>x.id===state.selectedExam)||exams[0];
 const admins=state.requests.filter(r=>r.route==='Administration'&&r.status==='Pending');
 return `<div class="intro"><div><p class="eyebrow">NURSE WORKSPACE · MAJA PETRIČ</p><h1>Record each step, once.</h1><p>Apply a reusable checklist, then record what was completed. The doctor sees the saved steps automatically.</p></div><span class="step-label">${icon('users')} ${exams.length} ${active?'open':'completed'} examinations</span></div><div class="doctor-layout"><section class="panel queue-panel"><div class="panel-head"><h2>Nursing examinations</h2></div><div class="filters"><button class="filter ${active?'active':''}" data-action="nurse-filter" data-value="Open">Open</button><button class="filter ${!active?'active':''}" data-action="nurse-filter" data-value="Completed">Completed</button></div>${exams.map(x=>{const steps=stepsForExam(x);return `<button class="queue-row ${exam?.id===x.id?'selected':''}" data-action="select-exam" data-id="${e(x.id)}"><div class="queue-patient"><strong>${e(state.patients[x.patient].name)}</strong><span class="pill">${steps.filter(s=>x.steps[s.id]).length}/${steps.length} recorded</span></div><h3>${e(x.title)}</h3><p>${x.appointmentId?'Approved laboratory appointment':'Automatically assigned to nurse'}</p></button>`;}).join('')||'<p class="empty">No examinations in this list.</p>'}<div class="record-group"><h3>${icon('file')} Administrative requests</h3>${admins.map(r=>`<article class="admin-task"><strong>${e(state.patients[r.patient].name)}</strong><p>${e(r.title)}</p><button class="btn" data-action="complete-admin" data-id="${e(r.id)}">${icon('check')} Complete request</button></article>`).join('')||'<p class="small muted">No administrative requests pending.</p>'}</div></section><div class="stack" id="request-detail">${exam?examDetail(exam):'<section class="panel"><h2>Select an examination</h2><p class="empty">Nurse-directed patient requests and booked lab collections appear here automatically.</p></section>'}</div></div>`;
 function examDetail(x){
  const completed=x.status==='Completed',steps=stepsForExam(x),template=state.nurseTemplates.find(t=>t.id===x.templateId),request=state.requests.find(r=>r.id===x.requestId);
  const draft=state.nurseTemplateDraft?.id===x.templateId?state.nurseTemplateDraft:null;
  return `<section class="panel"><div class="panel-head"><div><p class="eyebrow">${e(state.patients[x.patient].name)} · EXAMINATION</p><h2>${e(x.title)}</h2></div><span class="pill ${completed?'':'amber'}">${e(x.status)}</span></div><div class="notice">${icon('passport')}<span>Use the same patient record. Each saved step records who completed it and when.</span></div>${request?`<details class="nurse-answers"><summary>View patient’s selected answers</summary>${request.answers.map(([q,a])=>`<p><strong>${e(q)}</strong><br>${e(a)}</p>`).join('')}</details>`:''}
  <div class="nurse-template-panel"><div class="template-heading"><div><p class="eyebrow">REUSABLE CHECKLISTS</p><h3>Start with a common template</h3></div>${icon('file')}</div>${completed?`<p class="small muted">Used: ${e(template?.name||'Nurse checklist')}</p>`:`<div class="template-grid">${state.nurseTemplates.map(t=>`<button class="template-choice ${t.id===x.templateId?'selected':''}" data-action="apply-nurse-template" data-id="${e(x.id)}" data-template="${e(t.id)}" aria-pressed="${t.id===x.templateId}"><strong>${e(t.name)}</strong><small>${e(t.description)}</small><span>${t.steps.length} steps · ${t.id===x.templateId?'In use':'Apply'}</span></button>`).join('')}</div><button class="btn template-edit" data-action="edit-nurse-template" data-id="${e(x.id)}">${icon('settings')} Customize ${e(template?.name||'template')}</button><p class="small muted">Saved changes to a template can be used again for other patients. Applying it never marks a step as completed.</p>${draft?`<div class="template-editor"><h3>Choose steps to keep</h3><p class="small muted">Required identity, Passport, answers and next-step checks stay in every template.</p><div class="template-step-grid">${examinationSteps.map(s=>{const locked=s.required||(draft.id==='samples'&&s.id==='sample');const selected=draft.steps.includes(s.id);return `<button class="template-step ${selected?'selected':''}" data-action="toggle-nurse-template-step" data-id="${e(x.id)}" data-step="${s.id}" aria-pressed="${selected}" ${locked?'disabled':''}><span class="choice-box">${selected?icon('check'):''}</span><span>${e(s.label)}${locked?'<small>Always included</small>':''}</span></button>`;}).join('')}</div><div class="template-editor-actions"><button class="btn primary" data-action="save-nurse-template" data-id="${e(x.id)}">${icon('check')} Save template</button><button class="btn" data-action="cancel-nurse-template">Cancel</button></div></div>`:''}`}</div>
  <div class="nurse-checklist"><div class="template-heading"><h3>Examination steps</h3><span class="pill">${steps.filter(s=>x.steps[s.id]).length}/${steps.length} recorded</span></div>${steps.map(s=>{const entry=x.steps[s.id],required=s.required||!!x.appointmentId&&s.id==='sample';return `<article class="nurse-step"><h3>${e(s.label)}${required?'<span class="required-step">Required</span>':''}</h3><p>${e(s.detail)}</p><div class="step-options" role="group" aria-label="${e(s.label)}">${['Done',...(!required?['Not applicable']:[])].map(v=>`<button class="btn ${entry?.value===v?'primary':''}" data-action="exam-step" data-id="${e(x.id)}" data-step="${s.id}" data-value="${v}" aria-pressed="${entry?.value===v}" ${completed?'disabled':''}>${icon(v==='Done'?'check':'x')} ${v}</button>`).join('')}${entry&&!completed?`<button class="btn subtle" data-action="exam-step" data-id="${e(x.id)}" data-step="${s.id}" data-value="clear">Undo step</button>`:''}</div><p class="step-stamp">${entry?e(entry.by)+' · '+nursingTimestamp(entry.at):'Not yet recorded'}</p></article>`;}).join('')}</div>${completed?`<div class="notice">${icon('checkCircle')}<span>Completed by Nurse Maja Petrič · ${nursingTimestamp(x.completedAt)}. This signed demo record is read-only.</span></div>`:`<button class="btn primary full" data-action="finish-exam" data-id="${e(x.id)}" ${!canFinishExamination(x)?'disabled':''}>${icon('checkCircle')} Complete examination record</button><p class="small muted" style="margin-top:10px">Complete every required step and mark included optional steps Done or Not applicable.</p>`}${x.history?.length?`<details class="nurse-answers"><summary>Step history · ${x.history.length} updates</summary>${x.history.slice().reverse().map(h=>`<p><strong>${e(examinationSteps.find(s=>s.id===h.step)?.label||h.step)} · ${e(h.value)}</strong><br>${e(h.by)} · ${nursingTimestamp(h.at)}</p>`).join('')}</details>`:''}<p class="warning-note">Illustrative workflow checklist. Completed observations are recorded as steps; this demo does not capture measurements or replace a clinical protocol.</p></section>${passportHTML(x.patient,true)}`;
 }
}
