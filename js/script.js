// =========================================
// 1. 다크모드 토글
// =========================================
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

// 저장된 설정 읽기 (시크릿 모드 등에서는 저장소가 막힐 수 있어서 try/catch)
function getSavedTheme() {
  try {
    return localStorage.getItem("theme");
  } catch (e) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    // 저장이 안 돼도 사이트는 정상 동작
  }
}

// 처음 접속: 저장된 설정 → 없으면 기기 설정(다크모드 여부)을 따름
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = getSavedTheme() || (prefersDark ? "dark" : "light");
root.setAttribute("data-theme", initialTheme);

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  saveTheme(next);
});

// =========================================
// 2. 모바일 메뉴 열기 / 닫기
// =========================================
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});

// 메뉴 항목을 누르면 메뉴 닫기
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "메뉴 열기");
  });
});

// =========================================
// 3. 프로젝트 필터 (완료 / 진행 중 / 예정)
// =========================================
const filterButtons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".project");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    // 누른 버튼만 강조
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // 상태가 맞는 프로젝트만 보여주기
    projects.forEach((project) => {
      const show = filter === "all" || project.dataset.status === filter;
      project.classList.toggle("hidden", !show);
    });
  });
});

// =========================================
// 4. 스크롤하면 섹션이 나타나는 효과 + 현재 메뉴 강조
// =========================================
const revealSections = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target); // 한 번 나타나면 끝
      }
    });
  },
  { threshold: 0.15 }
);

revealSections.forEach((section) => revealObserver.observe(section));

// 지금 보고 있는 섹션의 메뉴에 색 표시
const sections = document.querySelectorAll("main section[id]");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const isCurrent = link.getAttribute("href") === "#" + entry.target.id;
          link.classList.toggle("active", isCurrent);
        });
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => navObserver.observe(section));
