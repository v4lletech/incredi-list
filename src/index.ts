import express from 'express';
import 'module-alias/register';
import userRoutes from '@users/infrastructure/api/userRoutes';
import { eventBus } from '@users/domain/events/EventBus';
import { configureMessageModule } from '@messages/infrastructure/container';

const app = express();
const port = process.env.PORT || 3080;

// Middleware
app.use(express.json());

// Configurar módulos
configureMessageModule(eventBus);

// Routes
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 