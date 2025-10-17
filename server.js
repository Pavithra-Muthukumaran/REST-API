import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 3000;
app.use(express.json());

// ===== MongoDB Connection =====
const mongoURI = 'mongodb+srv://pavithra:pathra11@connectdb.dzwyiej.mongodb.net/?retryWrites=true&w=majority&appName=ConnectDB';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ===== User Schema =====
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

const User = mongoose.model('User', userSchema);

// ===== Product Schema =====
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

// ===== USER ROUTES =====

// GET all active users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isActive: true });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET users older than a given age
app.get('/users/age/:min', async (req, res) => {
  const minAge = parseInt(req.params.min);
  try {
    const users = await User.find({ age: { $gt: minAge }, isActive: true });
    res.json(users);
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
    res.status(500).json({ message: err.message });
  }
});

// POST add user
app.post('/users', async (req, res) => {
  const { name, email, age, isActive } = req.body;
  if (!name || !email || !age) return res.status(400).json({ message: 'Name, email, age required' });

  const newUser = new User({ name, email, age, isActive });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update user
app.put('/users/:id', async (req, res) => {
  const { name, email, age, isActive } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, age, isActive },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE user
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.status(500).json({ message: err.message });
  }
});

// POST add product
app.post('/products', async (req, res) => {
  const { name, price, category } = req.body;
  if (!name || !price || !category) return res.status(400).json({ message: 'All fields required' });

  const newProduct = new Product({ name, price, category });
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update product
app.put('/products/:id', async (req, res) => {
  const { name, price, category } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, category },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE product
app.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== Start Server =====
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
