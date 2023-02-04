"use strict";
// ! Optimized import from compiler
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// ! Optimized import from compiler
const movieSchema = new mongoose_1.Schema({
    plot: String,
    genres: [String],
    runtime: Number,
    cast: [String],
    num_mflix_comments: Number,
    poster: String,
    title: String,
    fullplot: String,
    languages: [String],
    released: Date,
    directors: [String],
    rated: String,
    awards: {
        wins: Number,
        nominations: Number,
        text: String,
    },
    lastupdated: Date,
    year: Number,
    imdb: {
        rating: Number,
        votes: Number,
        id: Number,
    },
    countries: [String],
    type: String,
    tomatoes: {
        viewer: {
            rating: Number,
            numReviews: Number,
            meter: Number,
        },
        dvd: Date,
        lastUpdated: Date,
    },
});
class MoviesDB {
    constructor(connectionString) {
        this.connStr = "";
        if (connectionString.length <= 0) {
            console.error("MoviesDB requires a valid connection string");
            return;
        }
        this.connStr = connectionString;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const db = mongoose_1.default.createConnection(this.connStr, {});
                db.once("error", (err) => {
                    reject(err);
                });
                db.once("open", () => {
                    this.movies = db.model("movies", movieSchema);
                    resolve({
                        message: "success"
                    });
                });
            });
        });
    }
    getAllMovies(page = 1, perPage = 20, title = "") {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let findBy = {};
                if (title == null)
                    findBy = {};
                else
                    findBy = title.length > 0 ? { title: title } : {};
                if (this.movies) {
                    if (+page && +perPage) {
                        resolve(this.movies
                            .find(findBy)
                            .sort({ year: +1 })
                            .skip((page - 1) * +perPage)
                            .limit(+perPage)
                            .exec());
                    }
                    reject(new Error("page and perPage query parameters must be valid numbers"));
                }
                reject(new Error("Model is invalid!"));
            });
        });
    }
    addNewMovie(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.movies) {
                    const newMovie = new this.movies(data);
                    newMovie.save();
                    resolve({ new_id: newMovie.id });
                }
                else
                    reject(new Error("Model is invalid!"));
            });
        });
    }
    getMovieById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.movies)
                    resolve(this.movies.findOne({ _id: id }).exec());
                else
                    reject(new Error("Model is invalid!"));
            });
        });
    }
    updateMovieById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.movies)
                    resolve(this.movies.findByIdAndUpdate(id, data).exec());
                else
                    reject(new Error("Model is invalid!"));
            });
        });
    }
    deleteMovieById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                console.log(id);
                if (this.movies)
                    resolve(this.movies.deleteOne({ _id: id }).exec());
                else
                    reject(new Error("Model is invalid!"));
            });
        });
    }
}
exports.default = MoviesDB;
