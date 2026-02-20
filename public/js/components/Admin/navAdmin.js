document.addEventListener("DOMContentLoaded", function () {
  fetch("js/components/Admin/navAdmin.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;
    });
});