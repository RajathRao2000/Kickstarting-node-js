const fs = require("fs");
const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    fs.readFile("message.txt", (err, data) => {
      if (err) {
        console.log("error", err);
        return;
      }
      console.log("data", data.toString());
      data = decodeURIComponent(data.toString());
      res.write("<html>");
      res.write("<head><title>Enter Message</title></head>");
      res.write(
        `<body><p>${data}</p><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>`
      );
      res.write("</html>");
      return res.end();
    });
  }
  if (url == "/message" && method == "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        if (err) console.log("write-file", err);
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
};

/**
 * 3 ways to export
 */
// module.exports = { handler: requestHandler, someText: "some hardcoded text" };

// module.exports.handler = requestHandler;
// module.exports.someText = "Some hard code text";

exports.handler = requestHandler;
exports.someText = "Some hard code text";
