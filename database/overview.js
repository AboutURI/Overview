const mongoose = require('mongoose').set('debug', false);
mongoose.connect('mongodb://localhost/overview', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

let overviewSchema = new mongoose.Schema({
  'courseId': Number,
  'title': String, // this may actually be fetched from course content API instead -- TBD
  'tagline': String,
  'students': Number,
  'subjects': [String],
  'author': Number, // external ID
  'thumbnail': String,
  'language': String,
  'captions': [String]
});

let Overview = mongoose.model('Overview', overviewSchema);

let save = (records) => {
  records.forEach(record => {
    let entry = new Overview({
      courseId: record.courseId,
      title: record.title,
      tagline: record.tagline,
      students: record.students,
      subjects: record.subjects,
      author: record.author,
      thumbnail: record.thumbnail,
      language: record.language,
      captions: record.captions
    });
    Promise.resolve(entry.save())
      .then(doc => console.log('Saved', doc._doc.title))
      .catch(err => console.log(err));
  });
};

let get = (courseId, callback) => {
  Overview.find({courseId: courseId})
    .then(doc => callback(doc))
    .catch(err => console.log(err));
};

let post = (data, callback) => {
  Overview.find({})
    .sort({ courseId: -1 })
    .limit(1)
    .then(docs => {
        var courseId = docs[0].courseId+1;
        let entry = new Overview({
          courseId: courseId,
          title: data.title,
          tagline: data.tagline,
          students: data.students,
          subjects: data.subjects,
          author: data.author,
          thumbnail: data.thumbnail,
          language: data.language,
          captions: data.captions
        });
        Promise.resolve(entry.save())
          .then(doc => callback(doc))
          .catch(err => console.log(err));
      }
    );
};

let put = (courseId, data, callback) => {
  Overview.find({courseId: courseId})
    .then(docs => {
        if(docs.length == 0){
          post(data, callback);
        } else {
          Overview.findOneAndUpdate({courseId: courseId}, data, {new: true, useFindAndModify: false})
            .then(doc => callback(doc))
            .catch(err => console.log(err));
        }
      }
    );
};

let deleteOne = (courseId, callback) => {
  Overview.deleteOne({courseId: courseId}, (err, result) => {
    if(err) {
      console.log(err);
    } else {
      callback(result);
    }
  })
};


module.exports.save = save;
module.exports.get = get;
module.exports.post = post;
module.exports.put = put;
module.exports.delete = deleteOne;