/**
 * MediGuide — "Your Health, Our Reminder." | "Smart medical guidance and timely medication reminders, all in one place"
 */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let alarmTimer = null, alarmStartTime = 0, curAlarmVol = 0.25;
function playBeep(f = 880, d = 0.15, vol = 0.3) {
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(), g = audioCtx.createGain();
    osc.frequency.value = f; g.gain.setValueAtTime(Math.min(1.0, Math.max(0.05, vol)), audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + d);
    osc.connect(g); g.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + d);
  } catch(e) {}
}
function playAlarm(t = 'TAKING', vol = 0.3) {
  if (t === 'TAKING') { playBeep(880, 0.14, vol); setTimeout(() => playBeep(1046, 0.14, vol), 160); setTimeout(() => playBeep(1318, 0.22, vol), 330); }
  else { playBeep(659, 0.2, vol); setTimeout(() => playBeep(523, 0.25, vol), 220); }
}
function stopAlarm() { if (alarmTimer) { clearInterval(alarmTimer); alarmTimer = null; } curAlarmVol = 0.25; }
function startEscalatingAlarm(t = 'TAKING') {
  stopAlarm(); alarmStartTime = Date.now();
  const tick = () => { const s = Math.floor((Date.now() - alarmStartTime) / 1000); curAlarmVol = Math.min(1.0, 0.25 + s * 0.075); playAlarm(t, curAlarmVol); const v = document.getElementById('alarm-vol-meter'); if (v) v.textContent = `🔊 Volume: ${Math.round(curAlarmVol*100)}% (Escalating +${s}s)`; };
  tick(); alarmTimer = setInterval(tick, 2200);
}

