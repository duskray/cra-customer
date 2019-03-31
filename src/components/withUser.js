import React, { Component } from 'react'
import api from '../api'

export default function withUser(WrappedComponent) {
  return class extends Component {
    
    state = {
      user: sessionStorage.getItem('user') && sessionStorage.getItem('user') !== 'undefined' 
      ? JSON.parse(sessionStorage.getItem('user')) : {},
    }

    componentDidMount = () => {
      this.getUser()
    }

    getUser = async () => {
      const user  = await api.getUser()
      sessionStorage.setItem('user', JSON.stringify(user))
      this.setState({
        user,
      })
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} updateUser={this.getUser}/>;
    }
  }
}