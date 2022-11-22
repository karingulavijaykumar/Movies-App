import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import TrendingNowMovies from '../TrendingNowMovies'
import OriginalsMovies from '../OriginalsMovies'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    trendingMovies: [],
    originalsMovies: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrendingNowMovies()
    this.getOriginals()
  }

  getTrendingNowMovies = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
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
      //  console.log(fetchedData)
      const updatedData = fetchedData.results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
        id: eachMovie.id,
        overview: eachMovie.overview,
      }))
      this.setState({
        trendingMovies: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getOriginals = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const apiUrl = 'https://apis.ccbp.in/movies-app/originals'
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
        originalsMovies: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderMoviesListView = () => {
    const {trendingMovies, originalsMovies} = this.state

    return (
      <>
        <div className="home-image-card">
          <div className="home-heading-card">
            <h1 className="super-man-name">Super Man</h1>
            <p className="home-details">
              Superman is a fictional superhero who first appeared in American
              comic books published by DC Comics.
            </p>
            <button type="button" className="play-button">
              Play
            </button>
          </div>
        </div>
        <h1 className="trending-movie-name">Trending Now</h1>
        <TrendingNowMovies trendingMovies={trendingMovies} />
        <h1 className="originals-name">Originals</h1>
        <OriginalsMovies originalsMovies={originalsMovies} />
      </>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  onClickTryAgain = () => {
    this.getTrendingNowMovies()
    this.getOriginals()
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

  renderAllTrendingMovies = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMoviesListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {trendingMovies, originalsMovies} = this.state
    console.log(trendingMovies)
    console.log(originalsMovies)
    //   const {backdropPath, overview, id, title} = originalsMovies

    return (
      <div className="home-container">
        <Header />
        {this.renderAllTrendingMovies()}
        <Footer />
      </div>
    )
  }
}

export default Home