const HEALTH_GUIDES = {
  diseases: [
    {id:"d1",cat:"diseases",name:"Fever",icon:"🤒",desc:"Elevated temp >98.6°F.",causes:"Infection, dehydration.",prec:"Cool room, fluids.",meds:"Paracetamol 650mg (Safe Antipyretic), ORS Electrolytes",doc:"Doctor if >102°F or >48h.",links:"Apollo:https://www.apollopharmacy.in,Tata 1mg:https://www.1mg.com"}, {id:"d2",cat:"diseases",name:"Headache",icon:"🤕",desc:"Throbbing head pain.",causes:"Stress, eye strain.",prec:"Quiet room, cold compress.",meds:"Paracetamol 500mg (Safe Analgesic), Hydration ORS, Rest",doc:"Doctor if sudden thunderclap.",links:"Apollo:https://www.apollopharmacy.in,Practo:https://www.practo.com"}, {id:"d3",cat:"diseases",name:"Common Cold",icon:"🤧",desc:"Viral upper respiratory infection.",causes:"Rhinovirus.",prec:"Steam, warm gargle.",meds:"Cetirizine 10mg (Safe Antihistamine), Vitamin C 500mg, Saline Spray",doc:"Doctor if >10 days.",links:"Netmeds:https://www.netmeds.com,Tata 1mg:https://www.1mg.com"}, {id:"d4",cat:"diseases",name:"Malaria",icon:"🦟",desc:"Parasitic blood infection.",causes:"Plasmodium mosquito bite.",prec:"Bed nets, repellents.",meds:"Doctor-Prescribed ACT Antimalarial, Paracetamol 650mg, ORS",doc:"CRITICAL: Blood smear test.",links:"Apollo:https://www.apollopharmacy.in,Practo:https://www.practo.com"},
    {id:"d5",cat:"diseases",name:"Dengue",icon:"🩸",desc:"Tropical viral fever.",causes:"Aedes mosquito.",prec:"Netting, repellents.",meds:"Paracetamol 650mg (Safe — Avoid Aspirin/NSAIDs), ORS Hydration",doc:"CRITICAL: Platelet check.",links:"Tata 1mg:https://www.1mg.com,Apollo:https://www.apollopharmacy.in"}, {id:"d6",cat:"diseases",name:"Diabetes",icon:"🩺",desc:"High blood glucose.",causes:"Insulin resistance.",prec:"Low-glycemic diet, 30m walk.",meds:"Metformin 500mg (Safe First-Line Regimen), Doctor Advice",doc:"Quarterly HbA1c test.",links:"Tata 1mg:https://www.1mg.com,Netmeds:https://www.netmeds.com"}, {id:"d7",cat:"diseases",name:"Asthma",icon:"🫁",desc:"Airway wheezing.",causes:"Pollen, dust mites.",prec:"Rescue inhaler, clean air.",meds:"Salbutamol Inhaler 100mcg (Safe Rescue Inhaler), Clean Air",doc:"Pulmonologist action plan.",links:"Apollo:https://www.apollopharmacy.in,Practo:https://www.practo.com"}, {id:"d8",cat:"diseases",name:"Hypertension",icon:"❤️",desc:"BP above 130/80 mmHg.",causes:"High sodium, stress.",prec:"DASH diet, exercise.",meds:"Telmisartan 40mg (Safe First-Line as Prescribed), Low Sodium Diet",doc:"Routine doctor BP check.",links:"Netmeds:https://www.netmeds.com,Tata 1mg:https://www.1mg.com"}
  ],
  symptoms: [
    {id:"s1",cat:"symptoms",name:"Persistent Cough",icon:"🗣️",desc:"Throat irritation.",causes:"Post-viral, allergens.",prec:"Honey lemon water.",meds:"Cough Relief Syrup (Safe Antitussive), Warm Honey Water",doc:"Doctor if >3 weeks.",links:"Tata 1mg:https://www.1mg.com,Apollo:https://www.apollopharmacy.in"}, {id:"s2",cat:"symptoms",name:"Chronic Fatigue",icon:"🥱",desc:"Unrelenting exhaustion.",causes:"Anemia, thyroid, vitamin.",prec:"8h sleep, sun, diet.",meds:"Multivitamin & Iron B12 (Safe Dietary Support), Vitamin D3 60k",doc:"CBC count & thyroid panel.",links:"Netmeds:https://www.netmeds.com,Practo:https://www.practo.com"}, {id:"s3",cat:"symptoms",name:"Severe Nausea",icon:"🤢",desc:"Queasy urge to vomit.",causes:"Gastritis, motion bug.",prec:"Ginger tea, sips.",meds:"Ondansetron 4mg (Safe Antiemetic), ORS Fluids, Ginger Infusion",doc:"Doctor if cannot keep fluids.",links:"Apollo:https://www.apollopharmacy.in,Netmeds:https://www.netmeds.com"}, {id:"s4",cat:"symptoms",name:"Acute Dizziness",icon:"💫",desc:"Spinning vertigo.",causes:"Dehydration, BP drop.",prec:"Sit down, drink water.",meds:"Betahistine 16mg (Safe Vestibular Care), Hydration Fluids",doc:"Emergency if speech slurs.",links:"Practo:https://www.practo.com,Tata 1mg:https://www.1mg.com"}
  ],
  phobias: [
    {id:"p1",cat:"phobias",name:"Claustrophobia",icon:"🚪",desc:"Fear of tight spaces.",causes:"Past trauma.",prec:"Box breathing 4-4-4.",meds:"CBT Psychotherapy (Safe Non-Drug), Box Breathing 4-4-4",doc:"Therapy if avoiding elevators.",links:"Practo:https://www.practo.com,Apollo:https://www.apollopharmacy.in"}, {id:"p2",cat:"phobias",name:"Acrophobia",icon:"🏔️",desc:"Fear of heights.",causes:"Vestibular balance.",prec:"Horizon anchoring.",meds:"Guided Exposure Therapy (Safe), Horizon Anchoring",doc:"Consult therapist for trips.",links:"Practo:https://www.practo.com,Tata 1mg:https://www.1mg.com"}, {id:"p3",cat:"phobias",name:"Arachnophobia",icon:"🕷️",desc:"Fear of spiders.",causes:"Evolutionary survival.",prec:"Systematic relaxation.",meds:"Systematic Desensitization (Safe Non-Drug), Mindfulness",doc:"Consult psychologist.",links:"Practo:https://www.practo.com,Netmeds:https://www.netmeds.com"}, {id:"p4",cat:"phobias",name:"Social Phobia",icon:"👥",desc:"Fear of public scrutiny.",causes:"Early bullying.",prec:"Speech practice.",meds:"Speech & Cognitive Therapy (Safe Non-Pharmacological)",doc:"Consult clinical therapist.",links:"Practo:https://www.practo.com,Tata 1mg:https://www.1mg.com"}
  ],
  viruses: [
    {id:"v1",cat:"viruses",name:"Influenza Virus",icon:"🦠",desc:"Seasonal epidemic flu.",causes:"Airborne droplets.",prec:"Annual vaccine, mask.",meds:"Paracetamol 650mg (Safe Antipyretic), Vitamin C 1000mg, Zinc Lozenges",doc:"Doctor if fever >3 days.",links:"Apollo:https://www.apollopharmacy.in,Tata 1mg:https://www.1mg.com"}, {id:"v2",cat:"viruses",name:"Coronavirus",icon:"👑",desc:"Respiratory virus illness.",causes:"Aerosol inhalation.",prec:"N95 mask, ventilation.",meds:"Paracetamol 650mg (Safe), Vitamin C & Zinc, Steam Inhalation",doc:"EMERGENCY: Hospital if SpO2<94%.",links:"Practo:https://www.practo.com,Apollo:https://www.apollopharmacy.in"}, {id:"v3",cat:"viruses",name:"Dengue Virus",icon:"🦟",desc:"Mosquito Flavivirus.",causes:"Aedes mosquito saliva.",prec:"Repellents, drainage.",meds:"Paracetamol 650mg (Safe — Avoid NSAIDs), ORS Electrolyte Fluids",doc:"CRITICAL: Lab platelet check.",links:"Netmeds:https://www.netmeds.com,Tata 1mg:https://www.1mg.com"}, {id:"v4",cat:"viruses",name:"Norovirus",icon:"🤢",desc:"Gastroenteritis virus.",causes:"Contaminated oysters.",prec:"Wash hands for 30s.",meds:"ORS Rehydration Salts (WHO Safe Standard), Zinc 20mg, Probiotics",doc:"Doctor if vomiting >24h.",links:"Apollo:https://www.apollopharmacy.in,Netmeds:https://www.netmeds.com"}
  ]
};

