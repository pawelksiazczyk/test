const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors')

const Post = require("./models/Post");
const Login = require("./models/Login");
const Subcategory = require("./models/Subcategory");
const Category = require("./models/Category");
const { json } = require("body-parser");

const app = express();

app.use(bodyParser.json())
app.use(cors());

mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser: true});

const db = mongoose.connection;

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts)
  } catch(err) {
    res.json({message: err})
  }
});

app.post("/categories", async (req, res) => {
  const { title } = req.body;

  const allCategories = await Category.find();

  const exist = allCategories.filter(el => {
    return el.title === title
  })

  if(exist.length === 0) {
    const category = new Category({
      title
    });

    try {
      const savedCategory = await category.save();
      res.json(savedCategory)
    } catch (err) {
      res.json({ message: err })
    }
  } else {
    res.json({message: "Taki element juz istnieje"})
  }
  
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories)
  } catch(err) {
    res.json({message: err})
  }
});

app.patch("/categories/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { title } = req.body;

  const allCategories = await Category.find();

  const exist = allCategories.filter(el => {
    return el.title === title
  });

  if (exist.length === 0) {
    try {
      const data = await Category.findByIdAndUpdate(id, {
        title,
        updatedAt: new Date()
      });

      console.log(data)
      res.json(data);
    } catch (err) {
      res.json({ message: err })
    }
  } else {
    res.json({message: "Taki element juz istnieje"});
  }

  

});

app.patch("/subcategories/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { title, img } = req.body;

  const allSubcategories = await Subcategory.find();

  const exist = allSubcategories.filter(el => {
    return el.title === title
  });

  if (exist.length === 0) {
    try {
      const data = await Subcategory.findByIdAndUpdate(id, {
        title,
        img,
        updatedAt: new Date()
      });

      res.json(data);
    } catch (err) {
      res.json({ message: err })
    }
  } else {
    res.json({message: "Taki element juz istnieje"})
  }

  

});

app.patch("/posts/edit/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description, img } = req.body;

  const allPosts = await Post.find();

  const exist = allPosts.filter(el => {
    return el.title === title
  });

  if (exist.length === 0) {
    try {
      const data = await Post.findByIdAndUpdate(id, {
        title,
        description,
        img,
        updatedAt: new Date()
      });

      res.json(data);
    } catch (err) {
      res.json({ message: err })
    }
  } else {
    res.json({message: "Taki element juz istnieje"})
  }

  
});


app.delete("/categories/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {

    await Category.remove({_id: id});

    // const subcategory = await Subcategory.find({
    //   category: id
    // }).exec()
    await Subcategory.remove({category: id});
    await Post.remove({category: id})
    

  } catch(err) {
    res.json({message: err})
  }
});


app.delete("/subcategories/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await Subcategory.remove({ _id: id });
    await Post.remove({ subcategory: id })
  } catch (err) {
    res.json({ message: err })
  }
});



app.delete("/posts/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await Post.remove({ _id: id })
  } catch (err) {
    res.json({ message: err })
  }
});


app.post("/subcategories", async (req, res) => {
  const { title, img, posts, category } = req.body;

  const allSubcategories = await Subcategory.find();

  const exist = allSubcategories.filter(el => {
    return el.title === title
  })

  if (exist.length === 0) {
    const subcategory = new Subcategory({
      title,
      img,
      category
    });

    const newCategory = await Category.findById(subcategory.category);

    try {
      const savedSubcategory = await subcategory.save();

      const updatedCategory = await newCategory.updateOne({
        $addToSet: { subcategories: [subcategory._id] }
      })

      res.json(savedSubcategory)
      res.json(updatedCategory)
    } catch (err) {
      res.json({ message: err })
    }
  } else {
    res.json({message: "Taki element juz istnieje"})
  }
  
});

app.post("/posts", async (req, res) => {
  const { title, description, img, subcategory, category } = req.body;

  const allPosts = await Post.find();

  const exist = allPosts.filter(el => {
    return el.title === title
  })

  if (exist.length === 0) {
    const post = new Post({
      title,
      description,
      img,
      subcategory,
      category
    });

    const newSubcategory = await Subcategory.findById(post.subcategory);

    try {
      const savedPost = await post.save();
      const updatedSubcategory = await newSubcategory.updateOne({
        $addToSet: { posts: [post._id] }
      });
      //update subcategory
      res.json(savedPost);
      res.json(updatedSubcategory)
    } catch (err) {
      res.json({ message: err })
    }
  } else {
    res.json({message: "Taki element juz istnieje"})
  }

  
})

app.get("/subcategories", async (req, res) => {
  try {
    const subcategories = await Subcategory.find();
    res.json(subcategories)
  } catch (err) {
    res.json({ message: err })
  }
})

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts)
  } catch (err) {
    res.json({ message: err })
  }
})


app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const response = await Login.find().limit(1);
    const [ data ] = response;

    if (data.username === username && data.password === password) {
      res.json(true);
    } else {
      res.json(false)
    }

  } catch(err) {
    res.json({message: err})
  }

})

// app.post("/", async (req, res) => {

//   const {title, description, date, img} = req.body;

//   const post = new Post({
//     title: title,
//     description: description,
//     date: date,
//     img: img
//   });

//   try {
//     const savedPost = await post.save();
//     res.json(savedPost);
//   } catch (error) {
//     res.json({message: error})
//   }
// })

db.on("error", () => console.log("connection error"));
db.once("open", () => {
  console.log("connected")
})

app.listen(3001, () => {
  console.log("Server is running on port 3001");
})