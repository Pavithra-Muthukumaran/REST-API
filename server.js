import express from 'express';

const app = express();
const port = 5000;

// Middleware to parse JSON
app.use(express.json());

// In-memory users array
let users = [
  { id: 1, name: 'Pavithra', email: 'pavi@example.com', age: 23 },
  { id: 2, name: 'Vivek', email: 'rahul@example.com', age: 29},
  { id: 3, name: 'Mounika', email: 'mouni@example.com', age: 21 },
  { id: 4, name: 'Vadivel', email: 'vikramvel2000@gmail.com', age: 25   }
];

// ✅ GET /users – List all users
app.get('/users', (req, res) => {
  res.json(users);
});

// ✅ GET /users/:id – Get user by ID
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// ✅ POST /users – Add user
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({ message: 'Name, email, and age are required' });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    age
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// ✅ PUT /users/:id – Update user
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, age } = req.body;

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (!name || !email || !age) {
    return res.status(400).json({ message: 'Name, email, and age are required' });
  }

  users[userIndex] = { id: userId, name, email, age };
  res.json(users[userIndex]);
});

// ✅ DELETE /users/:id – Remove user
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

// ✅ /users/search?name=Rahul – Search by name
app.get('/users/search', (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: 'Please provide a name query parameter' });
  }

  const results = users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));

  if (results.length === 0) {
    return res.status(404).json({ message: 'No users found with that name' });
  }

  res.json(results);
});

// ✅ /users/adults – Return users aged 18 or above
app.get('/users/adults', (req, res) => {
  const adults = users.filter(u => u.age >= 18);
  res.json(adults);
});

// ✅ /users/emails – Return only email list
app.get('/users/emails', (req, res) => {
  const emails = users.map(u => u.email);
  res.json(emails);
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}/`);
});
