import { TodoItem, TodoStorageProvider } from '../components/TaskManager'

export class LocalStorageTodoStorage implements TodoStorageProvider {
    private readonly storageKey = 'todos'
    private nextId: number = 1

    constructor() {
        // Initialize nextId based on existing items
        const items = this.loadItems()
        if (items.length > 0) {
            this.nextId = Math.max(...items.map(item => item.id ?? 0)) + 1
        }
    }

    private loadItems(): TodoItem[] {
        const itemsJson = localStorage.getItem(this.storageKey)
        return itemsJson ? JSON.parse(itemsJson) : []
    }

    private saveItems(items: TodoItem[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(items))
    }

    onItemsLoad(): Promise<TodoItem[]> {
        try {
            // Synchronous operation, wrap result in a resolved Promise
            return Promise.resolve(this.loadItems());
        } catch (error) {
            // Wrap potential synchronous errors in a rejected Promise
            return Promise.reject(error);
        }
    }

    onItemAdd(item: Omit<TodoItem, 'id'>): Promise<TodoItem> {
        return Promise.resolve().then(() => {
            // Perform synchronous operations within the .then() callback
            const items = this.loadItems();
            const newItem: TodoItem = { ...item, id: this.nextId++ };
            items.push(newItem);
            this.saveItems(items);
            return newItem; // Resolve the promise with the new item
        });
        // Catch potential synchronous errors from loadItems/saveItems
        // Note: If loadItems or saveItems threw, the promise returned by .then() would automatically reject.
        // Adding an explicit .catch here might be redundant unless specific error handling is needed.
    }

    onItemUpdate(item: TodoItem): Promise<TodoItem> {
        return new Promise((resolve, reject) => {
            if (item.id === undefined) {
                // Reject immediately if id is missing
                return reject('Item must have an id to be updated.');
            }
            try {
                // Perform synchronous operations within the try block
                const items = this.loadItems();
                const index = items.findIndex(i => i.id === item.id);
                if (index === -1) {
                    // Reject if item not found
                    return reject('Item not found.');
                }
                items[index] = item;
                this.saveItems(items);
                // Resolve the promise with the updated item
                resolve(item);
            } catch (error) {
                // Reject if any synchronous operation fails
                reject(error);
            }
        });
    }

    onItemDelete(id: number): Promise<void> {
        return Promise.resolve().then(() => {
            // Perform synchronous operations within the .then() callback
            let items = this.loadItems();
            items = items.filter(item => item.id !== id);
            this.saveItems(items);
            // Resolve with no value for Promise<void>
        });
        // Catch potential synchronous errors (similar note as onItemAdd)
    }
} 