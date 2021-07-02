const faker = require('faker');
const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SDCPostgres',
  password: 'postgres',
  port: 5432,
})

tableQuery = 'CREATE TABLE overview(id integer NOT NULL, title text, tagline text, students integer, author integer, subjects text[], thumbnail text, language text, captions text[])'

const lang = [
  'Mandarin', 'Spanish', 'Hindustani', 'Bengali', 'Portuguese', 'Russian', 'Japanese', 'French', 'German', 'Tamil', 'Javanese', 'Italian', 'Romanian', 'Greek', 'Hipster'
];

const capitalize = function (string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
};

pool
  .query('DROP TABLE IF EXISTS overview')
  .then(res => {
    pool
      .query(tableQuery)
      .then(async res => {
        const data = [];
        let captions = [];
        let subjects = [];
        let startTime = new Date();
        let tempArr = [];
        for (let i = 1; i <= 10000000; i++) {
          captions = ['English'];
          subjects = [];
          for (let j = 1; j <= 5; j++) {
            let rand = Math.floor(Math.random() * lang.length);
            captions.push(lang[rand]);
          }
          for (let k = 1; k <= 3; k++) {
            subjects.push(capitalize(faker.random.word()).replace("'",""));
          }
          tempArr.push(`(${i},'${faker.company.catchPhrase()}','${capitalize(faker.hacker.ingverb()) + ' the ' + faker.hacker.adjective() + ' ' + faker.hacker.noun()}',${Math.floor((Math.random() * 90000)) + 10000},${Math.floor((Math.random() * 9999)) + 1},'{"${subjects.join('","')}"}','${faker.image.abstract()}','English','{"${captions.join('","')}"}')`)
          if(i%10000==0){
            let queryText = `INSERT INTO overview VALUES ${tempArr}`;
            try {
              const res = await pool.query(queryText)
            } catch (err) {
              console.log(err)
            }
            tempArr = []
          }
          // console.log(queryText)
        }
      })
  })
  .catch(err => {
    console.log(err);
  })
