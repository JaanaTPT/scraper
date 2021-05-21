const axios = require('axios');
const cheerio = require('cheerio');

axios.get('http://gunshowcomic.com/').then((response) => {
  const $ = cheerio.load(response.data);
  console.log($('.strip').attr('src'));
  
});