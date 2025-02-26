document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.clear();
      window.location.href = "/views/login.html";
    });
  }

  const role = localStorage.getItem("role");
  const adminPanel = document.getElementById("adminPanel");
  const solicitudesPanel = document.getElementById("solicitudes");

  if (adminPanel) {
    adminPanel.style.display = role === "administrador" ? "block" : "none";
  }

  if (solicitudesPanel) {
    solicitudesPanel.style.display = (role === 'usuario' || role === 'administrador') ? 'block' : 'none';
  }

  if (loginButton) {
    loginButton.style.display = (role === 'usuario' || role === 'administrador') ? 'none' : 'block';
  }

  if (logoutButton) {
    logoutButton.style.display = (role === 'usuario' || role === 'administrador') ? 'block' : 'none';
  }
});
