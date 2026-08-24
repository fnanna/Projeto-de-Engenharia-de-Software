const DATA = {

  user: { name:'Enzo', initials:'EN', role:'Estagiário' },

  dashboard: {
    dateLabel: 'Segunda-feira, 3 de agosto',
    hoursWeek: '32h e 30min',
    stats: [
      { label:'Projetos ativos', value:'05', trend:'+1 esse mês' },
      { label:'Tarefas pendentes', value:'07', trend:'2 vencem essa semana', alert:true },
      { label:'Reuniões marcadas', value:'03', trend:'próxima em 2 dias' },
    ],
    reminders: [
      { date:'HOJE', text:'Entrega do estudo preliminar — Vale Verde', sub:'Cliente: Fam. Andrade' },
      { date:'QUA', text:'Reunião de obra — Loja Cedro', sub:'10h · com fornecedor de marcenaria' },
      { date:'SEX', text:'Prazo executivo — Ed. Jequitibá', sub:'Fase: Projeto executivo' },
    ],
    activity: [
      { time:'09:40', html:'<b>Enzo</b> moveu "Detalhamento do banheiro" para Revisão — Vale Verde' },
      { time:'09:12', html:'<b>Wesley</b> registrou 3h no cronômetro — fase Executivo, Loja Cedro' },
      { time:'Ontem', html:'<b>Myllena</b> adicionou ata da reunião com Fam. Andrade' },
      { time:'Ontem', html:'<b>André</b> atualizou o cronograma — Ed. Jequitibá' },
    ],
    featuredIds: ['vale-verde','loja-cedro','jequitiba'],
  },

  projects: [
    { id:'vale-verde', glyph:'✳', name:'Residência Vale Verde', client:'Fam. Andrade',
      photo:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
      tagClass:'andamento', tagLabel:'Tudo ok', phaseClass:'naoiniciado', phaseLabel:'Projeto executivo',
      team:['EN','MY'], stageId:'exec', completed:false },
    { id:'loja-cedro', glyph:'◎', name:'Loja Cedro', client:'Cedro Móveis Ltda.',
      photo:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop',
      tagClass:'revisao', tagLabel:'Em revisão', phaseClass:'naoiniciado', phaseLabel:'Ant. interiores',
      team:['WE'], stageId:'ante-int', completed:false },
    { id:'jequitiba', glyph:'▲', name:'Ed. Jequitibá — cobertura', client:'Sr. Camargo',
      photo:null,
      tagClass:'atraso', tagLabel:'Atrasado', phaseClass:'naoiniciado', phaseLabel:'Anteprojeto',
      team:['MY'], stageId:'ante', stageLate:true, completed:false },
    { id:'bosque', glyph:'✳', name:'Apartamento Bosque', client:'Sra. Tavares',
      photo:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=300&fit=crop',
      tagClass:'andamento', tagLabel:'Tudo ok', phaseClass:'naoiniciado', phaseLabel:'Levantamento',
      team:['EN'], stageId:'lev', completed:false },
    { id:'feira-sp', glyph:'✦', name:'Estande Feira Design SP', client:'Feira Design SP',
      completed:true, completedDate:'10 jul', hoursTotal:'40h e 0min', category:'Efêmera', sub:'Instalação efêmera' },
    { id:'sobrado-aurora', glyph:'✳', name:'Reforma Sobrado Aurora', client:'Fam. Ribeiro',
      completed:true, completedDate:'22 jun', hoursTotal:'58h e 30min', category:'Residencial', sub:'Residencial, 160m²' },
  ],

  // Etapas do kanban "Por etapa" (o card de cada projeto é resolvido a partir de projects[].stageId)
  stageColumns: [
    { id:'avulsa', name:'Avulsa (não definida)' },
    { id:'proc', name:'Procedimentos iniciais' },
    { id:'lev', name:'Levantamento' },
    { id:'ante', name:'Anteprojeto' },
    { id:'ante-int', name:'Anteprojeto de Interiores' },
    { id:'exec', name:'Projeto Executivo' },
    { id:'obra', name:'Acompanhamento de obra' },
  ],

  calendar: {
    month: 'Setembro 2026',
    cells: [
      {day:30, muted:true}, {day:31, muted:true},
      {day:1, chips:[{cls:'b', label:'Vale Verde · reunião'}]},
      {day:2, chips:[{cls:'a', label:'Cedro · entrega revisão'}]},
      {day:3},{day:4},{day:5},{day:6},{day:7},{day:8},{day:9},{day:10},{day:11},{day:12},{day:13},{day:14},
      {day:15, chips:[{cls:'b', label:'Bosque · prazo levant.'}]},
      {day:16},{day:17},
      {day:18, chips:[{cls:'s', label:'Andrade · reunião'}]},
      {day:19},{day:20},
      {day:21, chips:[{cls:'r', label:'Jequitibá · atrasado'}]},
      {day:22, today:true},
      {day:23},{day:24},{day:25},{day:26},{day:27},
      {day:28, chips:[{cls:'b', label:'Vale Verde · entrega executivo'}]},
      {day:29},{day:30},
      {day:1, muted:true},{day:2, muted:true},{day:3, muted:true},
    ],
  },

  // Qual projeto abre quando se clica em qualquer card/linha de projeto
  currentProjectId: 'vale-verde',

  projectDetail: {
    photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
    glyph: '✳',
    name: 'Residência Vale Verde',
    sub: 'Fam. Andrade · Rua das Palmeiras, 340',
    statusValue: 'andamento',
    meta: [
      { label:'Etapa atual', value:'Projeto executivo' },
      { label:'Entrega da etapa', value:'28 ago 2026' },
    ],
    team: [ {i:'EN', n:'Enzo'}, {i:'MY', n:'Myllena'} ],
    kv: [
      { label:'Descrição', value:'Casa térrea de 220m² com três suítes, área gourmet integrada e paisagismo assinado. Projeto iniciado em junho de 2026.' },
      { label:'Endereço', value:'Rua das Palmeiras, 340 — Bairro Vale Verde' },
      { label:'Visitas ao local', value:'4 visitas realizadas · próxima em 30 ago' },
      { label:'Arquivos', valueHtml:'<a href="#" class="link-btn btn-icon-flex">📁 Abrir pasta no Drive ↗</a>' },
    ],
    tasksByStatus: {
      andamento: [
        { groupName:'Projeto executivo', tbodyId:'tbody-exec-and', tasks:[
          { title:'Cotas do telhado — planta de cobertura', phase:'Projeto executivo', disc:'ARQ', resp:'EN', respName:'Enzo', prazo:'30 ago', status:'naoiniciado', time:'0h e 0min' },
          { title:'Especificação de esquadrias', phase:'Projeto executivo', disc:'ARQ', resp:'MY', respName:'Myllena', prazo:'30 ago', status:'naoiniciado', time:'0h e 0min' },
          { title:'Memorial descritivo — acabamentos', phase:'Projeto executivo', disc:'ARQ', resp:'EN', respName:'Enzo', prazo:'30 ago', status:'naoiniciado', time:'0h e 0min' },
          { title:'Detalhamento do banheiro social', phase:'Projeto executivo', disc:'LIN', resp:'EN', respName:'Enzo', prazo:'28 ago', status:'andamento', time:'1h e 12min' },
          { title:'Compatibilização com projeto elétrico', phase:'Projeto executivo', disc:'INS', resp:'WE', respName:'Wesley', prazo:'28 ago', status:'andamento', time:'4h e 0min' },
        ]},
      ],
      revisao: [
        { groupName:'Anteprojeto', tbodyId:'tbody-ante-rev', tasks:[
          { title:'Planta baixa — pavimento superior', phase:'Anteprojeto', disc:'ARQ', resp:'AN', respName:'André', prazo:'—', status:'revisao', time:'6h e 30min' },
        ]},
      ],
      concluidas: [
        { groupName:'Estudo preliminar', tbodyId:'tbody-estudo-conc', tasks:[
          { title:'Estudo de viabilidade', phase:'Estudo preliminar', disc:'ARQ', resp:'MY', respName:'Myllena', prazo:'—', status:'concluido', time:'8h e 0min' },
          { title:'Implantação e insolação', phase:'Estudo preliminar', disc:'ARQ', resp:'EN', respName:'Enzo', prazo:'—', status:'concluido', time:'5h e 30min' },
        ]},
        { groupName:'Anteprojeto', tbodyId:'tbody-ante-conc', tasks:[
          { title:'Planta baixa — térreo', phase:'Anteprojeto', disc:'ARQ', resp:'WE', respName:'Wesley', prazo:'—', status:'concluido', time:'7h e 0min' },
          { title:'Elevações e cortes', phase:'Anteprojeto', disc:'ARQ', resp:'EN', respName:'Enzo', prazo:'—', status:'concluido', time:'9h e 0min' },
        ]},
      ],
    },
    gantt: {
      totalDays: 102, // eixo em dias corridos a partir de 1 jun
      months: [ {name:'Junho', days:30}, {name:'Julho', days:31}, {name:'Agosto', days:31}, {name:'Setembro', days:10} ],
      todayOffset: 83, // ~22 ago
      phases: [
        { name:'Estudo preliminar', startDay:4, endDay:19, status:'done' },
        { name:'Anteprojeto', startDay:19, endDay:44, status:'done', milestoneAt:45 },
        { name:'Projeto executivo', startDay:44, endDay:88, status:'current' },
        { name:'Acompanhamento de obra', startDay:88, endDay:101, status:'upcoming' },
      ],
    },
    kanban: [
      { name:'A fazer', cards:[
        { title:'Cotas do telhado', disc:'ARQ', resp:'EN', hours:'0h e 0min', taskTitle:'Cotas do telhado — planta de cobertura', phase:'Projeto executivo' },
        { title:'Especificação de esquadrias', disc:'ARQ', resp:'MY', hours:'0h e 0min', taskTitle:'Especificação de esquadrias', phase:'Projeto executivo' },
        { title:'Memorial descritivo', disc:'ARQ', resp:'EN', hours:'0h e 0min', taskTitle:'Memorial descritivo — acabamentos', phase:'Projeto executivo' },
      ]},
      { name:'Em andamento', cards:[
        { title:'Detalhamento do banheiro social', disc:'LIN', resp:'EN', hours:'1h e 12min ao vivo', live:true, taskTitle:'Detalhamento do banheiro social', phase:'Projeto executivo' },
        { title:'Compatibilização elétrica', disc:'INS', resp:'WE', hours:'4h e 0min', taskTitle:'Compatibilização com projeto elétrico', phase:'Projeto executivo' },
      ]},
      { name:'Revisão', cards:[
        { title:'Planta baixa — pavimento sup.', disc:'ARQ', resp:'AN', hours:'6h e 30min', taskTitle:'Planta baixa — pavimento superior', phase:'Anteprojeto' },
      ]},
      { name:'Concluído', cards:[
        { title:'Estudo de viabilidade', disc:'ARQ', resp:'MY', hours:'8h e 0min', taskTitle:'Estudo de viabilidade', phase:'Estudo preliminar' },
        { title:'Implantação e insolação', disc:'ARQ', resp:'EN', hours:'5h e 30min', taskTitle:'Implantação e insolação', phase:'Estudo preliminar' },
        { title:'Planta baixa — térreo', disc:'ARQ', resp:'WE', hours:'7h e 0min', taskTitle:'Planta baixa — térreo', phase:'Anteprojeto' },
        { title:'Elevações e cortes', disc:'ARQ', resp:'EN', hours:'9h e 0min', taskTitle:'Elevações e cortes', phase:'Anteprojeto' },
      ]},
    ],
    reunioes: [
      { date:'18\nAGO', title:'Alinhamento de acabamentos', sub:'Com Fam. Andrade · registrada por Myllena' },
      { date:'02\nAGO', title:'Definição de esquadrias', sub:'Interna · registrada por Enzo' },
      { date:'15\nJUL', title:'Apresentação do anteprojeto', sub:'Com Fam. Andrade · registrada por Wesley' },
    ],
    fornecedores: [
      { name:'Marcenaria Ipê', sub:'Marcenaria sob medida', phone:'(85) 99123-4455' },
      { name:'Lumen Iluminação Técnica', sub:'Projeto luminotécnico', phone:'(85) 98877-2210' },
      { name:'Construtora Alicerce', sub:'Execução de obra civil', phone:'(85) 3033-4410' },
    ],
  },

  // Detalhes usados no painel lateral de tarefa (chave = título da tarefa)
  taskDetails: {
    'Detalhamento do banheiro social': {
      resp:'Enzo', status:'andamento',
      desc:'Detalhamento de revestimentos, louças e metais do banheiro social, compatibilizado com o projeto hidráulico.',
      horas:'1h e 12min',
      comments:[
        {author:'Mapu', text:'confirmar cor do rejunte com a cliente antes de fechar o detalhe.', time:'ontem'},
        {author:'André', text:'revestimento aprovado, seguindo para as louças.', time:'hoje, 09:12'},
      ],
    },
  },
  taskDetailDefault: {
    resp:'André', status:'naoiniciado',
    desc:'Sem descrição adicionada ainda.',
    horas:'0h e 0min',
    comments:[],
  },

  hours: {
    legend: [
      {cls:'seg-estudo', label:'Estudo preliminar'},
      {cls:'seg-ante', label:'Anteprojeto'},
      {cls:'seg-exec', label:'Projeto executivo'},
      {cls:'seg-obra', label:'Acompanhamento de obra'},
    ],
    rows: [
      { name:'Residência Vale Verde', category:'Residencial', total:'64h e 0min',
        segments:[{cls:'seg-estudo',w:20},{cls:'seg-ante',w:25},{cls:'seg-exec',w:35}] },
      { name:'Loja Cedro', category:'Comercial', total:'31h e 30min',
        segments:[{cls:'seg-estudo',w:30},{cls:'seg-ante',w:45},{cls:'seg-exec',w:25}] },
      { name:'Ed. Jequitibá', category:'Interiores', total:'18h e 0min',
        segments:[{cls:'seg-estudo',w:40},{cls:'seg-ante',w:60}] },
      { name:'Estande Feira Design SP', category:'Efêmera', total:'40h e 0min',
        segments:[{cls:'seg-estudo',w:15},{cls:'seg-ante',w:20},{cls:'seg-exec',w:35},{cls:'seg-obra',w:30}] },
      { name:'Apartamento Bosque', category:'Residencial', total:'9h e 30min',
        segments:[{cls:'seg-estudo',w:100}] },
    ],
  },

  perfil: {
    nome:'Enzo', cargo:'Estagiário · acesso web', iniciais:'EN',
    toggles: [
      { label:'Prazos de entrega', sub:'Avisar quando um prazo estiver próximo', on:true },
      { label:'Reuniões', sub:'Lembrete 30 minutos antes', on:true },
      { label:'Resumo diário', sub:'Notificações a cada atualização de tarefa', on:false },
    ],
  },

  clientes: [
    {id:'andrade', iniciais:'FA', nome:'Fam. Andrade', tipo:'Pessoa física', desde:'Cliente desde 2025',
     projetos:['Residência Vale Verde'], email:'andrade@email.com', telefone:'(85) 99887-1122',
     endereco:'Rua das Palmeiras, 340 — Bairro Vale Verde',
     notas:'Prefere contato por WhatsApp. Reunião mensal de alinhamento às sextas.'},
    {id:'cedro', iniciais:'CM', nome:'Cedro Móveis Ltda.', tipo:'Pessoa jurídica · contato: Renata Cedro', desde:'Cliente desde 2024',
     projetos:['Loja Cedro'], email:'renata@cedro.com.br', telefone:'(85) 98123-7788',
     endereco:'Av. Padre Cícero, 1200 — Centro',
     notas:'Faturamento via nota fiscal de serviço, emitida mensalmente.'},
    {id:'camargo', iniciais:'SC', nome:'Sr. Camargo', tipo:'Pessoa física', desde:'Cliente desde 2023',
     projetos:['Ed. Jequitibá — cobertura'], email:'camargo@email.com', telefone:'(85) 99456-3321',
     endereco:'Ed. Jequitibá, cobertura — Bairro Cariri',
     notas:'Projeto em fase de anteprojeto, atualmente atrasado.'},
    {id:'tavares', iniciais:'ST', nome:'Sra. Tavares', tipo:'Pessoa física', desde:'Cliente desde 2026',
     projetos:['Apartamento Bosque'], email:'tavares@email.com', telefone:'(85) 99234-5567',
     endereco:'Ed. Bosque Verde, apto 402',
     notas:'Início do projeto: levantamento em andamento.'},
  ],

  fornecedores: [
    {id:'ipe', iniciais:'MI', nome:'Marcenaria Ipê', categoria:'Marcenaria',
     projetos:['Residência Vale Verde','Apartamento Bosque'], telefone:'(85) 99123-4455', email:'contato@marcenariaipe.com.br',
     endereco:'Distrito Industrial, Juazeiro do Norte — CE', contato:'Sr. Ipê (proprietário)',
     notas:'Prazo médio de entrega: 25 dias úteis.'},
    {id:'lumen', iniciais:'LI', nome:'Lumen Iluminação Técnica', categoria:'Luminotécnica',
     projetos:['Residência Vale Verde'], telefone:'(85) 98877-2210', email:'projetos@lumen.com.br',
     endereco:'Rua dos Engenheiros, 88 — Juazeiro do Norte', contato:'Eng. Paula Lumen',
     notas:'Responsável pelo projeto luminotécnico executivo.'},
    {id:'alicerce', iniciais:'CA', nome:'Construtora Alicerce', categoria:'Obra civil',
     projetos:['Residência Vale Verde','Ed. Jequitibá — cobertura'], telefone:'(85) 3033-4410', email:'obras@alicerce.com.br',
     endereco:'Av. Leão Sampaio, 550 — Juazeiro do Norte', contato:'Mestre de obras Ronaldo',
     notas:'Acompanhamento semanal de obra às quartas-feiras.'},
    {id:'prisma', iniciais:'VP', nome:'Vidraçaria Prisma', categoria:'Esquadrias',
     projetos:['Loja Cedro'], telefone:'(85) 98212-7790', email:'orcamento@prisma.com.br',
     endereco:'Rua do Vidro, 12 — Juazeiro do Norte', contato:'Marcos Prisma',
     notas:'Fornecedor exclusivo de esquadrias em alumínio da região.'},
  ],
};

