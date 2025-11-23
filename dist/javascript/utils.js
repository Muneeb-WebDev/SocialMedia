// Utility functions for the Social Media App

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function load(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function formatDate(date) {
  if (typeof date === "number") {
    date = new Date(date);
  }

  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  if (hours < 24) {
    return `${hours}h ago`;
  }
  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString();
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export function sanitize(value) {
  if (!value) return "";
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

export function isValidUrl(url) {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
// Theme
export const THEME_KEY = "theme";

export function getTheme() {
  return load(THEME_KEY) || "light";
}

export function saveTheme(theme) {
  save(THEME_KEY, theme);
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === "dark" ? "light" : "dark";
  saveTheme(next);
  applyTheme(next);
  return next;
}

export function initTheme(toggleButtonId) {
  const theme = getTheme();
  applyTheme(theme);

  if (toggleButtonId) {
    const btn = document.getElementById(toggleButtonId);
    if (btn) {
      btn.setAttribute("aria-pressed", theme === "dark");
      btn.addEventListener("click", () => {
        const newTheme = toggleTheme();
        btn.setAttribute("aria-pressed", newTheme === "dark");
      });
    }
  }
}

export function extractHashtags(text) {
  if (!text) return [];
  const matches = text.match(/#\w+/g) || [];
  return matches.map((tag) => tag.slice(1));
}

export function getUserById(userId) {
  const users = load("users") || [];
  return users.find((u) => u.id === userId) || null;
}

export function updateUserProfile(userId, updates) {
  const users = load("users") || [];
  const user = users.find((u) => u.id === userId);
  if (user) {
    Object.assign(user, updates);
    save("users", users);
    const currentUser = load("currentUser");
    if (currentUser && currentUser.id === userId) {
      save("currentUser", { ...currentUser, ...updates });
    }
  }
}

export function getTrendingHashtags() {
  const posts = load("posts") || [];
  const hashtagMap = {};

  posts.forEach((post) => {
    const tags = extractHashtags(post.text);
    tags.forEach((tag) => {
      hashtagMap[tag] = (hashtagMap[tag] || 0) + 1;
    });
  });

  return Object.entries(hashtagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));
}


