import React from 'react'

const UserContext = React.createContext({
  userName: '',
  password: '',
  onNewPassword: () => {},
  onNewUsername: () => {},
})

export default UserContext
