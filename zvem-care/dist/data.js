export const seed = {
 version:2, patient:'ana', selectedRequest:'r1', filter:'Pending',
 patients:{
  ana:{id:'ana',name:'Ana Novak',dob:'12 May 1988',insurance:'DEMO 2847 0193',doctor:'Dr. Nina Kovač',allergies:['Penicillin'],conditions:['Hypothyroidism'],medications:[{id:'m1',name:'Euthyrox',dose:'50 mcg',when:'Once daily · morning'},{id:'m2',name:'Vitamin D3',dose:'1,000 IU',when:'Once daily · with a meal'}],operations:[{name:'Appendectomy',date:'March 2014'}]},
  marija:{id:'marija',name:'Marija Novak',dob:'21 February 1959',insurance:'DEMO 2847 0531',doctor:'Dr. Nina Kovač',allergies:['No recorded allergies'],conditions:['Hypertension'],medications:[{id:'m3',name:'Amlodipine',dose:'5 mg',when:'Once daily · morning'}],operations:[{name:'Cataract surgery',date:'June 2022'}]}
 },
 appointments:[
  {id:'a1',patient:'ana',date:'2026-10-20',time:'09:30',title:'Regular check-up',kind:'Consultation',place:'Health Centre Ljubljana · Room 12',status:'Booked'},
  {id:'a2',patient:'ana',date:'2026-10-28',time:'08:15',title:'Routine blood test',kind:'Laboratory',place:'Health Centre Ljubljana · Laboratory',status:'Booked'},
  {id:'a3',patient:'marija',date:'2026-10-23',time:'10:00',title:'Regular check-up',kind:'Consultation',place:'Health Centre Ljubljana · Room 12',status:'Booked'}
 ],
 slots:[{id:'n1',date:'2026-10-21',time:'08:30',kind:'Nurse'},{id:'n2',date:'2026-10-22',time:'11:30',kind:'Nurse'},{id:'s1',date:'2026-10-21',time:'09:00',kind:'Consultation'},{id:'s2',date:'2026-10-22',time:'10:30',kind:'Consultation'},{id:'s3',date:'2026-10-26',time:'11:00',kind:'Consultation'},{id:'l1',date:'2026-10-22',time:'07:30',kind:'Laboratory'},{id:'l2',date:'2026-10-26',time:'08:00',kind:'Laboratory'}],
 requests:[{id:'r1',patient:'ana',type:'Symptoms',title:'New health concern',category:'Medical',route:'Nurse',status:'Pending',answers:[['Urgent help needed?','No'],['Main concern','Cold or throat symptoms'],['Symptoms','Cough; sore throat'],['Duration','A few days']],created:'Today · 08:45'},
 {id:'r2',patient:'marija',type:'Prescription',title:'Repeat prescription: Amlodipine',category:'Medical',route:'Doctor',status:'Pending',medications:['m3'],answers:[['Medication','Amlodipine 5 mg'],['Details','Existing prescription attached']],created:'Today · 08:30'},
 {id:'r3',patient:'ana',type:'Administrative',title:'Attendance confirmation',category:'Administrative',route:'Administration',status:'Pending',answers:[['Request','Attendance confirmation']],created:'Today · 08:15'}],
 waitingList:[{patient:'marija',appointment:'a3',enabled:true},{patient:'ana',appointment:'a1',enabled:true}], offers:[], activity:[], reminders:{ana:true,marija:true}, ticket:0
};
export const concernOptions = [
 {value:'cold',label:'Cold or throat symptoms',icon:'activity'},
 {value:'pain',label:'Pain or discomfort',icon:'heart'},
 {value:'urine',label:'A urinary problem',icon:'activity'},
 {value:'ongoing',label:'An ongoing condition',icon:'file'},
 {value:'other',label:'Other symptoms',icon:'activity'},
 {value:'unsure',label:'I’m not sure',icon:'help'}
];
export const branchOptions = {
 other:{question:'Tell us about your symptoms',choices:['Other']},
 cold:{question:'What are you experiencing?',choices:['Cough','Sore throat','Blocked or runny nose','Feeling feverish','I’m not sure']},
 pain:{question:'Where is the discomfort?',choices:['Head','Back or joints','Stomach','Somewhere else / I’m not sure']},
 urine:{question:'What has changed?',choices:['Discomfort when passing urine','Going more often','A change I’m worried about','I’m not sure']},
 ongoing:{question:'What do you need help with?',choices:['A regular follow-up','My medication','A change in how I feel','I’m not sure']}
};
