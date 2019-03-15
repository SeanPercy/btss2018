import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import path from "path";

import { clientConfig } from "../client-config";

const {
  test: { port },
  server: { host }
} = clientConfig;

const app = express();
const root = path.join(__dirname, "../dist");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(root));

app.get("/", (_, res) => {
  res.sendFile("index.html", { root });
});

app.listen(port, () => {
  process.stdout.write(
    `Production Build is getting served on http://${host}:${port}\n`
  );
});
