import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie._id}`} className="group block">
      <div className="card hover:border-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
        {/* Poster */}
        <div className="relative overflow-hidden aspect-[2/3]">
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/300x450/12121A/E50914?text=${encodeURIComponent(movie.title)}`;
            }}
          />
          {/* Rating badge */}
          {movie.rating > 0 && (
            <div className="absolute top-2 right-2 bg-black/80 text-yellow-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
              ⭐ {movie.rating}
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white text-sm font-semibold">View Details →</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm leading-tight mb-2 line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
              {movie.genre}
            </span>
            <span className="text-xs text-gray-400">{movie.duration} min</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{movie.language}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
