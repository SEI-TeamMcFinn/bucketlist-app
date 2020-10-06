import { Component } from 'react'
import axios from 'axios'
import messages from './../AutoDismissAlert/messages'
import { withRouter } from 'react-router-dom'
import apiUrl from './../../apiConfig'

class DeleteItem extends Component {
  componentDidMount () {
    console.log(this.props.params)
    const { msgAlert, history } = this.props

    axios({
      url: `${apiUrl}/buckets/${this.props.match.params.id}`,
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.props.user.token}` }
    })
      .then(res => this.setState({ didDelete: true }))
      .then(() => {
        msgAlert({
          heading: 'Delete succesfull',
          message: messages.deleteSuccess,
          variant: 'success'
        })
      })
      .finally(() => history.push('/buckets'))
  }

  render () {
    return ''
  }
}
export default withRouter(DeleteItem)
