import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Popular extends Component {
  state = {popularMovieList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getPopularMoviesList()
  }

  getPopularMoviesList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const apiUrl = 'https://apis.ccbp.in/movies-app/popular-movies'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    // console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()
      // console.log(fetchedData)
      const updatedData = fetchedData.results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
        id: eachMovie.id,
        overview: eachMovie.overview,
      }))
      this.setState({
        popularMovieList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickTryAgain = () => {
    this.getPopularMoviesList()
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderPopularMoviesList = () => {
    const {popularMovieList} = this.state

    return (
      <>
        <Header />
        <ul className="popular-list-container">
          {popularMovieList.map(eachMovie => (
            <Link
              to={`/movies/${eachMovie.id}`}
              className="popular-list-card"
              key={eachMovie.id}
            >
              <img
                alt={eachMovie.title}
                className="popular-image"
                src={eachMovie.posterPath}
              />
            </Link>
          ))}
        </ul>
        <Footer />
      </>
    )
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

  renderPopularMovies = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPopularMoviesList()
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
      <div className="popular-movie-container">
        {this.renderPopularMovies()}
      </div>
    )
  }
}

export default Popular
