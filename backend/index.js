const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const product_model = require('./models/product_model')

const port = 4000;

const app = express();

app.use(express.json());
app.use(cors());

//database connection
mongoose.connect('mongodb://localhost:27017/E-Commerce').then(() => {
  console.log('Database Connected');
}).catch((err) => {
  console.log(err);
})

//API calls
app.get('/', (req, res) => {
  res.send('Server started ')
})

//Image Storage
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({ storage: storage });

//upload images
app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  })
})

//Schema for creating products
// const userSchema = mongoose.Schema({
//   id: {
//     type: Number,
//     required: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   image: {
//     type: String,
//     required: true
//   },
//   category: {
//     type: String,
//     required: true
//   },
//   new_price: {
//     type: Number,
//     required: true
//   },
//   old_price: {
//     type: Number,
//     required: true
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   available: {
//     type: Boolean,
//     default: true
//   },
// });

// const products = mongoose.model('Product', userSchema);

app.post('/addproduct', async (req, res) => {
  let prdt = await product_model.find({});
  let id;
  if (prdt.length > 0) {
    let last_product_array = prdt.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  }
  else {
    id = 1;
  }
  const { name, image, category, new_price, old_price } = req.body;
  const product = new product_model({
    id: id,
    name: name,
    image: image,
    category: category,
    new_price: new_price,
    old_price: old_price
  });
  console.log(product);
  await product.save();
  console.log('save');
  res.json({
    success: true,
    name: req.body.name,
  })
})

//Deleting product

app.post('/removeproduct', async (req, res) => {
  if (await product_model.findOneAndDelete({ id: req.body.id })) {
    console.log('Remove');
    res.json({
      success: true,
      name: req.body.name
    })
  }
  else {
    res.status(400).json({
      success: false,
      message: "Id not exist"
    })
  }
});

//Get All Products
app.get('/allproducts', async(req, res)=>{
  let products = await product_model.find({});
  console.log('All product');
  res.send(products);
})

app.listen(port, (req, res) => {
  console.log(`Server started at port ${port}`);
})