import "dotenv/config";
import express from "express";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";


const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = new mongoose.Schema({
  photoURL: String,
  name: String,
  title: String,
  phone: Number,
  email: String,
});

const User = new mongoose.model("User", userSchema);

// Configure multer to store uploaded files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store uploads in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  User.find({})
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/getUser/:id", (req, res) => {
  const id = req.params.id;
  User.findById({ _id: id })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.put("/updateUser/:id", upload.single("photo"), (req, res) => {
  const id = req.params.id;
 

  User.findByIdAndUpdate(
    { _id: id },
    {
      photoURL: req.file.filename,
      name: req.body.name,
      title: req.body.title,
      phone: req.body.phone,
      email: req.body.email,
    }
  )
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error("Error fetching updated user:", err);
      res.json(err);
    });
});

app.delete("/deleteUser/:id", (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete({ _id: id })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/createUser", upload.single("photo"), (req, res) => {
  const { name, title, phone, email } = req.body;
  const photoURL = req.file.filename; // Unique filename of the uploaded image
  const newUser = new User({
    photoURL,
    name,
    title,
    phone,
    email,
  });

  newUser
    .save()
    .then((user) => {
      console.log("User saved");
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("server is running on port 3001");
});
