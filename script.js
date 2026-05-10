// script.js — 修复版（完整文件）
// 说明：修复了未定义 lang 导致的跳转报错，增加 currentLang 管理，并保留 Modal/轮播/多语言功能。

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     I18N 字典（示例，保留/扩展你的实际文案）
  ========================= */
  const I18N = {
    ko: {
      "meta.title":"Elkan Park — Portfolio",
      "intro.title":"안녕하세요,<br>PHP 백엔드 개발자<br><strong>Elkan Park</strong> 입니다.",
      "intro.desc":"안정적 서버 아키텍처와 확장성 있는 백엔드 시스템을 구축하는 백엔지니어입니다.",
      "profile.name":"Elkan Park","profile.role":"PHP 백엔드 엔지니어",
      "profile.email_label":"이메일","profile.email_value":"example@email.com",
      "profile.phone_label":"전화번호","profile.phone_value":"010-1234-5678",
      "profile.location_label":"위치","profile.location_value":"서울, 대한민국",
      "skills.title":"기술 스택","skills.php":"PHP","skills.laravel":"Laravel","skills.mysql":"MySQL",
      "skills.redis":"Redis","skills.docker":"Docker","skills.aws":"AWS","skills.nginx":"Nginx",
      "projects.title":"프로젝트",
      "projects.sample1.title":"프로젝트 이름","projects.sample1.desc":"간단한 설명 텍스트가 들어갑니다.",
      "projects.sample2.title":"프로젝트 이름","projects.sample2.desc":"간단한 설명 텍스트가 들어갑니다.",
      "projects.sample3.title":"프로젝트 이름","projects.sample3.desc":"간단한 설명 텍스트가 들어갑니다.",
      "modal.detail":"자세히 보기",
      "footer.copy":"© 2025 Elkan Park — All Rights Reserved"
    },
    zh: {
      "meta.title":"Elkan Park — 作品集",
      "intro.title":"你好，<br>我是 PHP 后端开发者<br><strong>Elkan Park</strong>",
      "intro.desc":"专注稳定服务器架构与可扩展后端系统的开发工程师。",
      "profile.name":"Elkan Park","profile.role":"PHP 后端工程师",
      "profile.email_label":"邮箱","profile.email_value":"example@email.com",
      "profile.phone_label":"电话","profile.phone_value":"010-1234-5678",
      "profile.location_label":"所在地","profile.location_value":"韩国 首尔",
      "skills.title":"技能","skills.php":"PHP","skills.laravel":"Laravel","skills.mysql":"MySQL",
      "skills.redis":"Redis","skills.docker":"Docker","skills.aws":"AWS","skills.nginx":"Nginx",
      "projects.title":"项目",
      "projects.sample1.title":"项目名称","projects.sample1.desc":"这里是一段简短的项目介绍。",
      "projects.sample2.title":"项目名称","projects.sample2.desc":"这里是一段简短的项目介绍。",
      "projects.sample3.title":"项目名称","projects.sample3.desc":"这里是一段简短的项目介绍。",
      "modal.detail":"查看完整详情",
      "footer.copy":"© 2025 Elkan Park — 版权所有"
    },
    en: {
      "meta.title":"Elkan Park — Portfolio",
      "intro.title":"Hello,<br>I am a PHP Backend Developer<br><strong>Elkan Park</strong>.",
      "intro.desc":"A backend engineer focusing on stable architecture and scalable backend systems.",
      "profile.name":"Elkan Park","profile.role":"PHP Backend Engineer",
      "profile.email_label":"Email","profile.email_value":"example@email.com",
      "profile.phone_label":"Phone","profile.phone_value":"010-1234-5678",
      "profile.location_label":"Location","profile.location_value":"Seoul, Korea",
      "skills.title":"Skills","skills.php":"PHP","skills.laravel":"Laravel","skills.mysql":"MySQL",
      "skills.redis":"Redis","skills.docker":"Docker","skills.aws":"AWS","skills.nginx":"Nginx",
      "projects.title":"Projects",
      "projects.sample1.title":"Project Name","projects.sample1.desc":"Short description about the project.",
      "projects.sample2.title":"Project Name","projects.sample2.desc":"Short description about the project.",
      "projects.sample3.title":"Project Name","projects.sample3.desc":"Short description about the project.",
      "modal.detail":"View Full Detail",
      "footer.copy":"© 2025 Elkan Park — All Rights Reserved"
    }
  };


  /* =========================
     State
  ========================= */
