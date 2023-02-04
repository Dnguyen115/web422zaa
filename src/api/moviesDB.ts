// ! Optimized import from compiler

import e from "express";
import mongoose, { Schema, Model, model, connect } from "mongoose";

// ! Optimized import from compiler

const movieSchema = new Schema({
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

export default class MoviesDB {
	connStr: string = "";
	movies: mongoose.Model<any> | undefined;

	constructor(connectionString: string) {
		if (connectionString.length <= 0) {
			console.error("MoviesDB requires a valid connection string");
			return;
		}

		this.connStr = connectionString;
	}

	async initialize() {
		return new Promise((resolve, reject) => {
			const db = mongoose.createConnection(this.connStr, {});

			db.once("error", (err) => {
				reject(err);
			});

			db.once("open", () => {
				this.movies = db.model("movies", movieSchema);
				resolve(
					{
						message: "success"
					}
				);
			});
		});
	}

	async getAllMovies(page: number = 1, perPage: number = 20, title: string | null = "") {
		return new Promise<object>((resolve, reject) => {
			let findBy = {};

			if (title == null) findBy = {};
			else findBy = title.length > 0 ? { title: title } : {};

			if (this.movies) {
				if (+page && +perPage) {
					resolve(
						this.movies
							.find(findBy)
							.sort({ year: +1 })
							.skip((page - 1) * +perPage)
							.limit(+perPage)
							.exec()
					);
				}
				reject(new Error("page and perPage query parameters must be valid numbers"));
			}
			reject(new Error("Model is invalid!"));
		});
	}

	async addNewMovie(data: object) {
		return new Promise<object>((resolve, reject) => {
			if (this.movies) {
				const newMovie = new this.movies(data);
				newMovie.save();
				resolve({ new_id: newMovie.id });
			} else reject(new Error("Model is invalid!"));
		});
	}

	async getMovieById(id: string) {
		return new Promise<object>((resolve, reject) => {
			if (this.movies) resolve(this.movies.findOne({ _id: id }).exec());
			else reject(new Error("Model is invalid!"));
		});
	}

	async updateMovieById(id: string, data: object) {
		return new Promise<object>((resolve, reject) => {
			if (this.movies) resolve(this.movies.findByIdAndUpdate(id, data).exec());
			else reject(new Error("Model is invalid!"));
		});
	}

	async deleteMovieById(id: string) {
		return new Promise<object>((resolve, reject) => {
			console.log(id)
			if (this.movies) resolve(this.movies.deleteOne({ _id: id }).exec());
			else reject(new Error("Model is invalid!"));
		});
	}
}
