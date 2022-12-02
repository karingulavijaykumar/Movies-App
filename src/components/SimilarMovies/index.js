import './index.css'

const SimilarMovies = props => {
  const {eachMovie} = props
  const {posterPath, title} = eachMovie
  return <img src={posterPath} alt={title} className="similar-img" />
}
export default SimilarMovies