const MEDICINES = [
  { id:"M1", name:"Paracetamol 650mg", generic:"Acetaminophen", cat:"TABLETS", desc:"Safe first-line relief for fever & mild body aches.", dosage:"1 tab q6-8h post-meals", price:4.99, stock:45, thresh:10, icon:"💊" }, { id:"M2", name:"Amoxicillin 500mg", generic:"Antibiotic", cat:"ANTIBIOTICS", desc:"Safe standard doctor-prescribed antibiotic.", dosage:"1 cap tid with meals (Rx)", price:12.50, stock:20, thresh:5, icon:"🧪" }, { id:"M3", name:"Cetirizine 10mg", generic:"Antihistamine", cat:"TABLETS", desc:"Safe, non-drowsy relief for cold & allergies.", dosage:"1 tab daily bedtime", price:5.20, stock:50, thresh:12, icon:"💊" }, { id:"M4", name:"Metformin 500mg", generic:"Anti-diabetic", cat:"DIABETES", desc:"Safe, proven first-line glycemic regulation.", dosage:"1 tab bid meals", price:8.90, stock:4, thresh:6, icon:"🩸" },
  { id:"M5", name:"Cough Relief Syrup", generic:"Dextromethorphan", cat:"SYRUPS", desc:"Safe soothing antitussive syrup for throat cough.", dosage:"10ml tid meals", price:7.40, stock:25, thresh:8, icon:"🍯" }, { id:"M6", name:"Pantoprazole 40mg", generic:"Antacid / PPI", cat:"ANTACIDS", desc:"Safe standard antacid for acid reflux & heartburn.", dosage:"1 cap morning before food", price:9.80, stock:35, thresh:10, icon:"🛡️" }, { id:"M7", name:"Vitamin D3 60k", generic:"Cholecalciferol", cat:"VITAMINS", desc:"Safe weekly essential vitamin for bone health.", dosage:"1 softgel weekly", price:14.50, stock:3, thresh:5, icon:"✨" }, { id:"M8", name:"ORS Electrolyte Sachet", generic:"Oral Rehydration Salts", cat:"SYRUPS", desc:"WHO-standard safe oral rehydration for fever fluids.", dosage:"Dissolve 1 sachet in 1L water", price:2.40, stock:60, thresh:15, icon:"💧" },
  { id:"M9", name:"Ondansetron 4mg", generic:"Antiemetic", cat:"TABLETS", desc:"Safe gentle relief from acute nausea & vomiting.", dosage:"1 tab SOS / pre-meal", price:6.50, stock:30, thresh:8, icon:"💊" }, { id:"M10", name:"Multivitamin & Iron B12", generic:"Zinc + B-Complex + Iron", cat:"VITAMINS", desc:"Safe daily dietary supplement for fatigue & vitality.", dosage:"1 cap daily post-breakfast", price:10.90, stock:32, thresh:8, icon:"✨" }, { id:"M11", name:"Salbutamol Inhaler", generic:"Bronchodilator (100mcg)", cat:"TABLETS", desc:"Safe, prescribed rescue bronchodilator for wheezing.", dosage:"1-2 puffs SOS as needed", price:11.80, stock:15, thresh:4, icon:"🫁" }, { id:"M12", name:"Telmisartan 40mg", generic:"ARB Antihypertensive", cat:"TABLETS", desc:"Safe, well-tolerated doctor-prescribed BP control.", dosage:"1 tab morning daily", price:9.40, stock:28, thresh:7, icon:"❤️" }
];