//  let currentLang = "ko"; // 当前语言（一定要维护）

  /* ========= 语言初始化（最高优先级 URL） ========= */
  const params = new URLSearchParams(window.location.search);
  const langFromURL = params.get("lang");

  const supportedLangs = ["ko", "zh", "en"];
  let currentLang = langFromURL
      || localStorage.getItem("lang")
      || "ko";
  if(!supportedLangs.includes(currentLang)) currentLang = "ko";

  /* 同步到 localStorage，保持页面间一致 */
  localStorage.setItem("lang", currentLang);
  let currentProject = 1;
  let currentIndex = 0;
  let autoRotateTimer = null;


  /* =========================
     Helpers: I18N apply
  ========================= */
  function applyLang(lang){
    if(!lang) lang = "ko";
    if(!supportedLangs.includes(lang)) lang = "ko";
    currentLang = lang;
    const dict = I18N[lang] || I18N['en'];
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.dataset.i18n;
      if(!key) return;
      const val = dict[key];
      if(val !== undefined){
        if(key.includes("intro.title")) el.innerHTML = val;
        else el.textContent = val;
      }
    });

    document.querySelectorAll(".lang-btn").forEach(btn=>{
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    if(detailBtn && dict["modal.detail"]) detailBtn.textContent = dict["modal.detail"];

    // 如果 Modal 打开，更新 Modal 文案（只会更新文字）
    const overlay = document.getElementById("projectModalOverlay");
    if(overlay && overlay.getAttribute("aria-hidden") === "false"){
      // re-render modal text using currentLang
      renderModalText(currentProject);
    }
  }

  // bind lang buttons
  document.querySelectorAll(".lang-btn").forEach(btn=>{
    btn.addEventListener("click", ()=> {
      const lang = btn.dataset.lang;
      localStorage.setItem("lang", lang);        // ✅ 记住语言
      history.replaceState(null, "", `?lang=${lang}`); // ✅ 同步 URL
      applyLang(lang);
    });
  });


  /* =========================
     Modal data / images
  ========================= */
  const imageSets = {
    1: [
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1581091012184-5cbf73a5f05e?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1560264418-c4445382edbc?auto=format&fit=crop&w=1500&q=80"
    ],
    2: [
      "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1560264418-c4445382edbc?auto=format&fit=crop&w=1500&q=80"
    ],
    3: [
      "https://images.unsplash.com/photo-1560264418-c4445382edbc?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1500&q=80",
      "https://images.unsplash.com/photo-1581091012184-5cbf73a5f05e?auto=format&fit=crop&w=1500&q=80"
    ]
  };

  const projectMeta = {
    1: {
      title: { ko: "프로젝트 1: Scalable API", zh: "项目 1：可扩展 API", en: "Project 1: Scalable API" },
      brief: { ko: "전자상거래용 고성능 API 시스템", zh: "电商用高吞吐 API 后端", en: "High-throughput backend for e-commerce." },
      tags: ["PHP","Laravel","AWS"],
      data: ["Users: 120k+","QPS: 3,000","Latency: <120ms"]
    },
    2: {
      title: { ko: "프로젝트 2: Real-time Cache", zh: "项目 2：实时缓存系统", en: "Project 2: Real-time Cache" },
      brief: { ko: "세션용 초저지연 캐시 서버", zh: "用于会话的低延迟缓存", en: "Low-latency caching service for sessions." },
      tags: ["Docker","Redis"],
      data: ["Hit Rate: 98%","Latency: 2–5ms","Throughput: 8k/sec"]
    },
    3: {
      title: { ko: "프로젝트 3: DB Optimization", zh: "项目 3：数据库优化", en: "Project 3: DB Optimization" },
      brief: { ko: "DB 쿼리 최적화 및 읽기 복제 구성", zh: "查询优化与读写分离", en: "Optimized queries and read replicas." },
      tags: ["MySQL","PHP"],
      data: ["Tables: 120+","Logs/day: 21M+","Query Reduction: 40%"]
    }
  };


  /* =========================
     Modal element refs (safe)
  ========================= */
  const overlay = document.getElementById("projectModalOverlay");
  const slideEls = [
    document.getElementById("modalSlide0"),
    document.getElementById("modalSlide1"),
    document.getElementById("modalSlide2")
  ];
  // note: prev/next may be outside or missing — guard later
  const prevBtn = overlay ? overlay.querySelector(".modal-prev") : null;
  const nextBtn = overlay ? overlay.querySelector(".modal-next") : null;
  const closeBtn = overlay ? overlay.querySelector(".modal-close") : null;
  const titleEl = document.getElementById("modalTitle");
  const briefEl = document.getElementById("modalBrief");
  const tagsEl = document.getElementById("modalTags");
  const dataEl = document.getElementById("modalData");
  const detailBtn = document.getElementById("modalDetailBtn");
  const loadingEl = document.getElementById("modalLoading");


  /* =========================
     Modal rendering & controls
  ========================= */
  function renderModalText(projectId){
    const meta = projectMeta[projectId] || projectMeta[1];
    if(!titleEl || !briefEl || !tagsEl || !dataEl) return;

    // use currentLang to pick text
    titleEl.textContent = (meta.title && meta.title[currentLang]) ? meta.title[currentLang] : (meta.title && meta.title.en);
    briefEl.textContent = (meta.brief && meta.brief[currentLang]) ? meta.brief[currentLang] : (meta.brief && meta.brief.en);

    tagsEl.innerHTML = (meta.tags || []).map(t => `<span class="tag">${t}</span>`).join(" ");
    dataEl.innerHTML = (meta.data || []).map(d => `<div class="data-line">${d}</div>`).join("");
  }

  function showLoading(flag){
    if(!loadingEl) return;
    loadingEl.classList.toggle("show", !!flag);
  }

  function preloadImages(list){
    return Promise.all(list.map(src => new Promise(res => {
      const img = new Image();
      img.onload = img.onerror = () => res();
      img.src = src;
    })));
  }

  function updateVisibleSlide(){
    slideEls.forEach((el,i) => {
      if(!el) return;
      el.classList.toggle("visible", i === currentIndex);
    });
  }

  function nextSlide(){
    const imgs = imageSets[currentProject] || imageSets[1];
    currentIndex = (currentIndex + 1) % imgs.length;
    updateVisibleSlide();
  }
  function prevSlide(){
    const imgs = imageSets[currentProject] || imageSets[1];
    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    updateVisibleSlide();
  }

  function stopAutoRotate(){
    if(autoRotateTimer){ clearInterval(autoRotateTimer); autoRotateTimer = null; }
  }

  function openModal(projectId){
    if(!overlay) return;
    currentProject = Number(projectId) || 1;
    currentIndex = 0;
    showLoading(true);

    const imgs = imageSets[currentProject] || imageSets[1];

    // preload images then show
    preloadImages(imgs).then(()=>{
      slideEls.forEach((el,i)=>{ if(el) { el.style.backgroundImage = `url("${imgs[i]}")`; el.classList.remove("visible"); } });
      if(slideEls[0]) slideEls[0].classList.add("visible");
      renderModalText(currentProject);
      showLoading(false);
    }).catch(()=>{ // on any fail, still attempt to show
      slideEls.forEach((el,i)=>{ if(el) el.style.backgroundImage = `url("${imgs[i]}")`; });
      renderModalText(currentProject);
      showLoading(false);
    });

    overlay.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";

    stopAutoRotate();
    autoRotateTimer = setInterval(()=> nextSlide(), 2800);
  }

  function closeModal(){
    if(!overlay) return;
    overlay.setAttribute("aria-hidden","true");
    stopAutoRotate();
    document.body.style.overflow = "";
  }

  // bind cards
  document.querySelectorAll(".project-card").forEach(card=>{
    card.addEventListener("click", () => {
      const pid = card.dataset.project || 1;
      openModal(pid);
    });
    card.addEventListener("keydown", (e) => {
      if(e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      const pid = card.dataset.project || 1;
      openModal(pid);
    });
  });

  // arrows / controls — guard existence and stopPropagation so clicks won't bubble to overlay
  if(nextBtn) nextBtn.addEventListener("click", e => { e.stopPropagation(); nextSlide(); stopAutoRotate(); });
  if(prevBtn) prevBtn.addEventListener("click", e => { e.stopPropagation(); prevSlide(); stopAutoRotate(); });
  if(closeBtn) closeBtn.addEventListener("click", e => { e.stopPropagation(); closeModal(); });

  // overlay click closes (only when clicking overlay itself)
  if(overlay) overlay.addEventListener("click", (e) => { if(e.target === overlay) closeModal(); });

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && overlay && overlay.getAttribute("aria-hidden") === "false") closeModal();
  });


  /* =========================
     Detail button -> preserve lang when navigating
  ========================= */
  if(detailBtn){
    detailBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // ensure currentLang exists, fallback to 'ko'
      const lang = currentLang || (document.querySelector(".lang-btn.active")?.dataset.lang) || "ko";
      closeModal();
      // include both project and lang in query string
      window.location.href = `project-detail.html?project=${currentProject}&lang=${encodeURIComponent(lang)}`;
    });
  }


  /* =========================
     Expose a small diagnostic log
  ========================= */
  // initial apply (in case elements have data-i18n keys)
  applyLang(currentLang);

});
