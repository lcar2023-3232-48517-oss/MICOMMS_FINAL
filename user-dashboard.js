/* ------------------ LOAD PERSISTENT PROFILE ON PAGE LOAD ------------------ */
function loadProfileData() {
  const savedName = localStorage.getItem('profileName') || 'User';
  const savedBio = localStorage.getItem('profileBio') || 'Write something about you...';
  const savedProfilePic = localStorage.getItem('profilePicture');

  const nameEl = document.querySelector(".sidebar h3");
  const bioEl = document.querySelector(".sidebar .bio");
  if (nameEl) nameEl.innerText = savedName;
  if (bioEl)  bioEl.innerText  = savedBio;

  if (savedProfilePic) {
    const profileIcon = document.querySelector(".profile-section .profile-icon");
    if (profileIcon) {
      profileIcon.outerHTML = `
        <img src="${savedProfilePic}?t=${Date.now()}"
             alt="Profile"
             class="profile-img">
      `;
    }
  }
}

function saveProfileData(name, bio, profilePicUrl = null) {
  localStorage.setItem('profileName', name || 'User');
  localStorage.setItem('profileBio', bio || '');
  if (profilePicUrl) {
    localStorage.setItem('profilePicture', profilePicUrl);
  }
}

/* ------------------ TABS ------------------ */
const tabs = document.querySelectorAll('[data-tab-value]');
const panes = document.querySelectorAll('.tabs-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const selector = tab.dataset.tabValue;
    const target = document.querySelector(selector);
    if (!target) return;

    panes.forEach(p => p.classList.remove('active'));
    target.classList.add('active');

    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  loadProfileData();
});

/* ------------------ EDIT PROFILE ------------------ */
const editProfileBtn = document.querySelector(".edit-profile");
const modalOverlay = document.getElementById("modalOverlay");
const editProfileModal = document.getElementById("editProfileModal");

if (editProfileBtn && modalOverlay && editProfileModal) {
  editProfileBtn.addEventListener("click", function () {
    modalOverlay.style.display = "flex";
    editProfileModal.style.display = "block";

    const nameEl = document.querySelector(".sidebar h3");
    const bioEl  = document.querySelector(".sidebar .bio");
    if (nameEl && bioEl) {
      document.getElementById("profileNameInput").value = nameEl.innerText;
      document.getElementById("profileBioInput").value  = bioEl.innerText;
    }
  });
}

const profilePicInput = document.getElementById("profilePictureInput");
const profilePicPreview = document.getElementById("profilePicturePreview");

if (profilePicInput && profilePicPreview) {
  profilePicInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) {
      profilePicPreview.innerHTML = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      profilePicPreview.innerHTML =
        `<img src="${ev.target.result}" class="preview-img" alt="Profile"
              style="width:100px;height:100px;border-radius:50%;object-fit:cover;">`;
    };
    reader.readAsDataURL(file);
  });
}

function closeEditProfile() {
  if (editProfileModal) editProfileModal.style.display = "none";

  const anyOpen = Array.from(document.querySelectorAll(".modal"))
    .some(m => m !== editProfileModal && m.style.display === "block");

  if (!anyOpen && modalOverlay) {
    modalOverlay.style.display = "none";
  }
}

async function saveProfile() {
  const newName = document.getElementById("profileNameInput").value.trim();
  const newBio  = document.getElementById("profileBioInput").value.trim();
  const profilePicFile = profilePicInput ? profilePicInput.files[0] : null;

  const nameEl = document.querySelector(".sidebar h3");
  const bioEl  = document.querySelector(".sidebar .bio");
  if (nameEl) nameEl.innerText = newName || "User";
  if (bioEl)  bioEl.innerText  = newBio;

  saveProfileData(newName, newBio);

  if (profilePicFile) {
    try {
      const formData = new FormData();
      formData.append('profile_pic', profilePicFile);

      const response = await fetch('upload_profile.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        const profileIcon = document.querySelector(".profile-section .profile-icon, .profile-img");
        if (profileIcon) {
          profileIcon.outerHTML = `
            <img src="uploads/profiles/${result.filename}?t=${Date.now()}"
                 alt="Profile"
                 class="profile-img">
          `;
        }

        saveProfileData(newName, newBio, `uploads/profiles/${result.filename}`);
        alert('Profile updated successfully!');
      } else {
        alert('Upload failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    }
  } else {
    alert('Profile updated successfully!');
  }

  if (profilePicInput) profilePicInput.value = "";
  if (profilePicPreview) profilePicPreview.innerHTML = "";
  closeEditProfile();
}

window.closeEditProfile = closeEditProfile;
window.saveProfile = saveProfile;

/* ------------------ LOG OUT ------------------ */
function logoutNow() {
  const logoutModal = document.getElementById("logoutModal");
  if (modalOverlay && logoutModal) {
    modalOverlay.style.display = "flex";
    logoutModal.style.display = "block";
  } else {
    window.location.href = "index.htm";
  }
}

function confirmLogout() {
  window.location.href = "index.htm";
}

function closeLogoutModal() {
  const logoutModal = document.getElementById("logoutModal");
  if (logoutModal) logoutModal.style.display = "none";

  const anyOpen = Array.from(document.querySelectorAll(".modal"))
    .some(m => m !== logoutModal && m.style.display === "block");

  if (!anyOpen && modalOverlay) {
    modalOverlay.style.display = "none";
  }
}

window.logoutNow = logoutNow;
window.confirmLogout = confirmLogout;
window.closeLogoutModal = closeLogoutModal;
window.onclick = function (event) {
  if (!modalOverlay) return;
  if (event.target === modalOverlay) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach(m => m.style.display = "none");
    modalOverlay.style.display = "none";
  }
};
