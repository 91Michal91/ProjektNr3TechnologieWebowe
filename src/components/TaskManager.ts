export class TodoList {
  #rootEl: HTMLDivElement | undefined;
  #listEl: HTMLElement | undefined;
  #inputEl: HTMLTextAreaElement | undefined;

  #theme: TodoThemeSchema | undefined;
  #storageProvider: TodoStorageProvider | undefined;

  constructor(options?: TodoOptions) {
    this.#theme = options?.theme;
    this.#storageProvider = options?.storage;
  }

  mount(parentEl?: HTMLElement) {
    this.#rootEl = document.createElement('div');
    this.#rootEl.classList.add(...classUnify(this.#theme?.root ?? 'todo'));

    this.#listEl = document.createElement('ul');
    this.#listEl.dataset.testid = 'todo-list';
    this.#listEl.classList.add(...classUnify(this.#theme?.list ?? 'todo-list'));

    const footerEl = document.createElement('form');
    footerEl.classList.add(...classUnify(this.#theme?.footer ?? 'todo-footer'));

    this.#inputEl = document.createElement('textarea');
    this.#inputEl.dataset.testid = 'todo-input';
    this.#inputEl.placeholder = 'Enter task description...';
    this.#inputEl.classList.add(...classUnify(this.#theme?.footer_input ?? ''));

    const addButtonEl = document.createElement('button');
    addButtonEl.textContent = '➕ Add Task';
    addButtonEl.dataset.testid = 'todo-add-button';
    addButtonEl.classList.add(...classUnify(this.#theme?.footer_addButton ?? ''));
    addButtonEl.addEventListener('click', (evt) => {
      this.#addItem();
      evt.preventDefault();
    });

    footerEl.appendChild(this.#inputEl);
    footerEl.appendChild(addButtonEl);
    this.#rootEl.appendChild(this.#listEl);
    this.#rootEl.appendChild(footerEl);

    if (parentEl) {
      parentEl.appendChild(this.#rootEl);
    }

    this.#storageProvider?.onItemsLoad().then(items => {
      items.forEach(item => this.#addItem(item, false));
    });

    return this.#rootEl;
  }

  addItem(text: string) {
    this.#addItem({
      text,
      isChecked: false
    }, false);
  }

  #addItem(todoItem?: TodoItem, addToStore: boolean = true) {
    const _todoItem: TodoItem = todoItem ?? {
      text: this.#inputEl?.value ?? '',
      isChecked: false
    };

    if (!_todoItem.text.trim()) return;

    const listEl = this.#listEl;
    const theme = this.#theme;

    if (!this.#inputEl || !listEl) throw new Error('Component not initialized!');

    const itemEl = document.createElement('li');
    itemEl.classList.add(...classUnify(theme?.list_item ?? 'todo-item'));
    if (_todoItem.isChecked) {
      itemEl.classList.add(...classUnify(theme?.list_itemDone ?? ''));
    }

    const textEl = document.createElement('div');
    textEl.textContent = _todoItem.text;
    textEl.classList.add(...classUnify(theme?.list_item_text ?? 'todo-item-text'));
    if (_todoItem.isChecked) {
      textEl.classList.add(...classUnify(theme?.list_item_textDone ?? ''));
    }

    const checkEl = document.createElement('input');
    checkEl.type = 'checkbox';
    checkEl.checked = _todoItem.isChecked;
    checkEl.classList.add(...classUnify(theme?.list_item_check ?? ''));

    checkEl.addEventListener('change', () => {
      _todoItem.isChecked = checkEl.checked;
      setItemChecked(checkEl.checked);
      this.#storageProvider?.onItemUpdate(_todoItem);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '🗑️';
    deleteButton.title = 'Delete task';
    deleteButton.dataset.testid = 'todo-delete-button';
    deleteButton.classList.add(...classUnify(theme?.list_item_deleteButton ?? ''));
    deleteButton.addEventListener('click', () => {
      listEl.removeChild(itemEl);
      this.#storageProvider?.onItemDelete(_todoItem.id!);
    });

    const editButton = document.createElement('button');
    editButton.textContent = '✏️';
    editButton.title = 'Edit task';
    editButton.dataset.mode = 'readonly';
    editButton.classList.add(...classUnify(theme?.list_item_editButton ?? ''));

    let textEditEl: HTMLTextAreaElement;
    editButton.addEventListener('click', () => {
      if (editButton.dataset.mode === 'readonly') {
        textEditEl = document.createElement('textarea');
        textEditEl.value = _todoItem.text;
        textEditEl.classList.add(...classUnify(theme?.list_item_textEditInput ?? ''));
        checkEl.after(textEditEl);
        textEl.classList.add(...classUnify(theme?.hidden ?? 'hidden'));
        deleteButton.disabled = true;
        editButton.dataset.mode = 'editing';
        editButton.textContent = '💾';
        textEditEl.focus();
      } else {
        _todoItem.text = textEditEl.value.trim();
        if (!_todoItem.text) return;
        
        textEl.textContent = _todoItem.text;
        textEl.classList.remove(...classUnify(theme?.hidden ?? 'hidden'));
        itemEl.removeChild(textEditEl);
        deleteButton.disabled = false;
        editButton.dataset.mode = 'readonly';
        editButton.textContent = '✏️';

        this.#storageProvider?.onItemUpdate(_todoItem);
      }
    });

    itemEl.appendChild(checkEl);
    itemEl.appendChild(textEl);
    itemEl.appendChild(deleteButton);
    itemEl.appendChild(editButton);

    this.#inputEl.value = '';

    if (addToStore) {
      this.#storageProvider?.onItemAdd(_todoItem).then(item => {
        _todoItem.id = item.id;
        listEl.appendChild(itemEl);
      });
    } else {
      if ((_todoItem?.id ?? 0) === 0) {
        throw new Error('Item has no id and cannot be added!');
      }
      listEl.appendChild(itemEl);
    }

    function setItemChecked(checkedValue: boolean) {
      checkEl.checked = checkedValue;
      const itemDoneClass = theme?.list_itemDone ?? 'todo-item-done';
      if (itemDoneClass) itemEl.classList.toggle(itemDoneClass, checkedValue);

      const itemDoneTextClass = theme?.list_item_textDone || '';
      if (itemDoneTextClass) textEl.classList.toggle(itemDoneTextClass, checkedValue);
    }
  }

  destroy() {
    this.#rootEl?.remove();
    this.#rootEl = undefined;
    this.#listEl = undefined;
    this.#inputEl = undefined;
    this.#theme = undefined;
    this.#storageProvider = undefined;
  }
}

function classUnify(classList: string) {
  if (!classList) return [];
  return classList.split(' ');
}

interface TodoOptions {
  theme?: TodoThemeSchema;
  storage?: TodoStorageProvider;
}

export interface TodoThemeSchema {
  root?: string;
  list?: string;
  list_item?: string;
  list_itemDone?: string;
  list_item_check?: string;
  list_item_text?: string;
  list_item_textDone?: string;
  list_item_textEditInput?: string;
  list_item_deleteButton?: string;
  list_item_editButton?: string;
  footer?: string;
  footer_input?: string;
  footer_addButton?: string;
  hidden?: string;
}

export interface TodoStorageProvider {
  onItemsLoad: () => Promise<TodoItem[]>;
  onItemAdd: (item: TodoItem) => Promise<TodoItem>;
  onItemUpdate: (item: TodoItem) => Promise<TodoItem>;
  onItemDelete: (id: number) => Promise<void>;
}

export interface TodoItem {
  id?: number;
  text: string;
  isChecked: boolean;
}