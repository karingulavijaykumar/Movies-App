import './index.css'

const SimilarMoviesItem = props => {
  const {similarMovieItemsDetails} = props
  const {posterPath, title} = similarMovieItemsDetails

  return (
    <li className="similar-movie-item-card">
      <img alt={title} className="similar-movie-image" src={posterPath} />
    </li>
  )
}

export default SimilarMoviesItem