const STATUS_LABELS = { naoiniciado:'Não iniciado', andamento:'Em andamento', revisao:'Em revisão', concluido:'Concluído' };
const PROJECT_TAG_LABELS = { naoiniciado:'Atrasado', andamento:'Tudo ok', revisao:'Em revisão', concluido:'Concluído' };

/* =========================================================================
   HELPERS
   ========================================================================= */
function statusSelectHtml(current, extraClass, labels){
  labels = labels || STATUS_LABELS;
  const opts = Object.keys(labels).map(v =>
    `<option value="${v}"${v===current?' selected':''}>${labels[v]}</option>`
  ).join('');
  return `<select class="status-select ${extraClass||''} ${current}" onchange="onStatusChange(this)">${opts}</select>`;
}
function miniAvatars(initialsArr){
  return `<div class="mini-avatars">${initialsArr.map(i=>`<div class="mini-avatar">${i}</div>`).join('')}</div>`;
}
function thumbCardHtml(p){
  const photoHtml = p.photo
    ? `<div class="thumb-photo" style="background-image:url('${p.photo}')"></div>`
    : `<div class="thumb-photo no-photo">${p.glyph}</div>`;
  return `
    <div class="thumb-card" onclick="nav('projeto')">
      ${photoHtml}
      <div class="thumb-body">
        <div class="thumb-name-row"><span class="glyph">${p.glyph}</span><h3>${p.name}</h3></div>
        <div class="thumb-tags">${p.tagClass ? `<span class="badge ${p.tagClass}">${p.tagLabel}</span>` : ''}<span class="badge ${p.phaseClass}">${p.phaseLabel}</span></div>
        <div class="thumb-foot"><span class="eyebrow">${p.client}</span>${miniAvatars(p.team)}</div>
      </div>
    </div>`;
}

