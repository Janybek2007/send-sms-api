import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import apiRouterV1 from "./routers/__root_v1.js";

dotenv.config()


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "Help"
    });
})

app.use('/api/v1', apiRouterV1);


export default app;
