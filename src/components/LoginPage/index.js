import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginPage extends Component {
  state = {username: '', password: '', errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onClickLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  submitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  submitFailure = errorMsg => {
    this.setState({errorMsg})
  }

  render() {
    const {username, password, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660479354/Group_7399_nn7x3u.png"
          alt="login website logo"
          className="login-logo"
        />
        <div className="form-container">
          <h1 className="login-heading">Login</h1>
          <form className="login-form" onSubmit={this.onClickLogin}>
            <label className="login-label" htmlFor="usernameInput">
              USERNAME
            </label>
            <input
              value={username}
              onChange={this.onChangeUsername}
              id="usernameInput"
              type="text"
              className="input-username"
              placeholder="username"
            />
            <label className="login-label" htmlFor="passwordInput">
              PASSWORD
            </label>
            <input
              type="password"
              id="passwordInput"
              value={password}
              placeholder="password"
              onChange={this.onChangePassword}
              className="input-password"
            />
            {errorMsg.length > 0 && <p className="err-msg">{errorMsg}</p>}
            <button type="submit" className="login-button">
              LOGIN
            </button>
          </form>
        </div>
        <h1 className="water-mark">Developed by Vijaykumar Karingula</h1>
      </div>
    )
  }
}

export default LoginPage
