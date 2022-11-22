import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {minutesToHours, getYear, getDate, getMonth} from 'date-fns'
import Header from '../Header'
import SimilarMoviesItem from '../SimilarMoviesItem'
import Footer from '../Footer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MovieItemDetails extends Component {
  state = {
    movieItemData: {},
    similarMovieItems: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMovieItem()
  }

  getFormattedData = data => ({
    adult: data.adult,
    backdropPath: data.backdrop_path,
    posterPath: data.poster_path,
    releaseDate: data.release_date,
    genres: data.genres,
    runtime: data.runtime,
    overview: data.overview,
    id: data.id,
    budget: data.budget,
    similarMovies: data.similar_movies,
    spokenLanguages: data.spoken_languages,
    title: data.title,
    voteAverage: data.vote_average,
    voteCount: data.vote_count,
  })

  getMovieItem = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/movies-app/movies/${id}`
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    //  console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = this.getFormattedData(fetchedData.movie_details)
      console.log(updatedData)
      const updatedSimilarProductsData = updatedData.similarMovies.map(
        eachSimilarMovie => ({
          backdropPath: eachSimilarMovie.backdrop_path,
          posterPath: eachSimilarMovie.poster_path,
          title: eachSimilarMovie.title,
          id: eachSimilarMovie.id,
          overview: eachSimilarMovie.overview,
        }),
      )
      this.setState({
        movieItemData: updatedData,
        similarMovieItems: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderMovieItemDetails = () => {
    const {movieItemData, similarMovieItems} = this.state
    const {
      //      posterPath,
      runtime,
      adult,
      title,
      releaseDate,
      overview,
      genres,
      voteAverage,
      voteCount,
      spokenLanguages,
      budget,
    } = movieItemData
    // console.log(runtime)
    const timeInHours = minutesToHours(runtime)
    const minutes = runtime - timeInHours * 60
    // console.log(timeInHours)
    // console.log(minutes)
    const year = getYear(new Date(releaseDate))
    // console.log(year)
    const date = getDate(new Date(releaseDate))
    const month = getMonth(new Date(releaseDate))
    // console.log(date)
    // console.log(month)
    const censorRating = adult ? 'A' : 'U/A'

    return (
      <>
        <div className="movie-item-details-image-card">
          <h1 className="movie-item-heading">{title}</h1>
          <div className="movie-item-list-container">
            <p className="movie-item-list">
              {timeInHours}h {minutes}m
            </p>
            <p className="movie-item-censor"> {censorRating}</p>
            <p className="movie-item-list">{year}</p>
          </div>
          <p className="overview">{overview}</p>
          <button type="button" className="play-button">
            Play
          </button>
        </div>
        <div className="movie-item-list-card">
          <div className="list-container">
            <h1 className="movie-item-list-heading">Genres</h1>
            {genres.map(eachGenre => (
              <p className="movie-item-list-details" key={eachGenre.id}>
                {eachGenre.name}
              </p>
            ))}
          </div>
          <div className="list-container">
            <h1 className="movie-item-list-heading">Audio Available</h1>
            {spokenLanguages.map(eachLanguage => (
              <p className="movie-item-list-details" key={eachLanguage.id}>
                {eachLanguage.english_name}
              </p>
            ))}
          </div>
          <div className="list-container">
            <h1 className="movie-item-list-heading">Rating Count</h1>
            <p className="movie-item-list-details">{voteCount}</p>
            <h1 className="movie-item-list-heading">Rating Average</h1>
            <p className="movie-item-list-details">{voteAverage}</p>
          </div>

          <div className="list-container">
            <h1 className="movie-item-list-heading">Budget</h1>
            <p className="movie-item-list-details">{budget}</p>
            <h1 className="movie-item-list-heading">Release Date</h1>
            <p className="movie-item-list-details">
              {date}th {month} {year}
            </p>
          </div>
        </div>
        <h1 className="more-like-this-heading">More like this</h1>
        <ul className="similar-movie-item-container">
          {similarMovieItems.map(eachSimilarMovie => (
            <SimilarMoviesItem
              similarMovieItemsDetails={eachSimilarMovie}
              key={eachSimilarMovie.id}
            />
          ))}
        </ul>
      </>
    )
  }

  onClickTryAgain = () => {
    this.getMovieItem()
  }

  renderFailureView = () => (
    <>
      <Header />
      <div className="failure-card">
        <img
          alt="failure view"
          className="failure-image"
          src="https://res.cloudinary.com/dr4h73xhp/image/upload/v1669130054/Background-Complete_qlcqgf.png"
        />
        <p className="failure-details">
          Something went wrong. Please try again
        </p>
        <button
          type="button"
          className="try-again-button"
          onClick={this.onClickTryAgain}
        >
          Try Again
        </button>
      </div>
    </>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderMovieDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMovieItemDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="movie-item-details-container">
          {this.renderMovieDetails()}
        </div>
        <Footer />
      </>
    )
  }
}

export default MovieItemDetails
