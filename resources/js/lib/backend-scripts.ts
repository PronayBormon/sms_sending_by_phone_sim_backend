type MenuInstance = {
    destroy: () => void;
};

type LayoutMenuElement = HTMLElement & {
    menuInstance?: MenuInstance;
};

let abortController: AbortController | null = null;

function toggleSidebar(): void {
    const current = document.body.getAttribute('sidebar-data-theme');
    document.body.setAttribute(
        'sidebar-data-theme',
        current === 'sidebar-hide' ? 'sidebar-show' : 'sidebar-hide',
    );
}

function bindSidebarToggle(
    id: string,
    selector: string,
    signal: AbortSignal,
): void {
    const element = document.getElementById(id);
    if (!element) {
        return;
    }

    const control = element.closest(selector) ?? element;
    control.addEventListener('click', toggleSidebar, { signal });
}

function initSidebarMenu(): void {
    const Menu = window.Menu;
    if (!Menu) {
        return;
    }

    document.querySelectorAll('#layout-menu').forEach((node) => {
        const element = node as LayoutMenuElement;

        if (element.menuInstance) {
            element.menuInstance.destroy();
            delete element.menuInstance;
        }

        const menu = new Menu(element, {
            orientation: 'vertical',
            closeChildren: false,
        });

        if (window.Helpers?.scrollToActive) {
            window.Helpers.scrollToActive(false);
        }

        if (window.Helpers) {
            window.Helpers.mainMenu = menu;
        }
    });
}

function initSimplebar(): void {
    const SimpleBar = window.SimpleBar;
    if (!SimpleBar) {
        return;
    }

    document.querySelectorAll('[data-simplebar]').forEach((node) => {
        const element = node as HTMLElement;

        if (element.dataset.simplebarInit === 'true') {
            return;
        }

        new SimpleBar(element);
        element.dataset.simplebarInit = 'true';
    });
}

function initBootstrapDropdowns(): void {
    const bootstrap = window.bootstrap;
    if (!bootstrap?.Dropdown) {
        return;
    }

    document
        .querySelectorAll('[data-bs-toggle="dropdown"]')
        .forEach((toggle) => {
            bootstrap.Dropdown.getOrCreateInstance(toggle);
        });
}

function initBootstrapTooltips(): void {
    const bootstrap = window.bootstrap;
    if (!bootstrap?.Tooltip) {
        return;
    }

    document
        .querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach((trigger) => {
            const instance = bootstrap.Tooltip.getInstance(trigger);
            if (instance) {
                instance.dispose();
            }

            new bootstrap.Tooltip(trigger);
        });
}

/** Re-initialize backend template scripts after React/Inertia renders the DOM. */
export function initBackendScripts(): void {
    abortController?.abort();
    abortController = new AbortController();
    const { signal } = abortController;

    if (!document.body.hasAttribute('sidebar-data-theme')) {
        document.body.setAttribute('sidebar-data-theme', 'sidebar-show');
    }

    bindSidebarToggle('header-burger-menu', '.header-burger-menu', signal);

    initSidebarMenu();
    initSimplebar();
    initBootstrapDropdowns();
    initBootstrapTooltips();
}
