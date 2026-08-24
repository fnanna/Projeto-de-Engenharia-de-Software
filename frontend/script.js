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
  dashboard:'Painel', projetos:'Projetos', projeto:'Projetos <span style="opacity:.4">/</span> Residência Vale Verde',
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

/* ---------- Por etapa: kanban de projetos ---------- */
let stages = [
  {id:'avulsa', name:'Avulsa (não definida)', projects:[]},
  {id:'proc', name:'Procedimentos iniciais', projects:[]},
  {id:'lev', name:'Levantamento', projects:[{glyph:'✳',name:'Apartamento Bosque',deadline:'15 set'}]},
  {id:'ante', name:'Anteprojeto', projects:[{glyph:'▲',name:'Ed. Jequitibá — cobertura',deadline:'21 ago',late:true}]},
  {id:'ante-int', name:'Anteprojeto de Interiores', projects:[{glyph:'◎',name:'Loja Cedro',deadline:'02 set'}]},
  {id:'exec', name:'Projeto Executivo', projects:[{glyph:'✳',name:'Residência Vale Verde',deadline:'28 ago'}]},
  {id:'obra', name:'Acompanhamento de obra', projects:[]}
];
function renderStages(){
  const el = document.getElementById('stageKanban');
  if(!el) return;
  let html = '';
  stages.forEach(s=>{
    html += '<div class="stage-col"><div class="stage-col-head"><span class="stg-name">'+s.name+'</span><div class="stg-right"><span class="stg-count">'+String(s.projects.length).padStart(2,'0')+'</span><button class="stg-del" onclick="removeStage(\''+s.id+'\')" title="Excluir etapa">×</button></div></div>';
    if(s.projects.length===0){
      html += '<div class="stage-empty">Nenhum projeto</div>';
    } else {
      s.projects.forEach(p=>{
        html += '<div class="stage-card" onclick="nav(\'projeto\')"><div class="stage-card-name"><span class="glyph" style="font-size:11px;">'+p.glyph+'</span> '+p.name+'</div><div class="stage-card-foot"><span class="eyebrow" style="'+(p.late?'color:var(--rust);':'')+'">'+ (p.late?'atrasado · ':'prazo ') + p.deadline+'</span></div></div>';
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
    stages.push({id:'s'+Date.now(), name:name.trim(), projects:[]});
    renderStages();
  }
}
function removeStage(id){
  if(id==='avulsa'){ alert('A etapa "Avulsa" não pode ser excluída.'); return; }
  const col = stages.find(s=>s.id===id);
  if(!col) return;
  if(confirm('Excluir a etapa "'+col.name+'"? Os projetos vinculados voltam para "Avulsa".')){
    const avulsa = stages.find(s=>s.id==='avulsa');
    if(avulsa) avulsa.projects.push(...col.projects);
    stages = stages.filter(s=>s.id!==id);
    renderStages();
  }
}
renderStages();

let timerInterval=null, timerSeconds=0, timerRunning=false;
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
    timerInterval=setInterval(()=>{timerSeconds++;renderTimer();},1000);
  } else {
    btn.textContent='Iniciar cronômetro';
    btn.classList.remove('stop');
    clearInterval(timerInterval);
  }
}
function openTask(title, phase){
  document.getElementById('tp-title').textContent=title;
  document.getElementById('tp-phase').textContent=phase;
  timerSeconds=0; timerRunning=false; clearInterval(timerInterval);
  document.getElementById('timer-btn').textContent='Iniciar cronômetro';
  document.getElementById('timer-btn').classList.remove('stop');
  renderTimer();
  document.getElementById('taskPanel').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}
function closeTask(){
  document.getElementById('taskPanel').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
  clearInterval(timerInterval); timerRunning=false;
}

/* ---------- Clientes ---------- */
const clientesData = [
  {id:'andrade', iniciais:'FA', nome:'Fam. Andrade', tipo:'Pessoa física', desde:'Cliente desde 2025',
   projetos:['Residência Vale Verde'], email:'andrade@email.com', telefone:'(85) 99887-1122',
   endereco:'Rua das Palmeiras, 340 — Bairro Vale Verde',
   docs:['Contrato de honorários.pdf','Procuração.pdf','RG e CPF.pdf'],
   notas:'Prefere contato por WhatsApp. Reunião mensal de alinhamento às sextas.'},
  {id:'cedro', iniciais:'CM', nome:'Cedro Móveis Ltda.', tipo:'Pessoa jurídica · contato: Renata Cedro', desde:'Cliente desde 2024',
   projetos:['Loja Cedro'], email:'renata@cedro.com.br', telefone:'(85) 98123-7788',
   endereco:'Av. Padre Cícero, 1200 — Centro',
   docs:['Contrato social.pdf','Contrato de honorários.pdf','Briefing da loja.pdf','Referências visuais.pdf','Aprovação de layout.pdf'],
   notas:'Faturamento via nota fiscal de serviço, emitida mensalmente.'},
  {id:'camargo', iniciais:'SC', nome:'Sr. Camargo', tipo:'Pessoa física', desde:'Cliente desde 2023',
   projetos:['Ed. Jequitibá — cobertura'], email:'camargo@email.com', telefone:'(85) 99456-3321',
   endereco:'Ed. Jequitibá, cobertura — Bairro Cariri',
   docs:['Contrato de honorários.pdf','Memorial descritivo.pdf'],
   notas:'Projeto em fase de anteprojeto, atualmente atrasado.'},
  {id:'tavares', iniciais:'ST', nome:'Sra. Tavares', tipo:'Pessoa física', desde:'Cliente desde 2026',
   projetos:['Apartamento Bosque'], email:'tavares@email.com', telefone:'(85) 99234-5567',
   endereco:'Ed. Bosque Verde, apto 402',
   docs:['Contrato de honorários.pdf'],
   notas:'Início do projeto: levantamento em andamento.'},
];
function renderClientes(){
  const el = document.getElementById('listaClientes');
  if(!el) return;
  let html = '<div class="list-row list-head" style="grid-template-columns:2fr 1.3fr 1.3fr 1fr;"><span>Cliente</span><span>Projeto(s)</span><span>Contato</span><span>Documentos</span></div>';
  clientesData.forEach(c=>{
    html += '<div class="list-row" style="grid-template-columns:2fr 1.3fr 1.3fr 1fr;" onclick="openCliente(\''+c.id+'\')">'
      + '<span class="proj-name-cell"><b>'+c.nome+'</b><span>'+c.desde+'</span></span>'
      + '<span>'+c.projetos.join(', ')+'</span>'
      + '<span class="mono-cell">'+c.email+'</span>'
      + '<span class="eyebrow">'+c.docs.length+' arquivo'+(c.docs.length===1?'':'s')+' →</span>'
      + '</div>';
  });
  el.innerHTML = html;
}
function openCliente(id){
  const c = clientesData.find(x=>x.id===id);
  if(!c) return;
  document.getElementById('cli-av').textContent = c.iniciais;
  document.getElementById('cli-nome').textContent = c.nome;
  document.getElementById('cli-sub').textContent = c.tipo;
  document.getElementById('cli-kv').innerHTML =
    '<div class="kv-row"><div class="kv-label">E-mail</div><div class="kv-value">'+c.email+'</div></div>'
    +'<div class="kv-row"><div class="kv-label">Telefone</div><div class="kv-value">'+c.telefone+'</div></div>'
    +'<div class="kv-row"><div class="kv-label">Endereço</div><div class="kv-value">'+c.endereco+'</div></div>'
    +'<div class="kv-row"><div class="kv-label">Notas</div><div class="kv-value">'+c.notas+'</div></div>';
  document.getElementById('cli-projetos').innerHTML = c.projetos.map(p=>
    '<div class="simple-list-row"><div class="row-title">'+p+'</div><button class="link-btn" onclick="nav(\'projeto\')">Abrir →</button></div>'
  ).join('');
  document.getElementById('cli-docs').innerHTML = c.docs.map(d=>
    '<div class="simple-list-row"><div class="row-flex"><span class="doc-ic">PDF</span><span class="row-title">'+d+'</span></div><a href="#" class="link-btn">Abrir ↗</a></div>'
  ).join('');
  nav('cliente');
  document.getElementById('crumb').innerHTML = '<a onclick="nav(\'clientes\')" style="cursor:pointer;">Clientes</a> <span style="opacity:.4">/</span> <b>'+c.nome+'</b>';
}
renderClientes();

/* ---------- Fornecedores ---------- */
const fornecedoresData = [
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
];
function renderFornecedores(){
  const el = document.getElementById('listaFornecedores');
  if(!el) return;
  let html = '<div class="list-row list-head" style="grid-template-columns:1.8fr 1.4fr 1.4fr 1fr;"><span>Fornecedor</span><span>Categoria</span><span>Projetos vinculados</span><span>Contato</span></div>';
  fornecedoresData.forEach(f=>{
    html += '<div class="list-row" style="grid-template-columns:1.8fr 1.4fr 1.4fr 1fr;" onclick="openFornecedor(\''+f.id+'\')">'
      + '<span class="row-title">'+f.nome+'</span>'
      + '<span>'+f.categoria+'</span>'
      + '<span>'+f.projetos.join(', ')+'</span>'
      + '<span class="mono-cell">'+f.telefone.replace('(85) ','')+'</span>'
      + '</div>';
  });
  el.innerHTML = html;
}
function openFornecedor(id){
  const f = fornecedoresData.find(x=>x.id===id);
  if(!f) return;
  document.getElementById('for-av').textContent = f.iniciais;
  document.getElementById('for-nome').textContent = f.nome;
  document.getElementById('for-sub').textContent = f.categoria;
  document.getElementById('for-kv').innerHTML =
    '<div class="kv-row"><div class="kv-label">Categoria</div><div class="kv-value">'+f.categoria+'</div></div>'
    +'<div class="kv-row"><div class="kv-label">E-mail</div><div class="kv-value">'+f.email+'</div></div>'
    +'<div class="kv-row"><div class="kv-label">Telefone</div><div class="kv-value">'+f.telefone+'</div></div>'
    +'<div class="kv-row"><div class="kv-label">Endereço</div><div class="kv-value">'+f.endereco+'</div></div>'
    +'<div class="kv-row"><div class="kv-label">Notas</div><div class="kv-value">'+f.notas+'</div></div>';
  document.getElementById('for-projetos').innerHTML = f.projetos.map(p=>
    '<div class="simple-list-row"><div class="row-title">'+p+'</div><button class="link-btn" onclick="nav(\'projeto\')">Abrir →</button></div>'
  ).join('');
  document.getElementById('for-contatos').innerHTML =
    '<div class="simple-list-row"><div><div class="row-title">'+f.contato+'</div><div class="row-sub">Contato principal</div></div><span class="mono-cell">'+f.telefone+'</span></div>';
  nav('fornecedor');
  document.getElementById('crumb').innerHTML = '<a onclick="nav(\'fornecedores\')" style="cursor:pointer;">Fornecedores</a> <span style="opacity:.4">/</span> <b>'+f.nome+'</b>';
}
renderFornecedores();
