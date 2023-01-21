"use strict";
// ! If this file exists, it means I forgot to remove it.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const moviesDB_1 = __importDefault(require("./src/moviesDB"));
require("dotenv").config();
const app = (0, express_1.default)();
const HTTP_PORT = process.env.PORT || 8080;
const db = new moviesDB_1.default(process.env.MONGODB_CONN_STRING ? process.env.MONGODB_CONN_STRING : "");
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.json({ message: "API Listening" });
});
app.get("/api/status", (req, res) => {
    db.getStatus().then((sta) => {
        res.json({ status: sta });
    }, (err) => {
        res.json({ error: err });
    });
});
app.post("/api/movies", (req, res) => {
    db.getAllMovies().then((movies) => {
        res.json(movies);
    }, (err) => {
        res.json({ error: err.message });
    });
});
app.get("/api/movies/all/:page?/:perPage?/:title?", (req, res) => {
    console.log(req.params.page, req.params.perPage, req.params.title);
    let page = +parseInt(req.params.page ? req.params.page : "1");
    let perPage = +parseInt(req.params.perPage ? req.params.perPage : "20");
    let title = req.params.title ? req.params.title : "";
    console.log(page, perPage, title);
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
    db.updateMovieById(req.params, req.body.id).then((obj) => {
        res.json(obj);
    }, (err) => {
        res.json({ error: err.message });
    });
});
app.delete("/api/movies/:id", (req, res) => {
    db.deleteMovieById(req.body.id).then((obj) => {
        res.json(obj);
    }, (err) => {
        res.json({ error: err.message });
    });
});
app.use((req, res) => {
    res.status(404).send("Resource not found");
});
db.getStatus().then((statusCode) => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}\nserver status: ${statusCode}
			`);
    });
}, (err) => {
    console.log(`server status: ${err.message}`);
});
