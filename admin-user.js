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


function openReportModal() {
  document.getElementById("modalOverlay").style.display = "flex";
  document.getElementById("reportModal").style.display = "block";
  document.getElementById("blockModal").style.display = "none";
}

function openBlockModal() {
  document.getElementById("modalOverlay").style.display = "flex";
  document.getElementById("blockModal").style.display = "block";
  document.getElementById("reportModal").style.display = "none";
}

function closeModal(e) {
  if (e && e.target !== document.getElementById("modalOverlay")) return;

  document.getElementById("modalOverlay").style.display = "none";
  document.getElementById("reportModal").style.display = "none";
  document.getElementById("blockModal").style.display = "none";
}

function confirmBlock() {
  alert("Seller blocked.");
  closeModal();
}

function submitReport() {
  alert("Report submitted.");
  closeModal();
}

function addToCart() {
  alert("Added to Cart.");
  closeModal();
}
