const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const securityMiddleware = require('./middlewares/securityMiddleware');
const userRoutes = require('./routes/userRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

securityMiddleware(app);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Multivendor Marketplace API is running' });
});

app.use(errorMiddleware);

module.exports = app;
