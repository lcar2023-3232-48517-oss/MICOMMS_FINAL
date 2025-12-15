const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("togglePassword");
const toggleIcon = document.getElementById("toggleIcon");

if (togglePasswordBtn && passwordInput && toggleIcon) {
  togglePasswordBtn.addEventListener("click", function () {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleIcon.textContent = "visibility";
    } else {
      passwordInput.type = "password";
      toggleIcon.textContent = "visibility_off";
    }
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  clearErrors();

  if (!email || !password) {
    showError("Please enter email and password");
    markBothInvalid();
    return;
  }

  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await fetch("login.php", {
      method: "POST",
      body: formData,
      credentials: "include" 
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (data.success === true) {
      if (data.role) {
        localStorage.setItem("userRole", data.role);   
      }
      localStorage.setItem("userEmail", email);
      window.location.replace("landing-basket.htm");
    } else {
      if (data.type === "invalid_email") {
        showError("Invalid email");
        markEmailInvalid();
      } else if (data.type === "incorrect_password") {
        showError("Incorrect password");
        markPasswordInvalid();
      } else {
        showError(data.message || "Invalid email or password");
        markBothInvalid();
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    showError("Login failed. Please try again.");
    markBothInvalid();
  }
}

function showError(message) {
  const errorWrapper = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");
  if (!errorWrapper || !errorText) return;

  errorText.textContent = message;
  errorWrapper.classList.add("show");
}

function clearErrors() {
  const errorWrapper = document.getElementById("errorMessage");
  const emailBox = document.getElementById("emailBox");
  const passwordBox = document.getElementById("passwordBox");

  if (errorWrapper) errorWrapper.classList.remove("show");
  if (emailBox) emailBox.classList.remove("invalid");
  if (passwordBox) passwordBox.classList.remove("invalid");
}

function markEmailInvalid() {
  const emailBox = document.getElementById("emailBox");
  if (emailBox) emailBox.classList.add("invalid");
}

function markPasswordInvalid() {
  const passwordBox = document.getElementById("passwordBox");
  if (passwordBox) passwordBox.classList.add("invalid");
}

function markBothInvalid() {
  markEmailInvalid();
  markPasswordInvalid();
}

document.addEventListener("DOMContentLoaded", function () {
  const forgotLink = document.getElementById("forgotPassword");
  const googleBtn  = document.getElementById("googleLoginBtn");

  if (forgotLink) {
    forgotLink.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Forgot Password Demo:\n\nPassword reset is not yet available in this demo version.");
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener("click", function () {
      alert("Google Login Demo:\n\nGoogle sign-in is not yet connected. This is just a demo button.");
    });
  }
});
