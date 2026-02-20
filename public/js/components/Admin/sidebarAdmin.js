document.addEventListener("DOMContentLoaded", function () {
  fetch("js/components/Admin/sidebarAdmin.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("sidebar").innerHTML = data;
    });
});