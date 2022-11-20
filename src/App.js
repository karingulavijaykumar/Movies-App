import {Route, Switch} from 'react-router-dom'
import Popular from './components/Popular'
import Login from './components/Login'
import Home from './components/Home'
import './App.css'

const App = () => (
  <>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/" component={Home} />
      <Route exact path="/popular" component={Popular} />
    </Switch>
  </>
)

export default App
