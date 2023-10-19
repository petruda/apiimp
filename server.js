// to use express for app dev
import express from "express";
// to use axios for req data from api's
import axios from "axios";
import bodyParser from "body-parser";
import { dirname } from "path";
// to take the url of the root
//to tap into the body elements of the DOM
import { fileURLToPath } from "url";
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

// to handle te first req to load the main page
app.get("/", (req, res) => {
    res.render("index.ejs", {    
    
    // left empty or with standard image so they are defined
      anime: "",
      character: "",
      quote: "",
      urlImage : "https://nekos.best/api/v2/hug/5721b0f4-a2ed-4de6-9ea3-763601c72fc9.gif", 
      isbnData : "https://covers.openlibrary.org/b/id/8538817-S.jpg",
    });
  });
//to hande the post request for generating an anime gif + quote
app.post("/", async (req, res) => {
  // Using axios to get from one API a quoate and from the other one an gif
  try {
    const result = await axios.get("https://animechan.xyz/api/random");
    const resultImage = await axios.get("https://nekos.best/api/v2/hug?amount=1");
    //api response is an array of objects and we need to tap in the first objects url
    var resultImg = resultImage.data.results[0].url;
    
// render the anime,charachter,quote and gif in the webpage
    res.render("index.ejs", { 
      anime: result.data.anime,
      character: result.data.character,
      quote: result.data.quote,
      urlImage : resultImg,
      isbnData : "https://covers.openlibrary.org/b/id/8538817-S.jpg",
    });
    //for testing the respong
    console.log(result);
    console.log(resultImg);
  } catch (error) { // to handle errors
    res.status(404).send(error.message);
  }
});
// to handle isbn search req
app.post("/isbn", async (req, res) => {
  try {
    //storing the isbn in a var for easier reuse
    var isbn = req.body["isbnSearch"];
    //getting the response from the Open Library api in a JSON format
    const resultIsbn = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json`);
    // to store initial response because otherwise throws error "ISBN:" is not defined
    //since response is an object in an object
    var resultIsbnImg = resultIsbn.data;
    //to tap into the isbn object and take just the URL for the cover of the book (very bad quality img)
    var finalResult = resultIsbnImg[`ISBN:${isbn}`].thumbnail_url;
    //to render just the isbn response rest stays empty/standard
    res.render("index.ejs", { 
      anime: "",
      character: "",
      quote: "",
      urlImage : "https://nekos.best/api/v2/hug/5721b0f4-a2ed-4de6-9ea3-763601c72fc9.gif", 
      isbnData: finalResult,
    });
    // testing respnse
    console.log(resultIsbnImg);
    console.log(finalResult);
  } catch (error) { // error handling
    res.status(404).send(error.message);
  }
});
// to log the port we are using
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
  