import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 5000;

app.use(express.json());

// ===== MongoDB Connection =====
const mongoURI = 'mongodb+srv://pavithra:pathra11@connectdb.dzwyiej.mongodb.net/?retryWrites=true&w=majority&appName=ConnectDB';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ===== User Schema =====
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], minlength: 3 },
  email: { type: String, required: [true, 'Email is required'], match: /.+\@.+\..+/ },
  age: { type: Number, required: [true, 'Age is required'], min: 0 },
  role: { type: String, enum: ['admin', 'user'], default: 'user' } // New role field
});

const User = mongoose.model('User', userSchema);

// ===== Product Schema =====
const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  stock: { type: Number, required: [true, 'Stock is required'], min: 0 }
});

const Product = mongoose.model('Product', productSchema);

// ===== USER ROUTES =====

// GET all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all admins
app.get('/users/admins', async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET average age
app.get('/users/average-age', async (req, res) => {
  try {
    const result = await User.aggregate([
      { $group: { _id: null, averageAge: { $avg: "$age" } } }
    ]);
    const averageAge = result[0]?.averageAge || 0;
    res.json({ averageAge });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Invalid user ID' });
  }
});

// POST create user
app.post('/users', async (req, res) => {
  const { name, email, age, role } = req.body;
  const newUser = new User({ name, email, age, role });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    const messages = Object.values(err.errors || {}).map(e => e.message);
    res.status(400).json({ message: messages.length ? messages : err.message });
  }
});

// PUT update user
app.put('/users/:id', async (req, res) => {
  const { name, email, age, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, age, role },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    const messages = Object.values(err.errors || {}).map(e => e.message);
    res.status(400).json({ message: messages.length ? messages : 'Invalid ID or data' });
  }
});

// DELETE user
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid user ID' });
  }
});

// ===== PRODUCT ROUTES =====

// GET all products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid product ID' });
  }
});

// POST create product
app.post('/products', async (req, res) => {
  const { name, price, stock } = req.body;
  const newProduct = new Product({ name, price, stock });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    const messages = Object.values(err.errors || {}).map(e => e.message);
    res.status(400).json({ message: messages.length ? messages : err.message });
  }
});

// PUT update product
app.put('/products/:id', async (req, res) => {
  const { name, price, stock } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, stock },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    const messages = Object.values(err.errors || {}).map(e => e.message);
    res.status(400).json({ message: messages.length ? messages : 'Invalid ID or data' });
  }
});

// DELETE product
app.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid product ID' });
  }
});

// ===== Start Server =====
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
