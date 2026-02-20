document.addEventListener("DOMContentLoaded", function () {
  fetch("js/components/User/navUser.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbarUser").innerHTML = data;
    });
});