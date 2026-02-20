document.addEventListener("DOMContentLoaded", function () {
  fetch("js/components/User/sidebarUser.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("sidebarUser").innerHTML = data;
    });
});