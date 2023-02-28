const fs = require("fs");
const http = require("http");
const url = require("url");


const replaceTemplate= (temp, product) => {
  let output = temp.replace(/{%RECIPE_NAME%}/g, product.name);
  output = output.replace(/{%RECIPE_CUISINE%}/g, product.cuisine);
  output = output.replace(/{%RECIPE_ID%}/g, product.id);
  let items=product.items.map(el=>{return "<li>" + el + "</li>"}).join('');
  output = output.replace(/{%RECIPE_ITEMS%}/g, items);
  let steps=product.steps.map(el=>{return "<li>" + el + "</li>"}).join('');
  output = output.replace(/{%RECIPE_STEPS%}/g, steps);

return output}



const tempOverview = fs.readFileSync(
  `${__dirname}/template/temp-overview.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/template/temp-card.html`,
  "utf-8"
);

const tempRecipe = fs.readFileSync(
  `${__dirname}/template/temp-recipe.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/api/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%RECIPE_CARDS%}', cardsHtml);
    res.end(output);

    // Recipe page
  } else if (pathname === "/recipe") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const recipe = dataObj[query.id];
    const output = replaceTemplate(tempRecipe, recipe );
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
