import { load, save, isValidEmail, hashPassword } from "./utils.js";
// Signup
export function initSignup() {
  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (!name || !email || !password || !confirmPassword) {
        alert("All fields are required");
        return;
      }

      if (!isValidEmail(email)) {
        alert("Please enter a valid email address");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const users = load("users") || [];
      if (users.find((u) => u.email === email)) {
        alert("User already exists with this email");
        return;
      }

      users.push({
        id: Date.now().toString(),
        name,
        email,
        password: hashPassword(password),
        createdAt: Date.now(),
        bio: "",
        profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + name,
        followers: [],
        following: [],
      });
      save("users", users);

      alert("Signup successful! Please log in.");
      window.location.href = "./login.html";
    });
  }
}
// Login
export function initLogin() {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Email and password are required");
        return;
      }

      const users = load("users") || [];
      const user = users.find(
        (u) => u.email === email && u.password === hashPassword(password)
      );

      if (!user) {
        alert("Invalid email or password");
        return;
      }

      save("currentUser", user);
      window.location.href = "./index.html";
    });
  }
}
// Logout
export function initLogout() {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "./index.html";
    });
  }
}
// welcome message
export function updateWelcomeMessage() {
  const welcomeEl = document.getElementById("welcomeUser");
  const currentUser = load("currentUser");

  if (welcomeEl && currentUser) {
    welcomeEl.textContent = `Welcome, ${currentUser.name}`;
  }
};

export function protectPage() {}
