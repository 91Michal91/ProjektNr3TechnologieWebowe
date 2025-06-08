import { IPage, IPageConstructor } from "./pages/IPage";

export class Router {
    #currentPage: string = '';
    #appEl: HTMLElement;
    #currentPageInstance: IPage | undefined;

    constructor(appEl: HTMLElement) {
        this.#appEl = appEl;
    }

    public goto(page: "Start" | "Login" | "Todo", params?: object): void {
        if (this.#currentPageInstance) {
            this.#currentPageInstance.unmount();
        }

        this.#currentPage = page;
        console.log(`Navigating to ${page} page`);
        import(`./pages/${page}Page`).then(module => {
            const PageComponent = module.default as IPageConstructor;
            const pageInstance = new PageComponent(params);
            this.#currentPageInstance = pageInstance;
            pageInstance.mount(this.#appEl);
        });
    }

    currentPage(): string {
        return this.#currentPage;
    }
}