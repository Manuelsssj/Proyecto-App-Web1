/* ====== DEMO CON SESIÓN + ESTADOS + GESTIÓN DE CURSOS + VALIDACIONES ====== */

const LS = {
  USER: "tc_user",        // {email, name, role:'student'|'admin'}
  ENR:  "tc_enrollments", // { [courseId]: true }
  RES:  "tc_results",     // { [courseId]: {correct, total, passed} }
  COURSES: "tc_courses"   // [ ...cursos ] (si existe, reemplaza los de fábrica)
};

// helpers storage
const load = (k,f)=>{ try{ return JSON.parse(localStorage.getItem(k)) ?? f; }catch{ return f; } };
const save = (k,v)=> localStorage.setItem(k, JSON.stringify(v));

// ===== Sesión =====
function getUser(){ return load(LS.USER, null); }
function setUser(u){ save(LS.USER, u); }
function clearUser(){ localStorage.removeItem(LS.USER); }
function isAdmin(){ return getUser()?.role === 'admin'; }

function renderAuthUI(){
  const user = getUser();
  document.querySelectorAll('[data-auth="guest"]').forEach(el=>el.classList.toggle('hidden', !!user));
  document.querySelectorAll('[data-auth="user"]').forEach(el=>el.classList.toggle('hidden', !user));
  document.querySelectorAll('[data-admin-only]').forEach(el=>el.classList.toggle('hidden', !isAdmin()));
  const logout = document.getElementById('logoutLink');
  if(logout){
    logout.onclick = (e)=>{ e.preventDefault(); clearUser(); alert('Sesión cerrada'); location.href='index.html'; };
  }
}

// ===== Utilidades de validación =====
function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

