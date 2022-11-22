import './index.css'

const SimilarMoviesItem = props => {
  const {similarMovieItemsDetails} = props
  const {backdropPath, title} = similarMovieItemsDetails

  return (
    <li className="similar-movie-item-card">
      <img alt={title} className="similar-movie-image" src={backdropPath} />
    </li>
  )
}

export default SimilarMoviesItem