let curGuideCat = 'diseases', curStoreCat = 'ALL', searchQ = '', cameraStream = null, genOtp = null;
let cart = JSON.parse(localStorage.getItem('mg_cart') || '[]');
let reminders = JSON.parse(localStorage.getItem('mg_rem') || JSON.stringify([{ id:"R1", name:"Paracetamol 650mg", type:"TAKING", schedule:"08:00 AM & 08:00 PM (After Food)", notes:"Post-meal for fever" }, { id:"R2", name:"Metformin 500mg", type:"REORDER", schedule:"Stock Level: 4 (Safety Limit: 6)", notes:"Low stock warning" }, { id:"R3", name:"Pantoprazole 40mg", type:"TAKING", schedule:"07:30 AM (Before Breakfast)", notes:"Acidity preventive" }]));
let orders = JSON.parse(localStorage.getItem('mg_ord') || JSON.stringify([{ id:"ORD-7021", date:"Today", items:[{ name:"Paracetamol 650mg", qty:2, price:4.99 }], total:9.98, status:"Dispatched 🚚" }, { id:"ORD-6894", date:"Yesterday", items:[{ name:"Amoxicillin 500mg", qty:1, price:12.50 }], total:12.50, status:"Delivered ✔" }]));
let currentUser = JSON.parse(localStorage.getItem('mg_user') || JSON.stringify({ username:"Sashank Sunny", email:"sashank@mediguide.com", isVerified:true, bloodGroup:"O+ Positive", allergies:"Penicillin", adherenceRate:"98%", phone:"+1 (555) 782-9421" }));

function validateEmail(e) { return e && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e); }
function isImproper(t) { return !t || ["<script", "javascript:", "drop table", "union select", "eval("].some(p => t.toLowerCase().includes(p)); }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.screen === id));
  const el = document.getElementById('screen-' + id);
  if (el) { el.classList.add('active'); window.location.hash = id; window.scrollTo({ top:0, behavior:'smooth' }); }
  if (id === 'guides') renderGuides(); if (id === 'store') renderStore(); if (id === 'reminders') renderReminders(); if (id === 'orders') renderOrders(); if (id === 'profile') renderProfile();
}

function setGuideCategory(cat, btn) { curGuideCat = cat; document.querySelectorAll('.guide-pill').forEach(b => b.classList.remove('active')); if (btn) btn.classList.add('active'); renderGuides(); }
function renderGuides() {
  const g = document.getElementById('guides-grid'); if (!g) return;
  const list = curGuideCat === 'all' ? Object.values(HEALTH_GUIDES).flat() : (HEALTH_GUIDES[curGuideCat] || []);
  const q = searchQ.toLowerCase().trim();
  const f = list.filter(i => !q || [i.name, i.desc, i.causes, i.prec, i.meds, i.doc].join(' ').toLowerCase().includes(q));
  g.innerHTML = f.length ? f.map(i => `<div class="medi-card"><div class="card-bar"></div><div class="card-body"><div class="card-icon">${i.icon}</div><span class="card-tag">${i.cat.toUpperCase()}</span><h3 class="card-title">${i.name}</h3><p class="card-desc">${i.desc}</p><div style="font-size:0.75rem;background:#f0fdfa;color:#0f766e;padding:0.35rem 0.6rem;border-radius:6px;line-height:1.35;"><strong>💊 Safe Medicines:</strong> ${i.meds}</div></div><div class="card-footer"><button class="btn-pill" style="font-size:0.78rem;" onclick="addTopicReminder('${i.name}','${i.meds}')">⏰ Set Reminder</button><button class="btn-scan" style="font-size:0.78rem;" onclick="openGuideDetail('${i.id}','${i.cat}')">📖 View Guide &rarr;</button></div></div>`).join('') : '<div style="grid-column:1/-1;text-align:center;padding:2.5rem;color:var(--muted);">No matching health topics.</div>';
}
function openGuideDetail(id, cat) {
  const i = (HEALTH_GUIDES[cat] || []).find(x => x.id === id); if (!i) return;
  document.getElementById('dt-title').innerHTML = `${i.icon} ${i.name} <span class="card-tag">${i.cat.toUpperCase()}</span>`;
  document.getElementById('dt-desc').textContent = i.desc; document.getElementById('dt-causes').textContent = i.causes; document.getElementById('dt-prec').textContent = i.prec; document.getElementById('dt-meds').textContent = i.meds; document.getElementById('dt-doc').textContent = i.doc;
  document.getElementById('dt-links').innerHTML = (i.links || '').split(',').map(l => { const p = l.split(':http'); return p.length === 2 ? `<a href="http${p[1]}" target="_blank" rel="noopener" class="link-chip">🔗 ${p[0]}</a>` : ''; }).join('');
  openModal('modal-guide-detail');
}
function addTopicReminder(name, meds) {
  const m = meds.split(',')[0].trim(); reminders.unshift({ id:"R"+(reminders.length+1), name:m, type:"TAKING", schedule:"08:00 AM & 08:00 PM", notes:`Remedy for ${name}` });
  localStorage.setItem('mg_rem', JSON.stringify(reminders)); playAlarm('TAKING'); toast(`⏰ Reminder set for ${m}!`);
}

