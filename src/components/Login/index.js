import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import UserContext from '../../context/UserContext'

import './index.css'

class Login extends Component {
  state = {showSubmitError: false, errorMsg: ''}

  render() {
    return (
      <UserContext.Consumer>
        {value => {
          const {username, password, onNewPassword, onNewUsername} = value

          const onChangePassword = event => {
            onNewPassword(event)
          }

          const onChangeUsername = event => {
            onNewUsername(event)
          }

          const onSubmitFailure = errorMsg => {
            this.setState({showSubmitError: true, errorMsg})
          }

          const onSubmitSuccess = jwtToken => {
            const {history} = this.props

            Cookies.set('jwt_token', jwtToken, {
              expires: 30,
            })
            history.replace('/')
          }

          const submitForm = async event => {
            event.preventDefault()

            const userDetails = {username, password}
            const url = 'https://apis.ccbp.in/login'
            const options = {
              method: 'POST',
              body: JSON.stringify(userDetails),
            }
            const response = await fetch(url, options)
            const data = await response.json()
            // const message = data.error_msg
            console.log(response)
            if (response.ok === true) {
              onSubmitSuccess(data.jwt_token)
            } else {
              onSubmitFailure(data.error_msg)
            }
          }

          const renderUsernameField = () => (
            <>
              <label className="label-input" htmlFor="username">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                className="user-input"
                value={username}
                onChange={onChangeUsername}
                placeholder="Username"
              />
            </>
          )

          const renderPasswordField = () => (
            <>
              <label className="label-input" htmlFor="password">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                className="user-input"
                value={password}
                onChange={onChangePassword}
                placeholder="Password"
              />
            </>
          )

          const {showSubmitError, errorMsg} = this.state

          const jwtToken = Cookies.get('jwt_token')

          if (jwtToken !== undefined) {
            return <Redirect to="/" />
          }
          return (
            <div className="login-container">
              <img
                alt="login website logo"
                className="movie-image"
                src="https://res.cloudinary.com/dr4h73xhp/image/upload/v1668663235/Group_7399_kernfa.png"
              />
              <form className="form-container" onSubmit={submitForm}>
                <h1 className="login-name">Login</h1>
                <div className="input-label-card">{renderUsernameField()}</div>
                <div className="input-label-card">{renderPasswordField()}</div>
                {showSubmitError && <p className="error-message">{errorMsg}</p>}
                <button type="submit" className="login-button">
                  Login
                </button>
              </form>
            </div>
          )
        }}
      </UserContext.Consumer>
    )
  }
}
export default Login
