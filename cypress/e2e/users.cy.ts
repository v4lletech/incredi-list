describe('Gestión de Usuarios', () => {
  beforeEach(() => {
    // Limpiar datos de prueba antes de cada test
    cy.request('GET', `${Cypress.env('apiUrl')}/v1/users`).then((response) => {
      if (response.body.users && response.body.users.length > 0) {
        response.body.users.forEach((user: any) => {
          cy.request({
            method: 'DELETE',
            url: `${Cypress.env('apiUrl')}/v1/users/${user.id}`,
            failOnStatusCode: false
          });
        });
      }
    });
  });

  describe('Creación de Usuarios V1', () => {
    it('debería crear un usuario exitosamente', () => {
      const userData = {
        name: 'Usuario de Prueba',
        communicationType: 'EMAIL'
      };

      cy.createUser(userData).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('message', 'Usuario creado exitosamente');
        expect(response.body).to.have.property('id');
        expect(response.body.id).to.be.a('string');
        expect(response.body).to.have.property('user');
        expect(response.body.user).to.deep.include({
          id: response.body.id,
          name: userData.name,
          communicationType: userData.communicationType
        });
      });
    });

    it('debería fallar al crear un usuario sin datos requeridos', () => {
      const invalidUserData = {
        name: 'Usuario de Prueba'
        // Falta communicationType
      };

      cy.createUser(invalidUserData as any).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
      });
    });
  });

  describe('Creación de Usuarios V2', () => {
    it('debería crear un usuario exitosamente con ID proporcionado', () => {
      const userData = {
        id: 'test-user-123',
        name: 'Usuario de Prueba V2',
        communicationType: 'EMAIL'
      };

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/v2/users`,
        body: userData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('message', 'Usuario creado exitosamente');
        expect(response.body).to.have.property('id', userData.id);
        expect(response.body).to.have.property('user');
        expect(response.body.user).to.deep.include({
          id: userData.id,
          name: userData.name,
          communicationType: userData.communicationType
        });
      });
    });

    it('debería fallar al crear un usuario sin ID', () => {
      const invalidUserData = {
        name: 'Usuario de Prueba V2',
        communicationType: 'EMAIL'
      };

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/v2/users`,
        body: invalidUserData,
        failOnStatusCode: false
      }).then((response) => {
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
      cy.request('GET', `${Cypress.env('apiUrl')}/v1/users?page=1&limit=2`).then((response) => {
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
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        userId = response.body.id;
      });
    });

    it('debería actualizar un usuario exitosamente', () => {
      // Verificamos que tenemos un ID válido antes de continuar
      expect(userId).to.be.a('string');
      expect(userId).to.not.be.empty;

      const updateData = {
        name: 'Usuario Actualizado',
        communicationType: 'SMS'
      };

      cy.updateUser(userId, updateData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Usuario actualizado exitosamente');
        expect(response.body).to.have.property('user');
        expect(response.body.user).to.deep.include({
          id: userId,
          ...updateData
        });
      });
    });

    it('debería fallar al actualizar un usuario inexistente', () => {
      const updateData = {
        name: 'Usuario Actualizado',
        communicationType: 'CONSOLE'
      };

      cy.updateUser('id-inexistente', updateData).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('error');
      });
    });
  });
}); 