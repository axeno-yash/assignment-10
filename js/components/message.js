function formatInline(text) {
  let result = text;

  while (result.includes("**")) {
    const start = result.indexOf("**");
    const end = result.indexOf("**", start + 2);

    if (end === -1) break;

    const boldText = result.slice(start + 2, end);

    result = result.slice(0, start) + "<strong>" + boldText + "</strong>" + result.slice(end + 2);
  }

  while (result.includes("](")) {
    const linkStart = result.lastIndexOf("[", result.indexOf("]("));
    const textEnd = result.indexOf("](", linkStart);

    if (linkStart === -1 || textEnd === -1) break;

    const urlEnd = result.indexOf(")", textEnd);

    if (urlEnd === -1) break;

    const linkText = result.slice(linkStart + 1, textEnd);
    const url = result.slice(textEnd + 2, urlEnd);

    const link = '<a href="' + url + '" class="message__link" target="_blank" rel="noopener">' + linkText + "</a>";

    result = result.slice(0, linkStart) + link + result.slice(urlEnd + 1);
  }

  return result;
}

function stripListMarker(line) {
  const text = line.trim();

  if (text.startsWith("- ") || text.startsWith("* ")) {
    return text.slice(2);
  }

  const dotIndex = text.indexOf(". ");

  if (dotIndex > 0) {
    const number = text.slice(0, dotIndex);

    let isNumber = true;

    for (const char of number) {
      if (char < "0" || char > "9") {
        isNumber = false;
        break;
      }
    }

    if (isNumber) {
      return text.slice(dotIndex + 2);
    }
  }

  return text;
}

function getHeadingLevel(line) {
  const text = line.trim();

  if (text.startsWith("### ")) {
    return {
      level: 4,
      text: text.slice(4),
    };
  }

  if (text.startsWith("## ")) {
    return {
      level: 3,
      text: text.slice(3),
    };
  }

  if (text.startsWith("# ")) {
    return {
      level: 2,
      text: text.slice(2),
    };
  }

  return null;
}

export function renderBlock(block) {
  const div = document.createElement("div");
  div.className = "message-block";

  switch (block.type) {
    case "text": {
      const chunks = block.value.split("\n\n");

      chunks.forEach((chunk) => {
        if (!chunk.trim()) return;

        const lines = chunk.split("\n");
        const heading = getHeadingLevel(lines[0]);

        if (heading) {
          const h = document.createElement(`h${heading.level}`);
          h.className = "message__heading";
          h.innerHTML = formatInline(heading.text);
          div.append(h);

          const rest = lines.slice(1).join(" ").trim();

          if (rest) {
            const p = document.createElement("p");
            p.className = "message__paragraph";
            p.innerHTML = formatInline(rest);
            div.append(p);
          }
        } else {
          const p = document.createElement("p");
          p.className = "message__paragraph";
          p.innerHTML = formatInline(lines.join(" "));
          div.append(p);
        }
      });

      break;
    }

    case "code": {
      const wrapper = document.createElement("div");
      wrapper.className = "code-block";

      const header = document.createElement("div");
      header.className = "code-block__header";

      const langLabel = document.createElement("span");
      langLabel.className = "code-block__language";
      langLabel.textContent = block.language || "plaintext";

      const copyBtn = document.createElement("button");
      copyBtn.className = "code-block__copy";
      copyBtn.type = "button";
      copyBtn.textContent = "Copy";

      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(block.value).then(() => {
          copyBtn.textContent = "Copied!";

          setTimeout(() => {
            copyBtn.textContent = "Copy";
          }, 1500);
        });
      });

      header.append(langLabel, copyBtn);

      const pre = document.createElement("pre");
      pre.className = "code-block__body";

      const code = document.createElement("code");

      if (block.language) {
        code.className = `language-${block.language}`;
      }

      code.textContent = block.value;

      pre.append(code);
      wrapper.append(header, pre);
      div.append(wrapper);

      break;
    }

    case "list": {
      const listElem = document.createElement(block.ordered ? "ol" : "ul");

      listElem.className = "message__list";

      block.value.split("\n").forEach((line) => {
        if (!line.trim()) return;

        const li = document.createElement("li");
        li.className = "message__list-item";
        li.innerHTML = formatInline(stripListMarker(line));

        listElem.append(li);
      });

      div.append(listElem);

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

        row
          .split("|")
          .slice(1, -1)
          .forEach((cell) => {
            const elem = document.createElement(i === 0 ? "th" : "td");

            elem.textContent = cell.trim();
            tr.append(elem);
          });

        if (i === 0) {
          thead.append(tr);
        } else {
          tbody.append(tr);
        }
      });

      table.append(thead, tbody);
      div.append(table);

      break;
    }
  }

  return div;
}
