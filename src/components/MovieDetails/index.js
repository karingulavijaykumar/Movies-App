import {Component} from 'react'
import Cookies from 'js-cookie'
import {format} from 'date-fns'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import SimilarMovies from '../SimilarMovies'
import './index.css'

const movieDetailsStatusConst = {
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class MovieDetails extends Component {
  state = {
    movieDetailsList: [],
    movieDetailsStatus: movieDetailsStatusConst.initial,
  }

  componentDidMount() {
    this.getMovieDetailsData()
  }

  getMovieDetailsData = async () => {
    this.setState({movieDetailsStatus: movieDetailsStatusConst.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const movieDetailsApi = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(movieDetailsApi, options)
    if (response.ok) {
      const data = await response.json()
      const convertedGenreList = data.movie_details.genres.map(each => ({
        id: each.id,
        name: each.name,
      }))
      const convertedSimilarMovies = data.movie_details.similar_movies.map(
        each => ({
          backdropPath: each.backdrop_path,
          id: each.id,
          posterPath: each.poster_path,
          title: each.title,
        }),
      )
      const convertedSpokenLanguages = data.movie_details.spoken_languages.map(
        each => ({
          id: each.id,
          englishName: each.english_name,
        }),
      )
      const convertedData = {
        adult: data.movie_details.adult,
        backdropPath: data.movie_details.backdrop_path,
        budget: data.movie_details.budget,
        id: data.movie_details.id,
        overview: data.movie_details.overview,
        posterPath: data.movie_details.poster_path,
        releaseDate: data.movie_details.release_date,
        runtime: data.movie_details.runtime,
        title: data.movie_details.title,
        voteAverage: data.movie_details.vote_average,
        voteCount: data.movie_details.vote_count,
        genres: convertedGenreList,
        similarMovies: convertedSimilarMovies,
        spokenLanguages: convertedSpokenLanguages,
      }
      this.setState({
        movieDetailsList: convertedData,
        movieDetailsStatus: movieDetailsStatusConst.success,
      })
    } else {
      this.setState({movieDetailsStatus: movieDetailsStatusConst.failure})
    }
  }

  tryAgainMoviesData = () => {
    this.getMovieDetailsData()
  }

  renderLoadingView = () => (
    <>
      <Header />
      <div className="loader-container" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    </>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="failure-page">
        <img
          src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660153718/movies%20prime%20app/failure_img_vggqi4.svg"
          className="failure-img"
          alt="failure view"
        />
        <p className="fail-text">Something went wrong. Please try again</p>
        <button
          type="button"
          onClick={this.tryAgainMoviesData}
          className="retry-btn"
        >
          Try Again
        </button>
      </div>
    </>
  )

  renderSuccessView = () => {
    const {movieDetailsList} = this.state
    const {
      adult,
      backdropPath,
      budget,
      genres,
      overview,
      releaseDate,
      runtime,
      similarMovies,
      spokenLanguages,
      title,
      voteAverage,
      voteCount,
    } = movieDetailsList
    const inHours = Math.floor(runtime / 60)
    const inMinutes = runtime % 60
    const movieTime = `${inHours}h${inMinutes}m`
    const certificateName = adult ? 'A' : 'U/A'
    const releaseYear = format(new Date(releaseDate), 'yyyy')
    const releasedDateFormat = format(new Date(releaseDate), 'do MMMM yyyy')

    return (
      <>
        <Header />
        <div
          className="movie-details-container"
          style={{
            backgroundImage: `url(${backdropPath})`,
          }}
        >
          <div className="movie-details-card">
            <h1 className="title">{title}</h1>
            <div className="more-details">
              <p className="text">{movieTime}</p>
              <p className="text">{certificateName}</p>
              <p className="text">{releaseYear}</p>
            </div>
            <p className="text">{overview}</p>
            <button type="button" className="play-btn">
              Play
            </button>
          </div>
        </div>
        <div className="additional-information">
          <div className="movie-info">
            <div className="info">
              <h1 className="info-heading">Genres</h1>
              <Genres genres={genres} key={genres.id} />
            </div>
            <div className="info">
              <h1 className="info-heading">Audio Available</h1>
              <AvailableLanguages spokenLanguages={spokenLanguages} />
            </div>
            <div className="info">
              <h1 className="info-heading">Rating Count</h1>
              <p className="info-items">{voteCount}</p>

              <h1 className="info-heading">Rating Averages</h1>
              <p className="info-items">{voteAverage}</p>
            </div>
            <div className="info">
              <h1 className="info-heading">Budget</h1>
              <p className="info-items">{budget}</p>
              <h1 className="info-heading">Release Date</h1>
              <p className="info-items">{releasedDateFormat}</p>
            </div>
          </div>
          <div className="similar-movies-container">
            <h1 className="more">More like this</h1>
            <ul className="similar-movies-list">
              {similarMovies.map(each => (
                <SimilarMovies eachMovie={each} key={each.id} />
              ))}
            </ul>
          </div>
          <Footer />
        </div>
      </>
    )
  }

  renderViews = () => {
    const {movieDetailsStatus} = this.state
    switch (movieDetailsStatus) {
      case movieDetailsStatusConst.in_progress:
        return this.renderLoadingView()
      case movieDetailsStatusConst.success:
        return this.renderSuccessView()
      case movieDetailsStatusConst.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return <div className="bg-container">{this.renderViews()}</div>
  }
}

const Genres = props => {
  const {genres} = props
  return (
    <ul className="items">
      {genres.map(each => (
        <li>
          <p>{each.name}</p>
        </li>
      ))}
    </ul>
  )
}

const AvailableLanguages = props => {
  const {spokenLanguages} = props
  return (
    <ul>
      {spokenLanguages.map(each => (
        <li className="items">
          <p>{each.englishName}</p>
        </li>
      ))}
    </ul>
  )
}
export default MovieDetails
