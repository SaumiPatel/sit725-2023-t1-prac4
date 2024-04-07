var express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
var app = express();
const path = require("path");
const uri =
  "mongodb+srv://admin:admin@cluster0.wh5bwpz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
var port = process.env.port || 3000;
let collection;
app.use(express.static(path.join(__dirname, "public_html")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function postCat(cat, callback) {
  collection.insertOne(cat, callback);
}

function getAllCats(callback) {
  collection.find({}).toArray(callback);
}

// Create a MongoClient with a MongoClientOptions object to set the
// Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function runDBConnection() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    collection = client.db().collection("Cat");
    console.log(collection);
  } catch (ex) {
    console.error(ex);
  }
}
app.get("/", (req, res) => {
  res.render("index.html");
});
app.get("/api/projects", (req, res) => {
  getAllCats((err, result) => {
    if (!err) {
      res.json({
        statusCode: 200,
        data: result,
        message: "get all cats successful",
      });
    }
  });
});

app.post("/api/cat", (req, res) => {
  let cat = req.body;
  postCat(cat, (err, result) => {
    if (!err) {
      res.json({ statusCode: 201, data: result, message: "success" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  runDBConnection();
});
