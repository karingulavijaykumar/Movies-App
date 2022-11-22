import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Search extends Component {
  state = {searchText: '', searchMovies: []}

  onChangeName = event => {
    this.setState({searchText: event.target.value})
    this.getSearchMovies()
  }

  getSearchMovies = async () => {
    const {searchText} = this.state
    console.log(searchText)
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchText}`
    console.log(apiUrl)
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
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
        searchMovies: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderSearchMovies = () => {
    const {searchMovies, searchText} = this.state

    if (searchMovies.length === 0) {
      return (
        <div className="no-search-container">
          <img
            className="search-failure-image"
            alt="no movies"
            src="https://res.cloudinary.com/dr4h73xhp/image/upload/v1669138714/Group_gvbc9r.png"
          />
          <p className="no-search-details">
            Your search for {searchText} did not find any matches.
          </p>
        </div>
      )
    }
    return (
      <ul className="search-list-container">
        {searchMovies.map(eachMovie => (
          <li key={eachMovie.id}>
            <img
              src={eachMovie.posterPath}
              className="search-image"
              alt={eachMovie.title}
            />
          </li>
        ))}
      </ul>
    )
  }

  onClickTryAgain = () => {
    this.getSearchMovies()
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

  renderSearchAllMovies = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSearchMovies()
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
      <div className="search-movie-container">
        <Header />
        <input
          type="search"
          placeholder="text"
          className="search-input"
          onChange={this.onChangeName}
        />
        {this.renderSearchAllMovies()}
      </div>
    )
  }
}

export default Search
