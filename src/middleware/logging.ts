import morgan from "morgan";
var rfs = require("rotating-file-stream");
import { Request, Response } from "express";
const pad = (num: number) => (num > 9 ? "" : "0") + num;

const generator = (time: Date | null, index: number) => {
  if (!time) return "logs/access.log";
  var year = time.getFullYear();
  var month = pad(time.getMonth() + 1);
  var day = pad(time.getDate());
  var hour = pad(time.getHours());
  var minute = pad(time.getMinutes());

  return `logs/${year}-${month}/${year}-${month}-${day}-${hour}-${minute}-${index}-access.log`;
};

/** Rotate if 10 MegaByte or 1 day is over */
var accessLogStream = rfs.createStream(generator, {
  size: "10M",
  interval: "1d",
  compress: "gzip",
});

var middleware = morgan(
  function (tokens: any, req: Request, res: Response) {
    return [
      req.headers["x-real-ip"] || req.socket.remoteAddress,
      "-",
      new Date().toUTCString(),
      "-",
      tokens.method(req, res),
      "-",
      tokens.url(req, res),
      "-",
      tokens.status(req, res),
      "-",
      tokens.res(req, res, "content-length"),
      "bytes",
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  },
  {
    stream: accessLogStream,
  }
);

export default process.env.NODE_ENV === "production"
  ? middleware
  : morgan("dev");
