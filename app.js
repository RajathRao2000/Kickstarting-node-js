const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }

  if (req.url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      console.log(message);
      fs.writeFile("message.txt", message, (err) => {
        console.log(err, "error");
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
    // fs.writeFileSync("message.txt", "DUMMY");
    // res.writeHead(302, { Location: "/" });
    // return res.end();
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  if (req.url === "/home") {
    res.write("<body><h1>Welcome home</h1></body>");
  }
  if (req.url === "/about") {
    res.write("<body><h1>Welcome to About Us page</h1></body>");
  }
  if (req.url === "/node") {
    res.write("<body><h1>Welcome to Node Js project</h1></body>");
  }
  res.write("</html>");
  res.end();
});
server.listen(3000);
