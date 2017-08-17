var fs = require('fs');
var path = require('path');

const pathTags = 'tags';
const pathPosts = '_posts';

let tags = new Set();

fs.readdir(pathPosts, function(err, files) {
  files.forEach( (file) => {
    const fullPath = path.join(__dirname, pathPosts, file);
    const fileData = fs.readFileSync(fullPath, 'utf-8');
    const tagsList = processPost(fileData, fullPath);
    tagsList.forEach( (tag) => {
      tags.add(tag.trim());
    })
  })

  tags.forEach( (tag) => {
    const filePath = path.join(__dirname, pathTags, tag + '.md');
    if (!fs.existsSync(filePath)) {
      console.log(`Creating page for tag ${tag}`);
      const fileContent = '---\n' +
        'layout: page_tag\n' +
        `tag: ${tag}\n` +
        `permalink: /tags/${tag}/\n` +
        '---'
      fs.writeFile(filePath, fileContent, function(err) {
        if(err) console.log(err);
      });
    }
  })
})


function processPost(data, fullPath) {
  if (!data) {
    console.log(`Error processing file ${fullPath}`);
    console.log(err);
    return [];
  }
  const re = /tags: \[.*]/;
  const result = re.exec(data);
  if (!result) {
    console.log(`File ${fullPath} has no tag list`);
    return [];
  }
  const tags = result[0].replace('tags: ', '').slice(1, -1).split(',');
  return tags;
}
