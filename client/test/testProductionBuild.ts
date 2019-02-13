import bodyParser from 'body-parser';
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.TEST_PORT || 4004;
const root = path.join(__dirname, "../dist");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(root));

app.get("/", (_, res) => {
    res.sendFile("index.html", { root });
});

app.listen(port, () => {
    process.stdout.write(`Production Build is getting served on port ${port}\n`);
});

export default app;
