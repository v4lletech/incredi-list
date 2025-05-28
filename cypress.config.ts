import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3080',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implementar eventos de nodo aquí
    },
  },
  env: {
    apiUrl: 'http://localhost:3080/api',
  },
}); 