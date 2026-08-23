export function initSettingsModal() {
    const accountToggle = document.querySelector('.sidebar-account-toggle');
    const accountMenu = document.querySelector('.sidebar-account-menu');
    const settingsTrigger = document.querySelector('.sidebar-account-menu__item--settings');
    const modal = document.querySelector('.settings-modal');
    const closeButtons = document.querySelectorAll('.settings-modal__close, .settings-modal__backdrop');
    const navItems = document.querySelectorAll('.settings-modal__nav-item');
    const contentTitle = document.querySelector('.settings-modal__content h3');

    const closeAccountMenu = () => {
        accountMenu.hidden = true;
        accountToggle.setAttribute('aria-expanded', 'false');
    };

    const closeModal = () => {
        modal.hidden = true;
    };

    accountToggle.addEventListener('click', () => {
        const isOpen = !accountMenu.hidden;
        accountMenu.hidden = isOpen;
        accountToggle.setAttribute('aria-expanded', String(!isOpen));
    });

    settingsTrigger.addEventListener('click', () => {
        closeAccountMenu();
        modal.hidden = false;
    });

    closeButtons.forEach((button) => button.addEventListener('click', closeModal));

    navItems.forEach((item) => item.addEventListener('click', () => {
        navItems.forEach((navItem) => navItem.classList.toggle('is-active', navItem === item));
        contentTitle.textContent = item.textContent;
    }));
}
