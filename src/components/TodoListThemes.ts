import { TodoThemeSchema } from "./TaskManager";

export const TodoBoostrapTheme: TodoThemeSchema = {
  root: 'd-flex flex-column h-100 bg-dark text-light p-3 rounded-4 shadow-sm',
  list: 'list-group list-group-flush flex-grow-1 gap-2 overflow-auto',
  list_item: 'list-group-item d-flex align-items-center rounded-3 border-0 px-3 py-2 bg-dark bg-opacity-75',
  list_itemDone: 'opacity-75 bg-secondary bg-opacity-25',
  list_item_check: 'form-check-input me-3 flex-shrink-0',
  list_item_text: 'flex-grow-1 fw-medium',
  list_item_textDone: 'text-decoration-line-through text-muted',
  list_item_textEditInput: 'form-control bg-dark text-light border-secondary me-2',
  list_item_deleteButton: 'btn btn-outline-danger btn-sm px-3 flex-shrink-0',
  list_item_editButton: 'btn btn-outline-warning btn-sm ms-2 px-3 flex-shrink-0',
  footer: 'd-flex gap-2 align-items-start pt-3 border-top border-secondary mt-auto',
  footer_input: 'form-control bg-dark text-light border-secondary flex-grow-1',
  footer_addButton: 'btn btn-success px-4',
  hidden: 'd-none'
};

export const TodoDefaultTheme: TodoThemeSchema = {
  root: 'todo',
  list: 'todo-list',
  list_item: 'todo-item',
  list_itemDone: 'todo-item-done',
  list_item_check: '',
  list_item_text: 'todo-item-text',
  list_item_textDone: '',
  list_item_textEditInput: '',
  list_item_deleteButton: '',
  list_item_editButton: '',
  footer: 'todo-footer',
  footer_input: '',
  footer_addButton: '',
  hidden: 'hidden'
};