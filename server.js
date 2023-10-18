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
      anime: "Click the button first",
      character: "Click the button first",
      quote: "Click the button first",
      urlImage : "Click the button first", 
    });
  });
app.post("/", async (req, res) => {
  try {
    const result = await axios.get("https://animechan.xyz/api/random");
    const resultImage = await axios.get("https://nekos.best/api/v2/neko");

    res.render("index.ejs", { 
      anime: result.data.anime,
      character: result.data.character,
      quote: result.data.quote,
    });
    console.log(result)
  } catch (error) {
    res.status(404).send(error.message);
  }
});



app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
  