/* =========================================================================
   RENDER: DASHBOARD
   ========================================================================= */
function renderDashboard(){
  const d = DATA.dashboard;
  document.getElementById('dash-date').textContent = d.dateLabel;
  document.getElementById('dash-greeting').textContent = 'Bom dia, ' + DATA.user.name;
  document.getElementById('dash-hours').innerHTML = `◷ <b>${d.hoursWeek}</b> registradas essa semana`;

  document.getElementById('dash-stats').innerHTML = d.stats.map(s => `
    <div class="card stat-card">
      <span class="eyebrow">${s.label}</span>
      <div class="stat-num">${s.value}</div>
      <span class="stat-trend${s.alert?' alert':''}">${s.trend}</span>
    </div>`).join('');

  document.getElementById('dash-reminders').innerHTML = d.reminders.map(r => `
    <div class="reminder-row">
      <span class="reminder-date">${r.date}</span>
      <div><div class="reminder-txt">${r.text}</div><div class="reminder-sub">${r.sub}</div></div>
    </div>`).join('');

  document.getElementById('dash-activity').innerHTML = d.activity.map(a => `
    <div class="tl-item"><div class="tl-time">${a.time}</div><div class="tl-txt">${a.html}</div></div>`).join('');

  const featured = d.featuredIds.map(id => DATA.projects.find(p => p.id === id)).filter(Boolean);
  document.getElementById('dash-featured').innerHTML = featured.map(thumbCardHtml).join('');
}
function addReminder(){
  const text = prompt('Texto do lembrete (ex: "Entrega do projeto X"):');
  if(!text || !text.trim()) return;
  const sub = prompt('Detalhe opcional (ex: nome do cliente, horário):') || '';
  const date = prompt('Quando? (ex: HOJE, QUA, SEX, 28 AGO):') || 'EM BREVE';
  DATA.dashboard.reminders.push({ date: date.trim().toUpperCase(), text: text.trim(), sub: sub.trim() });
  renderDashboard();
}

