const SUPPORTED_LANGS = ["ko", "zh", "en"];
const params = new URLSearchParams(window.location.search);
const requestedProject = params.get("project") || "1";
let currentLang = normalizeLang(params.get("lang") || localStorage.getItem("lang") || "ko");

const projectDetailData = {
    "1": {
        images: [
            "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1500&q=80",
            "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=1500&q=80",
            "https://images.unsplash.com/photo-1560264418-c4445382edbc?auto=format&fit=crop&w=1500&q=80"
        ],
        ko: {
            label: "Backend Project",
            title: "Scalable API System",
            brief: "전자상거래 트래픽을 안정적으로 처리하는 고성능 API 시스템입니다.",
            overview: "Laravel 기반 API를 설계하고 Redis 캐시, 쿼리 최적화, AWS 배포 구성을 통해 피크 트래픽에서도 안정적인 응답 속도를 유지했습니다.",
            tags: ["PHP", "Laravel", "AWS"],
            data: ["Users: 120k+", "QPS: 3,000", "Latency: <120ms"]
        },
        zh: {
            label: "后端项目",
            title: "可扩展 API 系统",
            brief: "面向电商高并发场景的高吞吐 API 后端。",
            overview: "基于 Laravel 设计 API 架构，通过 Redis 缓存、SQL 查询优化和 AWS 部署配置，让系统在高峰流量下保持稳定响应。",
            tags: ["PHP", "Laravel", "AWS"],
            data: ["用户量：120k+", "QPS：3,000", "延迟：<120ms"]
        },
        en: {
            label: "Backend Project",
            title: "Scalable API System",
            brief: "A high-throughput API backend for e-commerce traffic.",
            overview: "Designed Laravel APIs with Redis caching, query optimization, and AWS deployment practices to keep response times stable during peak traffic.",
            tags: ["PHP", "Laravel", "AWS"],
            data: ["Users: 120k+", "QPS: 3,000", "Latency: <120ms"]
        }
    },
    "2": {
        images: [
            "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=1500&q=80",
            "https://images.unsplash.com/photo-1581091012184-5cbf73a5f05e?auto=format&fit=crop&w=1500&q=80",
            "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1500&q=80"
        ],
        ko: {
            label: "Infrastructure Project",
            title: "Real-time Cache Service",
            brief: "세션과 반복 조회 데이터를 위한 저지연 캐시 서비스입니다.",
            overview: "Docker 기반으로 Redis 캐시 계층을 구성하고 캐시 키 정책과 만료 전략을 정리해 반복 조회 비용을 낮췄습니다.",
            tags: ["Docker", "Redis"],
            data: ["Hit Rate: 98%", "Latency: 2-5ms", "Throughput: 8k/sec"]
        },
        zh: {
            label: "基础设施项目",
            title: "实时缓存服务",
            brief: "用于会话和高频读取数据的低延迟缓存服务。",
            overview: "基于 Docker 构建 Redis 缓存层，整理缓存键规则与过期策略，降低重复读取成本并提升响应稳定性。",
            tags: ["Docker", "Redis"],
            data: ["命中率：98%", "延迟：2-5ms", "吞吐量：8k/sec"]
        },
        en: {
            label: "Infrastructure Project",
            title: "Real-time Cache Service",
            brief: "A low-latency cache service for sessions and repeated reads.",
            overview: "Built a Redis cache layer with Docker and clarified key design plus expiration strategy to reduce repeated database reads.",
            tags: ["Docker", "Redis"],
            data: ["Hit Rate: 98%", "Latency: 2-5ms", "Throughput: 8k/sec"]
        }
    },
    "3": {
        images: [
            "https://images.unsplash.com/photo-1560264418-c4445382edbc?auto=format&fit=crop&w=1500&q=80",
            "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=1500&q=80",
            "https://images.unsplash.com/photo-1581091012184-5cbf73a5f05e?auto=format&fit=crop&w=1500&q=80"
        ],
        ko: {
            label: "Database Project",
            title: "Database Optimization",
            brief: "쿼리 병목을 줄이고 읽기 성능을 개선한 DB 최적화 프로젝트입니다.",
            overview: "느린 쿼리를 분석해 인덱스를 재설계하고 읽기 복제 구성을 도입해 주요 API의 응답 시간을 단축했습니다.",
            tags: ["PHP", "MySQL"],
            data: ["Tables: 120+", "Logs/day: 21M+", "Query Reduction: 40%"]
        },
        zh: {
            label: "数据库项目",
            title: "数据库优化",
            brief: "减少查询瓶颈并提升读取性能的数据库优化项目。",
            overview: "分析慢查询后重新设计索引，并引入读副本配置，降低核心 API 的响应时间和数据库压力。",
            tags: ["PHP", "MySQL"],
            data: ["数据表：120+", "日志/日：21M+", "查询减少：40%"]
        },
        en: {
            label: "Database Project",
            title: "Database Optimization",
            brief: "A database optimization project focused on faster reads.",
            overview: "Analyzed slow queries, redesigned indexes, and introduced read replicas to reduce response time for core APIs.",
            tags: ["PHP", "MySQL"],
            data: ["Tables: 120+", "Logs/day: 21M+", "Query Reduction: 40%"]
        }
    }
};

