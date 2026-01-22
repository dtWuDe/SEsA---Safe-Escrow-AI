import express, { Express} from 'express';
import { createRouters } from './route';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// // Middleware
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', createRouters());

// // Error handling middleware
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//     console.error(err.stack);
//     res.status(err.status || 500).json({
//         message: err.message || 'Internal Server Error',
//         ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//     });
// });

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 API endpoints available at http://localhost:${PORT}/api/v1/auth`);
});

export default app;