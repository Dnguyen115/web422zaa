"use strict";
/*********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Nguyen Duy Student ID: 126048214 Date: 3rd Feb 2023
 *  Cyclic Link: https://healthy-plum-trench-coat.cyclic.app/
 *
 ********************************************************************************/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ! Optimized import from compiler
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const moviesDB_1 = __importDefault(require("./src/api/moviesDB"));
// ! Optimized import from compiler
require("dotenv").config();
const app = (0, express_1.default)();
const HTTP_PORT = process.env.PORT || 8080;
const db = new moviesDB_1.default(process.env.MONGODB_CONN_STRING ? process.env.MONGODB_CONN_STRING : "");
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.json({ message: "API Listening" });
});
app.get("/api/movies", (req, res) => {
    let page = req.query.page ? Number(req.query.page) : 1;
    let perPage = req.query.perPage ? Number(req.query.perPage) : 10;
    let title = req.query.title ? String(req.query.title) : null;
    db.getAllMovies(page, perPage, title).then((movies) => {
        res.json(movies);
    }, (err) => {
        res.json({ error: err.message });
    });
});
app.get("/api/movies/:id", (req, res) => {
    db.getMovieById(req.params.id).then((movies) => {
        res.json(movies);
    }, (err) => {
        res.json({ error: err.message });
    });
});
app.put("/api/movies/:id", (req, res) => {
    db.updateMovieById(req.params.id, req.body).then((obj) => {
        res.json(obj);
    }, (err) => {
        res.json({ error: err.message });
    });
});
app.delete("/api/movies/:id", (req, res) => {
    db.deleteMovieById(req.params.id).then((obj) => {
        res.json(obj);
    }, (err) => {
        res.json({ error: err.message });
    });
});
app.use((req, res) => {
    res.status(404).send("Resource not found");
});
db.initialize().then((msg) => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}
			`);
    });
}, (err) => {
    console.log(`server status: ${err.message}`);
});
