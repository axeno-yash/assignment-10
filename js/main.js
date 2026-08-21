import "./data/conversations.js";
import "./data/responses.js";

import "./components/sidebar.js";
import "./components/chat.js";
import "./components/message.js";
import "./components/composer.js";
import "./components/modal.js";
import "./components/dropdown.js";

import "./utils/dom.js";
import "./utils/helpers.js";

const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('sidebar-backdrop');
const openBtn = document.getElementById('sidebar-open');
const closeBtn = document.getElementById('sidebar-close');

function openSidebar() {
    sidebar.classList.add('is-open');
    sidebar.setAttribute('aria-hidden', 'false');
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add('is-visible'));
}

function closeSidebar() {
    sidebar.classList.remove('is-open');
    sidebar.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('is-visible');
    backdrop.addEventListener('transitionend', () => backdrop.hidden = true, { once: true });
}

openBtn.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);
backdrop.addEventListener('click', closeSidebar);