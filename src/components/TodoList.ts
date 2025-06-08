export class TodoList {
  #rootEl: HTMLDivElement | undefined;
  #listEl: HTMLElement | undefined;
  #inputEl: HTMLTextAreaElement | undefined;

  #theme: TodoThemeSchema | undefined
  #storageProvider: TodoStorageProvider | undefined

  constructor(options?: TodoOptions) {
    this.#theme = options?.theme
    this.#storageProvider = options?.storage
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
    this.#inputEl.classList.add(...classUnify(this.#theme?.footer_input ?? ''));

    const addButtonEl = document.createElement('button');
    addButtonEl.textContent = 'Dodaj'
    addButtonEl.dataset.testid = 'todo-add-button';
    addButtonEl.classList.add(...classUnify(this.#theme?.footer_addButton ?? ''));
    addButtonEl.addEventListener('click', (evt) => {
      this.#addItem()
      evt.preventDefault()
    })

    this.#rootEl.appendChild(this.#listEl);
    this.#rootEl.appendChild(footerEl);
    footerEl.appendChild(this.#inputEl);
    footerEl.appendChild(addButtonEl);

    if (parentEl) {
      parentEl.appendChild(this.#rootEl)
    }

    this.#storageProvider?.onItemsLoad().then(items => {
      items.forEach(item => this.#addItem(item, false))
    })

    return this.#rootEl
  }

  addItem(text: string) {
    this.#addItem({
      text,
      isChecked: false
    }, false)
  }

  #addItem(todoItem?: TodoItem, addToStore: boolean = true) {
    const _todoItem: TodoItem = todoItem ?? {
      text: this.#inputEl?.value ?? '',
      isChecked: false
    }

    const listEl = this.#listEl;
    const theme = this.#theme;

    if (!this.#inputEl || !listEl) throw new Error('Component probaly not initialized!');

    const itemEl = document.createElement('li')
    itemEl.classList.add(...classUnify(this.#theme?.list_item ?? 'todo-item'));

    const textEl = document.createElement('div');
    textEl.textContent = _todoItem.text
    textEl.classList.add(...classUnify(this.#theme?.list_item_text ?? 'todo-item-text'));

    const checkEl = document.createElement('input');
    checkEl.type = 'checkbox'
    setItemChecked(_todoItem.isChecked);

    checkEl.addEventListener('change', () => {
      // store within closure
      const item = _todoItem;

      setItemChecked(checkEl.checked);

      item.isChecked = checkEl.checked;
      this.#storageProvider?.onItemUpdate(item)
    });
    checkEl.classList.add(...classUnify(this.#theme?.list_item_check ?? ''))

    const deleteButton = document.createElement("button");
deleteButton.textContent = "Usuń";
deleteButton.dataset.testid = 'todo-delete-button';
deleteButton.addEventListener("click", () => {
  // store within closure
  const item = _todoItem;
  listEl.removeChild(itemEl);
  this.#storageProvider?.onItemDelete(item.id!);
});
deleteButton.classList.add(...classUnify(this.#theme?.list_item_deleteButton ?? ''));

    const editButton = document.createElement("button");
    editButton.textContent = "Edytuj";
    editButton.dataset.mode = "readonly";
    editButton.classList.add(...classUnify(this.#theme?.list_item_editButton ?? ''))

    let textEditEl: HTMLTextAreaElement;
    editButton.addEventListener("click", () => {
      // store within closure
      const item = _todoItem;
      if (editButton.dataset.mode === "readonly") {
        textEditEl = document.createElement("textarea")
        item.text = textEl.textContent ?? "";
        textEditEl.value = item.text;
        textEditEl.classList.add(...classUnify(this.#theme?.list_item_textEditInput ?? ''))
        checkEl.after(textEditEl);
        textEl.classList.add(...classUnify(this.#theme?.hidden ?? 'hidded'));
        deleteButton.disabled = true;
        editButton.dataset.mode = "editing";
        editButton.textContent = "Zapisz";
      } else {
        item.text = textEditEl.value;
        textEl.textContent = item.text;
        textEl.classList.remove(...classUnify(this.#theme?.hidden ?? 'hidded'));
        itemEl.removeChild(textEditEl);
        deleteButton.disabled = false;
        editButton.dataset.mode = "readonly";
        editButton.textContent = "Edytuj";

        this.#storageProvider?.onItemUpdate(item)
      }
    });

    itemEl.appendChild(checkEl)
    itemEl.appendChild(textEl)
    itemEl.appendChild(deleteButton)
    itemEl.appendChild(editButton)

    this.#inputEl.value = ''


    if (addToStore) {
      this.#storageProvider?.onItemAdd(_todoItem).then(item => {
        _todoItem.id = item.id;
        this.#listEl?.appendChild(itemEl);
      })
    } else {
      // load scenario.
      if ((_todoItem?.id ?? 0) === 0) {
        throw new Error('Item has no id and cannot be added!')
      }
      this.#listEl?.appendChild(itemEl);
    }

    function setItemChecked(checkedValue: boolean) {
      checkEl.checked = checkedValue;
      const itemDoneClass = theme?.list_itemDone ?? 'todo-item-done'
      if (itemDoneClass) itemEl.classList.toggle(itemDoneClass, checkedValue);

      const itemDoneTextClass = theme?.list_item_textDone || ''
      if (itemDoneTextClass) textEl.classList.toggle(itemDoneTextClass, checkedValue);
    }
  }

  /**
   * @description Safely destroys component
   * @returns {void}
   */
  destroy() {
    // remove from DOM
    this.#rootEl?.remove();

    // release references
    this.#rootEl = undefined;
    this.#listEl = undefined;
    this.#inputEl = undefined;
    this.#theme = undefined;
    this.#storageProvider = undefined;
  }
}



function classUnify(classList: string) {
  if (!classList) return []
  return classList.split(' ');
}

interface TodoOptions {
  theme: TodoThemeSchema,
  storage?: TodoStorageProvider
}

export interface TodoThemeSchema {
  root?: string,
  list?: string,
  list_item?: string,
  list_itemDone?: string,
  list_item_check?: string,
  list_item_text?: string,
  list_item_textDone?: string,
  list_item_textEditInput?: string,
  list_item_deleteButton?: string,
  list_item_editButton?: string,
  footer?: string,
  footer_input?: string,
  footer_addButton?: string,
  hidden?: string
}

export interface TodoStorageProvider {
  onItemsLoad: () => Promise<TodoItem[]>
  onItemAdd: (item: TodoItem) => Promise<TodoItem>
  onItemUpdate: (item: TodoItem) => Promise<TodoItem>
  onItemDelete: (id: number) => Promise<void>
}

export interface TodoItem {
  id?: number
  text: string
  isChecked: boolean
}