const UI_COPY = {
    ko: { overview: "Overview", stack: "Tech Stack", data: "Key Data", back: "← Back" },
    zh: { overview: "项目概览", stack: "技术栈", data: "关键数据", back: "← 返回" },
    en: { overview: "Overview", stack: "Tech Stack", data: "Key Data", back: "← Back" }
};

const projectId = projectDetailData[requestedProject] ? requestedProject : "1";
const els = {
    backBtn: document.getElementById("backBtn"),
    label: document.getElementById("detailLabel"),
    title: document.getElementById("detailTitle"),
    brief: document.getElementById("detailBrief"),
    overview: document.getElementById("detailOverview"),
    tags: document.getElementById("detailTags"),
    data: document.getElementById("detailData"),
    overviewHeading: document.getElementById("overviewHeading"),
    stackHeading: document.getElementById("stackHeading"),
    dataHeading: document.getElementById("dataHeading"),
    seoTitle: document.getElementById("seoTitle"),
    seoDesc: document.getElementById("seoDesc"),
    ogTitle: document.getElementById("ogTitle"),
    ogDesc: document.getElementById("ogDesc"),
    ogImage: document.getElementById("ogImage")
};

const slides = [
    document.getElementById("slide0"),
    document.getElementById("slide1"),
    document.getElementById("slide2")
];
let currentSlide = 0;

function normalizeLang(lang) {
    return SUPPORTED_LANGS.includes(lang) ? lang : "ko";
}

function syncUrl() {
    const nextParams = new URLSearchParams({ project: projectId, lang: currentLang });
    history.replaceState(null, "", `?${nextParams.toString()}`);
}

function renderDetail() {
    const data = projectDetailData[projectId][currentLang];
    const copy = UI_COPY[currentLang];

    document.documentElement.lang = currentLang;
    localStorage.setItem("lang", currentLang);
    syncUrl();

    els.label.textContent = data.label;
    els.title.textContent = data.title;
    els.brief.textContent = data.brief;
    els.overview.textContent = data.overview;
    els.overviewHeading.textContent = copy.overview;
    els.stackHeading.textContent = copy.stack;
    els.dataHeading.textContent = copy.data;

    els.tags.replaceChildren();
    data.tags.forEach(tag => {
        const item = document.createElement("span");
        item.className = "tag";
        item.textContent = tag;
        els.tags.appendChild(item);
    });

    els.data.replaceChildren();
    data.data.forEach(line => {
        const item = document.createElement("div");
        item.className = "data-line";
        item.textContent = line;
        els.data.appendChild(item);
    });

    const pageTitle = `${data.title} | Elkan Park`;
    document.title = pageTitle;
    els.seoTitle.textContent = pageTitle;
    els.seoDesc.content = data.brief;
    els.ogTitle.content = pageTitle;
    els.ogDesc.content = data.brief;
    els.ogImage.content = projectDetailData[projectId].images[0];

    els.backBtn.href = `index.html?lang=${encodeURIComponent(currentLang)}`;
    els.backBtn.textContent = copy.back;
}

function setupSlides() {
    projectDetailData[projectId].images.forEach((url, index) => {
        if (!slides[index]) return;
        slides[index].style.backgroundImage = `url("${url}")`;
        slides[index].style.pointerEvents = "none";
    });
    setSlide(0);
}

function setSlide(index) {
    currentSlide = index;
    slides.forEach((slide, slideIndex) => {
        if (!slide) return;
        slide.classList.toggle("visible", slideIndex === currentSlide);
    });
}

document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === currentLang));
    btn.addEventListener("click", () => {
        currentLang = normalizeLang(btn.dataset.lang);
        document.querySelectorAll(".lang-btn").forEach(item => {
            const isActive = item.dataset.lang === currentLang;
            item.classList.toggle("active", isActive);
            item.setAttribute("aria-pressed", String(isActive));
        });
        renderDetail();
    });
});

document.querySelector(".carousel-prev")?.addEventListener("click", () => {
    setSlide((currentSlide - 1 + slides.length) % slides.length);
});

document.querySelector(".carousel-next")?.addEventListener("click", () => {
    setSlide((currentSlide + 1) % slides.length);
});

setupSlides();
renderDetail();
