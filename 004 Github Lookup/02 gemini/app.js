const mouseOrb = document.getElementById("mouseOrb");
let mouseX = window.innerWidth / 2,
  mouseY = window.innerHeight / 2;
let orbX = mouseX,
  orbY = mouseY;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateOrb() {
  orbX += (mouseX - orbX) * 0.04;
  orbY += (mouseY - orbY) * 0.04;
  mouseOrb.style.left = `${orbX}px`;
  mouseOrb.style.top = `${orbY}px`;
  requestAnimationFrame(animateOrb);
}
animateOrb();

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Scroll-based theme toggle and title shrink effect
const themeToggle = document.getElementById("themeToggle");
const siteTitle = document.querySelector(".site-title");
const titleContainer = document.querySelector(".title-container");
const topBar = document.querySelector(".top-bar");
const viewportWrapper = document.querySelector(".viewport-wrapper");

viewportWrapper.addEventListener("scroll", () => {
  const scrollY = viewportWrapper.scrollTop;
  const maxScroll = 200; // Scroll distance to reach minimum size
  const minScale = 0.75; // Both shrink to 75%

  // Calculate scale based on scroll position
  const scrollProgress = Math.min(scrollY / maxScroll, 1);
  const scale = 1 - scrollProgress * (1 - minScale);

  // Title: shrink from 2.5rem to 75% and reduce padding
  const titleFontSize = 2.5 - scrollProgress * 0.625; // 2.5rem down to 1.875rem (75%)
  const titlePadding = 8 - scrollProgress * 6; // 8px down to 2px
  
  // Container margin: reduce from 32px to 16px
  const containerMargin = 32 - scrollProgress * 16; // 32px down to 16px
  
  themeToggle.style.transform = `scale(${scale})`;
  siteTitle.style.fontSize = `${titleFontSize}rem`;
  siteTitle.style.padding = `${titlePadding}px 0`;
  titleContainer.style.marginBottom = `${containerMargin}px`;
});

async function fetchUser(user) {
  const username = user.trim();
  if (!username) return;

  document
    .querySelectorAll(".reveal-node")
    .forEach((n) => n.classList.remove("visible"));

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("errorCard").classList.add("hidden");
  document.getElementById("profileCard").classList.add("hidden");
  document.getElementById("repoSection").classList.add("hidden");

  setTimeout(
    () => document.getElementById("loading").classList.add("visible"),
    50,
  );

  try {
    const [uRes, rRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(
        `https://api.github.com/users/${username}/repos?sort=stars&per_page=9`,
      ),
    ]);

    if (!uRes.ok) throw new Error();
    const userData = await uRes.json();
    const reposData = await rRes.json();

    document.getElementById("loading").classList.add("hidden");

    renderProfile(userData);
    renderRepos(reposData);
  } catch {
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("errorCard").classList.remove("hidden");
    setTimeout(
      () => document.getElementById("errorCard").classList.add("visible"),
      50,
    );
  }
}

function renderProfile(user) {
  document.getElementById("avatar").src = user.avatar_url;
  document.getElementById("name").textContent = user.name || user.login;
  document.getElementById("login").textContent = `@${user.login}`;
  document.getElementById("joinedDate").textContent =
    `Member since ${new Date(user.created_at).getFullYear()}`;
  document.getElementById("bio").textContent =
    user.bio || "No biography provided.";
  document.getElementById("repos").textContent = user.public_repos;
  document.getElementById("followers").textContent = user.followers;
  document.getElementById("following").textContent = user.following;

  const fields = [
    ["location", user.location, "locationItem"],
    ["blog", user.blog, "blogItem", true],
    [
      "twitter",
      user.twitter_username,
      "twitterItem",
      true,
      `https://twitter.com/${user.twitter_username}`,
    ],
  ];

  fields.forEach(([id, val, container, isLink, href]) => {
    const el = document.getElementById(id);
    const cont = document.getElementById(container);
    if (val) {
      cont.classList.remove("hidden");
      el.textContent = val;
      if (isLink)
        el.href = href || (val.startsWith("http") ? val : `https://${val}`);
    } else {
      cont.classList.add("hidden");
    }
  });

  const profileCard = document.getElementById("profileCard");
  profileCard.classList.remove("hidden");
  setTimeout(() => profileCard.classList.add("visible"), 150);
}

function renderRepos(repos) {
  const grid = document.getElementById("repoGrid");
  const section = document.getElementById("repoSection");
  const header = document.getElementById("repoHeader");

  grid.innerHTML = "";
  section.classList.remove("hidden");

  // Delayed header reveal
  setTimeout(() => header.classList.add("visible"), 450);

  repos.forEach((repo, i) => {
    const card = document.createElement("a");
    card.className = "repo-card reveal-node";
    card.href = repo.html_url;
    card.target = "_blank";
    card.innerHTML = `
            <div class="repo-name">${repo.name}</div>
            <div class="repo-desc">${repo.description || "No description provided."}</div>
            <div class="repo-stats">
                <div class="repo-stat-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>${repo.stargazers_count}</div>
                <div class="repo-stat-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>${repo.forks_count}</div>
                ${repo.language ? `<div class="repo-stat-item"><span class="lang-dot" style="background:var(--brand-accent)"></span>${repo.language}</div>` : ""}
            </div>
        `;
    grid.appendChild(card);

    // Slowed down group animation: 3 items per row
    // Each row now has a 300ms staggered delay from the previous one
    const rowIndex = Math.floor(i / 3);
    setTimeout(() => card.classList.add("visible"), 700 + rowIndex * 300);
  });
}

const input = document.getElementById("usernameInput");
const btn = document.getElementById("searchBtn");

const handleSearch = () => {
  if (input.value.trim()) fetchUser(input.value);
};

btn.addEventListener("click", handleSearch);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

// Load default user
window.onload = () => fetchUser("gaearon");
