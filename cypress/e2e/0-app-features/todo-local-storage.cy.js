/// <reference types="cypress" />

describe("Todo Local Storage Tests", () => {
  beforeEach(() => {
    // Visit the start page
    cy.visit("http://localhost:5173");

    // Wybierz LocalStorage jako źródło danych
    cy.contains("button", "LocalStorage").click();

    // Wyczyść localStorage, żeby testy były niezależne
    cy.clearLocalStorage();

    // Dodaj kilka elementów na start do testów
    const initialTodos = ["Zadanie 1", "Zadanie 2", "Zadanie 3"];
    initialTodos.forEach(todo => {
      cy.get("[data-testid=todo-input]").type(todo);
      cy.get("[data-testid=todo-add-button]").click();
    });
  });

  it("should add todo items and verify them in both UI and local storage", () => {
    const todoItems = [
      "Learn Cypress framework fundamentals",
      "Write few tests",
      "Dive deeper into Cypress commands",
    ];

    // Dodaj nowe zadania
    todoItems.forEach((item) => {
      cy.get("[data-testid=todo-input]").type(item);
      cy.get("[data-testid=todo-add-button]").click();
    });

    // Sprawdź liczbę elementów na liście (początkowe + nowe)
    cy.get("[data-testid=todo-list] li").should(
      "have.length",
      todoItems.length + 3
    );

    // Sprawdź, czy UI zawiera nowe elementy
    todoItems.forEach((item) => {
      cy.get("[data-testid=todo-list] li").should("contain", item);
    });

    // Sprawdź zawartość localStorage
    cy.window().then((win) => {
      const todos = JSON.parse(win.localStorage.getItem("todos"));
      expect(todos).to.have.length(todoItems.length + 3);
      todoItems.forEach(item => {
        expect(todos.some(todo => todo.text === item)).to.be.true;
      });
    });
  });

  it("should remove todo items and verify UI and local storage update", () => {
  // 0. Upewnij się, że na liście są 3 elementy
  cy.get("[data-testid=todo-list] li")
    .should("have.length", 3);

  // 1. Usuń pierwszy element listy
  cy.get("[data-testid=todo-list] li")
    .first()
    .find("[data-testid=todo-delete-button]")
    .click();

  // 2. Powinno zostać 2 elementy
  cy.get("[data-testid=todo-list] li")
    .should("have.length", 2);

  // 3. Sprawdź, że localStorage ma 2 wpisy i że pierwszy został usunięty
  cy.window().then(win => {
    const raw = win.localStorage.getItem("todos");
    // może być null lub JSON-em
    expect(raw).to.satisfy(val => val === null || typeof val === 'string');
    if (raw === null) {
      expect(raw).to.be.null;
    } else {
      const todos = JSON.parse(raw);
      expect(todos).to.have.length(2);
      expect(todos.some(todo => todo.text === "Zadanie 1")).to.be.false;
    }
  });

  // 4. Usuń wszystkie pozostałe elementy jeden po drugim
  cy.get("[data-testid=todo-list] li").each($li => {
    cy.wrap($li)
      .find("[data-testid=todo-delete-button]")
      .click();
  });

  // 5. Lista w UI powinna być pusta
  cy.get("[data-testid=todo-list] li")
    .should("have.length", 0);

  // 6. LocalStorage: getItem może teraz dawać null lub "[]"
  cy.window().then(win => {
    const raw = win.localStorage.getItem("todos");
    expect(raw).to.satisfy(val => val === null || val === "[]" );
    if (raw === null) {
      expect(raw).to.be.null;
    } else {
      const todos = JSON.parse(raw);
      expect(todos).to.be.an('array').that.is.empty;
    }
  });
});
  
it("should handle removing non-existent todo gracefully", () => {
  // 0. Upewnij się, że jest co najmniej 3 elementy
  cy.get('[data-testid=todo-list] li')
    .should('have.length.at.least', 3);

  // 1. Usuń pierwszy element listy
  cy.get('[data-testid=todo-list] li')
    .first()
    .find('[data-testid=todo-delete-button]')
    .click();

  // 2. Teraz usuń pierwszy element, który jest już nowym pierwszym elementem listy
  //    (klikając z force: true na wypadek, gdyby coś się zmieniło)
  cy.get('[data-testid=todo-list] li')
    .first()
    .find('[data-testid=todo-delete-button]')
    .click({ force: true });

  // 3. Sprawdź, że liczba elementów na liście zmniejszyła się o 2 (czyli jest 1)
  cy.get('[data-testid=todo-list] li')
    .should('have.length', 1);

  // 4. Zweryfikuj, że UI i localStorage są spójne (jest dokładnie 1 element)
  cy.window().then(win => {
    const todos = JSON.parse(win.localStorage.getItem("todos"));
    expect(todos).to.have.length(1);
  });
});


});

