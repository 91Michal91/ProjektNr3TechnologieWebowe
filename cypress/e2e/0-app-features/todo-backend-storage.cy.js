describe('TODO app backend storage tests', () => {
  let token;

  before(() => {
    cy.request('POST', 'https://todo-back.runasp.net/authenticate', {
      userName: 'user1',
      password: 'Pass123#',
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
      expect(token).to.be.a('string').and.not.be.empty;
    });
  });

  function ensureAppIsReady() {
    return cy.visit('http://localhost:5173', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', token);
      }
    }).then(() => {
      cy.contains('button', 'Backend').click();
      cy.get('input#username').type('user1');
      cy.get('input#password').type('Pass123#');
      cy.get('button[type=submit]').click();
      cy.get('[data-testid=todo-list]', { timeout: 10000 }).should('exist');
    });
  }

function clearTodos() {
  return cy.request({
    method: 'GET',
    url: 'https://todo-back.runasp.net/todo/list-item',
    headers: { Authorization: `Bearer ${token}` }
  }).then(response => {
    const todos = response.body;

    if (!todos.length) {
      return null;
    }

    const deleteRequests = todos.map(todo => {
      return cy.request({
        method: 'DELETE',
        url: `https://todo-back.runasp.net/todo/list-item/${todo.id}`,
        headers: { Authorization: `Bearer ${token}` }
      });
    });
    return cy.wrap(Promise.all(deleteRequests));
  });
}

  it('should add todo items and verify them in both UI and backend storage', () => {
    ensureAppIsReady()
      .then(() => clearTodos())
      .then(() => {
        cy.get('[data-testid=todo-list] li').should('have.length', 0);

        const todoItems = [
          'Learn Cypress framework fundamentals',
          'Write few tests',
          'Dive deeper into Cypress commands',
        ];

        // Add new todos
        todoItems.forEach((item) => {
          cy.get('[data-testid=todo-input]').type(item);
          cy.get('[data-testid=todo-add-button]').click();
        });

        // Check the number of items in the list
        cy.get('[data-testid=todo-list] li').should('have.length', todoItems.length);

        // Verify UI contains new items
        todoItems.forEach((item) => {
          cy.get('[data-testid=todo-list] li').should('contain', item);
        });

        // Verify backend storage
        cy.request({
          method: 'GET',
          url: 'https://todo-back.runasp.net/todo/list-item',
          headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
          const todos = response.body;
          expect(todos).to.have.length(todoItems.length);
          todoItems.forEach(item => {
            expect(todos.some(todo => todo.text === item)).to.be.true;
          });
        });
      });
  });
  it('should remove todo items and verify UI and backend storage update', () => {
    ensureAppIsReady()
      .then(() => {
      
        cy.get('[data-testid=todo-list] li').should('have.length', 3);

        // Remove the first item
        cy.get('[data-testid=todo-list] li')
          .first()
          .find('[data-testid=todo-delete-button]')
          .click();

        // Should have 2 items left
        cy.get('[data-testid=todo-list] li').should('have.length', 2);

        // Verify backend storage has 2 items and the first one was removed
        cy.request({
          method: 'GET',
          url: 'https://todo-back.runasp.net/todo/list-item',
          headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
          const todos = response.body;
          expect(todos).to.have.length(2);
          expect(todos.some(todo => todo.text === 'Learn Cypress framework fundamentals')).to.be.false;
        });
      });
  });
});
