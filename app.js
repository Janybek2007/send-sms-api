import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import userRouter from "./routers/user-router.js";

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "Help"
    });
})

app.use('/api/v1', userRouter);


export default app;
