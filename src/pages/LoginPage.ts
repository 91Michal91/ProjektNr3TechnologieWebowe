import { backend, router } from "../app";
import { BackendTodoStorage } from "../storage/BackendTodoStorage";
import { IPage } from "./IPage";

export default class LoginPage implements IPage {
    #rootEl: HTMLDivElement | undefined;
    #formEl: HTMLFormElement | undefined;
    #usernameInputEl: HTMLInputElement | undefined;
    #passwordInputEl: HTMLInputElement | undefined;
    #submitHandler: ((evt: Event) => void) | undefined;
    #cancelHandler: ((evt: MouseEvent) => void) | undefined;
    #cancelButtonEl: HTMLAnchorElement | undefined;

    mount(parentEl?: HTMLElement) {
        this.#rootEl = document.createElement('div');
        this.#rootEl.classList.add('login-container', 'd-flex', 'justify-content-center', 'align-items-center', 'h-100');

        this.#formEl = document.createElement('form');
        this.#formEl.classList.add('login-form', 'p-4', 'bg-light', 'rounded', 'shadow');

        const titleEl = document.createElement('h2');
        titleEl.textContent = 'Login';
        titleEl.classList.add('text-center', 'mb-4');

        const usernameGroupEl = document.createElement('div');
        usernameGroupEl.classList.add('mb-3');

        const usernameLabelEl = document.createElement('label');
        usernameLabelEl.textContent = 'Username';
        usernameLabelEl.classList.add('form-label');
        usernameLabelEl.setAttribute('for', 'username');

        this.#usernameInputEl = document.createElement('input');
        this.#usernameInputEl.type = 'text';
        this.#usernameInputEl.id = 'username';
        this.#usernameInputEl.classList.add('form-control');
        this.#usernameInputEl.required = true;

        const passwordGroupEl = document.createElement('div');
        passwordGroupEl.classList.add('mb-3');

        const passwordLabelEl = document.createElement('label');
        passwordLabelEl.textContent = 'Password';
        passwordLabelEl.classList.add('form-label');
        passwordLabelEl.setAttribute('for', 'password');

        this.#passwordInputEl = document.createElement('input');
        this.#passwordInputEl.type = 'password';
        this.#passwordInputEl.id = 'password';
        this.#passwordInputEl.classList.add('form-control');
        this.#passwordInputEl.required = true;

        const loginButtonEl = document.createElement('button');
        loginButtonEl.type = 'submit';
        loginButtonEl.textContent = 'Login';
        loginButtonEl.classList.add('btn', 'btn-primary', 'w-100');

        this.#cancelButtonEl = document.createElement('a');
        this.#cancelButtonEl.textContent = 'Cancel';
        this.#cancelButtonEl.classList.add('btn', 'btn-secondary', 'w-100', 'mt-2');
        this.#cancelButtonEl.href = '#'; // Prevent default link behavior

        this.#submitHandler = (evt) => {
            evt.preventDefault();
            // Handle login logic here
            const loginData = {
                username: this.#usernameInputEl?.value,
                password: this.#passwordInputEl?.value
            }

            console.log('Login attempt:', loginData);

            backend.authenticate(loginData)
                .then(data => {
                    console.log(data)
                    router.goto('Todo', { storage: new BackendTodoStorage() });
                })
                .catch(error => {
                    console.error('Error:', error)
                    alert('Login failed!')
                });

        };

        this.#cancelHandler = (evt: MouseEvent) => {
            evt.preventDefault();
            router.goto('Start');
        };

        this.#formEl.addEventListener('submit', this.#submitHandler);
        this.#cancelButtonEl.addEventListener('click', this.#cancelHandler);

        usernameGroupEl.appendChild(usernameLabelEl);
        usernameGroupEl.appendChild(this.#usernameInputEl);

        passwordGroupEl.appendChild(passwordLabelEl);
        passwordGroupEl.appendChild(this.#passwordInputEl);

        this.#formEl.appendChild(titleEl);
        this.#formEl.appendChild(usernameGroupEl);
        this.#formEl.appendChild(passwordGroupEl);
        this.#formEl.appendChild(loginButtonEl);
        this.#formEl.appendChild(this.#cancelButtonEl);

        this.#rootEl.appendChild(this.#formEl);

        if (parentEl) {
            parentEl.appendChild(this.#rootEl);
        }

        return this.#rootEl;
    }

    unmount(): void {
        if (this.#formEl && this.#submitHandler) {
            this.#formEl.removeEventListener('submit', this.#submitHandler);
        }
        if (this.#cancelButtonEl && this.#cancelHandler) {
            this.#cancelButtonEl.removeEventListener('click', this.#cancelHandler);
        }
        if (this.#rootEl) {
            this.#rootEl.remove();
        }
        this.#rootEl = undefined;
        this.#formEl = undefined;
        this.#usernameInputEl = undefined;
        this.#passwordInputEl = undefined;
        this.#submitHandler = undefined;
        this.#cancelHandler = undefined;
        this.#cancelButtonEl = undefined;
    }
}
