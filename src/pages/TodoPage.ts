import { router } from '../app';
import { TodoList, TodoStorageProvider } from '../components/TodoList';
import { TodoBoostrapTheme } from '../components/TodoListThemes';

import { IPage } from './IPage';

export default class TodoPage implements IPage {
    #rootElement: HTMLElement | undefined;
    #todoComponent: TodoList | undefined;

    constructor(params?: { storage: TodoStorageProvider }) {

        this.#rootElement = document.createElement('div');
        this.#rootElement.classList.add('d-flex', 'flex-column', 'vh-100', 'bg-light');

        this.#todoComponent = new TodoList({
            theme: TodoBoostrapTheme,
            storage: params?.storage
        });
    }

    mount(parentElement: HTMLElement): HTMLElement {
        const rootElement = this.#rootElement!;
        const todoComponent = this.#todoComponent!;

        // Create header
        const header = document.createElement('header');
        header.classList.add('p-3', 'bg-primary', 'text-white', 'shadow-sm');

        // Create a container for header content
        const headerContainer = document.createElement('div');
        headerContainer.classList.add('d-flex', 'align-items-center');

        // Create the title
        const title = document.createElement('h1');
        title.classList.add('m-0', 'fs-4', 'flex-grow-1', 'text-center');
        title.textContent = 'My Todo List';

        // Create the back button
        const backButton = document.createElement('button');
        backButton.setAttribute('data-testid', 'back-button');
        backButton.innerHTML = '<i class="bi bi-chevron-left"></i> Back';
        backButton.classList.add('btn', 'btn-light', 'me-3');
        backButton.addEventListener('click', () => {
            router.goto('Start');
        });

        // Add button and title to the container (button first now)
        headerContainer.appendChild(backButton);
        headerContainer.appendChild(title);

        // Set header content
        header.appendChild(headerContainer);

        // Create main content area
        const mainContent = document.createElement('main');
        mainContent.classList.add('flex-grow-1', 'overflow-auto', 'p-3');

        // Mount todo component
        const todoWrapper = document.createElement('div');
        todoWrapper.setAttribute('id', 'todo-list');
        todoWrapper.setAttribute('data-testid', 'todo-list');
        todoWrapper.classList.add('h-100', 'mx-auto', 'bg-white', 'rounded', 'shadow-sm');
        todoWrapper.style.maxWidth = '800px';
        todoComponent.mount(todoWrapper);

        // Assemble the page
        rootElement.appendChild(header);
        mainContent.appendChild(todoWrapper);
        rootElement.appendChild(mainContent);

        // Mount to parent
        parentElement.appendChild(rootElement);

        return rootElement;
    }

    unmount(): void {
        // destroy todo component
        this.#todoComponent!.destroy();
        this.#todoComponent = undefined;

        // Remove the root element
        this.#rootElement!.remove();
        this.#rootElement = undefined;
    }
}
