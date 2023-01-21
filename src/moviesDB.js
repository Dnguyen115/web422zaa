"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const movieSchema = new mongoose_1.default.Schema({
    plot: String,
    genres: [String],
    runtime: Number,
    cast: [String],
    num_mflix_comments: Number,
    posters: String,
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
        if (connectionString.length <= 0) {
            console.error("MoviesDB requires a valid connection string");
            return;
        }
        this.database = mongoose_1.default.createConnection(connectionString, {});
        this.movies = this.database.model("movies", movieSchema);
    }
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a;
                if (this.database)
                    resolve(this.database.readyState);
                else
                    reject(new Error("Database not connected"));
                (_a = this.database) === null || _a === void 0 ? void 0 : _a.once("error", (err) => {
                    reject(err);
                });
            });
        });
    }
    getAllMovies(page = 1, perPage = 20, title = "") {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let findBy = title.length > 0 ? { title } : {};
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
    updateMovieById(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.movies)
                    resolve(this.movies.updateOne({ _id: id }, { $set: data }).exec());
                else
                    reject(new Error("Model is invalid!"));
            });
        });
    }
    deleteMovieById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (this.movies)
                    resolve(this.movies.deleteOne({ _id: id }).exec());
                else
                    reject(new Error("Model is invalid!"));
            });
        });
    }
}
exports.default = MoviesDB;
