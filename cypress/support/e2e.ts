// Importar comandos personalizados
import './commands';

// Ocultar fetch/XHR requests del log de comandos
const app = window.top;
if (app) {
  app.document.addEventListener('DOMContentLoaded', () => {
    const style = app.document.createElement('style');
    style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
    app.document.head.appendChild(style);
  });
}

// Declarar tipos personalizados para TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Comando personalizado para crear un usuario
       * @example cy.createUser({ name: 'Test User', communicationType: 'EMAIL' })
       */
      createUser(userData: { name: string; communicationType: string }): Chainable<Cypress.Response<any>>;
      
      /**
       * Comando personalizado para obtener un usuario por ID
       * @example cy.getUserById('123')
       */
      getUserById(id: string): Chainable<Cypress.Response<any>>;
      
      /**
       * Comando personalizado para actualizar un usuario
       * @example cy.updateUser('123', { name: 'Updated Name' })
       */
      updateUser(id: string, userData: { name?: string; communicationType?: string }): Chainable<Cypress.Response<any>>;
    }
  }
} 