/* =========================================================================
   RENDER: PROJETOS (HUB) — thumbnails, calendário, concluídos
   (o kanban "Por etapa" é renderizado por renderStages(), mais abaixo)
   ========================================================================= */
function renderProjectsHub(){
  const ativos = DATA.projects.filter(p => !p.completed);
  document.getElementById('hub-thumb-grid').innerHTML = ativos.map(thumbCardHtml).join('');

  const cal = DATA.calendar;
  document.getElementById('cal-month').textContent = cal.month;
  const dow = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => `<div class="cal-dow">${d}</div>`).join('');
  const cells = cal.cells.map(c => {
    const chips = (c.chips||[]).map(ch => `<span class="cal-chip ${ch.cls}">${ch.label}</span>`).join('');
    const cls = ['cal-cell', c.muted?'muted':'', c.today?'today':''].filter(Boolean).join(' ');
    return `<div class="${cls}"><div class="cal-daynum">${c.day}</div>${chips}</div>`;
  }).join('');
  document.getElementById('cal-grid').innerHTML = dow + cells;

  const concluidos = DATA.projects.filter(p => p.completed);
  const head = '<div class="list-row list-head"><span></span><span>Projeto</span><span>Cliente</span><span>Categoria</span><span>Concluído em</span><span>Horas totais</span><span></span></div>';
  const rows = concluidos.map(p => `
    <div class="list-row">
      <span class="cat-glyph">${p.glyph}</span>
      <span class="proj-name-cell"><b>${p.name}</b><span>${p.sub}</span></span>
      <span>${p.client}</span>
      <span><span class="badge concluido">${p.category}</span></span>
      <span class="mono-cell">${p.completedDate}</span>
      <span class="mono-cell">${p.hoursTotal}</span>
      <span></span>
    </div>`).join('');
  document.getElementById('lista-concluidos').innerHTML = head + rows;
}