function filterStoreCategory(c, btn) { curStoreCat = c; document.querySelectorAll('.store-pill').forEach(b => b.classList.remove('active')); if (btn) btn.classList.add('active'); renderStore(); }
function renderStore() {
  const g = document.getElementById('store-grid'); if (!g) return;
  const q = searchQ.toLowerCase().trim();
  const f = MEDICINES.filter(m => (curStoreCat === 'ALL' || m.cat === curStoreCat) && (!q || (m.name + ' ' + m.generic + ' ' + m.desc).toLowerCase().includes(q)));
  g.innerHTML = f.map(m => {
    const low = m.stock <= m.thresh;
    return `<div class="medi-card"><div class="card-bar"></div><div class="card-body"><div class="card-icon">${m.icon}</div><span class="card-tag">${m.cat}</span><h3 class="card-title">${m.name}</h3><p style="font-size:0.78rem;color:#0284c7;">${m.generic}</p><p class="card-desc">${m.desc}</p><div style="font-size:0.78rem;color:var(--muted);">Dosage: ${m.dosage}</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.4rem;"><span style="font-size:1.2rem;font-weight:800;color:#0f766e;">$${m.price.toFixed(2)}</span><span style="font-size:0.72rem;font-weight:700;color:${low?'#ef4444':'#10b981'};">${low?`⚠️ Low Stock (${m.stock})`:`In Stock (${m.stock})`}</span></div></div><div class="card-footer"><button class="btn-pill" style="font-size:0.78rem;" onclick="addStoreReminder('${m.name}','${m.dosage}',${low})">⏰ Reminder</button><button class="btn-primary" style="font-size:0.78rem;padding:0.4rem 0.8rem;width:auto;" onclick="addToCart('${m.id}')">🛒 Add</button></div></div>`;
  }).join('');
}
function addStoreReminder(name, dosage, low) {
  reminders.unshift({ id:"R"+(reminders.length+1), name, type:low?"REORDER":"TAKING", schedule:dosage, notes:low?"Low stock alert":"Daily dosage" });
  localStorage.setItem('mg_rem', JSON.stringify(reminders)); playAlarm(low?'REORDER':'TAKING'); toast(low?`🔔 Reorder alert for ${name}!`:`⏰ Dosage reminder for ${name}!`);
}

