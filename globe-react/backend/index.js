const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let posts = [
  { id: 1, title: 'Hello from backend!' }
];

// GET all posts
app.get('/posts', (req, res) => {
  res.json(posts);
});

// POST new post
app.post('/posts', (req, res) => {
  const { title } = req.body;
  const newPost = { id: posts.length + 1, title };
  posts.push(newPost);
  res.status(201).json(newPost);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 