/* =========================================================================
   RENDER: PROJETO DETALHE
   ========================================================================= */
function renderProjectDetail(){
  const pd = DATA.projectDetail;
  document.getElementById('proj-hero-photo').style.backgroundImage = `url('${pd.photo}')`;
  document.getElementById('proj-glyph').textContent = pd.glyph;
  document.getElementById('proj-title').textContent = pd.name;
  document.getElementById('proj-sub').textContent = pd.sub;
  document.getElementById('proj-status').value = pd.statusValue;
  document.getElementById('proj-status').className = 'status-select ' + pd.statusValue;

  const metaHtml = pd.meta.map(m => `<div class="hero-meta-item"><div class="eyebrow">${m.label}</div><div>${m.value}</div></div>`).join('');
  const teamHtml = `
    <div class="hero-meta-item">
      <div class="eyebrow">Equipe</div>
      <div class="team-chips">
        ${pd.team.map(t => `<div class="team-chip"><div class="mini-avatar">${t.i}</div>${t.n}</div>`).join('')}
        <button class="team-add" title="Adicionar à equipe" onclick="alert('Adicionar membro à equipe do projeto')">+</button>
      </div>
    </div>`;
  document.getElementById('proj-meta').innerHTML = metaHtml + teamHtml;

  document.getElementById('proj-kv').innerHTML = pd.kv.map(row => `
    <div class="kv-row"><div class="kv-label">${row.label}</div><div class="kv-value">${row.valueHtml || row.value}</div></div>`).join('');

  renderTasksTab();
  renderGantt();
  renderProjectKanban();

  document.getElementById('proj-reunioes').innerHTML = pd.reunioes.map(r => {
    const [d1,d2] = r.date.split('\n');
    return `<div class="simple-list-row"><div class="row-flex"><div class="doc-ic">${d1}<br>${d2}</div><div><div class="row-title">${r.title}</div><div class="row-sub">${r.sub}</div></div></div><span class="eyebrow">Ver ata →</span></div>`;
  }).join('');

  document.getElementById('proj-fornecedores').innerHTML = pd.fornecedores.map(f => `
    <div class="simple-list-row"><div><div class="row-title">${f.name}</div><div class="row-sub">${f.sub}</div></div><span class="mono-cell">${f.phone}</span></div>`).join('');
}

function renderTasksTab(){
  const groupsByStatus = DATA.projectDetail.tasksByStatus;
  ['andamento','revisao','concluidas'].forEach(statusKey => {
    const container = document.getElementById('tasks-' + statusKey);
    const groups = groupsByStatus[statusKey];
    let html = `<div class="task-group-actions"><button class="link-btn" onclick="addTaskGroup('${statusKey}')">+ Nova etapa</button></div>`;
    html += groups.map(g => `
      <div class="task-group">
        <div class="task-group-head" onclick="toggleGroup(this)">
          <span class="car">▾</span><b>${g.groupName}</b>
          <span class="eyebrow ml-auto">${g.tasks.length} tarefa${g.tasks.length===1?'':'s'}</span>
          <button class="group-add-btn" onclick="event.stopPropagation();addTaskRow('${g.tbodyId}','${g.groupName}')">+ tarefa</button>
        </div>
        <div class="task-group-body">
          <table class="task-table">
            <thead><tr><th>Responsável</th><th>Tarefa</th><th>Prazo</th><th>Status</th><th>Tempo</th></tr></thead>
            <tbody id="${g.tbodyId}">
              ${g.tasks.map(taskRowHtml).join('')}
            </tbody>
          </table>
        </div>
      </div>`).join('');
    container.innerHTML = html;
  });
}
function taskRowHtml(t){
  return `
    <tr onclick="openTask('${t.title.replace(/'/g,"\\'")}','${t.phase}')">
      <td><div class="resp-cell"><div class="mini-avatar">${t.resp}</div>${t.respName}</div></td>
      <td><span class="disc">${t.disc}</span>${t.title}</td>
      <td class="mono-cell">${t.prazo}</td>
      <td>${statusSelectHtml(t.status)}</td>
      <td class="mono-cell">${t.time}</td>
    </tr>`;
}

function renderGantt(){
  const g = DATA.projectDetail.gantt;
  const dayW = 26;
  const monthsHtml = g.months.map(m => `<div class="gantt-month-lbl" style="width:${m.days*dayW}px;">${m.name}</div>`).join('');
  // ruler: percorre todos os dias sequencialmente
  let offset = 0;
  let rulerHtml = '';
  g.months.forEach(m => {
    for(let d=1; d<=m.days; d++){
      const isWeekend = (offset % 7 === 5 || offset % 7 === 6);
      const isToday = offset === g.todayOffset;
      const cls = ['gantt-day', isWeekend?'weekend':'', isToday?'today':''].filter(Boolean).join(' ');
      rulerHtml += `<div class="${cls}">${d}</div>`;
      offset++;
    }
  });
  const barsHtml = g.phases.map((ph,i) => {
    const left = ph.startDay * dayW;
    const width = (ph.endDay - ph.startDay + 1) * dayW;
    const milestone = ph.milestoneAt !== undefined ? `<div class="gantt-milestone" style="left:${ph.milestoneAt*dayW}px;"></div>` : '';
    return `<div class="gantt-phase-row">
      <div class="gantt-bar-abs ${ph.status}" style="left:${left}px;width:${width}px;">${ph.name}</div>
      ${milestone}
    </div>`;
  }).join('');

  document.getElementById('gantt-root').innerHTML = `
    <div class="gantt-toolbar">
      <div class="gantt-toolbar-left">
        <button class="btn-define">⚑ Definir/Atualizar</button>
        <button class="chip-ghost" onclick="document.getElementById('gantt-body-inner').classList.toggle('collapsed')">☰ Etapas</button>
      </div>
      <button class="link-btn" onclick="addGanttPhase()">+ Nova etapa</button>
    </div>
    <div class="gantt-scroll-outer">
      <div class="gantt-inner" style="width:${g.totalDays*dayW}px;">
        <div class="gantt-months">${monthsHtml}</div>
        <div class="gantt-ruler">${rulerHtml}</div>
        <div class="gantt-body" id="gantt-body-inner">${barsHtml}</div>
      </div>
    </div>`;
}
function addGanttPhase(){
  const name = prompt('Nome da nova etapa do cronograma:');
  if(name && name.trim()){
    const g = DATA.projectDetail.gantt;
    const last = g.phases[g.phases.length-1];
    g.phases.push({ name:name.trim(), startDay:last.endDay, endDay:last.endDay+14, status:'upcoming' });
    g.totalDays = Math.max(g.totalDays, last.endDay+14+5);
    renderGantt();
  }
}

