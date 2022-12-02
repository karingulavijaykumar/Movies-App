import {Component} from 'react'
import {Link} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import {MdMenuOpen} from 'react-icons/md'
import {AiFillCloseCircle} from 'react-icons/ai'
import './index.css'

class Header extends Component {
  state = {activeFullMenu: false, searchValue: ''}

  activeFullMenuFun = () => {
    this.setState({activeFullMenu: true})
  }

  nonActiveFullMenu = () => {
    this.setState({activeFullMenu: false})
  }

  onChangeSearchInput = event => {
    this.setState({searchValue: event.target.value})
  }

  onSearch = () => {
    const {getSearchResultsData, activeSearchRoute} = this.props
    const {searchValue} = this.state
    if (searchValue !== '' && activeSearchRoute) {
      getSearchResultsData(searchValue)
    }
  }

  render() {
    const {searchValue, activeFullMenu} = this.state
    const {
      activeSearchRoute,
      activeHome,
      activePopular,
      activeAccount,
    } = this.props
    const searchContainer = activeSearchRoute
      ? 'search-input-route-container search-input-container'
      : 'search-input-container'
    const searchButton = activeSearchRoute
      ? 'search-route-button search-button'
      : 'search-button'
    const searchIcon = activeSearchRoute ? 'icons search-route-icon' : 'icons'
    const homeRoute = activeHome ? 'menu-items highlight' : 'menu-items'
    const popularRoute = activePopular ? 'menu-items highlight' : 'menu-items'
    const accountRoute = activeAccount ? 'menu-items highlight' : 'menu-items'
    return (
      <nav className="nav-bar header">
        <Link to="/" className="img-link">
          <img
            className="header-website"
            alt="website logo"
            src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660479354/Group_7399_nn7x3u.png"
          />
        </Link>
        <ul className="show-menu show1">
          <Link to="/">
            <li className={homeRoute}>Home</li>
          </Link>
          <Link to="/popular">
            <li className={popularRoute}>Popular</li>
          </Link>
        </ul>
        <div className="search-icon-container">
          <div className={searchContainer}>
            {activeSearchRoute && (
              <input
                type="search"
                placeholder="search"
                value={searchValue}
                onChange={this.onChangeSearchInput}
                className="search-input"
              />
            )}
            <Link to="/search">
              <HiOutlineSearch
                className={(searchIcon, searchButton)}
                onClick={this.onSearch}
                type="button"
                testid="searchButton"
              />
            </Link>
            <Link to="/account">
              <img
                src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660573232/Avatar_giy0y5.png"
                className="avatar show1"
                alt="profile"
              />
            </Link>
            <button
              type="button"
              className="show close-btn"
              onClick={this.activeFullMenuFun}
            >
              <MdMenuOpen className="hamburger icons" />
            </button>
          </div>
        </div>
        <nav className=" show">
          {activeFullMenu && (
            <ul className="show-menu">
              <Link to="/">
                <li className={homeRoute}>Home</li>
              </Link>
              <Link to="/popular">
                <li className={popularRoute}>Popular</li>
              </Link>
              <Link to="/account">
                <li className={accountRoute}>Account</li>
              </Link>
              <li>
                <button
                  type="button"
                  onClick={this.nonActiveFullMenu}
                  className="close-btn"
                >
                  <AiFillCloseCircle className="close icons" />
                </button>
              </li>
            </ul>
          )}
        </nav>
      </nav>
    )
  }
}
export default Header
