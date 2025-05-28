describe('Gestión de Usuarios', () => {
  beforeEach(() => {
    // Limpiar datos de prueba antes de cada test
    cy.request('GET', `${Cypress.env('apiUrl')}/v1/users`).then((response) => {
      const users = response.body.users;
      users.forEach((user: any) => {
        cy.request('DELETE', `${Cypress.env('apiUrl')}/v1/users/${user.id}`);
      });
    });
  });

  describe('Creación de Usuarios', () => {
    it('debería crear un usuario exitosamente', () => {
      const userData = {
        name: 'Usuario de Prueba',
        communicationType: 'EMAIL'
      };

      cy.createUser(userData).its('response').then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('message', 'Usuario creado exitosamente');
      });
    });

    it('debería fallar al crear un usuario sin datos requeridos', () => {
      const invalidUserData = {
        name: 'Usuario de Prueba'
        // Falta communicationType
      };

      cy.createUser(invalidUserData as any).its('response').then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
      });
    });
  });

  describe('Listado de Usuarios', () => {
    beforeEach(() => {
      // Crear algunos usuarios de prueba
      const users = [
        { name: 'Usuario 1', communicationType: 'EMAIL' },
        { name: 'Usuario 2', communicationType: 'SMS' },
        { name: 'Usuario 3', communicationType: 'CONSOLE' }
      ];

      users.forEach(user => {
        cy.createUser(user);
      });
    });

    it('debería listar usuarios con paginación', () => {
      cy.request('GET', `${Cypress.env('apiUrl')}/v1/users?page=1&limit=2`).its('response').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('users');
        expect(response.body.users).to.be.an('array');
        expect(response.body.users.length).to.be.at.most(2);
        expect(response.body).to.have.property('total');
        expect(response.body).to.have.property('page', 1);
        expect(response.body).to.have.property('limit', 2);
      });
    });
  });

  describe('Actualización de Usuarios', () => {
    let userId: string;

    beforeEach(() => {
      // Crear un usuario para las pruebas de actualización
      cy.createUser({
        name: 'Usuario Original',
        communicationType: 'EMAIL'
      }).its('response').then((response) => {
        // Extraer el ID del usuario creado
        userId = response.body.id;
      });
    });

    it('debería actualizar un usuario exitosamente', () => {
      const updateData = {
        name: 'Usuario Actualizado',
        communicationType: 'SMS'
      };

      cy.updateUser(userId, updateData).its('response').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Usuario actualizado exitosamente');
      });
    });

    it('debería fallar al actualizar un usuario inexistente', () => {
      const updateData = {
        name: 'Usuario Actualizado'
      };

      cy.updateUser('id-inexistente', updateData).its('response').then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('error');
      });
    });
  });
}); 