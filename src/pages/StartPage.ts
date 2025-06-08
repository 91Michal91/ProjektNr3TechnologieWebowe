import { backend, router } from '../app';
import { BackendTodoStorage } from '../storage/BackendTodoStorage';
import { IndexedDbTodoStorage } from '../storage/IndexedDbTodoStorage';
import { LocalStorageTodoStorage } from '../storage/LocalStorageTodoStorage';
import { IPage } from './IPage';

export default class StartPage implements IPage {
    private rootElement: HTMLElement | null = null;

    constructor() { }

mount(parentElement: HTMLElement): HTMLElement {
    this.rootElement = document.createElement('div');
    this.rootElement.classList.add('container', 'mt-5');

    const title = document.createElement('h1');
    title.textContent = 'Choose Data Source';
    title.classList.add('mb-4', 'text-center');
    this.rootElement.appendChild(title);

    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('d-grid', 'gap-2', 'col-6', 'mx-auto');

    const backendButton = this.createButton('Backend', () => {
        if (backend.authToken) {
            router.goto('Todo', { storage: new BackendTodoStorage() });
        } else {
            router.goto('Login');
        }
    }, 'storage-backend');
    buttonGroup.appendChild(backendButton);

    const indexedDbButton = this.createButton('IndexedDb', () =>
        router.goto('Todo', { storage: new IndexedDbTodoStorage() }),
        'storage-indexeddb'
    );
    buttonGroup.appendChild(indexedDbButton);

    const localStorageButton = this.createButton('LocalStorage', () =>
        router.goto('Todo', { storage: new LocalStorageTodoStorage() }),
        'storage-local'
    );
    buttonGroup.appendChild(localStorageButton);

    this.rootElement.appendChild(buttonGroup);
    parentElement.appendChild(this.rootElement);

    return this.rootElement;
}

    unmount(): void {
        if (this.rootElement && this.rootElement.parentNode) {
            this.rootElement.parentNode.removeChild(this.rootElement);
        }
        this.rootElement = null;
    }

    private createButton(text: string, onClick: () => void, dataTestId: string): HTMLButtonElement {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add('btn', 'btn-primary', 'btn-lg');
        button.setAttribute('data-testid', dataTestId); // <-- dodano
        button.addEventListener('click', onClick);
        return button;
    }
} 