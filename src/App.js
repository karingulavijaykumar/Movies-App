import {Switch, Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './components/LoginPage'
import Home from './components/Home'
import MovieDetails from './components/MovieDetails'
import Popular from './components/Popular'
import Profile from './components/Profile'
import Search from './components/Search'
import NotFound from './components/NotFound'
import './App.css'

const App = () => (
  <div className="bg-container">
    <Switch>
      <Route exact path="/login" component={LoginPage} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/popular" component={Popular} />
      <ProtectedRoute exact path="/search" component={Search} />
      <ProtectedRoute exact path="/account" component={Profile} />
      <ProtectedRoute exact path="/movies/:id" component={MovieDetails} />
      <Route component={NotFound} />
    </Switch>
  </div>
)

export default App
