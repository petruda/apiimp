import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
// to take the url of the root
import { fileURLToPath } from "url";
// to make the full fath ( root + localpath)

//dosen't do anything, but it was supposed to
const __dirname = dirname(fileURLToPath(import.meta.url));
//what port the server uses
const app = express();
const port = 3000;
//to include static files
app.use(express.static("public"));
//to acces body element
app.use(bodyParser.urlencoded({ extended: true }));
//for defining ejs as viewing engine
app.set("view engine", "ejs");
// strats here empty arrays for items for the lists

app.get("/", (req, res) => {
    res.render("index.ejs", {    
      anime: "",
      character: "",
      quote: "",
      urlImage : "https://nekos.best/api/v2/hug/5721b0f4-a2ed-4de6-9ea3-763601c72fc9.gif", 
      isbnData : "https://covers.openlibrary.org/b/id/8538817-S.jpg",
    });
  });
app.post("/", async (req, res) => {
  try {
    const result = await axios.get("https://animechan.xyz/api/random");
    const resultImage = await axios.get("https://nekos.best/api/v2/hug?amount=1");
    var resultImg = resultImage.data.results[0].url;
    

    res.render("index.ejs", { 
      anime: result.data.anime,
      character: result.data.character,
      quote: result.data.quote,
      urlImage : resultImg,
      isbnData : "https://covers.openlibrary.org/b/id/8538817-S.jpg",
    });
    console.log(result);
    console.log(resultImg);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
app.post("/isbn", async (req, res) => {
  try {
    var isbn = req.body["isbnSearch"];
    const resultIsbn = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json`);
    var resultIsbnImg = resultIsbn.data;
    var finalResult = resultIsbnImg[`ISBN:${isbn}`].thumbnail_url;
    res.render("index.ejs", { 
      anime: "",
      character: "",
      quote: "",
      urlImage : "https://nekos.best/api/v2/hug/5721b0f4-a2ed-4de6-9ea3-763601c72fc9.gif", 
      isbnData: finalResult,
    });
    console.log(resultIsbnImg);
    console.log(finalResult);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

var _OLBookInfo = 
{
  'ISBN:9781780992266': {
    bib_key: 'ISBN:9781780992266',
    info_url: 'https://openlibrary.org/books/OL31595593M/Ghosts_of_My_Life',
    preview: 'noview',
    preview_url: 'https://openlibrary.org/books/OL31595593M/Ghosts_of_My_Life',
    thumbnail_url: 'https://covers.openlibrary.org/b/id/10526326-S.jpg'
  }
}


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
  