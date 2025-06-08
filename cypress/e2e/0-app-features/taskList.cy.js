/// <reference types="cypress" />

describe("Todo Local Storage Tests", () => {
  beforeEach(() => {
    
    cy.visit("http://localhost:5173");

    
    cy.contains("button", "LocalStorage").click();

    
    cy.clearLocalStorage();

    
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

    
    todoItems.forEach((item) => {
      cy.get("[data-testid=todo-input]").type(item);
      cy.get("[data-testid=todo-add-button]").click();
    });

    
    cy.get("[data-testid=todo-list] li").should(
      "have.length",
      todoItems.length + 3
    );

  
    todoItems.forEach((item) => {
      cy.get("[data-testid=todo-list] li").should("contain", item);
    });

   
    cy.window().then((win) => {
      const todos = JSON.parse(win.localStorage.getItem("todos"));
      expect(todos).to.have.length(todoItems.length + 3);
      todoItems.forEach(item => {
        expect(todos.some(todo => todo.text === item)).to.be.true;
      });
    });
  });

  it("should remove todo items and verify UI and local storage update", () => {
  
  cy.get("[data-testid=todo-list] li")
    .should("have.length", 3);

  
  cy.get("[data-testid=todo-list] li")
    .first()
    .find("[data-testid=todo-delete-button]")
    .click();

  
  cy.get("[data-testid=todo-list] li")
    .should("have.length", 2);

  
  cy.window().then(win => {
    const raw = win.localStorage.getItem("todos");
    
    expect(raw).to.satisfy(val => val === null || typeof val === 'string');
    if (raw === null) {
      expect(raw).to.be.null;
    } else {
      const todos = JSON.parse(raw);
      expect(todos).to.have.length(2);
      expect(todos.some(todo => todo.text === "Zadanie 1")).to.be.false;
    }
  });

  
  cy.get("[data-testid=todo-list] li").each($li => {
    cy.wrap($li)
      .find("[data-testid=todo-delete-button]")
      .click();
  });

  
  cy.get("[data-testid=todo-list] li")
    .should("have.length", 0);

  
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
  
  cy.get('[data-testid=todo-list] li')
    .should('have.length.at.least', 3);

  
  cy.get('[data-testid=todo-list] li')
    .first()
    .find('[data-testid=todo-delete-button]')
    .click();

  
  
  cy.get('[data-testid=todo-list] li')
    .first()
    .find('[data-testid=todo-delete-button]')
    .click({ force: true });

  
  cy.get('[data-testid=todo-list] li')
    .should('have.length', 1);

  
  cy.window().then(win => {
    const todos = JSON.parse(win.localStorage.getItem("todos"));
    expect(todos).to.have.length(1);
  });
});


});

