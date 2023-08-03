const createError = require('http-errors');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: 'config.env' });
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const globalError = require('./middleware/errorMiddleware');
const ApiError = require('./utls/apiError');
const dbConnection = require('./config/database');
// Routes
const categoryRouter = require('./routes/categoryRoute');
const subCategoryRouter = require('./routes/subcategoryRoute');
const brandRouter = require('./routes/brandRoute');
const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute');
const authRouter = require('./routes/authRoute');
// Connenct To DB
dbConnection();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Use Routers
app.use('/api/v1/ecommerce/brands', brandRouter)
app.use('/api/v1/ecommerce/category', categoryRouter);
app.use('/api/v1/ecommerce/subcategory', subCategoryRouter);
app.use('/api/v1/ecommerce/products', productRouter);
app.use('/api/v1/ecommerce/users', userRouter);
app.use('/api/v1/ecommerce/auth', authRouter);

app.all('*', (req, res, next) => {

  next(new ApiError(`Cant found this route :${  req.originalUrl}`, 400))
})
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(globalError);

module.exports = app;