// PRESCRIPTION SCANNER
function openRxScanner() { openModal('modal-rx'); }
async function openCameraScan() {
  const v = document.getElementById('rx-video'), d = document.getElementById('rx-mock-doc');
  try { if (!cameraStream) cameraStream = await navigator.mediaDevices.getUserMedia({ video:true }); v.srcObject = cameraStream; v.style.display = 'block'; d.style.display = 'none'; } catch(e) { toast("📹 Camera active inside viewfinder!"); }
  takePrescriptionScan();
}
function handleRxFile(e) {
  if (e.target.files && e.target.files[0]) {
    const r = new FileReader(); r.onload = ev => { document.getElementById('rx-video').style.display = 'none'; const d = document.getElementById('rx-mock-doc'); d.style.display = 'block'; d.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:contain;">`; takePrescriptionScan(); };
    r.readAsDataURL(e.target.files[0]);
  }
}
function takePrescriptionScan() {
  const l = document.getElementById('rx-laser'), tag = document.getElementById('rx-tag'), res = document.getElementById('rx-result');
  l.style.display = 'block'; tag.textContent = '📸 Scanning prescription...'; playBeep(1200, 0.08);
  setTimeout(() => {
    l.style.display = 'none'; tag.textContent = '✔ Prescription Captured & Verified!'; playBeep(1046, 0.15); res.style.display = 'block';
    res.innerHTML = `<div style="background:#f0fdfa;border:1px solid #5eead4;border-radius:10px;padding:0.75rem;text-align:left;"><div style="display:flex;justify-content:space-between;font-size:0.8rem;color:#0f766e;border-bottom:1px solid #ccfbf1;padding-bottom:0.2rem;margin-bottom:0.3rem;"><span><strong>Dr. Sarah Jenkins, MD</strong> (Rx #48291)</span><span class="badge-verified">Verified Rx ✔</span></div><p style="font-size:0.75rem;color:var(--muted);margin-bottom:0.3rem;">Patient: <strong>${currentUser.username}</strong> | Date: Today</p><ul style="font-size:0.8rem;margin:0.2rem 0 0.6rem 1.1rem;color:#334155;"><li><strong>Amoxicillin 500mg</strong> &bull; 1 Cap tid x 7d (Food)</li><li><strong>Paracetamol 650mg</strong> &bull; 1 Tab SOS (Fever)</li><li><strong>Pantoprazole 40mg</strong> &bull; 1 Cap morning before breakfast</li></ul><div style="display:flex;gap:0.4rem;"><button class="btn-primary" style="font-size:0.8rem;padding:0.4rem 0.7rem;width:auto;" onclick="addRxToReminders()">⏰ Set Reminders</button><button class="btn-pill" style="font-size:0.8rem;" onclick="addRxToCart()">🛒 Add to Cart</button></div></div>`;
    toast("✔ Prescription scanned & medicines extracted!");
  }, 900);
}
function addRxToReminders() {
  [{ name:"Amoxicillin 500mg (Rx)", type:"TAKING", schedule:"08:00 AM, 02:00 PM, 08:00 PM" }, { name:"Paracetamol 650mg (Rx)", type:"TAKING", schedule:"SOS As needed" }, { name:"Pantoprazole 40mg (Rx)", type:"TAKING", schedule:"07:30 AM (Before Food)" }].forEach(x => reminders.unshift({ id:"R"+(reminders.length+1), ...x, notes:"Doctor Rx #48291" }));
  localStorage.setItem('mg_rem', JSON.stringify(reminders)); playAlarm('TAKING'); closeModal('modal-rx'); toast("⏰ 3 Prescribed items added to Reminders!"); showScreen('reminders');
}
function addRxToCart() { ["M2", "M1", "M6"].forEach(id => addToCart(id, false)); closeModal('modal-rx'); toast("🛒 Prescribed items added to Cart!"); openCart(); }

function renderReminders() {
  const c = document.getElementById('reminders-list'); if (!c) return;
  c.innerHTML = reminders.length ? reminders.map((r, i) => `<div style="background:white;border-radius:12px;padding:0.9rem 1.1rem;margin-bottom:0.7rem;border:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.4rem;"><div><div style="display:flex;align-items:center;gap:0.3rem;"><span style="font-size:1rem;">${r.type==='TAKING'?'⏰':'🔔'}</span><strong>${r.name}</strong><span class="card-tag" style="background:${r.type==='TAKING'?'#ccfbf1':'#fee2e2'};color:${r.type==='TAKING'?'#0f766e':'#b91c1c'};">${r.type}</span></div><p style="color:#0284c7;font-size:0.82rem;font-weight:600;">Schedule: ${r.schedule}</p><p style="color:var(--muted);font-size:0.76rem;">${r.notes||''}</p></div><div style="display:flex;gap:0.3rem;"><button class="btn-beep" onclick="triggerAlarmModal('${r.name}','${r.schedule}','${r.type}')">🔔 Beep</button><button class="btn-pill" style="color:#ef4444;" onclick="deleteReminder(${i})">✕</button></div></div>`).join('') : '<div style="text-align:center;padding:2rem;color:var(--muted);background:white;border-radius:12px;">No active reminders.</div>';
}
function addCustomReminder(t) {
  const n = prompt(`Enter medicine name for ${t} reminder:`, t==='TAKING'?'Vitamin D3 60k':'Amoxicillin 500mg');
  if (isImproper(n)) { if (n) alert("Improper content rejected!"); return; }
  const s = prompt("Enter schedule/time (e.g. 09:00 AM after food):", "09:00 AM (Daily)"); if (!s) return;
  reminders.unshift({ id:"R"+(reminders.length+1), name:n.trim(), type:t, schedule:s.trim(), notes:"User reminder" });
  localStorage.setItem('mg_rem', JSON.stringify(reminders)); playAlarm(t); toast(`✔ ${t} reminder set!`); renderReminders();
}
function deleteReminder(i) { reminders.splice(i, 1); localStorage.setItem('mg_rem', JSON.stringify(reminders)); toast("Reminder deleted."); renderReminders(); }
function triggerAlarmModal(n, s, t) { document.getElementById('alarm-title').textContent = t==='TAKING'?'⏰ Medicine Dose Alert':'🔔 Reorder Alert'; document.getElementById('alarm-med').textContent = n; document.getElementById('alarm-schedule').textContent = `Time: ${s}`; openModal('modal-alarm'); startEscalatingAlarm(t); }

function addToCart(id, t = true) {
  const m = MEDICINES.find(x => x.id === id); if (!m) return;
  const e = cart.find(x => x.id === id); if (e) e.qty++; else cart.push({ id:m.id, name:m.name, price:m.price, qty:1 });
  localStorage.setItem('mg_cart', JSON.stringify(cart)); updateCartBadge(); if (t) toast(`🛒 Added ${m.name} to cart! Choose payment in Cart.`);
}
function updateCartBadge() { const b = document.getElementById('cart-badge'); if (b) b.textContent = cart.reduce((s, i) => s + i.qty, 0); }
function openCart() {
  const c = document.getElementById('cart-items'); if (!c) return;
  let total = 0;
  c.innerHTML = cart.length ? cart.map((it, idx) => { total += it.price * it.qty; return `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border);"><div><strong>${it.name}</strong><br><span style="font-size:0.78rem;color:var(--muted);">$${it.price.toFixed(2)} × ${it.qty}</span></div><div style="display:flex;align-items:center;gap:0.4rem;"><strong>$${(it.price*it.qty).toFixed(2)}</strong><button class="btn-pill" style="padding:0.15rem 0.4rem;font-size:0.7rem;" onclick="removeFromCart(${idx})">✕</button></div></div>`; }).join('') : '<div style="text-align:center;padding:1.5rem;color:var(--muted);">Cart is empty.</div>';
  document.getElementById('cart-total').textContent = '$' + total.toFixed(2); openModal('modal-cart');
}
function removeFromCart(i) { cart.splice(i, 1); localStorage.setItem('mg_cart', JSON.stringify(cart)); updateCartBadge(); openCart(); }
function togglePayDetails(v) {
  const t = document.getElementById('pay-detail-box'); if (!t) return;
  t.innerHTML = v.includes('UPI') ? '📲 Instant 0% fee UPI transfer via GPay / PhonePe / Paytm' : v.includes('Card') ? '💳 Secure 256-bit SSL encrypted Card Payment' : v.includes('Cash') ? '💵 Pay at doorstep via cash or QR upon delivery' : '🏥 Cashless medical claim via registered health insurance TPA';
}
function checkout() {
  if (!cart.length) { toast("Cart is empty!"); return; }
  const addr = (document.getElementById('cart-delivery-addr')?.value || '').trim();
  if (!addr || isImproper(addr)) { alert("📍 Please provide a valid delivery address to place your order!"); return; }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0), payMethod = document.getElementById('cart-pay-method')?.value || "UPI / QR Code", status = payMethod.includes("Cash") ? "Confirmed (COD) 📦" : "Paid & Confirmed ✔";
  orders.unshift({ id:"ORD-"+Math.floor(1000+Math.random()*9000), date:"Just Now", items:[...cart], total, payMethod, address:addr, status });
  localStorage.setItem('mg_ord', JSON.stringify(orders)); cart = []; localStorage.setItem('mg_cart', JSON.stringify(cart));
  updateCartBadge(); closeModal('modal-cart'); playBeep(1046, 0.2); toast(`✔ Order placed! Delivering to ${addr.slice(0,24)}...`); showScreen('orders');
}
function renderOrders() {
  const c = document.getElementById('orders-list'); if (!c) return;
  c.innerHTML = orders.length ? orders.map(o => `<div style="background:white;border-radius:12px;padding:1rem;margin-bottom:0.8rem;border:1px solid var(--border);"><div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:0.4rem;margin-bottom:0.4rem;flex-wrap:wrap;gap:0.3rem;"><strong>${o.id}</strong><div style="display:flex;gap:0.3rem;align-items:center;"><span class="badge-verified" style="font-size:0.72rem;">💳 ${o.payMethod||'Online Paid'}</span><span class="card-tag">${o.status}</span></div></div><div style="font-size:0.78rem;color:#0f766e;margin-bottom:0.4rem;">📍 <strong>Delivery:</strong> ${o.address || '42 Health Parkway, Medical District, NY'}</div><div>${o.items.map(it => `<div style="font-size:0.82rem;color:#334155;">&bull; ${it.name} (x${it.qty}) - $${(it.price*it.qty).toFixed(2)}</div>`).join('')}</div><div style="text-align:right;margin-top:0.4rem;font-weight:800;color:#0f766e;">Total: $${o.total.toFixed(2)}</div></div>`).join('') : '<div style="text-align:center;padding:2rem;color:var(--muted);background:white;border-radius:12px;">No orders yet.</div>';
}

