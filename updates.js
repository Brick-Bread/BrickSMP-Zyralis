const owner = "Brick-Bread";
const repo = "BrickSMP-Zyralis";
const folderPath = "Updates";

const container = document.getElementById("update-content");

const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`;

function parseDate(name) {
  // converts 2026-1-21.md → Date
  const clean = name.replace(".md", "");
  return new Date(clean);
}

fetch(apiURL)
  .then(res => {
    if (!res.ok) throw new Error("GitHub API failed");
    return res.json();
  })
  .then(files => {
    const mdFiles = files.filter(f => f.name.endsWith(".md"));

    if (mdFiles.length === 0) {
      container.textContent = "No updates available.";
      return;
    }

    mdFiles.sort((a, b) => parseDate(a.name) - parseDate(b.name));
    const latest = mdFiles.at(-1);

    return fetch(latest.download_url)
      .then(res => res.text())
      .then(md => {
        container.innerHTML = `
          <h2>${latest.name.replace(".md", "")}</h2>
          <div class="md-content">
            ${marked.parse(md)}
          </div>
        `;
      });
  })
  .catch(err => {
    console.error(err);
    container.innerHTML = `
      <p style="color:#f87171;">
        Failed to load update.
      </p>
    `;
  });
