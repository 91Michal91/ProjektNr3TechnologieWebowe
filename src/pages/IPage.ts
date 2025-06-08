/**
 * Interface defining the contract for page components
 */
export interface IPage {
    /**
     * Mounts the page component to the specified parent element
     * @param parentElement The HTML element to mount this page to
     * @returns The root element of the page
     */
    mount(parentElement: HTMLElement): HTMLElement;

    /**
     * Unmounts the page component and cleans up any resources
     */
    unmount(): void;
}

/**
 * Type definition for the constructor of page components
 */
export type IPageConstructor = new (params?: object) => IPage; 