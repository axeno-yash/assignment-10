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

    const searchBtn = document.querySelector('#sidebar-search-btn');
    const searchInput = document.querySelector('#sidebar-search');

    if (searchBtn && searchInput) {
        searchBtn.onclick = () => {
            searchInput.hidden = !searchInput.hidden;
            if (!searchInput.hidden) searchInput.focus();
            else {
                searchInput.value = '';
                filterChats('');
            }
        };

        searchInput.oninput = () => filterChats(searchInput.value.trim().toLowerCase());
    }

    function filterChats(query) {
        document.querySelectorAll('.convo-item').forEach(item => {
            const title = item.querySelector('.convo-item__title')?.textContent.toLowerCase() || '';
            item.hidden = !title.includes(query);
        });
    }

    const menu = document.querySelector('#convo-menu');
    let activeItem = null;

    document.querySelector('.sidebar__convo-groups')?.addEventListener('click', (e) => {
        const moreBtn = e.target.closest('.convo-item__more');
        if (moreBtn) {
            e.stopPropagation();
            activeItem = moreBtn.closest('.convo-item');
            const rect = moreBtn.getBoundingClientRect();
            menu.style.top = `${rect.top}px`;
            menu.style.left = `${rect.right + 6}px`;
            menu.hidden = false;
        }
    });

    menu?.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = e.target.closest('.convo-menu__item')?.dataset.action;
        if (!action || !activeItem) return;

        if (action === 'rename') {
            const titleElem = activeItem.querySelector('.convo-item__title');
            const newTitle = prompt('Rename chat:', titleElem.textContent.trim());
            if (newTitle) titleElem.textContent = newTitle.trim();
        } else if (action === 'delete') {
            activeItem.remove();
        }
        menu.hidden = true;
    });

    document.addEventListener('click', () => {
        if (menu) menu.hidden = true;
    });
}
