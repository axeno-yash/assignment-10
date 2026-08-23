export function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.drawer-overlay');
    const openBtn = document.querySelector('.sidebar-toggle');
    const closeBtn = document.querySelector('.sidebar-close');

    openBtn.addEventListener('click', () => {
        sidebar.classList.add('is-open');
        overlay.hidden = false;
        overlay.classList.add('is-visible');
    });

    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('is-open');
        overlay.hidden = true;
        overlay.classList.remove('is-visible');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        overlay.hidden = true;
    });
}