// ===== Cursos de fábrica (contenido básico y coherente con la lección) =====
const DEFAULT_COURSES = [
  {
    id:"c1",
    title:"Fundamentos de Programación",
    meta:"Nivel inicial · ~10h",
    desc:"Variables, condicionales, bucles y funciones para resolver problemas simples.",
    content: `
      <h3>Objetivo</h3>
      <p>Comprender los principios básicos de la programación y desarrollar lógica con variables, condicionales, bucles y funciones.</p>
      <h3>Conceptos clave</h3>
      <ul>
        <li><b>Variables:</b> espacios para guardar datos, p. ej. <code>edad=20</code>.</li>
        <li><b>Tipos:</b> numéricos, cadenas y booleanos (verdadero/falso).</li>
        <li><b>Operadores:</b> aritméticos (+,-,*,/) y comparativos (==,&gt;,&lt;).</li>
        <li><b>Condicionales:</b> permiten decidir con <code>if / else</code>.</li>
        <li><b>Bucles:</b> repiten código (<code>for</code>, <code>while</code>).</li>
        <li><b>Funciones:</b> agrupan instrucciones reutilizables.</li>
      </ul>
      <h3>Ejemplos</h3>
      <pre><code>// Ejemplo condicional
if (edad &gt;= 18) { print("Mayor de edad"); } else { print("Menor de edad"); }

// Ejemplo bucle
for (i=0; i&lt;5; i++) { print("Número:", i); }

// Ejemplo función
function suma(a,b){ return a+b; }</code></pre>
      <p>Programar mejora el pensamiento lógico y permite automatizar tareas.</p>
    `,
    quiz:[
      {q:"¿Qué tipo representa verdadero/falso?",o:["Booleano","Cadena","Entero"],a:0},
      {q:"¿Cuál de estos repite código?",o:["if","while","else"],a:1},
      {q:"¿Para qué sirve una función?",o:["Reutilizar instrucciones","Guardar archivos","Pintar estilos"],a:0},
      {q:"¿Qué operador compara igualdad?",o:["==","=","!="],a:0},
      {q:"¿Qué estructura decide entre alternativas?",o:["if/else","for","while"],a:0}
    ]
  },
  {
    id:"c2",
    title:"Redes y TCP/IP",
    meta:"Nivel inicial · ~8h",
    desc:"Dirección IP, máscara, gateway y DNS; y comandos de diagnóstico como ping y traceroute.",
    content: `
      <h3>Objetivo</h3>
      <p>Conocer los fundamentos del modelo TCP/IP y cómo se comunican los dispositivos en Internet.</p>
      <h3>Modelo TCP/IP</h3>
      <ol>
        <li><b>Aplicación:</b> programas (navegador, correo).</li>
        <li><b>Transporte:</b> fiabilidad y puertos (TCP/UDP).</li>
        <li><b>Internet:</b> direccionamiento (IP).</li>
        <li><b>Acceso a red:</b> medio físico (Wi-Fi, cable).</li>
      </ol>
      <h3>Parámetros de red</h3>
      <ul>
        <li><b>IP:</b> identifica al equipo, ej. 192.168.1.5</li>
        <li><b>Máscara:</b> separa red/host, ej. 255.255.255.0 (/24)</li>
        <li><b>Gateway:</b> salida a otras redes (Internet)</li>
        <li><b>DNS:</b> traduce nombres (dominio) a IP</li>
      </ul>
      <h3>Diagnóstico</h3>
      <pre><code>ipconfig / ifconfig
ping 8.8.8.8
tracert (Windows) / traceroute (Linux/Mac)</code></pre>
      <p>Si falla la navegación, prueba conectividad con <code>ping</code> y revisa la configuración IP/DNS.</p>
    `,
    quiz:[
      {q:"¿Qué servicio traduce nombres a direcciones IP?",o:["DNS","HTTP","FTP"],a:0},
      {q:"Una máscara /24 equivale a:",o:["255.255.255.0","255.255.0.0","255.0.0.0"],a:0},
      {q:"¿Qué comando comprueba conectividad básica?",o:["ping","ipconfig","whoami"],a:0},
      {q:"¿Cuál es la capa con protocolos TCP/UDP?",o:["Transporte","Aplicación","Internet"],a:0},
      {q:"El gateway sirve para:",o:["Salir a otras redes","Asignar IPs","Cifrar tráfico"],a:0}
    ]
  },
  {
    id:"c3",
    title:"Bases de Datos SQL",
    meta:"Nivel inicial · ~10h",
    desc:"Modelo relacional, tablas y consultas básicas con SELECT, WHERE y agregaciones sencillas.",
    content: `
      <h3>Objetivo</h3>
      <p>Manejar datos con SQL: crear tablas, insertar registros y consultar información.</p>
      <h3>Modelo relacional</h3>
      <p>Los datos se guardan en tablas (columnas/campos y filas/registros). Es recomendable definir una clave primaria.</p>
      <h3>Comandos SQL básicos</h3>
      <pre><code>CREATE TABLE alumnos(id INT PRIMARY KEY, nombre VARCHAR(50));
INSERT INTO alumnos VALUES (1,'Ana'),(2,'Luis');
SELECT nombre FROM alumnos WHERE id &gt; 1;
UPDATE alumnos SET nombre='Luis A.' WHERE id=2;
DELETE FROM alumnos WHERE id=1;</code></pre>
      <h3>Funciones útiles</h3>
      <ul>
        <li><code>COUNT()</code> cuenta filas</li>
        <li><code>AVG()</code>, <code>MIN()</code>, <code>MAX()</code></li>
        <li><code>DISTINCT</code> valores únicos</li>
      </ul>
      <p>SQL permite construir sistemas de información para múltiples áreas.</p>
    `,
    quiz:[
      {q:"¿Qué comando crea una tabla?",o:["INSERT","CREATE","ADD"],a:1},
      {q:"¿Qué cláusula filtra filas?",o:["WHERE","GROUP BY","ORDER BY"],a:0},
      {q:"¿Qué función cuenta registros?",o:["COUNT","SUM","AVG"],a:0},
      {q:"¿Cómo obtengo valores únicos?",o:["DISTINCT","UNIQUE()","ONLY"],a:0},
      {q:"¿Qué instrucción inserta registros?",o:["INSERT","UPDATE","DELETE"],a:0}
    ]
  },
  {
    id:"c4",
    title:"Desarrollo Web",
    meta:"Nivel inicial · ~12h",
    desc:"Estructura con HTML, estilos con CSS e interactividad con JavaScript.",
    content: `
      <h3>Objetivo</h3>
      <p>Entender cómo se construyen páginas web con HTML, CSS y JavaScript.</p>
      <h3>HTML</h3>
      <p>Define la estructura:</p>
      <pre><code>&lt;h1&gt;Bienvenido&lt;/h1&gt;
&lt;p&gt;Página de ejemplo&lt;/p&gt;
&lt;a href="contacto.html"&gt;Ir a contacto&lt;/a&gt;</code></pre>
      <h3>CSS</h3>
      <p>Define el aspecto visual:</p>
      <pre><code>body { background:#f9f9f9; font-family: Arial; }
h1 { color: blue; }</code></pre>
      <h3>JavaScript</h3>
      <p>Añade interactividad:</p>
      <pre><code>document.getElementById("boton").onclick = () =&gt; alert("Hola!");</code></pre>
      <p>Usa estructura semántica, diseño adaptable y prácticas de accesibilidad.</p>
    `,
    quiz:[
      {q:"¿Qué etiqueta contiene el contenido principal?",o:["head","main","footer"],a:1},
      {q:"¿Para qué sirve CSS?",o:["Estilos/diseño","Lógica de servidor","Base de datos"],a:0},
      {q:"¿Qué hace JavaScript en el navegador?",o:["Interactividad (DOM/eventos)","Define estilos","Estructura el HTML"],a:0},
      {q:"¿Para qué sirve el atributo alt?",o:["Texto alternativo de imágenes","Cambiar color","Importar JS"],a:0},
      {q:"¿Qué etiqueta crea enlaces?",o:["a","link","script"],a:0}
    ]
  },
  {
    id:"c5",
    title:"Ciberseguridad Básica",
    meta:"Nivel inicial · ~6h",
    desc:"Buenas prácticas para proteger tus cuentas y dispositivos en línea.",
    content: `
      <h3>Objetivo</h3>
      <p>Reconocer riesgos comunes y aplicar hábitos para proteger tu información.</p>
      <h3>Amenazas típicas</h3>
      <ul>
        <li><b>Phishing:</b> mensajes falsos que buscan datos.</li>
        <li><b>Malware:</b> software malicioso (virus, spyware).</li>
        <li><b>Contraseñas débiles:</b> fáciles de adivinar o reutilizadas.</li>
        <li><b>Wi-Fi público:</b> puede interceptar tráfico si no usas protección.</li>
      </ul>
      <h3>Buenas prácticas</h3>
      <ol>
        <li>Contraseñas de 12+ caracteres, únicas por sitio.</li>
        <li>Activa 2FA (app autenticadora mejor que SMS).</li>
        <li>No hagas clic en enlaces sospechosos; verifica remitente.</li>
        <li>Actualiza sistema y antivirus; haz copias de seguridad.</li>
        <li>Usa VPN en redes públicas.</li>
      </ol>
    `,
    quiz:[
      {q:"¿Qué método 2FA es preferible por seguridad?",o:["App 2FA","SMS","Email"],a:0},
      {q:"Mínimo recomendado de caracteres en una contraseña:",o:["12","6","4"],a:0},
      {q:"Señal típica de phishing:",o:["Urgencia y enlaces raros","Dominio verificado","Firma digital"],a:0},
      {q:"Buena práctica de claves:",o:["Usar gestor de contraseñas","Reutilizarlas","Compartir por chat"],a:0},
      {q:"En Wi-Fi público se recomienda:",o:["Usar VPN","Quitar 2FA","Compartir hotspot"],a:0}
    ]
  }
];

