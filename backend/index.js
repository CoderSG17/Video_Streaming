import express from "express"
import {createReadStream, statSync} from 'fs'
import { dirname } from "path"
import path from "path"
import fs from "fs"
import cors from 'cors'
import { fileURLToPath } from "url"
const app = express()
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename) 
// console.log(__dirname)


app.get('/', function(req, res){
  res.json({message: "Hello"})
})

app.get('/video', (req, res) => {
  // const file = `${__dirname}/public/simpletestvideo.mp4`
  const filepath = path.join(__dirname, 'public', 'simpletestvideo.mp4'); //put your video here 
  const stat = statSync(filepath);
  const fileSize = stat.size;

  const range = req.headers.range;

  if (!range) {
    res.status(400).send("Requires range bhai ");
    return;
  }

  const chunkSize = 10**6; // 1MB ho gya 
  const start = Number(range.replace(/\D/g, "")); // to remove all non-numeric characters from the string.
  const end = Math.min(start + chunkSize - 1, fileSize - 1);

  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4"
  };

  res.writeHead(206, headers);

  const fileStream = createReadStream(filepath, {
    start,
    end
  });
  fileStream.pipe(res); // attches one stream from another 
});



app.listen(8080, function(){
  console.log("Listening at port 8080 🔥")
})