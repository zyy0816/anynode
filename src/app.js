const http = require('http');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const conf = require('./config/defaultConfig');

const server = http.createServer((req,res)=>{

  const filePath = path.join(conf.root,req.url);
  fs.stat(filePath,(err,stats)=>{
    if(err){
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`${filePath} is not a directory or file`);
      return;
    }
    if(stats.isFile()){
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      //速度慢，不建议使用
      // fs.readFile(filePath, (err, res)=>{
      //   res.end(res);
      // });
      fs.createReadStream(filePath).pipe(res);
    }else if(stats.isDirectory()){
      fs.readdir(filePath,(err,files)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(files.join(','));
      });
    }
  });



  // res.statusCode = 200;
  // res.setHeader('Content-Type','text/plain');
  // res.end('hello world!');
  // eslint-disable-next-line no-console
  console.log(req.url, filePath);


  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/html');
  // res.write('<html>');
  // res.write('<body>');
  // res.write('Hello Http!');
  // res.write('</body>');
  // res.end('</html>');

});

server.listen(conf.port,conf.hostname,()=>{
  const addr = `http://${conf.hostname}:${conf.port}`;
  // eslint-disable-next-line no-console
  console.info(`server start at ${chalk.green(addr)}`);
});


