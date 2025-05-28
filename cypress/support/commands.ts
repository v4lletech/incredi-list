// Comandos personalizados para las pruebas E2E

// Comando para crear un usuario
Cypress.Commands.add('createUser', (userData: { name: string; communicationType: string }) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/v1/users`,
    body: userData,
    failOnStatusCode: false
  }).then((response) => {
    return response;
  });
});

// Comando para obtener un usuario por ID
Cypress.Commands.add('getUserById', (id: string) => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('apiUrl')}/v1/users/${id}`,
    failOnStatusCode: false
  }).then((response) => {
    return response;
  });
});

// Comando para actualizar un usuario
Cypress.Commands.add('updateUser', (id: string, userData: { name?: string; communicationType?: string }) => {
  return cy.request({
    method: 'PUT',
    url: `${Cypress.env('apiUrl')}/v1/users/${id}`,
    body: userData,
    failOnStatusCode: false
  }).then((response) => {
    return response;
  });
}); 