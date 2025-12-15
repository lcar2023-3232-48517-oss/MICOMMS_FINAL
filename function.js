/* ------------------ LOAD PERSISTENT PROFILE ON PAGE LOAD ------------------ */
function loadProfileData() {
  const savedName = localStorage.getItem('profileName') || 'Seller/Admin';
  const savedBio = localStorage.getItem('profileBio') || 'Write something about you...';
  const savedProfilePic = localStorage.getItem('profilePicture');
  
  const nameEl = document.querySelector(".sidebar h3");
  const bioEl = document.querySelector(".sidebar .bio");
  if (nameEl) nameEl.innerText = savedName;
  if (bioEl) bioEl.innerText = savedBio;
  
  if (savedProfilePic) {
    const profileIcon = document.querySelector(".profile-section .profile-icon");
    if (profileIcon) {
      profileIcon.outerHTML = `
        <img src="${savedProfilePic}?t=${Date.now()}" 
             alt="Profile" 
             class="profile-img" 
             style="width: 145px; height: 145px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-left: 90px;">
      `;
    }
  }
}

function saveProfileData(name, bio, profilePicUrl = null) {
  localStorage.setItem('profileName', name || 'Seller/Admin');
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

/* ------------------ ADD PRODUCT ------------------ */
document.addEventListener("DOMContentLoaded", () => {
  loadProfileData();

  const addBtn = document.querySelector(".add-prod");
  const addModal = document.getElementById("addProductModal");
  const editModal = document.getElementById("editModal");
  const productContainer = document.querySelector(".products-card");

  let selectedItem = null; 

  /* ------------------ IMAGE PREVIEWS ------------------ */
  function setupImagePreview(inputEl, previewEl) {
    if (!inputEl || !previewEl) return;
    inputEl.addEventListener("change", e => {
      const file = e.target.files[0];
      if (!file) {
        previewEl.innerHTML = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        previewEl.innerHTML = `<img src="${ev.target.result}" class="preview-img" alt="Image">`;
      };
      reader.readAsDataURL(file);
    });
  }

  setupImagePreview(document.getElementById("productImage"), document.getElementById("productImagePreview"));
  setupImagePreview(document.getElementById("profilePictureInput"), document.getElementById("profilePicturePreview"));

  /* ------------------ MODAL OPEN/CLOSE ------------------ */
  function openModal(modal) { modal.style.display = "flex"; }
  function closeModal(modal) { modal.style.display = "none"; }

  document.getElementById("closeModalBtn").addEventListener("click", () => closeModal(addModal));
  document.getElementById("cancelAddBtn").addEventListener("click", () => closeModal(addModal));
  window.closeEditModal = () => closeModal(editModal);

  addBtn.addEventListener("click", () => {
    selectedItem = null;
    document.getElementById("productName").value = "";
    document.getElementById("productDesc").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productCategory").selectedIndex = 0;
    document.getElementById("productStock").value = "";
    document.getElementById("productImage").value = "";
    document.getElementById("productImagePreview").innerHTML = "";
    openModal(addModal);
  });

  /* ------------------ CREATE OR UPDATE PRODUCT ------------------ */
  function saveProduct({isEdit = false} = {}) {
    const name = isEdit ? document.getElementById("editTitle").value.trim() : document.getElementById("productName").value.trim();
    const desc = isEdit ? document.getElementById("editDesc").value.trim() : document.getElementById("productDesc").value.trim();
    const price = isEdit ? document.getElementById("editPrice").value.trim() : document.getElementById("productPrice").value.trim();
    const category = isEdit ? document.getElementById("editCategory").value : document.getElementById("productCategory").value;
    const stock = isEdit ? document.getElementById("editStock").value : document.getElementById("productStock").value;
    
    
    if (!name) { alert("Product name is required"); return; }

    let card;
    if (isEdit && selectedItem) {
      card = selectedItem;
      card.querySelector('h5').innerText = name;

      const imgBox = card.querySelector('.product-preview');
      const imageToUse = currentImageData || card.dataset.image || null;

      if (imageToUse) {
    const img = imgBox.querySelector("img");
    if (img) img.src = imageToUse;
    card.dataset.image = imageToUse;
  }
          

      card.querySelector('.product_desc').innerText = desc;
      card.querySelector('.product-price').innerText = `$${price || "0.00"}`;
      card.querySelector('.product-category').innerText = `Category: ${category}`;
      card.querySelector('.product-stock').innerText = `Stock: ${stock}`;
      card.dataset.category = category;
      card.dataset.stock = stock;
    } else {
      card = document.createElement("div");
      card.classList.add("product-item");
      card.dataset.category = category;
      card.dataset.stock = stock;

      card.innerHTML = `
        <div class="product-preview">
        <img class="product-img" /></div>
        <div class="prod-details">
          <div class="products-info">
            <h5>${name}</h5>
            <p class="product-price">$${price || "0.00"}</p>
            <p class="product-category">Category: ${category}</p>
            <p class="product-stock">Stock: ${stock}</p>
            <p class="product_desc">${desc}</p>
          </div>
        </div>
        <button class="material-icons edit-btn">edit</button>
        <button class="material-icons delete-btn" style="color:red;">delete</button>
      `;

      
      const imgBox = card.querySelector('.product-preview');
      console.log("currentImageData:", currentImageData);
      const imageToUse = currentImageData || null;

      if (imageToUse) {
         imgBox.querySelector("img").src = imageToUse;
        card.dataset.image = imageToUse;
      }

      // Edit button
    card.querySelector(".edit-btn").addEventListener("click", () => {
  selectedItem = card;

  document.getElementById("editTitle").value =
    card.querySelector("h5").innerText;

  document.getElementById("editDesc").value =
    card.querySelector(".product_desc").innerText;

  document.getElementById("editPrice").value =
    card.querySelector(".product-price").innerText.replace("$", "");

  document.getElementById("editCategory").value =
    card.dataset.category;

  document.getElementById("editStock").value =
    card.dataset.stock;

  openModal(editModal);
});
      // Delete button
      card.querySelector(".delete-btn").addEventListener("click", () => {
        selectedItem = card;
        document.getElementById('deleteModal').style.display = 'block';
      });

      productContainer.appendChild(card);
      
    }

    updateViewAs(card);

    // Close the correct modal
    if (isEdit) closeModal(editModal);
    else closeModal(addModal);

    //for image
    currentImageData = null;
      document.getElementById("productImage").value = "";
      document.getElementById("productImagePreview").innerHTML = "";
  }

  document.getElementById("saveProductBtn").addEventListener("click", () => saveProduct({isEdit:false}));
  window.saveEdit = () => saveProduct({isEdit:true});

  window.confirmDelete = function() {
    if (selectedItem) selectedItem.remove();
    closeModal(document.getElementById('deleteModal'));
  };
  window.closeDeleteModal = function() { closeModal(document.getElementById('deleteModal')); };

});

let currentImageData = null;

document.getElementById("productImage").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ev => {
    currentImageData = ev.target.result;

    // preview
    document.getElementById("productImagePreview").innerHTML =
      `<img src="${currentImageData}" alt="Preview">`;
  };
  reader.readAsDataURL(file);
});