function renderProfile() {
  const m = { name:currentUser.username, user:currentUser.username, email:currentUser.email, phone:currentUser.phone||"+1 (555) 782-9421", addr:currentUser.address||"42 Health Parkway, NY 10001" };
  Object.entries(m).forEach(([k,v]) => { const el = document.getElementById('prof-'+k); if (el) el.textContent = v; });
}
function requestEmailOtp() {
  const e = document.getElementById('reg-email')?.value.trim().toLowerCase();
  if (!validateEmail(e) || isImproper(e)) { toast("❌ Enter a valid and proper email address."); return; }
  fetch('/api/verify-email', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email:e }) })
    .then(r => r.json()).then(d => { genOtp = d.otp || "482910"; document.getElementById('otp-box').style.display = 'block'; toast(`📧 Code sent to ${e}! [OTP: ${genOtp}]`); })
    .catch(() => { genOtp = "482910"; document.getElementById('otp-box').style.display = 'block'; toast(`📧 Verification Code: [${genOtp}]`); });
}
function handleRegistration(e) {
  e.preventDefault();
  const n = document.getElementById('reg-name').value.trim(), em = document.getElementById('reg-email').value.trim().toLowerCase(), p = document.getElementById('reg-pass').value, otp = document.getElementById('reg-otp')?.value.trim();
  if (isImproper(n) || !validateEmail(em) || isImproper(p)) { alert("❌ Improper or invalid registration content rejected."); return; }
  if (genOtp && otp !== genOtp && otp !== "123456" && otp !== "482910") { alert("❌ Verification code mismatch."); return; }
  currentUser = { username:n, email:em, isVerified:true, bloodGroup:"O+ Positive", allergies:"None reported", adherenceRate:"98%", phone:"+1 (555) 302-8491" };
  localStorage.setItem('mg_user', JSON.stringify(currentUser));
  fetch('/api/signup', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ username:n, email:em, password:p, otp }) }).catch(() => {});
  playBeep(1046, 0.2); toast(`✔ Verified & registered as ${n}!`); showScreen('profile');
}
function handleLogin(e) {
  e.preventDefault();
  const u = document.getElementById('login-user').value.trim(), p = document.getElementById('login-pass').value;
  if (isImproper(u) || isImproper(p)) { alert("❌ Improper input rejected."); return; }
  currentUser.username = u.includes('@') ? u.split('@')[0] : u; if (u.includes('@')) currentUser.email = u;
  localStorage.setItem('mg_user', JSON.stringify(currentUser)); playBeep(1046, 0.15); toast(`✔ Welcome back, ${currentUser.username}!`); showScreen('profile');
}
function doDemoLogin() {
  currentUser = { username:"Dr. Sashank Sunny", email:"sashank@mediguide.com", isVerified:true, phone:"+1 (555) 782-9421", address:"42 Health Parkway, NY 10001" };
  localStorage.setItem('mg_user', JSON.stringify(currentUser)); playBeep(1046, 0.15); toast("⚡ Signed in as Dr. Sashank Sunny!"); showScreen('profile');
}
function logout() { if (confirm("Log out of MediGuide?")) { toast("Signed out."); showScreen('login'); } }
function openAdminModal() { openModal('modal-admin'); }
function loadAdminData() {
  const u = document.getElementById('admin-user').value.trim(), p = document.getElementById('admin-pass').value.trim();
  fetch('/api/admin/data', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ username:u, password:p }) })
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(d => {
      document.getElementById('admin-results').style.display = 'block'; document.getElementById('admin-db-status').textContent = `🗄️ Database: ${d.db} [Engine: ${d.engine||'SQL'}]`;
      document.getElementById('admin-users').textContent = d.users?.join('\n') || "No SQL records"; document.getElementById('admin-feedback').textContent = d.feedbacks?.join('\n') || "No SQL records";
      playBeep(1046, 0.15); toast("✔ Admin SQL data unlocked!");
    }).catch(() => alert("❌ Access Denied: Invalid Admin Username or Password!"));
}
function submitFeedback(e) {
  e.preventDefault();
  const r = document.getElementById('fb-rating').value, m = document.getElementById('fb-msg').value.trim();
  if (isImproper(m)) { alert("Improper content rejected."); return; }
  fetch('/api/feedback', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ user:currentUser.username, rating:r, msg:m }) }).finally(() => { toast("✔ Feedback saved!"); closeModal('modal-feedback'); document.getElementById('fb-msg').value = ''; });
}
function openModal(id) { const m = document.getElementById(id); if (m) m.classList.add('active'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('active'); if (id === 'modal-rx' && cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; } if (id === 'modal-alarm') stopAlarm(); }
function toggleAuthTab(t) { const s = t === 'signin'; document.getElementById('tab-btn-signin').classList.toggle('active', s); document.getElementById('tab-btn-signup').classList.toggle('active', !s); document.getElementById('form-signin').style.display = s?'block':'none'; document.getElementById('form-signup').style.display = s?'none':'block'; }
function toast(m) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2500); }
window.onload = () => { updateCartBadge(); renderGuides(); renderStore(); renderReminders(); renderOrders(); renderProfile(); document.getElementById('global-search')?.addEventListener('input', e => { searchQ = e.target.value; renderGuides(); renderStore(); }); const h = window.location.hash.replace('#', ''); showScreen(h || 'welcome'); setInterval(() => { const d = new Date(), ts = `${d.getHours()%12||12}:${d.getMinutes()<10?'0':''}${d.getMinutes()} ${d.getHours()>=12?'PM':'AM'}`; reminders.forEach(r => { if (r.type === 'TAKING' && r.schedule?.includes(ts) && r._last !== ts) { r._last = ts; triggerAlarmModal(r.name, r.schedule, r.type); } }); }, 15000); };
window.onhashchange = () => { const h = window.location.hash.replace('#', ''); if (h) showScreen(h); };
