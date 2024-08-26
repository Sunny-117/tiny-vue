document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");

  const renderPage = (path) => {
    console.log(path, "path");
    switch (path) {
      case "/":
      case "/index.html":
        content.innerHTML = "<h1>Home</h1>";
        break;
      case "/about":
        content.innerHTML = "<h1>About</h1>";
        break;
      case "/contact":
        content.innerHTML = "<h1>Contact</h1>";
        break;
      default:
        content.innerHTML = "Not Found";
    }
  };

  document.querySelectorAll("a[data-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      // 阻止默认事件
      e.preventDefault();
      const path = e.target.getAttribute("href");
      // 推入到浏览器历史记录中
      history.pushState(null, null, path);
      renderPage(path);
    });
  });

  renderPage(window.location.pathname || "/");
});
