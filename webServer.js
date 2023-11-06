/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch their reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const express = require("express");
const app = express();

const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");

app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

mongoose.set("strictQuery", false);
// Modify the mongoose.connect to connect to your MongoDB database.
mongoose.connect("mongodb://127.0.0.1:27017/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to get collection counts
async function getCollectionCounts() {
  const [userCount, photoCount] = await Promise.all([
    User.countDocuments(),
    Photo.countDocuments(),
  ]);

  return {
    user: userCount,
    photo: photoCount,
  };
}

app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

// Route to fetch SchemaInfo and object counts from the database
app.get("/test", async function (request, response) {
  try {
    const [schemaInfo, counts] = await Promise.all([
      SchemaInfo.findOne(),
      getCollectionCounts(),
    ]);

    const result = {
      info: schemaInfo,
      counts: counts,
    };
    response.json(result);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Route to fetch the list of users for the navigation sidebar
app.get("/user/list", async function (request, response) {
  try {
    const res = await User.find({}, "_id first_name last_name");
    response.json(res);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Route to fetch the list of photos
app.get("/photo/list", async function (request, response) {
  try {
    const res = JSON.parse(JSON.stringify(await Photo.find({})));
    res.map(photo => {
      return (photo.comments.map(comment => {
        delete comment.user_id;
        return comment;
      }));
    });
    response.json(res);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Route to fetch user details by ID
app.get("/user/:id", async function (request, response) {
  const userId = request.params.id;

  try {
    const user = JSON.parse(JSON.stringify(await User.findById(userId)));
    delete user.__v;
    
    response.json(user);
  } catch (error) {
    response.status(400).json({ error: "User not found" });
  }
});

// Route to fetch photos of a user by ID
app.get("/photosOfUser/:id", async function (request, response) {
  const userId = request.params.id;

  try {
    let photos = JSON.parse(JSON.stringify(await Photo.find({ user_id: userId })));
    console.log("photos", photos);

    if (photos.length === 0) {
      response.status(400).json({ error: "No photos found for the user" });
    } else {
      photos = await Promise.all(photos.map(async (photo) => {
        delete photo.__v;
        photo.comments = await Promise.all(photo.comments.map(async (comment) => {
          let user = JSON.parse(JSON.stringify(await User.find({_id: comment.user_id}, "_id first_name last_name")));
          comment.user = user[0];
          delete comment.user_id;
          return comment;
        }));
        console.log("photo", photo);
        return photo;
      }));

      response.status(200).json(photos);
    }
  } catch (error) {
    response.status(400).json({ error: "No photos found for the user" });
  }
});

// Route to fetch photos of a user by ID
app.get("/photo/:id", async function (request, response) {
  const photoId = request.params.id;

  try {
    let photo = JSON.parse(JSON.stringify(await Photo.findById(photoId)));
    if (!photo) {
      response.status(400).json({error: "No photo found"});
      return;
    }
    delete photo.__v;
    
    photo.comments = await Promise.all(photo.comments.map(async (comment) => {
      let user = JSON.parse(JSON.stringify(await User.find({_id: comment.user_id}, "_id first_name last_name")));
      comment.user = user[0];
      delete comment.user_id;
      return comment;
    }));
    console.log("single-photo", photoId, photo);

    response.status(200).json(photo);
  } catch (error) {
    response.status(400).json({ error: "No photo found" });
  }
});

// Route to fetch login of a user by ID
app.get("/admin/login/:id", async function (request, response) {
  const userName = request.params.id; 
  let user = JSON.parse(JSON.stringify(await User.findById(userName)));
  if (!user) {
    response.status(400).json({ error: "No photo found" });
    return;
  }
});

// Route to fetch logout of a user by ID
app.get("/admin/login/:id", async function (request, response) {
  const userName = request.params.id; 
  let user = JSON.parse(JSON.stringify(await User.findById(userName)));
  if (!user) {
    response.status(400).json({ error: "No user is logged in" });
    return;
  }
});



const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});


