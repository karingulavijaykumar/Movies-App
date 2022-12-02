import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'

import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import HomeMovieItem from '../HomeMovieItem'

import './index.css'

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
  ],
}

const renderOriginalMoviesConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}
const activeHome = true

const renderTrendingMoviesConst = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    originalMoviesStatus: renderOriginalMoviesConst.initial,
    trendingMoviesStatus: renderTrendingMoviesConst.initial,
    originalMoviesList: [],
    trendingMoviesList: [],
    randomMovie: [],
  }

  componentDidMount() {
    this.getOriginalsMoviesData()
    this.getTrendingMoviesData()
  }

  getOriginalsMoviesData = async () => {
    this.setState({originalMoviesStatus: renderOriginalMoviesConst.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const originalsDataApi = 'https://apis.ccbp.in/movies-app/originals'
    const response = await fetch(originalsDataApi, options)
    if (response.ok) {
      const data = await response.json()
      const convertedOriginalsData = data.results.map(each => ({
        backdropPath: each.backdrop_path,
        id: each.id,
        overview: each.overview,
        posterPath: each.poster_path,
        title: each.title,
      }))
      const randomNumber = Math.floor(
        Math.random() * convertedOriginalsData.length,
      )
      const randomMovie = convertedOriginalsData[randomNumber]
      this.setState({
        originalMoviesList: convertedOriginalsData,
        originalMoviesStatus: renderOriginalMoviesConst.success,
        randomMovie,
      })
    } else {
      this.setState({originalMoviesStatus: renderOriginalMoviesConst.failure})
    }
  }

  retryOriginalMoviesData = () => {
    this.getOriginalsMoviesData()
  }

  getTrendingMoviesData = async () => {
    this.setState({trendingMoviesStatus: renderTrendingMoviesConst.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const trendingDataApi = 'https://apis.ccbp.in/movies-app/trending-movies'
    const response = await fetch(trendingDataApi, options)
    if (response.ok) {
      const data = await response.json()
      const convertedTrendingData = data.results.map(each => ({
        backdropPath: each.backdrop_path,
        id: each.id,
        overview: each.overview,
        posterPath: each.poster_path,
        title: each.title,
      }))
      this.setState({
        trendingMoviesList: convertedTrendingData,
        trendingMoviesStatus: renderTrendingMoviesConst.success,
      })
    } else {
      this.setState({trendingMoviesStatus: renderTrendingMoviesConst.failure})
    }
  }

  retryTrendingMoviesData = () => {
    this.getTrendingMoviesData()
  }

  renderPosterSuccessView = () => {
    const {randomMovie} = this.state
    const {title, overview, backdropPath} = randomMovie
    return (
      <>
        <Header activeHome={activeHome} />
        <div
          style={{backgroundImage: `url(${backdropPath})`}}
          className="home-page"
        >
          <div className="home-movie-page">
            <h1 className="title">{title}</h1>
            <h1 className="over-view">{overview}</h1>
            <button type="button" className="play-btn">
              Play
            </button>
          </div>
        </div>
      </>
    )
  }

  renderOriginalsSuccessView = () => {
    const {originalMoviesList} = this.state
    return (
      <div className="movies-list-page">
        <Slider className="slick" {...settings}>
          {originalMoviesList.map(each => (
            <HomeMovieItem eachMovie={each} key={each.id} />
          ))}
        </Slider>
      </div>
    )
  }

  renderTrendingSuccessView = () => {
    const {trendingMoviesList} = this.state
    return (
      <>
        <div className="movies-list-page">
          <Slider className="slick" {...settings}>
            {trendingMoviesList.map(each => (
              <HomeMovieItem eachMovie={each} key={each.id} />
            ))}
          </Slider>
        </div>
      </>
    )
  }

  renderPosterFailureView = () => (
    <>
      <Header activeHome={activeHome} />
      <div className="failure-page-container">
        <div className="failure-page-card-1">
          <img
            className="warning-icon"
            alt="failure view"
            src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660451047/movies%20prime%20app/alert-triangle_najaul.png"
          />
          <p className="poster-failure-msg">
            Something went wrong. Please try again
          </p>
          <button
            className="poster-try-again-btn"
            type="button"
            onClick={this.getOriginalsMoviesData}
          >
            Try Again
          </button>
        </div>
      </div>
    </>
  )

  renderOriginalsFailureView = () => (
    <div className="failure-page-container">
      <div className="failure-page-card-2">
        <img
          className="warning-icon"
          alt="failure view"
          src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660451047/movies%20prime%20app/alert-triangle_najaul.png"
        />
        <p className="poster-failure-msg">
          Something went wrong. Please try again
        </p>
        <button
          className="poster-try-again-btn"
          type="button"
          onClick={this.getOriginalsMoviesData}
        >
          Try Again
        </button>
      </div>
    </div>
  )

  renderTrendingFailureView = () => (
    <div className="failure-page-container failure-page-card-2">
      <img
        className="warning-icon"
        alt="failure view"
        src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660451047/movies%20prime%20app/alert-triangle_najaul.png"
      />
      <p className="poster-failure-msg">
        Something went wrong. Please try again
      </p>
      <button
        className="poster-try-again-btn"
        type="button"
        onClick={this.getTrendingMoviesData}
      >
        Try Again
      </button>
    </div>
  )

  renderPosterLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderOriginalsLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderOriginalViews = () => {
    const {originalMoviesStatus} = this.state
    switch (originalMoviesStatus) {
      case renderOriginalMoviesConst.in_progress:
        return this.renderOriginalsLoadingView()
      case renderOriginalMoviesConst.success:
        return this.renderOriginalsSuccessView()
      case renderOriginalMoviesConst.failure:
        return this.renderOriginalsFailureView()
      default:
        return null
    }
  }

  renderTrendingViews = () => {
    const {trendingMoviesStatus} = this.state
    switch (trendingMoviesStatus) {
      case renderTrendingMoviesConst.in_progress:
        return this.renderOriginalsLoadingView()
      case renderTrendingMoviesConst.success:
        return this.renderTrendingSuccessView()
      case renderTrendingMoviesConst.failure:
        return this.renderTrendingFailureView()
      default:
        return null
    }
  }

  renderPosterViews = () => {
    const {originalMoviesStatus} = this.state
    switch (originalMoviesStatus) {
      case renderOriginalMoviesConst.in_progress:
        return this.renderPosterLoadingView()
      case renderOriginalMoviesConst.success:
        return this.renderPosterSuccessView()
      case renderOriginalMoviesConst.failure:
        return this.renderPosterFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        {this.renderPosterViews()}
        <h1 className="trending">Trending Now</h1>
        {this.renderTrendingViews()}
        <h1 className="originals">Originals</h1>
        {this.renderOriginalViews()}
        <Footer />
      </>
    )
  }
}
export default Home
