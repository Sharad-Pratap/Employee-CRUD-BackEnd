import express from "express";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/crudDB").then(()=>{
    console.log("Database connection established");
})
.catch(err=>{
    console.log(err);
})

const userSchema = new mongoose.Schema({
    photoURL : String,
    name : String,
    title : String,
    phone : Number,
    email : String
})

const User = new mongoose.model('User', userSchema);


app.get("/", (req,res)=>{
    User.find({})
    .then((user)=>{
        res.json(user)
    })
    .catch((err)=>{
        res.json(err);
    })
})

app.get('/getUser/:id', (req,res)=>{
    const id = req.params.id;
    User.findById({_id : id})
    .then((user)=>{
        res.json(user)
    })
    .catch((err)=>{
        res.json(err);
    })

})

app.put("/updateUser/:id", (req, res) => {
    const id = req.params.id;
    console.log("Received PUT request for user ID:", id);
    console.log("Request body:", req.body);

    User.findByIdAndUpdate(
        { _id: id },
        {
            photoURL: req.body.photoURL,
            name: req.body.name,
            title: req.body.title,
            phone: req.body.phone,
            email: req.body.email,
        }
    )
        .then((user) => {
            console.log("Updated user:", user);
            res.json(user);
        })
        .catch((err) => {
            console.error("Error updating user:", err);
            res.json(err);
        });
});

app.delete('/deleteUser/:id', (req,res)=>{
    const id = req.params.id
    User.findByIdAndDelete({_id : id})
    .then((user)=>{
        res.json(user);
    })
    .catch((err)=>{
        res.json(err);
    })
})

app.post("/createUser", (req,res)=>{
    User.create(req.body)
    .then((user)=>{
        res.json(user);
    })
    .catch((err)=>{
        res.json(err);
    })
})


app.listen(3001, ()=>{
    console.log("server is running on port 3001");
})
