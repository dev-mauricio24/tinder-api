import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.routes.js';
import usersRouter from './routes/user.routes.js';
import servicesRouter from './routes/service.routes.js';
import companyRouter from './routes/company.routes.js'

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/', authRouter);
app.use('/api/users/', usersRouter);
app.use('/api/services/', servicesRouter);
app.use('/api/company/', companyRouter);

export default app;