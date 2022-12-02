import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import MovieItems from '../MovieItems'
import './index.css'

const popularConst = {
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const activePopular = true

class Popular extends Component {
  state = {popularMoviesList: [], popularStatus: popularConst.initial}

  componentDidMount() {
    this.getPopularMoviesData()
  }

  getPopularMoviesData = async () => {
    this.setState({popularStatus: popularConst.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const popularMoviesApi = 'https://apis.ccbp.in/movies-app/popular-movies'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(popularMoviesApi, options)
    if (response.ok) {
      const data = await response.json()
      const convertedData = data.results.map(each => ({
        backdropPath: each.backdrop_path,
        posterPath: each.poster_path,
        id: each.id,
        title: each.title,
      }))
      this.setState({
        popularMoviesList: convertedData,
        popularStatus: popularConst.success,
      })
    } else {
      this.setState({popularStatus: popularConst.failure})
    }
  }

  tryAgainPopularData = () => {
    this.getPopularMoviesData()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660153718/movies%20prime%20app/failure_img_vggqi4.svg"
        alt="failure view"
        className="fail-img"
      />
      <p className="fail-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="try-agin-button"
        onClick={this.tryAgainPopularData}
      >
        Try Again
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {popularMoviesList} = this.state
    return (
      <>
        <Header isPopular={activePopular} />
        <ul className="list-items">
          {popularMoviesList.map(each => (
            <MovieItems eachMovie={each} key={each.id} />
          ))}
        </ul>
      </>
    )
  }

  renderViews = () => {
    const {popularStatus} = this.state
    switch (popularStatus) {
      case popularConst.in_progress:
        return this.renderLoadingView()
      case popularConst.success:
        return this.renderSuccessView()
      case popularConst.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        {this.renderViews()}
        <Footer />
      </>
    )
  }
}
export default Popular
