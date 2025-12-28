import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [];
let nextId = 1;

// Routes

app.get('/', (req, res) => {
  res.send('Welcome to the Trust Taller API');
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const newUser: User = { id: nextId++, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

export default app;