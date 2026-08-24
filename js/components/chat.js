import { promptSuggestions, conversations } from "../data/conversations.js";
import { pickResponse, regeneratedResponses } from "../data/responses.js";
import { renderBlock } from "./message.js";

export function initChat() {
  const messagesList = document.querySelector("#messages-list");
  const welcome = document.querySelector("#welcome-state");
  const suggestions = document.querySelector("#prompt-suggestions");
  const newChatButton = document.querySelector("#new-chat-button");
  const form = document.querySelector("#composer-form");
  const input = document.querySelector("#composer-input");
  const sendBtn = document.querySelector("#composer-send");

  let messages = [];
  let generationTimer = null;
  let regenIndex = 0;
  let isGenerating = false;

  function addMessage(role, content) {
    const msg = document.createElement("div");
    msg.className = `message message--${role}`;
    msg.dataset.messageIndex = messages.length;

    if (role === "user") {
      msg.textContent = content;
    } else {
      content.forEach((block) => msg.append(renderBlock(block)));
      const actions = document.createElement("div");
      actions.className = "message__actions";
      actions.innerHTML = `
        <button class="message__action" data-action="copy" title="Copy">Copy</button>
        <button class="message__action" data-action="like" title="Like">👍</button>
        <button class="message__action" data-action="dislike" title="Dislike">👎</button>
        <button class="message__action" data-action="regenerate" title="Regenerate">↻</button>
        <button class="message__action" data-action="more" title="More">More</button>
      `;
      msg.append(actions);
    }

    messagesList.append(msg);
    messages.push({ role, content });
    welcome.hidden = true;
    msg.scrollIntoView({ behavior: "smooth", block: "end" });
    return msg;
  }

  function send(text) {
    addMessage("user", text);
    respond(text);
  }

  function respond(text) {
    isGenerating = true;
    sendBtn.classList.add("is-stop");
    sendBtn.innerHTML = '<span class="composer-stop-icon"></span>';

    const loading = document.createElement("div");
    loading.className = "message message--assistant message--loading";
    loading.dataset.messageIndex = messages.length;
    loading.innerHTML = `
      <span class="message__dot"></span>
      <span class="message__dot"></span>
      <span class="message__dot"></span>
    `;
    messagesList.append(loading);
    messages.push({ role: "assistant", content: [{ type: "text", value: "..." }] });
    welcome.hidden = true;
    loading.scrollIntoView({ behavior: "smooth", block: "end" });

    generationTimer = setTimeout(() => {
      clearTimeout(generationTimer);
      generationTimer = null;
      loading.remove();
      messages.pop();

      const response = pickResponse(text);
      addMessage("assistant", response);

      isGenerating = false;
      sendBtn.classList.remove("is-stop");
      sendBtn.innerHTML = '<img src="./assets/icons/up-arrow.svg" alt="">';
    }, 850);
  }

  function stop() {
    if (!isGenerating) return;
    clearTimeout(generationTimer);
    generationTimer = null;

    const loading = messagesList.querySelector(".message--loading");
    if (loading) {
      loading.remove();
      messages.pop();
    }

    addMessage("assistant", [
      {
        type: "text",
        value:
          "Generation stopped. You can continue with another message whenever you are ready.",
      },
    ]);

    isGenerating = false;
    sendBtn.classList.remove("is-stop");
    sendBtn.innerHTML = '<img src="./assets/icons/up-arrow.svg" alt="">';
  }

  function loadConversation(key) {
    const convo = conversations[key] || conversations.text;
    messages = [];
    messagesList.innerHTML = "";
    welcome.hidden = true;
    convo.forEach((m) => addMessage(m.role, m.content));

    document
      .querySelectorAll(".convo-item")
      .forEach((item) => item.classList.remove("is-active"));
    document
      .querySelector(`[data-conversation="${key}"]`)
      ?.closest(".convo-item")
      ?.classList.add("is-active");
  }

  function resetChat() {
    clearTimeout(generationTimer);
    generationTimer = null;
    messages = [];
    messagesList.innerHTML = "";
    welcome.hidden = false;
    isGenerating = false;
    sendBtn.classList.remove("is-stop");
    sendBtn.innerHTML = '<img src="./assets/icons/up-arrow.svg" alt="">';
    input.focus();
  }

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${input.scrollHeight}px`;
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();

    if (!text) return;
    if (isGenerating) {
      stop();
      return;
    }
    input.value = "";
    input.style.height = "auto";
    send(text);
  });

  sendBtn.addEventListener("click", () => {
    if (isGenerating) stop();
  });

  document
    .querySelector(".composer-button--attach")
    .addEventListener("click", (btn) => {
      btn.classList.add("is-active");
      setTimeout(() => btn.classList.remove("is-active"), 350);
    });

  messagesList.addEventListener("click", (e) => {
    const btn = e.target.closest("button");

    if (!btn) return;

    const msgEl = btn.closest(".message--assistant");

    if (!msgEl) return;

    const idx = Number(msgEl.dataset.messageIndex);
    const msg = messages[idx];

    if (!msg) return;

    if (btn.dataset.action === "copy") {
      const text = msg.content.map((b) => b.value).join("\n");

      navigator.clipboard.writeText(text);

      const old = btn.textContent;

      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = old), 1300);

    } else if (
      btn.dataset.action === "like" ||
      btn.dataset.action === "dislike"

    ) {
      msgEl
        .querySelectorAll('[data-action="like"], [data-action="dislike"]')
        .forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    } else if (btn.dataset.action === "regenerate") {
      msg.content =
        regeneratedResponses[regenIndex % regeneratedResponses.length];
      regenIndex++;
      msgEl.querySelectorAll(".message-block").forEach((el) => el.remove());
      msg.content.forEach((block) =>
        msgEl.insertBefore(
          renderBlock(block),
          msgEl.querySelector(".message__actions"),
        ),
      );
    } else if (btn.dataset.action === "more") {
      const saved = btn.classList.toggle("is-active");
      btn.textContent = saved ? "Saved" : "More";
    }
  });

  promptSuggestions.forEach((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn suggestion-button";
    b.textContent = s;
    b.onclick = () => {
      input.value = s;
      input.style.height = "auto";
      input.style.height = `${input.scrollHeight}px`;
      input.focus();
    };
    suggestions.append(b);
  });

  newChatButton?.addEventListener("click", resetChat);

  document.querySelectorAll(".convo-item__link").forEach((btn) => {
    btn.addEventListener("click", () =>
      loadConversation(btn.dataset.conversation),
    );
  });
}
