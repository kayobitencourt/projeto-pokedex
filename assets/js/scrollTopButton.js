const scrollTopButton = document.getElementById("scrollTopButton");

      window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
          scrollTopButton.classList.add("show");
        } else {
          scrollTopButton.classList.remove("show");
        }
      });

      scrollTopButton.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });