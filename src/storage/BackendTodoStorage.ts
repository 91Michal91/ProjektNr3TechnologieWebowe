import { backend } from "../app";
import { TodoItem, TodoStorageProvider } from "../components/TodoList";

export class BackendTodoStorage implements TodoStorageProvider {
    onItemsLoad() {
        return backend.getAllItems().then(items => { return items as TodoItem[] })
    }
    onItemAdd(item: TodoItem) {
        return backend.saveItem(item).then(item => { return item as TodoItem })
    }
    onItemUpdate(item: TodoItem) {
        return backend.saveItem(item).then(item => { return item as TodoItem })
    }
    onItemDelete(id: number) {
        return backend.deleteItem(id)
    }
}