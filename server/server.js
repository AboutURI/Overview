const db = require('../database/overview.js');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();

app.use(cors());
app.use(express.static(__dirname + '/../public'));

const jsonParser = bodyParser.json()

app.get('/overview?:courseId', function(req, res) {
  let courseId = req.query.courseId;
  db.get(courseId, function(rec) {
    if (rec[0] === undefined) {
      res.status(404).send([]);
    } else {
      res.send({
        "courseId": rec[0].courseId,
        "title": rec[0].title,
        "tagline": rec[0].tagline,
        "students": rec[0].students,
        "subjects": rec[0].subjects,
        "author": rec[0].author,
        "language": rec[0].language,
        "captions": rec[0].captions
      });
    }
  });
});

app.post('/overview?', jsonParser, function(req, res) {
  db.post(req.body, function(rec) {
    res.send({
      "courseId": rec.courseId,
      "title": rec.title,
      "tagline": rec.tagline,
      "students": rec.students,
      "subjects": rec.subjects,
      "author": rec.author,
      "language": rec.language,
      "captions": rec.captions
    });
  });
});

app.put('/overview?:courseId', jsonParser, function(req, res) {
  let courseId = req.query.courseId;
  if(!courseId){
    db.post(req.body, function(rec) {
      res.send({
        "courseId": rec.courseId,
        "title": rec.title,
        "tagline": rec.tagline,
        "students": rec.students,
        "subjects": rec.subjects,
        "author": rec.author,
        "language": rec.language,
        "captions": rec.captions
      });
    });
  } else {
    db.put(courseId, req.body, function(rec) {
      res.send({
        "courseId": rec.courseId,
        "title": rec.title,
        "tagline": rec.tagline,
        "students": rec.students,
        "subjects": rec.subjects,
        "author": rec.author,
        "language": rec.language,
        "captions": rec.captions
      });
    });
  }
});

app.delete('/overview?:courseId', function(req, res) {
  let courseId = req.query.courseId;
  db.delete(courseId, function(rec) {
    if (rec.deletedCount === 0) {
      res.status(404).send(`Error deleting id: ${courseId}`);
    } else {
      res.send({ deleted: courseId});
    }
  });
});

module.exports = app;
