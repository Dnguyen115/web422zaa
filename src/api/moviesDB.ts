// ! Optimized import from compiler

import e from "express";
import mongoose, { Schema, Model, model, connect } from "mongoose";

// ! Optimized import from compiler

interface IMovie {
	plot: string;
	genres: string[];
	runtime: number;
	cast: string[];
	num_mflix_comments: number;
	posters: string;
	title: string;
	fullplot: string;
	languages: string[];
	released: Date;
	directors: string[];
	rated: string;
	awards: {
		wins: number;
		nominations: number;
		text: string;
	};
	lastupdated: Date;
	year: number;
	imdb: {
		rating: number;
		votes: number;
		id: number;
	};
	countries: string[];
	type: string;
	tomatoes: {
		viewer: {
			rating: number;
			numReviews: number;
			meter: number;
		};
		dvd: Date;
		lastUpdated: Date;
	};
}

const movieSchema = new mongoose.Schema<IMovie>({
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

export default class MoviesDB {
	database: mongoose.Connection | undefined;
	movies: mongoose.Model<IMovie> | undefined;

	constructor(connectionString: string) {
		if (connectionString.length <= 0) {
			console.error("MoviesDB requires a valid connection string");
			return;
		}

		this.database = mongoose.createConnection(connectionString, {});
		this.movies = this.database.model<IMovie>("movies", movieSchema);
	}

	async getStatus() {
		return new Promise<number>((resolve, reject) => {
			if (this.database) resolve(this.database.readyState);
			else reject(new Error("Database not connected"));

			this.database?.once("error", (err: any) => {
				reject(err);
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

	async updateMovieById(data: object, id: string) {
		return new Promise<object>((resolve, reject) => {
			if (this.movies) resolve(this.movies.updateOne({ _id: id }, { $set: data }).exec());
			else reject(new Error("Model is invalid!"));
		});
	}

	async deleteMovieById(id: string) {
		return new Promise<object>((resolve, reject) => {
			if (this.movies) resolve(this.movies.findByIdAndDelete(id).exec());
			else reject(new Error("Model is invalid!"));
		});
	}
}