// cursos actuales (desde LS o default)
function getCourses(){ return load(LS.COURSES, null) ?? DEFAULT_COURSES; }
function setCourses(list){ save(LS.COURSES, list); }
function nextCourseId(){
  const list = getCourses();
  const nums = list.map(c=> (c.id||"").replace("c","")).map(n=>parseInt(n||"0",10)||0);
  const next = (Math.max(...nums)+1);
  return `c${next}`;
}

// ===== Enroll/Resultados =====
function getEnrolls(){ return load(LS.ENR, {}); }
function enroll(courseId){ const e=getEnrolls(); e[courseId]=true; save(LS.ENR,e); alert("Inscripción registrada (demo)."); if(document.getElementById('courseGrid')) initCursos(); }

function getResults(){ return load(LS.RES, {}); }
function setResult(courseId, correct, total){
  const r = getResults(); r[courseId] = {correct, total, passed: correct >= 3}; save(LS.RES, r);
}
function isApproved(courseId){ const r=getResults()[courseId]; return !!(r && r.passed); }

// ===== Páginas básicas =====
function initIndex(){ const y=document.getElementById("year"); if(y) y.textContent=new Date().getFullYear(); renderAuthUI(); }

// LOGIN con validación
function initLogin(){
  renderAuthUI();
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const email = form.email.value.trim();
    const pass  = form.password.value.trim();

    if(!isValidEmail(email)){ alert("Ingresa un correo válido."); return; }
    if(pass.length < 6){ alert("La contraseña debe tener al menos 6 caracteres."); return; }

    if(email === 'admin@tech' && pass === 'admin123'){
      setUser({email, name:'Admin', role:'admin'});
      alert('Sesión iniciada como ADMIN');
    }else{
      setUser({email, name: email.split('@')[0] || 'Alumno', role:'student'});
      alert('Sesión iniciada');
    }
    location.href = 'cursos.html';
  });
}

