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

const fs = require("fs");
const express = require("express");
const app = express();

const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");

const processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');

app.use(
  session({ secret: "secretKey", resave: false, saveUninitialized: false })
);
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
app.use(bodyParser.json());

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
    res.map((photo) => {
      return photo.comments.map((comment) => {
        delete comment.user_id;
        return comment;
      });
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
    let photos = JSON.parse(
      JSON.stringify(await Photo.find({ user_id: userId }))
    );
    console.log("photos", photos);

    if (photos.length === 0) {
      response.status(400).json({ error: "No photos found for the user" });
    } else {
      photos = await Promise.all(
        photos.map(async (photo) => {
          delete photo.__v;
          photo.comments = await Promise.all(
            photo.comments.map(async (comment) => {
              let user = JSON.parse(
                JSON.stringify(
                  await User.find(
                    { _id: comment.user_id },
                    "_id first_name last_name"
                  )
                )
              );
              comment.user = user[0];
              delete comment.user_id;
              return comment;
            })
          );
          console.log("photo", photo);
          return photo;
        })
      );

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
      response.status(400).json({ error: "No photo found" });
      return;
    }
    delete photo.__v;

    photo.comments = await Promise.all(
      photo.comments.map(async (comment) => {
        let user = JSON.parse(
          JSON.stringify(
            await User.find(
              { _id: comment.user_id },
              "_id first_name last_name"
            )
          )
        );
        comment.user = user[0];
        delete comment.user_id;
        return comment;
      })
    );
    console.log("single-photo", photoId, photo);

    response.status(200).json(photo);
  } catch (error) {
    response.status(400).json({ error: "No photo found" });
  }
});

app.post("/commentsOfPhoto/:photo_id", async function (request, response) {
  // get id of photo that new comment should be added to
  const photoId = request.params.photo_id;

  // get new comment from request params
  const newComment = request.body.comment;

  if (!photoId || !newComment) {
    response.status(400).json({ error: "photo_id and comment are required" });
  }
  if (!newComment.trim().length) {
    response.status(400).json({ error: "Empty comment, please try again" });
  }

  try {
    const userId = request.session.user ? request.session.user._id : null;
    if (!userId) {
      response.status(401).json({ error: "Unauthorized - User not logged in" });
      return;
    }
    // get photo that new comment should be added to
    let photo = await Photo.findById(photoId);

    // append new comment to photo comments array
    photo.comments.push({
      comment: newComment,
      user_id: userId, // TODO: Get the currently logged in user id and put it here
    });

    photo.save();
    photo = JSON.parse(JSON.stringify(photo));
    response.status(200).json(photo);
  } catch (e) {}
});

//route to log in a user
app.post("/admin/login", async function (request, response) {
  const userName = request.body.username;
  //our user value is set to the users userName
  let user = await User.findOne({ login_name: userName });
  if (!user) {
    response.status(400).json({ error: "Login Failed" });
  } else {
    request.session.user = user;
    response.json({ message: "Logged in successfully", user });
  }
});

//route to log out a user
app.post("/admin/logout", function (request, response) {
  // destory current session management in place
  request.session.destroy(function (err) {
    if (err) {
      response.status(400).json({ error: "Log Out Failed" });
      return;
    }
    response.clearCookie("connect.sid", { path: "/" });
    response.json({ message: "Logged out successfully" });
  });
});

function loggedInCheck(req, res, next) {
  //if the path is login or logout
  if (req.path === "/admin/login" || req.path === "/admin/logout") {
    next();
  }
  //check to see if we have a user session
  if (req.session.user) {
    next();
  } else {
    //if not throw a 401 error
    res.status(401).json({ error: "Unauthorized" });
  }
}

app.use(loggedInCheck);

app.post("/photos/new", loggedInCheck , function (request, response) {
  const user_id = request.session.user._id;
  if (user_id === "") {
    console.error("Error in /photos/new", user_id);
    response.status(400).send("user_id required");
    return;
  }
  processFormBody(request, response, function (err) {
    if (err || !request.file) {
      console.error("Error in /photos/new", err);
      response.status(400).send("photo required");
      return;
    }
    const timestamp = new Date().valueOf();
    const filename = 'U' +  String(timestamp) + request.file.originalname;
    fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
      if (err) {
        console.error("Error in /photos/new", err);
        response.status(400).send("error writing photo");
        return;
      }
      Photo.create(
          {
            _id: new mongoose.Types.ObjectId(),
            file_name: filename,
            date_time: new Date(),
            user_id: new mongoose.Types.ObjectId(user_id),
            comment: []
          })
          .then((returnValue) => {
            response.end();
          })
          .catch(err => {
            console.error("Error in /photos/new", err);
            response.status(500).send(JSON.stringify(err));
          });
        });
      });
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
