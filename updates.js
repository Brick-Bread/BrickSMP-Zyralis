const OWNER = "Brick-Bread";
const REPO = "BrickSMP-Zyralis";
const PATH = "Updates"; // ⚡ Case-sensitive, must match the folder on main branch
const BRANCH = "main";

const container = document.getElementById("updates");

fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`)
  .then(res => {
    if (!res.ok) throw new Error("GitHub API failed");
    return res.json();
  })
  .then(files => {
    container.innerHTML = ""; // Clear "Loading..." text

    files
      .filter(f => f.type === "file")
      .sort((a, b) => b.name.localeCompare(a.name)) // newest first
      .forEach(file => loadUpdate(file));
  })
  .catch(err => {
    console.error(err);
    container.innerHTML = "<p>Failed to load updates.</p>";
  });

function loadUpdate(file) {
  fetch(file.download_url)
    .then(res => res.text())
    .then(text => {
      const lines = text.split("\n");
      let title = file.name;

      // Use first line if it’s a markdown header
      if (lines[0].startsWith("#")) {
        title = lines.shift().replace(/^#+\s*/, "");
      }

      const card = document.createElement("div");
      card.className = "update-card";

      card.innerHTML = `
        <div class="update-header">
          <h3>${title}</h3>
          <span class="date">${file.name.replace(/\..+$/, "")}</span>
        </div>
        <div class="update-body">${lines.join("<br>")}</div>
      `;

      container.appendChild(card);
    });
}