// REGISTRO con validación
function initRegister(){
  renderAuthUI();
  const form = document.getElementById("regForm");
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const name  = form.name.value.trim();
    const email = form.email.value.trim();
    const pass  = form.password.value.trim();

    if(name.length < 2){ alert("Ingresa tu nombre completo."); return; }
    if(!isValidEmail(email)){ alert("Ingresa un correo válido."); return; }
    if(pass.length < 6){ alert("La contraseña debe tener al menos 6 caracteres."); return; }

    setUser({email, name, role:'student'});
    alert('Cuenta creada e inicio de sesión realizado');
    location.href = 'cursos.html';
  });
}

// ===== Cursos (listado/curso/lección/estudiante) =====
function courseCard(c){
  const enrolled = !!getEnrolls()[c.id];
  const approved = isApproved(c.id);
  const status = approved ? `<span class="badge">✅ Aprobado</span>` : (enrolled ? `<span class="pill">📚 Inscrito</span>` : "");
  return `
    <div class="card">
      <div class="row wrap gap mb"><div class="muted">${c.meta}</div> ${status}</div>
      <h3>${c.title}</h3>
      <p>${c.desc}</p>
      <div class="row gap wrap">
        <a class="btn" href="curso.html?id=${c.id}">Ver curso</a>
        <a class="btn" href="leccion.html?id=${c.id}">Ir a la lección</a>
        <button class="btn" onclick="enroll('${c.id}')">Inscribirme</button>
      </div>
    </div>`;
}
function initCursos(){
  renderAuthUI();
  const list = getCourses();
  document.getElementById("courseGrid").innerHTML = list.map(courseCard).join("");
}
function initCurso(){
  renderAuthUI();
  const id = new URLSearchParams(location.search).get("id");
  const list = getCourses();
  const c = list.find(x=>x.id===id) || list[0];

  document.getElementById("courseMeta").textContent = c.meta;
  document.getElementById("courseTitle").textContent = c.title;
  document.getElementById("courseContent").innerHTML = c.content;

  document.getElementById("lessonLink").href = `leccion.html?id=${c.id}`;
  document.getElementById("enrollBtn").onclick = ()=> enroll(c.id);

  const statusWrap = document.createElement("div"); statusWrap.className = "row wrap gap mb";
  const enrolled = !!getEnrolls()[c.id]; const approved = isApproved(c.id);
  if (approved) statusWrap.innerHTML += `<span class="badge">✅ Aprobado</span>`;
  else if (enrolled) statusWrap.innerHTML += `<span class="pill">📚 Inscrito</span>`;
  document.getElementById("courseMeta").appendChild(statusWrap);
}
function initLeccion(){
  renderAuthUI();
  const id = new URLSearchParams(location.search).get("id");
  const list = getCourses();
  const c = list.find(x=>x.id===id) || list[0];

  document.getElementById("lessonMeta").textContent = c.meta;
  document.getElementById("lessonTitle").textContent = `Lección · ${c.title}`;
  document.getElementById("backToCourse").href = `curso.html?id=${c.id}`;

  const wrap = document.getElementById("quizWrap");
  (c.quiz || []).forEach((q,i)=>{
    const group = document.createElement("div");
    group.className = "mt";
    group.innerHTML = `
      <p><b>${i+1}.</b> ${q.q}</p>
      ${q.o.map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join("")}
    `;
    wrap.appendChild(group);
  });

  document.getElementById("quizForm").addEventListener("submit", e=>{
    e.preventDefault();
    let correct=0;
    (c.quiz || []).forEach((q,i)=>{
      const v = document.querySelector(`input[name='q${i}']:checked`);
      if(v && +v.value===q.a) correct++;
    });
    setResult(c.id, correct, (c.quiz||[]).length);
    const needed = 3, total = (c.quiz||[]).length;
    document.getElementById("quizResult").textContent =
      correct >= needed ? `¡Aprobado! Correctas ${correct}/${total} ✅`
                        : `No aprobado. Correctas ${correct}/${total}. Necesitas ${needed}.`;
  });
}
function initEstudiante(){
  renderAuthUI();
  const enr = getEnrolls(); const res = getResults(); const list = getCourses();
  const enrolled = list.filter(c => enr[c.id]);
  const approved = list.filter(c => res[c.id]?.passed);
  const pending  = list.filter(c => enr[c.id] && !res[c.id]?.passed);

  const mkCard = (c) => {
    const r = res[c.id]; const badge = r?.passed ? `<span class="badge">✅ Aprobado</span>` : `<span class="pill">📚 Inscrito</span>`;
    const progress = r ? ` · Resultado: ${r.correct}/${r.total}` : "";
    return `
      <div class="card">
        <div class="row wrap gap mb"><div class="muted">${c.meta}</div> ${badge}</div>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <p class="muted">Estado: ${r?.passed ? "Aprobado" : "Inscrito"}${progress}</p>
        <div class="row gap wrap">
          <a class="btn" href="curso.html?id=${c.id}">Ver contenido</a>
          <a class="btn" href="leccion.html?id=${c.id}">Ir a la lección</a>
        </div>
      </div>`;
  };

  document.getElementById("est-aprobados").innerHTML = approved.length
    ? approved.map(mkCard).join("") : `<div class="card"><p class="muted">Aún no hay cursos aprobados.</p></div>`;
  document.getElementById("est-pendientes").innerHTML = pending.length
    ? pending.map(mkCard).join("") : `<div class="card"><p class="muted">No hay cursos pendientes.</p></div>`;
  document.getElementById("est-inscritos").innerHTML = enrolled.length
    ? enrolled.map(mkCard).join("") : `<div class="card"><p class="muted">Todavía no te inscribes en ningún curso.</p></div>`;
}

