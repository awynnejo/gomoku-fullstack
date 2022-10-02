import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Game } from './gomoku';

dotenv.config();

// Database connection
const connectDB = async () => {
    const dbUri = process.env.DBURI || '';
    console.log('Connecting to db...')
    try {
        await mongoose.connect(dbUri);

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

connectDB();
mongoose.connection.once('connected', () => {
    console.log("connected to db")
})

const app: Express = express();
app.use(express.json())
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('hello world');

});

app.post('/user/login', (req: Request, res: Response) => {
    res.send('Login')
})

app.post('/user/register', (req: Request, res: Response) => {
    res.send('Register user')
})

app.get('/game/played', (req: Request, res: Response) => {
    res.send('Played games')
});

app.get('/game/:id', (req: Request, res: Response) => {
    res.send('Single game details')
});

app.get('/game/new/:size', (req: Request, res: Response) => {
    var game: Game = new Game(parseInt(req.params.size))
    res.send(game)
});

app.post('/game/update/:id', (req: Request, res: Response) => {
    res.send('Update current moves and respond with status')
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}'`);
});
