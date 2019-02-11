"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var body_parser_1 = require("body-parser");
var cors_1 = require("cors");
var dotenv = require("dotenv");
// @ts-ignore
var express_1 = require("express");
var path = require("path");
dotenv.config();
var app = express_1.default();
var port = process.env.TEST_PORT || 4000;
var root = path.join(__dirname, "../dist");
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cors_1.default());
app.use(express_1.default.static(root));
app.set("port", port);
app.get("/", function (_, res) {
    res.sendFile("index.html", { root: root });
});
app.listen(port, function () {
    process.stdout.write("Production Build is getting served on port " + port + "\n");
});
exports.default = app;
