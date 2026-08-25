function formatBold(text) {
  const parts = text.split("**");
  if (parts.length === 1) return text;

  return parts
    .map((part, index) => (index % 2 === 1 ? `<strong>${part}</strong>` : part))
    .join("");
}

function formatLinks(text) {
  let result = text;

  while (result.includes("[") && result.includes("](") && result.includes(")")) {
    const start = result.indexOf("[");
    const middle = result.indexOf("](", start);
    const end = result.indexOf(")", middle);

    if (start === -1 || middle === -1 || end === -1) break;

    const label = result.slice(start + 1, middle);
    const url = result.slice(middle + 2, end);
    const linkHtml = `<a href="${url}" class="message__link" target="_blank" rel="noopener">${label}</a>`;

    result = result.slice(0, start) + linkHtml + result.slice(end + 1);
  }

  return result;
}

function formatInline(text) {
  return formatLinks(formatBold(text));
}

function stripListMarker(line) {
  const trimmed = line.trim();

  if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
    return trimmed.slice(2);
  }

  return trimmed;
}

function getHeading(line) {
  const trimmed = line.trim();
  if (trimmed.startsWith("### ")) return { tag: "h4", text: trimmed.slice(4) };
  if (trimmed.startsWith("## ")) return { tag: "h3", text: trimmed.slice(3) };
  if (trimmed.startsWith("# ")) return { tag: "h2", text: trimmed.slice(2) };
  return null;
}

export function renderBlock(block) {
  const div = document.createElement("div");
  div.className = "message-block";

  switch (block.type) {
    case "text": {
      const chunks = block.value.split("\n\n");

      div.innerHTML = chunks
        .map((chunk) => {
          const trimmed = chunk.trim();
          if (!trimmed) return "";

          const heading = getHeading(trimmed);
          if (heading) {
            return `<${heading.tag} class="message__heading">${formatInline(heading.text)}</${heading.tag}>`;
          }

          const paragraph = trimmed.split("\n").join(" ");
          return `<p class="message__paragraph">${formatInline(paragraph)}</p>`;
        })
        .join("");
      break;
    }

    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      const items = block.value
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => `<li class="message__list-item">${formatInline(stripListMarker(line))}</li>`)
        .join("");

      div.innerHTML = `<${tag} class="message__list">${items}</${tag}>`;
      break;
    }

    case "table": {
      const lines = block.value.trim().split("\n");
      const validRows = lines.filter((line) => !line.includes("---"));

      const rows = validRows.map((row) =>
        row
          .split("|")
          .slice(1, -1)
          .map((cell) => cell.trim())
      );

      if (rows.length === 0) break;

      const headerCells = rows[0].map((cell) => `<th>${formatInline(cell)}</th>`).join("");
      const bodyRows = rows
        .slice(1)
        .map((row) => {
          const cells = row.map((cell) => `<td>${formatInline(cell)}</td>`).join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");

      div.innerHTML = `
        <table class="message-table">
          <thead><tr>${headerCells}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      `;
      break;
    }

    case "code": {
      const lang = block.language || "plaintext";
      div.innerHTML = `
        <div class="code-block">
          <div class="code-block__header">
            <span class="code-block__language">${lang}</span>
            <button class="code-block__copy" type="button">Copy</button>
          </div>
          <pre class="code-block__body"><code class="language-${lang}">${block.value}</code></pre>
        </div>
      `;

      const copyBtn = div.querySelector(".code-block__copy");
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(block.value).then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
        });
      });
      break;
    }
  }

  return div;
}
