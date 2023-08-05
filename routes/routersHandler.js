// Routes
const categoryRouter = require('./categoryRoute');
const subCategoryRouter = require('./subcategoryRoute');
const brandRouter = require('./brandRoute');
const productRouter = require('./productRoute');
const userRouter = require('./userRoute');
const authRouter = require('./authRoute');


//Use Routers
const routerHandler = (app) => {
    app.use('/api/v1/ecommerce/brands', brandRouter)
    app.use('/api/v1/ecommerce/category', categoryRouter);
    app.use('/api/v1/ecommerce/subcategory', subCategoryRouter);
    app.use('/api/v1/ecommerce/products', productRouter);
    app.use('/api/v1/ecommerce/users', userRouter);
    app.use('/api/v1/ecommerce/auth', authRouter);
}


module.exports = routerHandler;