document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMenu();
  initAvatar();
  initPageTitle();
  initVisitorText();
});

/* =========================
   Theme（主題切換 + 記憶）
========================= */
function initTheme() {
  const body = document.body;
  const themeBtn = document.getElementById("themeBtn");

  // 載入儲存的主題
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    body.classList.add("light-theme");
    if (themeBtn) themeBtn.textContent = "🌕";
  }

  // 點擊切換
  if (!themeBtn) return;
  themeBtn.addEventListener("click", e => {
    e.stopPropagation();

    const isLight = body.classList.toggle("light-theme");
    themeBtn.textContent = isLight ? "🌕" : "🌑";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

/* =========================
   Menu（漢堡選單）
========================= */
function initMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const sideNav = document.getElementById("sideNav");
  const body = document.body;

  if (!menuBtn || !sideNav) return;

  // 漢堡按鈕
  menuBtn.addEventListener("click", e => {
    e.stopPropagation();

    sideNav.classList.toggle("active");
    body.classList.toggle("menu-open");
    menuBtn.classList.toggle("active");
  });

  // 點選選單連結 → 收回
  sideNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      sideNav.classList.remove("active");
      body.classList.remove("menu-open");
      menuBtn.classList.remove("active");
    });
  });

  // 點空白 → 收回
  document.addEventListener("click", e => {
    if (
      sideNav.classList.contains("active") &&
      !sideNav.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      sideNav.classList.remove("active");
      body.classList.remove("menu-open");
      menuBtn.classList.remove("active");
    }
  });
}

/* =========================
   Avatar（About 頭像互動）
========================= */
function initAvatar() {
  const avatar = document.getElementById("avatarClick");
  if (!avatar) return;

  const clickSound = new Audio("cat.wav");

  // 是否為觸控裝置（沒有 hover）
  const isTouchDevice = window.matchMedia("(hover: none)").matches;

  avatar.addEventListener("click", () => {
    // 播放音效
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});

    // 手機：切換圖片
    if (isTouchDevice) {
      avatar.classList.toggle("is-active");
    }

    // 點擊回饋動畫
    avatar.classList.add("is-clicked");
    setTimeout(() => {
      avatar.classList.remove("is-clicked");
    }, 150);
  });
}

/* =========================
   Page Title（逐字跳出）
========================= */
function initPageTitle() {
  const title = document.querySelector(".page-title");
  if (!title) return;

  const text = title.textContent.trim();
  title.textContent = "";

  [...text].forEach((char, index) => {
    const span = document.createElement("span");
    span.textContent = char === " " ? "\u00A0" : char;
    span.style.animationDelay = `${index * 0.08}s`;
    title.appendChild(span);
  });
}

/* =========================
   View Counter（首頁限定）
========================= */
(function () {
  const el = document.getElementById("viewCount");
  if (!el) return; // ⭐ 關鍵：只有首頁才會有這個元素

  const namespace = "hinagi-nagi-blog"; // 換成你自己的唯一名稱
  const key = "index";                  // ⭐ 只算首頁

  fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
    .then(res => res.json())
    .then(data => {
      el.textContent = data.value;
    })
    .catch(() => {
      el.textContent = "...";
    });
})();

function initVisitorText() {
  const el = document.getElementById("siteVisitor");
  const countEl = document.getElementById("viewCount");
  if (!el || !countEl) return;

  // 等觀看數抓到後再做動畫
  function initVisitorText() {
    const el = document.getElementById("siteVisitor");
    const countEl = document.getElementById("viewCount");
    if (!el || !countEl) return;

    let animated = false;

    const observer = new MutationObserver(() => {
      if (animated) return;
      animated = true;
      animateText(el);
      observer.disconnect();
    });

    observer.observe(countEl, { childList: true });

    // ⭐ 保底：1 秒後強制動畫（GitHub Pages 需要）
    setTimeout(() => {
      if (!animated) {
        animated = true;
        animateText(el);
      }
    }, 1000);

    function animateText(target) {
      const text = target.textContent;
      target.textContent = "";

      [...text].forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.classList.add("char");
        span.style.animationDelay = `${index * 0.04}s`;
        target.appendChild(span);
      });
    }
  }
  function animateText(target) {
    const text = target.textContent;
    target.textContent = "";

    [...text].forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.classList.add("char");
      span.style.animationDelay = `${index * 0.04}s`; // 比標題慢
      target.appendChild(span);
    });
  }
}
