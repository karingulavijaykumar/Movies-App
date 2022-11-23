import Cookies from 'js-cookie'
import UserContext from '../../context/UserContext'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const Account = props => (
  <UserContext.Consumer>
    {value => {
      const {username, password} = value

      const onClickLogout = () => {
        const {history} = props
        Cookies.remove('jwt_token')
        history.replace('/login')
      }
      const starPassword = '*'.repeat(password.length)

      return (
        <>
          <div className="account-container">
            <Header />
            <div className="account-container-card">
              <h1 className="account-name">
                Account
                <hr className="separator" />
              </h1>
              <div className="account-card">
                <p className="account-heading">Member ship</p>
                <div>
                  <p className="account">{username}@gmail.com</p>
                  <p className="account">password: {starPassword}</p>
                </div>
              </div>
              <hr className="separator" />

              <div className="account-card">
                <p className="account-heading">Plan details</p>
                <div className="premium-card">
                  <p className="account">Premium</p>
                  <p className="account-ultra">Ultra HD</p>
                </div>
              </div>
              <hr className="separator" />

              <button
                type="button"
                className="logout-button"
                onClick={onClickLogout}
              >
                Logout
              </button>
            </div>
            <Footer />
          </div>
        </>
      )
    }}
  </UserContext.Consumer>
)
export default Account
