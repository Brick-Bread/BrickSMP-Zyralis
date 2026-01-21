const repoOwner = "YOUR_GITHUB_USERNAME";
const repoName = "YOUR_REPO_NAME";

const updatesContainer = document.getElementById("updates");

fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits`)
  .then(res => res.json())
  .then(commits => {
    updatesContainer.innerHTML = "";

    commits.slice(0, 10).forEach(commit => {
      const div = document.createElement("div");
      div.className = "update-card";

      div.innerHTML = `
        <h3>${commit.commit.message}</h3>
        <p>${commit.commit.author.name} · 
        ${new Date(commit.commit.author.date).toLocaleDateString()}</p>
        <a href="${commit.html_url}" target="_blank">View on GitHub</a>
      `;

      updatesContainer.appendChild(div);
    });
  })
  .catch(() => {
    updatesContainer.innerHTML =
      "<p class='muted'>Failed to load updates.</p>";
  });
