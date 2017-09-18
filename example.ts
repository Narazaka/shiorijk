import * as ShioriJK from "./lib/shiorijk";
// const ShioriJK = require("./lib/shiorijk"); // also OK

// ---------- parse request ----------

// parse transaction
const requestParser = new ShioriJK.Shiori.Request.Parser();
const requestStr =
  "GET SHIORI/3.0\r\n" +
  "Charset: UTF-8\r\n" +
  "Sender: embryo\r\n" +
  "ID: OnBIFFComplete\r\n" +
  "Reference0: 2\r\n" +
  "Reference1: 1024\r\n" +
  "Reference2: mail.example.com\r\n" +
  "Reference3: 1\r\n" +
  "Reference4: Subject: foo\x01X-Mailer: sendmail\x02Subject: bar\x01X-Mailer: Sylpheed\r\n" +
  "Reference5: 512\x01512\r\n" +
  "Reference6: 123@example.com\x01456@example.com\r\n" +
  "\r\n";
const request = requestParser.parse(requestStr);
console.log(request.request_line.method === "GET"); // request line info
console.log(request.headers.get("ID") === "OnBIFFComplete"); // gets header value
console.log(request.headers.ID === "OnBIFFComplete"); // shortcut for common headers
console.log(request.headers.Reference(1) === "1024"); // shortcut for Reference*
console.log(request.headers.references().length === 7); // get all references
console.log(request.headers.get_separated("Reference6")[0] === "123@example.com"); // separated by \x01
console.log(request.headers.get_separated2("Reference4")[1][0] === "Subject: bar"); // separated by \x01 and \x02

// parse chunks like HTTP
let parseResult;
parseResult = requestParser.parse_chunk("GET SHIORI/3.0\r\nCharset: UTF-8\r\n");
console.log(parseResult.state === "continue");
parseResult = requestParser.parse_chunk("ID: version\r\n\r\n");
console.log(parseResult.state === "end");
console.log(parseResult.results.length === 1);
console.log(parseResult.results[0].headers.ID === "version");

// parse lines
parseResult = requestParser.parse_lines(["GET SHIORI/3.0", "Charset: UTF-8"]);
console.log(parseResult.state === "continue");
parseResult = requestParser.parse_lines(["ID: version", ""]);
console.log(parseResult.state === "end");
console.log(parseResult.results[0].headers.ID === "version");

// ---------- parse response ----------

const responseParser = new ShioriJK.Shiori.Response.Parser();
const responseStr =
  "SHIORI/3.0 200 OK\r\n" +
  "Sender: ikaga\r\n" +
  "Charset: UTF-8\r\n" +
  "Value: 8.2.8\r\n" +
  "\r\n";
const response = responseParser.parse(responseStr);
console.log(response.headers.Value === "8.2.8");

// also you can parse by chunks and lines

// ---------- build request ----------

const request2 = new ShioriJK.Message.Request({
  request_line: {method: "GET", version: "3.0"},
  headers: {
    Charset: "UTF-8",
    Sender: "embryo",
  },
});

// can set after initialize
request2.headers.set("ID", "version");

console.log(request2.toString() === "GET SHIORI/3.0\r\nCharset: UTF-8\r\nSender: embryo\r\nID: version\r\n\r\n");

// ---------- build response ----------

const response2 = new ShioriJK.Message.Response({
  status_line: {code: 200, version: "3.0"},
  headers: {
    Charset: "UTF-8",
    Sender: "ikaga",
    Value: "8.2.8",
  }
});

console.log(response2.toString() === "SHIORI/3.0 200 OK\r\nCharset: UTF-8\r\nSender: ikaga\r\nValue: 8.2.8\r\n\r\n");