function renderProjectKanban(){
  const cols = DATA.projectDetail.kanban;
  document.getElementById('proj-kanban').innerHTML = cols.map(col => `
    <div class="stage-col stage-col--flex">
      <div class="stage-col-head"><span class="stg-name">${col.name}</span><span class="stg-count">${String(col.cards.length).padStart(2,'0')}</span></div>
      ${col.cards.map(c => `
        <div class="stage-card" onclick="openTask('${c.taskTitle.replace(/'/g,"\\'")}','${c.phase}')">
          <div class="stage-card-name"><span class="glyph glyph-sm">${c.disc}</span> ${c.title}</div>
          <div class="stage-card-foot"><span class="eyebrow${c.live?' eyebrow-live':''}">${c.hours}</span><div class="mini-avatar">${c.resp}</div></div>
        </div>`).join('')}
    </div>`).join('');
}

/* =========================================================================
   RENDER: RELATÓRIO DE HORAS
   ========================================================================= */
function renderHours(){
  document.getElementById('horas-legend').innerHTML = DATA.hours.legend.map(l => `
    <div class="legend-item"><span class="legend-sw ${l.cls}"></span>${l.label}</div>`).join('');
  document.getElementById('horas-rows').innerHTML = DATA.hours.rows.map(r => `
    <div class="chart-row">
      <div class="chart-label"><b>${r.name}</b><span>${r.category}</span></div>
      <div class="stackbar">${r.segments.map(s => `<div class="seg ${s.cls}" style="width:${s.w}%;"></div>`).join('')}</div>
      <div class="chart-total">${r.total}</div>
    </div>`).join('');
}

/* =========================================================================
   RENDER: PERFIL
   ========================================================================= */
function renderPerfil(){
  const p = DATA.perfil;
  document.getElementById('perfil-av').textContent = p.iniciais;
  document.getElementById('topbar-avatar').textContent = p.iniciais;
  document.getElementById('perfil-nome').textContent = p.nome;
  document.getElementById('perfil-cargo').textContent = p.cargo;
  document.getElementById('perfil-toggles').innerHTML = p.toggles.map(t => `
    <div class="toggle-row">
      <div class="toggle-txt"><b>${t.label}</b><span>${t.sub}</span></div>
      <button class="switch${t.on?' on':''}" onclick="this.classList.toggle('on')"></button>
    </div>`).join('');
}

/* =========================================================================
   NAVEGAÇÃO / UI GENÉRICA
   ========================================================================= */
function doLogin(){
  document.getElementById('screen-login').style.display='none';
  document.getElementById('app-shell').classList.add('active');
  nav('dashboard');
  if(localStorage.getItem('traco_sidebar_collapsed')==='1'){
    document.querySelector('.sidebar').classList.add('collapsed');
  }
}
function toggleSidebar(){
  const sb = document.querySelector('.sidebar');
  sb.classList.toggle('collapsed');
  localStorage.setItem('traco_sidebar_collapsed', sb.classList.contains('collapsed') ? '1' : '0');
}
function doLogout(){
  document.getElementById('app-shell').classList.remove('active');
  document.getElementById('screen-login').style.display='flex';
}

const crumbNames = {
  dashboard:'Painel', projetos:'Projetos',
  projeto:'Projetos <span style="opacity:.4">/</span> ' + DATA.projectDetail.name,
  clientes:'Clientes', cliente:'Clientes <span style="opacity:.4">/</span> …',
  fornecedores:'Fornecedores', fornecedor:'Fornecedores <span style="opacity:.4">/</span> …',
  horas:'Relatório de horas', perfil:'Perfil'
};
function nav(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('is-active', p.dataset.page===page));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('is-active', n.dataset.page===page));
  document.getElementById('crumb').innerHTML = '<b>'+ (crumbNames[page]||page) +'</b>';
  window.scrollTo(0,0);
}
function hubTab(name){
  document.querySelectorAll('.hub-tab').forEach(b=>b.classList.toggle('is-active', b.dataset.hub===name));
  document.querySelectorAll('.hub-panel').forEach(p=>p.classList.toggle('is-active', p.dataset.hubpanel===name));
}
function tab(name){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('is-active', b.dataset.tab===name));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('is-active', p.dataset.tabpanel===name));
}
function statusTab(name){
  document.querySelectorAll('.status-tab').forEach(b=>b.classList.toggle('is-active', b.dataset.status===name));
  document.querySelectorAll('.status-panel').forEach(p=>p.classList.toggle('is-active', p.dataset.statuspanel===name));
}
function toggleGroup(head){
  head.classList.toggle('collapsed');
  head.nextElementSibling.classList.toggle('collapsed');
}
function onStatusChange(sel){
  sel.className = 'status-select ' + sel.value;
}

