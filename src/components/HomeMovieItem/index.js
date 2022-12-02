import {Link} from 'react-router-dom'
import './index.css'

const HomeMovieItem = props => {
  const {eachMovie} = props
  const {title, posterPath, id} = eachMovie
  return (
    <Link to={`/movies/${id}`}>
      <img src={posterPath} className="img" alt={title} />
    </Link>
  )
}
export default HomeMovieItem
