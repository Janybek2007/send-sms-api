import app from './app.js';
import mongoose from "mongoose";

const port = process.env.PORT || 4141;

async function dbConnect() {
    try {
        const db_uri = process.env.DB_URI
        await mongoose.connect(db_uri)
        console.log('MongoDB Connected');
    } catch (e) {
        console.log('error db connected', e)
    }
}


app.listen(port, async () => {
    await dbConnect();
    console.log(`Listening: http://localhost:${port}`);
});