/* ---------- Tarefas: criar etapa / criar tarefa (ações do protótipo) ---------- */
function addTaskGroup(statusKey){
  const name = prompt('Nome da nova etapa:');
  if(!name || !name.trim()) return;
  const tbodyId = 'tbody-' + statusKey + '-' + Date.now();
  DATA.projectDetail.tasksByStatus[statusKey].push({ groupName:name.trim(), tbodyId, tasks:[] });
  renderTasksTab();
}
function addTaskRow(tbodyId, groupName){
  const title = prompt('Nome da nova tarefa:');
  if(!title || !title.trim()) return;
  // encontra o grupo pelo tbodyId em qualquer status
  for(const key of ['andamento','revisao','concluidas']){
    const group = DATA.projectDetail.tasksByStatus[key].find(g => g.tbodyId === tbodyId);
    if(group){
      group.tasks.push({ title:title.trim(), phase:groupName, disc:'ARQ', resp:'—', respName:'Sem responsável', prazo:'—', status:'naoiniciado', time:'0h e 0min' });
      renderTasksTab();
      return;
    }
  }
}

/* =========================================================================
   POR ETAPA: kanban de projetos (usa DATA.projects + DATA.stageColumns)
   ========================================================================= */
function renderStages(){
  const el = document.getElementById('stageKanban');
  if(!el) return;
  let html = '';
  DATA.stageColumns.forEach(s=>{
    const inStage = DATA.projects.filter(p => !p.completed && p.stageId === s.id);
    html += `<div class="stage-col"><div class="stage-col-head"><span class="stg-name">${s.name}</span><div class="stg-right"><span class="stg-count">${String(inStage.length).padStart(2,'0')}</span><button class="stg-del" onclick="removeStage('${s.id}')" title="Excluir etapa">×</button></div></div>`;
    if(inStage.length===0){
      html += '<div class="stage-empty">Nenhum projeto</div>';
    } else {
      inStage.forEach(p=>{
        html += `<div class="stage-card" onclick="nav('projeto')"><div class="stage-card-name"><span class="glyph glyph-sm">${p.glyph}</span> ${p.name}</div><div class="stage-card-foot"><span class="eyebrow${p.stageLate?' eyebrow-live':''}">${p.stageLate?'atrasado':'em andamento'}</span></div></div>`;
      });
    }
    html += '</div>';
  });
  html += '<div class="add-stage-col"><button class="add-stage-btn" onclick="addStage()">+ Nova etapa</button></div>';
  el.innerHTML = html;
}
function addStage(){
  const name = prompt('Nome da nova etapa:');
  if(name && name.trim()){
    DATA.stageColumns.push({id:'s'+Date.now(), name:name.trim()});
    renderStages();
  }
}
function removeStage(id){
  if(id==='avulsa'){ alert('A etapa "Avulsa" não pode ser excluída.'); return; }
  const col = DATA.stageColumns.find(s=>s.id===id);
  if(!col) return;
  if(confirm('Excluir a etapa "'+col.name+'"? Os projetos vinculados voltam para "Avulsa".')){
    DATA.projects.forEach(p => { if(p.stageId===id) p.stageId='avulsa'; });
    DATA.stageColumns = DATA.stageColumns.filter(s=>s.id!==id);
    renderStages();
  }
}

/* =========================================================================
   CRONÔMETRO / PAINEL LATERAL DE TAREFA
   (o tempo acumulado de cada tarefa é mantido em memória em taskTimers,
    então trocar de tarefa não reinicia o cronômetro das outras)
   ========================================================================= */
let timerInterval=null, timerSeconds=0, timerRunning=false;
let currentTaskTitle=null, lastOpenedTitle=null, lastOpenedPhase=null;
const taskTimers = {}; // título -> segundos acumulados

function pad(n){return n.toString().padStart(2,'0');}
function renderTimer(){
  const h=Math.floor(timerSeconds/3600), m=Math.floor((timerSeconds%3600)/60), s=timerSeconds%60;
  document.getElementById('timer-display').textContent = pad(h)+':'+pad(m)+':'+pad(s);
}
function toggleTimer(){
  const btn=document.getElementById('timer-btn');
  timerRunning = !timerRunning;
  if(timerRunning){
    btn.textContent='Pausar cronômetro';
    btn.classList.add('stop');
    timerInterval=setInterval(()=>{ timerSeconds++; renderTimer(); if(currentTaskTitle) taskTimers[currentTaskTitle]=timerSeconds; },1000);
  } else {
    btn.textContent='Iniciar cronômetro';
    btn.classList.remove('stop');
    clearInterval(timerInterval);
  }
  document.getElementById('timerDot').style.display = timerRunning ? 'block' : 'none';
}
function openTask(title, phase){
  taskEditing = false;
  document.getElementById('tp-edit-btn').textContent = '✎ Editar';
  document.getElementById('tp-resp').style.display = 'block';
  document.getElementById('tp-desc').style.display = 'block';
  document.getElementById('tp-resp-input').style.display = 'none';
  document.getElementById('tp-desc-input').style.display = 'none';
  if(timerRunning) toggleTimer(); // pausa a tarefa anterior antes de trocar
  currentTaskTitle = title;
  lastOpenedTitle = title;
  lastOpenedPhase = phase;
  timerSeconds = taskTimers[title] || 0;
  renderTimer();

  const det = DATA.taskDetails[title] || DATA.taskDetailDefault;
  document.getElementById('tp-title').textContent = title;
  document.getElementById('tp-phase').textContent = phase;
  document.getElementById('tp-resp').textContent = det.resp;
  document.getElementById('tp-status').value = det.status;
  document.getElementById('tp-status').className = 'status-select ' + det.status;
  document.getElementById('tp-desc').textContent = det.desc;
  document.getElementById('tp-horas').textContent = det.horas;
  document.getElementById('tp-comments').innerHTML = det.comments.map(c =>
    `<div class="tp-comment"><b>${c.author}</b> ${c.text} <span>${c.time}</span></div>`
  ).join('') || '<p class="eyebrow">Sem comentários ainda.</p>';

  document.getElementById('taskPanel').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}
function closeTask(){
  if(timerRunning) toggleTimer();
  document.getElementById('taskPanel').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}
