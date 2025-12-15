const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const passwordGroup = document.getElementById("passwordGroup");
const confirmGroup = document.getElementById("confirmPasswordGroup");
const message = document.getElementById("message");
const signupBtn = document.getElementById("signupBtn");
const form = document.getElementById("signupForm");
const roleSelect = document.getElementById("role");

function updateButtonState() {
  const pwd = passwordInput.value;
  const cpwd = confirmInput.value;
  const role = roleSelect.value;

  const passwordsOk = pwd.length >= 8 && pwd === cpwd;
  const roleOk = role === "user" || role === "admin";

  signupBtn.disabled = !(passwordsOk && roleOk);
}

function checkPasswords() {
  const pwd = passwordInput.value;
  const cpwd = confirmInput.value;

  if (pwd.length < 8) {
    passwordGroup.classList.add("invalid");
    passwordGroup.classList.remove("valid");
    message.textContent = "Password must be at least 8 characters long.";
    message.classList.add("invalid");
    message.classList.remove("valid");
    signupBtn.disabled = true;
    return;
  }

  if (!cpwd) {
    passwordGroup.classList.remove("valid", "invalid");
    confirmGroup.classList.remove("valid", "invalid");
    message.textContent = "";
    signupBtn.disabled = true;
    return;
  }

  if (pwd === cpwd) {
    passwordGroup.classList.add("valid");
    passwordGroup.classList.remove("invalid");
    confirmGroup.classList.add("valid");
    confirmGroup.classList.remove("invalid");
    message.textContent = "Passwords match.";
    message.classList.add("valid");
    message.classList.remove("invalid");
  } else {
    passwordGroup.classList.add("invalid");
    confirmGroup.classList.add("invalid");
    passwordGroup.classList.remove("valid");
    confirmGroup.classList.remove("valid");
    message.textContent = "Passwords do not match.";
    message.classList.add("invalid");
    message.classList.remove("valid");
  }

  updateButtonState();
}

passwordInput.addEventListener("input", checkPasswords);
confirmInput.addEventListener("input", checkPasswords);
roleSelect.addEventListener("change", updateButtonState);

form.addEventListener("submit", function(e) {
  const pwd = passwordInput.value;
  const cpwd = confirmInput.value;
  const role = roleSelect.value;

  if (pwd.length < 8 || pwd !== cpwd || !role) {
    e.preventDefault();
    alert("Please fill all fields correctly (role and matching passwords of at least 8 characters).");
  }
});
