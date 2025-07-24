const form = document.querySelector("form");
    const input = document.querySelector("input");
    const reposContainer = document.querySelector(".repos");
    const mainContainer = document.querySelector(".main-container");
    const API = "https://api.github.com/users/";

    async function fetchData(username) {
      try {
        const res = await fetch(`${API}${username}`);
        if (!res.ok) throw new Error(res.statusText);

        const { avatar_url, bio, blog, company, followers, following, location, login, twitter_username } = await res.json();

        const html = `
          <section class="about-user">
            <div class="user-avatar" style="background-image: url(${avatar_url})"></div>
            <p class="user-name">${login}</p>
            <button class="follow">Follow</button>
            <p class="user-bio">${bio || "No bio available"}</p>
            <div class="followers-info">
              <a href="#"><i class="fa-solid fa-user-group"></i> ${followers} followers</a> |
              <a href="#">${following} following</a>
            </div>
            <div class="icon-container"><i class="fa-regular fa-building"></i>${company || ""}</div>
            <div class="icon-container"><i class="fa-solid fa-location-dot"></i>${location || ""}</div>
            <div class="icon-container"><i class="fa-solid fa-link"></i><a href="${blog}" target="_blank">${blog}</a></div>
            <div class="icon-container"><i class="fa-brands fa-twitter"></i>${twitter_username ? `@${twitter_username}` : ""}</div>
          </section>
        `;
        mainContainer.insertAdjacentHTML("afterbegin", html);
      } catch (err) {
        alert("User not found!");
        console.error(err);
      }
    }

    async function fetchRepos(username) {
      try {
        const res = await fetch(`${API}${username}/repos`);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();

        reposContainer.innerHTML = "";
        data.forEach(repo => {
          const repoHTML = `
            <div class="repo-card">
              <a href="${repo.html_url}" class="repo-title" target="_blank">${repo.name}</a>
              <p class="repo-subtitle">${repo.description || "No description"}</p>
              <div class="popularity">
                <p class="technology-used">${repo.language || ""}</p>
                <div class="stars"><i class="fa-regular fa-star"></i> ${repo.watchers_count}</div>
                <div class="fork"><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</div>
              </div>
              <p class="pill">Public</p>
            </div>
          `;
          reposContainer.innerHTML += repoHTML;
        });
      } catch (err) {
        console.error(err);
      }
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      reposContainer.innerHTML = "";
      document.querySelector(".about-user")?.remove();
      const val = input.value.trim();
      if (val) {
        await fetchData(val);
        await fetchRepos(val);
      }
      input.value = "";
    });

    // Dummy projects shown by default
    document.addEventListener("DOMContentLoaded", () => {
      const dummyRepos = [
        {
          name: "Smart To-Do List",
          description: "A smart productivity app with priority, stats & voice commands.",
          language: "JavaScript",
          watchers_count: 120,
          forks_count: 45,
          html_url: "#"
        },
        {
          name: "Student Grade System",
          description: "Python-Tkinter project for managing student records and grades.",
          language: "Python",
          watchers_count: 85,
          forks_count: 22,
          html_url: "#"
        },
        {
          name: "GitHub Profile Clone",
          description: "Responsive front-end clone of a GitHub profile using HTML, CSS, JS.",
          language: "HTML",
          watchers_count: 150,
          forks_count: 60,
          html_url: "#"
        }
      ];
      dummyRepos.forEach(repo => {
        const repoHTML = `
          <div class="repo-card">
            <a href="${repo.html_url}" class="repo-title" target="_blank">${repo.name}</a>
            <p class="repo-subtitle">${repo.description}</p>
            <div class="popularity">
              <p class="technology-used">${repo.language}</p>
              <div class="stars"><i class="fa-regular fa-star"></i> ${repo.watchers_count}</div>
              <div class="fork"><i class="fa-solid fa-code-fork"></i> ${repo.forks_count}</div>
            </div>
            <p class="pill">Public</p>
          </div>
        `;
        reposContainer.innerHTML += repoHTML;
      });
    });