let taskEditing = false;
function toggleTaskEdit(){
  const btn = document.getElementById('tp-edit-btn');
  taskEditing = !taskEditing;
  if(taskEditing){
    document.getElementById('tp-resp-input').value = document.getElementById('tp-resp').textContent;
    document.getElementById('tp-desc-input').value = document.getElementById('tp-desc').textContent;
    document.getElementById('tp-resp').style.display = 'none';
    document.getElementById('tp-desc').style.display = 'none';
    document.getElementById('tp-resp-input').style.display = 'block';
    document.getElementById('tp-desc-input').style.display = 'block';
    btn.textContent = '💾 Salvar';
  } else {
    const newResp = document.getElementById('tp-resp-input').value.trim();
    const newDesc = document.getElementById('tp-desc-input').value.trim();
    if(!DATA.taskDetails[currentTaskTitle]){
      DATA.taskDetails[currentTaskTitle] = Object.assign({}, DATA.taskDetailDefault, {comments:[]});
    }
    DATA.taskDetails[currentTaskTitle].resp = newResp;
    DATA.taskDetails[currentTaskTitle].desc = newDesc;
    document.getElementById('tp-resp').textContent = newResp;
    document.getElementById('tp-desc').textContent = newDesc;
    document.getElementById('tp-resp').style.display = 'block';
    document.getElementById('tp-desc').style.display = 'block';
    document.getElementById('tp-resp-input').style.display = 'none';
    document.getElementById('tp-desc-input').style.display = 'none';
    btn.textContent = '✎ Editar';
  }
}
function openLastTask(){
  openTask(lastOpenedTitle || 'Detalhamento do banheiro social', lastOpenedPhase || 'Projeto executivo');
}

/* =========================================================================
   CLIENTES
   ========================================================================= */
function renderClientes(){
  const el = document.getElementById('listaClientes');
  if(!el) return;
  let html = '<div class="list-row list-head list-row--4a"><span>Cliente</span><span>Projeto(s)</span><span>Contato</span></div>';
  DATA.clientes.forEach(c=>{
    html += `<div class="list-row list-row--4a" onclick="openCliente('${c.id}')">
      <span class="proj-name-cell"><b>${c.nome}</b><span>${c.desde}</span></span>
      <span>${c.projetos.join(', ')}</span>
      <span class="mono-cell">${c.email}</span>
    </div>`;
  });
  el.innerHTML = html;
}
function openCliente(id){
  const c = DATA.clientes.find(x=>x.id===id);
  if(!c) return;
  document.getElementById('cli-av').textContent = c.iniciais;
  document.getElementById('cli-nome').textContent = c.nome;
  document.getElementById('cli-sub').textContent = c.tipo;
  document.getElementById('cli-kv').innerHTML =
    `<div class="kv-row"><div class="kv-label">E-mail</div><div class="kv-value">${c.email}</div></div>
     <div class="kv-row"><div class="kv-label">Telefone</div><div class="kv-value">${c.telefone}</div></div>
     <div class="kv-row"><div class="kv-label">Endereço</div><div class="kv-value">${c.endereco}</div></div>
     <div class="kv-row"><div class="kv-label">Notas</div><div class="kv-value">${c.notas}</div></div>`;
  document.getElementById('cli-projetos').innerHTML = c.projetos.map(p=>
    `<div class="simple-list-row"><div class="row-title">${p}</div><button class="link-btn" onclick="nav('projeto')">Abrir →</button></div>`
  ).join('');
  nav('cliente');
  document.getElementById('crumb').innerHTML = '<a onclick="nav(\'clientes\')" style="cursor:pointer;">Clientes</a> <span style="opacity:.4">/</span> <b>'+c.nome+'</b>';
}

/* =========================================================================
   FORNECEDORES
   ========================================================================= */
function renderFornecedores(){
  const el = document.getElementById('listaFornecedores');
  if(!el) return;
  let html = '<div class="list-row list-head list-row--4b"><span>Fornecedor</span><span>Categoria</span><span>Projetos vinculados</span><span>Contato</span></div>';
  DATA.fornecedores.forEach(f=>{
    html += `<div class="list-row list-row--4b" onclick="openFornecedor('${f.id}')">
      <span class="row-title">${f.nome}</span>
      <span>${f.categoria}</span>
      <span>${f.projetos.join(', ')}</span>
      <span class="mono-cell">${f.telefone.replace('(85) ','')}</span>
    </div>`;
  });
  el.innerHTML = html;
}
function openFornecedor(id){
  const f = DATA.fornecedores.find(x=>x.id===id);
  if(!f) return;
  document.getElementById('for-av').textContent = f.iniciais;
  document.getElementById('for-nome').textContent = f.nome;
  document.getElementById('for-sub').textContent = f.categoria;
  document.getElementById('for-kv').innerHTML =
    `<div class="kv-row"><div class="kv-label">Categoria</div><div class="kv-value">${f.categoria}</div></div>
     <div class="kv-row"><div class="kv-label">E-mail</div><div class="kv-value">${f.email}</div></div>
     <div class="kv-row"><div class="kv-label">Telefone</div><div class="kv-value">${f.telefone}</div></div>
     <div class="kv-row"><div class="kv-label">Endereço</div><div class="kv-value">${f.endereco}</div></div>
     <div class="kv-row"><div class="kv-label">Notas</div><div class="kv-value">${f.notas}</div></div>`;
  document.getElementById('for-projetos').innerHTML = f.projetos.map(p=>
    `<div class="simple-list-row"><div class="row-title">${p}</div><button class="link-btn" onclick="nav('projeto')">Abrir →</button></div>`
  ).join('');
  document.getElementById('for-contatos').innerHTML =
    `<div class="simple-list-row"><div><div class="row-title">${f.contato}</div><div class="row-sub">Contato principal</div></div><span class="mono-cell">${f.telefone}</span></div>`;
  nav('fornecedor');
  document.getElementById('crumb').innerHTML = '<a onclick="nav(\'fornecedores\')" style="cursor:pointer;">Fornecedores</a> <span style="opacity:.4">/</span> <b>'+f.nome+'</b>';
}

/* =========================================================================
   BOOTSTRAP — popula tudo assim que o script carrega
   ========================================================================= */
renderDashboard();
renderProjectsHub();
renderProjectDetail();
renderHours();
renderPerfil();
renderStages();
renderClientes();
renderFornecedores();