// ===== Admin: KPIs + CRUD básico de cursos + VALIDACIÓN =====
function computeAdminKPIs(){
  const enr = getEnrolls();
  const res = getResults();
  const inscritos = Object.keys(enr).length;
  const aprobados = Object.values(res).filter(r=>r?.passed).length;
  const pendientes = Math.max(inscritos - aprobados, 0);
  return { inscritos, aprobados, pendientes };
}
function renderKPIs(){
  const k = computeAdminKPIs();
  const si = document.getElementById("kpiInscritos");
  const sa = document.getElementById("kpiAprobados");
  const sp = document.getElementById("kpiPendientes");
  if(si) si.textContent = k.inscritos;
  if(sa) sa.textContent = k.aprobados;
  if(sp) sp.textContent = k.pendientes;
}
function renderCourseTable(){
  const tbody = document.querySelector("#courseTable tbody");
  if(!tbody) return;
  const list = getCourses();
  tbody.innerHTML = list.map(c=>`
    <tr>
      <td>${c.id}</td>
      <td>${c.title}</td>
      <td>${c.meta}</td>
      <td class="row gap">
        <button class="btn" data-edit="${c.id}">Editar</button>
        <button class="btn" data-del="${c.id}">Eliminar</button>
      </td>
    </tr>
  `).join("");
  tbody.querySelectorAll("[data-edit]").forEach(b=> b.onclick = ()=> loadCourseIntoForm(b.dataset.edit));
  tbody.querySelectorAll("[data-del]").forEach(b=> b.onclick = ()=> deleteCourse(b.dataset.del));
}
function loadCourseIntoForm(id){
  const list = getCourses();
  const c = list.find(x=>x.id===id);
  if(!c) return;
  const f = document.getElementById("courseForm");
  f.id.value = c.id;
  f.title.value = c.title;
  f.meta.value = c.meta;
  f.desc.value = c.desc;
  f.content.value = c.content;
  window.scrollTo({top:0, behavior:'smooth'});
}
function deleteCourse(id){
  if(!confirm("¿Eliminar curso?")) return;
  let list = getCourses().filter(c=>c.id!==id);
  setCourses(list);
  renderCourseTable();
  alert("Curso eliminado.");
}
function resetCourseForm(){
  const f = document.getElementById("courseForm");
  f.reset();
  f.id.value = "";
}
function nextCoursePayloadFromForm(f){
  return {
    id: f.id.value.trim() || nextCourseId(),
    title: f.title.value.trim(),
    meta: f.meta.value.trim(),
    desc: f.desc.value.trim(),
    content: f.content.value.trim(),
    // Quiz por defecto para cursos nuevos
    quiz: [
      {q:"Pregunta 1",o:["A","B","C"],a:0},
      {q:"Pregunta 2",o:["A","B","C"],a:1},
      {q:"Pregunta 3",o:["A","B","C"],a:2},
      {q:"Pregunta 4",o:["A","B","C"],a:0},
      {q:"Pregunta 5",o:["A","B","C"],a:1},
    ]
  };
}
function initAdmin(){
  renderAuthUI();
  if(!isAdmin()){ alert('Solo para administrador'); location.href='index.html'; return; }

  renderKPIs();
  renderCourseTable();

  const f = document.getElementById("courseForm");
  f.addEventListener("submit", (e)=>{
    e.preventDefault();
    const title = f.title.value.trim();
    const meta  = f.meta.value.trim();
    const desc  = f.desc.value.trim();
    const cont  = f.content.value.trim();

    // VALIDACIONES solicitadas
    if(title.length < 3){ alert("El título debe tener al menos 3 caracteres."); return; }
    if(meta.length  < 5){ alert("Meta muy corta (ej.: 'Nivel inicial · ~10h')."); return; }
    if(desc.length  < 10){ alert("Descripción demasiado corta."); return; }
    if(cont.length  < 20){ alert("Contenido insuficiente. Agrega un par de párrafos."); return; }

    const id = f.id.value.trim();
    const payload = nextCoursePayloadFromForm(f);

    let list = getCourses();
    if(id) list = list.map(c=> c.id===id ? {...c, ...payload, id} : c);
    else   list = [...list, payload];

    setCourses(list);
    renderCourseTable();
    alert(id ? "Curso actualizado" : "Curso creado");
    resetCourseForm();
  });
  document.getElementById("resetFormBtn").onclick = resetCourseForm;

  // tabla de ejemplo (demo)
  const tb = document.querySelector("#admTable tbody");
  if(tb){
    const alumnos=["Ana Pérez","Luis Torres","María León"];
    const rows=[];
    const list=getCourses();
    alumnos.forEach(a=>{
      list.forEach(c=>{
        const approved = Math.random()>0.6;
        rows.push(`<tr>
          <td>${a}</td>
          <td>${c.title}</td>
          <td>${Math.random()>0.5?"Sí":"No"}</td>
          <td>${approved? "Aprobado" : "Sin evaluación"}</td>
        </tr>`);
      });
    });
    tb.innerHTML = rows.join("");
  }
}
