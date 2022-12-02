import {Link} from 'react-router-dom'
import './index.css'

const MovieItems = props => {
  const {eachMovie} = props
  const {posterPath, id, title} = eachMovie
  return (
    <Link to={`/movies/${id}`}>
      <li>
        <img className="popular-img" src={posterPath} alt={title} />
      </li>
    </Link>
  )
}
export default MovieItems
