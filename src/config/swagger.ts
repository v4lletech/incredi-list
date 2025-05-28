import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Incredi-List API',
      version: '1.0.0',
      description: 'Documentación de la API REST de Incredi-List',
      contact: {
        name: 'Antonio Valle',
        email: 'antonio@v4lle.tech'
      }
    },
    externalDocs: {
        description: 'swagger.json',
        url: '/swagger.json'
    },
    servers: [
      {
        url: 'http://localhost:3080',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/Contexts/**/*.ts'], // Archivos que contienen anotaciones de Swagger
};

export const swaggerSpec = swaggerJsdoc(options); 