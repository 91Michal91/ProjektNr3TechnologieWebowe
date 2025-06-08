import { TodoThemeSchema } from "./TodoList";

export const TodoBoostrapTheme: TodoThemeSchema = {
    root: 'd-flex flex-column h-100',
    list: 'list-group flex-grow-1 p-2',
    list_item: 'list-group-item d-flex',
    list_itemDone: '',
    list_item_check: 'form-check-input me-3',
    list_item_text: 'flex-grow-1 me-3',
    list_item_textDone: 'text-decoration-line-through',
    list_item_textEditInput: 'form-control me-3',
    list_item_deleteButton: 'btn btn-danger',
    list_item_editButton: 'btn btn-warning ms-1',
    footer: 'd-flex p-2',
    footer_input: 'form-control me-2',
    footer_addButton: 'btn btn-primary',
    hidden: 'd-none'
}