// ===== CONFIG =====
const owner = "Brick-Bread";         // GitHub username
const repo = "BrickSMP-Zyralis";     // Repo name
const folderPath = "Updates";        // Folder with .md updates

const container = document.getElementById("update-content");

// ===== FETCH LIST OF FILES =====
fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`)
  .then(res => res.json())
  .then(files => {
    if (!Array.isArray(files) || files.length === 0) {
      container.textContent = "No updates found.";
      return;
    }

    // ===== FILTER ONLY .md FILES =====
    const mdFiles = files.filter(f => f.name.endsWith(".md"));
    if (mdFiles.length === 0) {
      container.textContent = "No Markdown updates found.";
      return;
    }

    // ===== SORT ALPHABETICALLY (yyyy-mm-dd.md ensures latest last) =====
    mdFiles.sort((a,b) => a.name.localeCompare(b.name));

    const latestFile = mdFiles[mdFiles.length - 1];

    // ===== EXTRACT DATE FROM FILENAME =====
    const dateMatch = latestFile.name.match(/(\d{4}-\d{2}-\d{2})/);
    const updateDate = dateMatch ? dateMatch[1] : "Unknown Date";

    // ===== FETCH RAW CONTENT =====
    return fetch(latestFile.download_url)
      .then(res => res.text())
      .then(mdText => {
        container.innerHTML = `
          <h2>${updateDate}</h2>
          <div class="md-content">${marked.parse(mdText)}</div>
        `;
      });
  })
  .catch(() => {
    container.textContent = "Failed to load update.";
  });
