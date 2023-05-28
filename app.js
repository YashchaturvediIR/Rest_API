//basic thi ngs u all know , if revise then see node n express files 
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); //install by npm i body-parser

const app = express();

//using bodyparser for json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connecting api to database
mongoose.connect("mongodb://127.0.0.1:27017/Yash").then(() => {
    console.log("Connected with MongoDB Database...")
}).catch(() => {
    console.log(err);
})


//Schema defined here
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    pricer: Number
})

//make collection
const Product = new mongoose.model("Product", productSchema);

//Creating home page
app.get("/",(req,res)=>{
    res.send("Welcome to a world of seamless connectivity and efficient data management with our cutting-edge Restful API, crafted with precision and expertise by Mr. Yash Chaturvedi. Powered by the dynamic duo of Node.js and Express, this API brings a new level of functionality and performance to your applications, supporting all CRUD operations.");
})


//creating API:
//creating .post method
app.post("/api/product/new", async (req, res) => {   //always use asynch when use await method
    const x = await Product.create(req.body);
    res.status(201).json({  //status code: refer status.txt file
        success: true,
        x
    })
})


//creating Read method (to get all product)
app.get("/api/products", async (req, res) => {
    const y = await Product.find();

    res.status(200).json({
        success: true,
        y
    })
})

//creating Update method (to update product)
app.put("/api/product/:id", async (req, res) => {

    let z = await Product.findById(req.params.id);
    //used let coz we are going to use this variable again
    //to find the product to which to update we need to find it first
    //to find, we use byId fun which takes req.params.id (in postman or thunder client params is the body which takes url)
    //for eg. http://localhost:4000/api/products/re8r248r24gtr24ui
    //this is the id proovided nby mongoDB itself and vcan be provided by frontend

    //Base Case
    if (!Product) {
        res.status(500).json({
            success: false,
            message: "Product is not Found"
        })
    }


    z = await Product.findByIdAndUpdate(req.params.id, res.body, {
        new: true,
        useFindAndModify: false,
        runValidators: true
    })//learn this json parameters for to update any...

    res.status(202).json({
        success: true,
        z
    })
})

//Creating Delete method (Deleting Product)
app.delete("/api/delete/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        // Base Case
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        await product.remove();
        
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        // Handle any potential errors
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

app.listen(4000, () => {
    console.log("Server created at http://localhost:4000");
})