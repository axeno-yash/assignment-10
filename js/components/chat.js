import { promptSuggestions, conversations } from "../data/conversations.js";
import { pickResponse, regeneratedResponses } from "../data/responses.js";
import { renderBlock } from "./message.js";
import { initAttachments } from "./attachment.js";

export function initChat() {
  const messagesList = document.querySelector("#messages-list");
  const welcome = document.querySelector("#welcome-state");
  const suggestions = document.querySelector("#prompt-suggestions");
  const newChatButton = document.querySelector("#new-chat-button");
  const form = document.querySelector("#composer-form");
  const input = document.querySelector("#composer-input");
  const sendBtn = document.querySelector("#composer-send");

  const attachments = initAttachments();

  let generationTimer = null;
  let regenIndex = 0;
  let isGenerating = false;

  function setGenerating(active) {
    isGenerating = active;
    sendBtn.classList.toggle("is-stop", active);
    sendBtn.innerHTML = active
      ? '<span class="composer-stop-icon"></span>'
      : '<img src="./assets/icons/up-arrow.svg" alt="">';
  }

  function addMessage(role, content) {
    const msg = document.createElement("div");
    msg.className = `message message--${role}`;

    if (role === "user") {
      msg.textContent = content;
    } else {
      content.forEach((block) => msg.append(renderBlock(block)));

      const actions = document.createElement("div");
      actions.className = "message__actions";
      actions.innerHTML = `
        <button class="btn message__action" data-action="copy" title="Copy">
          <img class="icon" src="./assets/icons/copy.svg" alt="copy-icon">
        </button>
        <button class="btn message__action" data-action="like" title="Good response">
          <img class="icon" src="./assets/icons/like.svg" alt="like-icon">
        </button>
        <button class="btn message__action" data-action="dislike" title="Bad response">
          <img class="icon" src="./assets/icons/dislike.svg" alt="dislike-icon">
        </button>
        <button class="btn message__action" data-action="regenerate" title="Regenerate">
          <img class="icon" src="./assets/icons/regenerate.svg" alt="regenerate-icon">
        </button>
        <button class="btn message__action" data-action="more" title="More">
          <img class="icon" src="./assets/icons/more.svg" alt="more-icon">
        </button>
      `;
      msg.append(actions);
    }

    messagesList.append(msg);
    welcome.hidden = true;
    msg.scrollIntoView({ behavior: "smooth", block: "end" });

    return msg;
  }

  function respond(text) {
    setGenerating(true);

    const loading = document.createElement("div");
    loading.className = "message message--assistant message--loading";
    loading.innerHTML = `
      <span class="message__dot"></span>
      <span class="message__dot"></span>
      <span class="message__dot"></span>
    `;

    messagesList.append(loading);
    welcome.hidden = true;
    loading.scrollIntoView({ behavior: "smooth", block: "end" });

    generationTimer = setTimeout(() => {
      loading.remove();
      addMessage("assistant", pickResponse(text));
      setGenerating(false);
    }, 850);
  }

  function send(text) {
    addMessage("user", text);
    respond(text);
  }

  function stop() {
    if (!isGenerating) return;

    clearTimeout(generationTimer);
    document.querySelector(".message--loading")?.remove();

    addMessage("assistant", [
      {
        type: "text",
        value: "Generation stopped. You can continue with another message whenever you are ready.",
      },
    ]);

    setGenerating(false);
  }

  function loadConversation(key) {
    const convo = conversations[key] || conversations.text;
    messagesList.innerHTML = "";
    welcome.hidden = true;

    convo.forEach((m) => addMessage(m.role, m.content));

    document.querySelectorAll(".convo-item").forEach((item) => {
      item.classList.remove("is-active");
    });

    document
      .querySelector(`[data-conversation="${key}"]`)
      ?.closest(".convo-item")
      ?.classList.add("is-active");
  }

  function resetChat() {
    clearTimeout(generationTimer);
    attachments?.clear();
    messagesList.innerHTML = "";
    welcome.hidden = false;
    setGenerating(false);
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
    const file = attachments?.getFile();

    if (!text && !file) return;

    if (isGenerating) {
      stop();
      return;
    }

    input.value = "";
    input.style.height = "auto";
    attachments?.clear();
    send(text || file.name);
  });

  sendBtn.addEventListener("click", () => {
    if (isGenerating) stop();
  });

  messagesList.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    const msgElem = btn?.closest(".message--assistant");
    if (!btn || !msgElem) return;

    const action = btn.dataset.action;

    if (action === "copy") {
      const text = Array.from(msgElem.querySelectorAll(".message-block"))
        .map((elem) => elem.innerText.trim())
        .join("\n\n");

      navigator.clipboard.writeText(text);
      const originalHtml = btn.innerHTML;
      btn.innerHTML = `<span>Copied</span>`;
      setTimeout(() => (btn.innerHTML = originalHtml), 1300);
    }

    if (action === "like" || action === "dislike") {
      msgElem
        .querySelectorAll('[data-action="like"], [data-action="dislike"]')
        .forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    }

    if (action === "regenerate") {
      const newResponse = regeneratedResponses[regenIndex % regeneratedResponses.length];
      regenIndex++;

      msgElem.querySelectorAll(".message-block").forEach((elem) => elem.remove());
      const actions = msgElem.querySelector(".message__actions");
      newResponse.forEach((block) => msgElem.insertBefore(renderBlock(block), actions));
    }

    if (action === "more") {
      btn.classList.toggle("is-active");
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
      loadConversation(btn.dataset.conversation)
    );
  });
}
