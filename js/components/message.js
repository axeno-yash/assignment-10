export function renderBlock(block) {
  const div = document.createElement("div");
  div.className = "message-block";

  switch (block.type) {
    case "text": {
      div.innerHTML = block.value.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
      break;
    }
    case "code": {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      if (block.language) code.className = `language-${block.language}`;
      code.textContent = block.value;
      pre.append(code);
      div.append(pre);
      break;
    }
    case "list": {
      const ul = document.createElement("ul");
      block.value.split("\n").forEach(line => {
        const li = document.createElement("li");
        li.textContent = line.replace(/^-\s*/, "");
        ul.append(li);
      });
      div.append(ul);
      break;
    }
    case "table": {
      const table = document.createElement("table");
      table.className = "message-table";
      const rows = block.value.trim().split("\n");
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");
      rows.forEach((row, i) => {
        const tr = document.createElement("tr");
        row.split("|").slice(1, -1).forEach(cell => {
          const elem = document.createElement(i === 0 ? "th" : "td");
          elem.textContent = cell.trim();
          tr.append(elem);
        });
        (i === 0 ? thead : tbody).append(tr);
      });
      table.append(thead, tbody);
      div.append(table);
      break;
    }
  }
  return div;
}