import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import MovieItems from '../MovieItems'
import './index.css'

const searchConst = {
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const activeSearchRoute = true

class Search extends Component {
  state = {
    searchStatus: searchConst.initial,
    searchResultsList: [],
    searchValue: '',
  }

  componentDidMount() {
    this.getSearchResultsData()
  }

  getSearchResultsData = async searchValue => {
    this.setState({searchStatus: searchConst.in_progress})
    const jwtToken = Cookies.get('jwt_token')
    const searchApiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchValue}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(searchApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const convertedData = data.results.map(each => ({
        backdropPath: each.backdrop_path,
        posterPath: each.poster_path,
        title: each.title,
        id: each.id,
      }))
      this.setState({
        searchResultsList: convertedData,
        searchStatus: searchConst.success,
        searchValue,
      })
    } else {
      this.setState({searchStatus: searchConst.failure})
    }
  }

  renderSuccessView = () => {
    const {searchResultsList, searchValue} = this.state
    return searchResultsList.length > 0 && searchValue !== '' ? (
      <ul className="search-items">
        {searchResultsList.map(each => (
          <MovieItems eachMovie={each} key={each.id} />
        ))}
      </ul>
    ) : (
      this.renderNoResultsView()
    )
  }

  renderNoResultsView = () => {
    const {searchValue} = this.state
    return searchValue !== '' ? (
      <div className="no-results-view">
        <img
          src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660153718/movies%20prime%20app/No_Views_awtv8d.svg"
          alt="no movies"
          className="no-results-img"
        />
        <p className="no-results-text">
          Your search for {searchValue} did not find any matches.
        </p>
      </div>
    ) : (
      this.renderLoadingView()
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  tryAgainSearchData = () => {
    this.getSearchResultsData()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660153718/movies%20prime%20app/failure_img_vggqi4.svg"
        classAnName="failure-img"
        alt="failure view"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        className="try-again-button"
        type="button"
        onClick={this.tryAgainSearchData}
      >
        Try Again
      </button>
    </div>
  )

  renderViews = () => {
    const {searchStatus} = this.state
    switch (searchStatus) {
      case searchConst.in_progress:
        return this.renderLoadingView()
      case searchConst.success:
        return this.renderSuccessView()
      case searchConst.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header
          getSearchResultsData={this.getSearchResultsData}
          activeSearchRoute={activeSearchRoute}
        />
        <div className="search-container">{this.renderViews()}</div>
      </>
    )
  }
}
export default Search
