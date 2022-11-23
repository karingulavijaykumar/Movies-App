import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import UserContext from './context/UserContext'
import ProtectedRoute from './components/ProtectedRoute'
import Popular from './components/Popular'
import Login from './components/Login'
import Home from './components/Home'
import Account from './components/Account'
import Search from './components/Search'
import MovieItemDetails from './components/MovieItemDetails'
import NotFound from './components/NotFound'
import './App.css'

class App extends Component {
  state = {username: '', password: ''}

  onNewPassword = event => {
    this.setState({password: event.target.value})
  }

  onNewUsername = event => {
    this.setState({username: event.target.value})
  }

  render() {
    const {username, password} = this.state
    return (
      <UserContext.Provider
        value={{
          username,
          password,
          onNewUsername: this.onNewUsername,
          onNewPassword: this.onNewPassword,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/popular" component={Popular} />
          <ProtectedRoute exact path="/account" component={Account} />
          <ProtectedRoute exact path="/search" component={Search} />
          <ProtectedRoute
            exact
            path="/movies/:id"
            component={MovieItemDetails}
          />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </UserContext.Provider>
    )
  }
}
export default App
