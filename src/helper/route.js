const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);


module.exports = async function(req,res,filePath){
  try {
    const stats = await stat(filePath);//所有的await要包裹在async内
    if (stats.isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      //速度慢，不建议使用
      // fs.readFile(filePath, (err, res)=>{
      //   res.end(res);
      // });
      fs.createReadStream(filePath).pipe(res);
    } else if (stats.isDirectory()) {
      const files = await readdir(filePath);//不加上await会返回promise，而不是正确的返回值
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(files.join(','));
    }
  } catch (ex) {
    console.log(ex);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${filePath} is not a directory or file`);
    return;
  }
}