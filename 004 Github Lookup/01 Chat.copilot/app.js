const usernameInput = document.getElementById("usernameInput");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const profile = document.getElementById("profile");
const themeToggle = document.getElementById("themeToggle");

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

themeToggle.addEventListener("click", toggleTheme);
initTheme();

function isValidUsername(username) {
  if (!username || username.trim() === "") return false;
  if (username.length > 39) return false;
  const validPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
  return validPattern.test(username);
}

function setLoading(isLoading) {
  if (isLoading) {
    loading.classList.remove("hidden");
    profile.classList.add("hidden");
    error.classList.add("hidden");
  } else {
    loading.classList.add("hidden");
  }
}

function showError(message) {
  error.textContent = message;
  error.classList.remove("hidden");
  profile.classList.add("hidden");
}

function renderUser(user) {
  document.getElementById("avatar").src = user.avatar_url;
  document.getElementById("name").textContent = user.name || user.login;
  document.getElementById("username").textContent = `@${user.login}`;
  document.getElementById("bio").textContent = user.bio || "No bio available";

  // Meta info
  const companyContainer = document.getElementById("companyContainer");
  if (user.company) {
    document.getElementById("company").textContent = user.company;
    companyContainer.classList.remove("hidden");
  } else {
    companyContainer.classList.add("hidden");
  }

  const locationContainer = document.getElementById("locationContainer");
  if (user.location) {
    document.getElementById("location").textContent = user.location;
    locationContainer.classList.remove("hidden");
  } else {
    locationContainer.classList.add("hidden");
  }

  const blogContainer = document.getElementById("blogContainer");
  if (user.blog) {
    const blogLink = document.getElementById("blog");
    blogLink.textContent = user.blog;
    blogLink.href = user.blog.startsWith("http")
      ? user.blog
      : `https://${user.blog}`;
    blogContainer.classList.remove("hidden");
  } else {
    blogContainer.classList.add("hidden");
  }

  const twitterContainer = document.getElementById("twitterContainer");
  if (user.twitter_username) {
    const twitterLink = document.getElementById("twitter");
    twitterLink.textContent = `@${user.twitter_username}`;
    twitterLink.href = `https://twitter.com/${user.twitter_username}`;
    twitterContainer.classList.remove("hidden");
  } else {
    twitterContainer.classList.add("hidden");
  }

  const joinedContainer = document.getElementById("joinedContainer");
  if (user.created_at) {
    const joinedDate = new Date(user.created_at);
    const formattedDate = joinedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    document.getElementById("joined").textContent = `Joined ${formattedDate}`;
    joinedContainer.classList.remove("hidden");
  } else {
    joinedContainer.classList.add("hidden");
  }

  // Stats
  document.getElementById("repos").textContent = user.public_repos;
  document.getElementById("gists").textContent = user.public_gists;
  document.getElementById("followers").textContent = user.followers;
  document.getElementById("following").textContent = user.following;
  document.getElementById("profileLink").href = user.html_url;

  profile.classList.remove("hidden");
  error.classList.add("hidden");
}

async function fetchGitHubUser(username) {
  try {
    setLoading(true);

    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      }
      throw new Error("Failed to fetch user data");
    }

    const userData = await response.json();
    renderUser(userData);
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}

function handleSearch() {
  const username = usernameInput.value.trim();

  if (!isValidUsername(username)) {
    showError("Please enter a valid GitHub username");
    return;
  }

  fetchGitHubUser(username);
}

searchBtn.addEventListener("click", handleSearch);

// Handle Enter key in input field
usernameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSearch();
  }
});
