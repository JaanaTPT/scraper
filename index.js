const axios = require('axios');
const cheerio = require('cheerio');

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

async function download(url, filename){
  const writer = fs.createWriteStream(path.resolve(__dirname, filename));
  const response = await axios.get(url, {responseType: 'stream'});
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
  });
}

async function getOrCache(url){

  let md5 = crypto.createHash('md5');
  md5.update(url);
  let cacheName = `cache/${md5.digest('hex')}`;

  try {
      if (fs.existsSync(cacheName)) {
          console.log('cached request');
        return fs.readFileSync(cacheName, {encoding:'utf8', flag:'r'});
      } else {
          let response = await axios.get(url);
           fs.writeFileSync(cacheName, response.data);
          console.log('live request');
          return response.data;
      }
    } catch(err) {
      console.error(err)
    }
}

(async ()=> {
  for(let i = 896; i>886; i--){
      try {
          let data = await getOrCache(`http://gunshowcomic.com/${i}/`);
          const $ = cheerio.load(data);
          let src = $('.strip').attr('src');
          let title = $('.strip').attr('title')
          console.log(src, title);
          let parts = src.split('/');
          await download(src, 'images/'+parts[parts.length-1]);
      } catch (err) {
          console.log(err);
      }
  }
})();

// axios.get('http://gunshowcomic.com/').then((response) => {
//   const $ = cheerio.load(response.data);
//   console.log($('.strip').attr('src'));
  
// });