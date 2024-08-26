document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");

  const renderPage = (hash) => {
    switch (hash) {
      case "#home":
        content.innerHTML = "<h1>Home</h1>";
        break;
      case "#about":
        content.innerHTML = "<h1>About</h1>";
        break;
      case "#contact":
        content.innerHTML = "<h1>Contact</h1>";
        break;
      default:
        content.innerHTML = "<h1>404</h1>";
    }
  };

  window.addEventListener("hashchange", () => {
    renderPage(window.location.hash);
  });

  renderPage(window.location.hash || "#home");
});