/* ------------------ EDIT PROFILE ------------------ */
const editProfileBtn = document.querySelector(".edit-profile");
if (editProfileBtn) {
  editProfileBtn.addEventListener("click", function () {
    const modal = document.getElementById("editProfileModal");
    if (!modal) return;
    modal.style.display = "block";

    const nameEl = document.querySelector(".sidebar h3");
    const bioEl = document.querySelector(".sidebar .bio");
    if (nameEl && bioEl) {
      document.getElementById("profileNameInput").value = nameEl.innerText;
      document.getElementById("profileBioInput").value = bioEl.innerText;
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
      profilePicPreview.innerHTML = `<img src="${ev.target.result}" class="preview-img" alt="Profile" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">`;
    };
    reader.readAsDataURL(file);
  });
}

function closeEditProfile() {
  const modal = document.getElementById("editProfileModal");
  if (modal) modal.style.display = "none";
}

async function saveProfile() {
  const newName = document.getElementById("profileNameInput").value.trim();
  const newBio = document.getElementById("profileBioInput").value.trim();
  const profilePicFile = profilePicInput.files[0];

  const nameEl = document.querySelector(".sidebar h3");
  const bioEl = document.querySelector(".sidebar .bio");
  if (nameEl) nameEl.innerText = newName || "Seller/Admin";
  if (bioEl) bioEl.innerText = newBio;

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
                 class="profile-img" 
                 style="width: 145px; height: 145px; border-radius: 50%; object-fit: cover; vertical-align: middle; margin-left: 90px;">
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

  profilePicInput.value = "";
  profilePicPreview.innerHTML = "";
  closeEditProfile();
}

window.closeEditProfile = closeEditProfile;
window.saveProfile = saveProfile;

window.onclick = function (event) {
  const modal = document.getElementById("editProfileModal");
  const addModal = document.getElementById("addProductModal");
  if (event.target === modal && modal) modal.style.display = "none";
  if (event.target === addModal && addModal) addModal.style.display = "none";
};

/* ------------------ LOG OUT------------------ */
function logoutNow() {
  window.location.href = "index.htm";
}

const name = document.getElementById("productName").value.trim();
const desc = document.getElementById("productDesc").value;
const price = document.getElementById("productPrice").value.trim();
const category = document.getElementById("productCategory").value;
const stock = document.getElementById("productStock").value || 0;


// Add Product
const addProductBtn = document.querySelector(".add-prod");
const addProductModal = document.getElementById("addProductModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveProductBtn = document.getElementById("saveProductBtn");
const cancelAddBtn = document.getElementById("cancelAddBtn");

const productsList = document.getElementById("productsList");

addProductBtn.addEventListener("click", () => {
  addProductModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => addProductModal.style.display = "none");
cancelAddBtn.addEventListener("click", () => addProductModal.style.display = "none");

// View As
function updateViewAs(card) {
  const productsList = document.getElementById("productsList");

  // remove placeholder
  const placeholder = productsList.querySelector(".placeholder");
  if (placeholder) placeholder.remove();

  const viewCard = document.createElement("div");
  viewCard.className = "product-card";

  const image = card.dataset.image || "";

  viewCard.innerHTML = `
    <div class="product-preview"
         style="background-image:url('${image}')"></div>

    <div class="product-info">
      <h5>${card.querySelector("h5").innerText}</h5>
      <p class="product-price">${card.querySelector(".product-price").innerText}</p>
      <p class="product-category">${card.querySelector(".product-category").innerText}</p>
      <p class="product-stock">${card.querySelector(".product-stock").innerText}</p>
      <p class="description">${card.querySelector(".product_desc").innerText}</p>
    </div>
  `;

  productsList.appendChild(viewCard);
}