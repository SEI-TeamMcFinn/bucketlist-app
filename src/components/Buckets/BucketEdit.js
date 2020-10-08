import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import messages from './../AutoDismissAlert/messages'

class EditBucketItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bucketItem: {
        title: '',
        description: '',
        completed: ''
      },
      didEdit: false
    }
  }

  componentDidMount () {
    axios({
      url: `${apiUrl}/buckets/${this.props.match.params.id}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${this.props.user.token}` }
    })
      .then(res => this.setState({ bucketItem: res.data.bucket }))
      .catch(console.error)
  }

  handleChange = (event) => {
    // get the value that the user typed in
    const userInput = event.target.value
    // get the name the input field they are accessing
    const key = event.target.name
    // Make a copy of the State
    const itemCopy = Object.assign({}, this.state.bucketItem)
    // updating the key in state with the new value the user typed in
    itemCopy[key] = userInput
    // updating the state with our new copy
    this.setState({ bucketItem: itemCopy })
  }

  handleComplete = (event) => {
    const key = event.target.name
    // Make a copy of the State
    const itemCopy = Object.assign({}, this.state.bucketItem)
    // updating the key in state with the new value the user typed in
    itemCopy[key] = !this.state.bucketItem.completed
    // updating the state with our new copy
    this.setState({ bucketItem: itemCopy })
  }

  handleSubmit = (event) => {
    const { msgAlert } = this.props
    // preventing the default action of the SUBMIT
    event.preventDefault()
    const bucketItem = this.state.bucketItem
    axios({
      url: `${apiUrl}/buckets/${this.props.match.params.id}`,
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${this.props.user.token}` },
      data: {
        bucket: bucketItem
      }
    })
      // succesful return of data from the API call
      .then(res => this.setState({ didEdit: true }))
      .then(() => {
        msgAlert({
          heading: 'Edit succesfull',
          message: messages.success,
          variant: 'success'
        })
      })
      // .then(this.forceUpdate())
      .catch(() => {
        msgAlert({
          heading: 'Failed to Edit',
          message: messages.failure,
          variant: 'danger'
        })
      })
  }

  render () {
    if (this.state.didEdit) {
      return <Redirect to={'/buckets/'} />
    }

    const { title, description } = this.state.bucketItem

    return (
      <div className="row">
        <div className="col-sm-10 col-md-8 mx-auto mt-5">

          <h3>Edit Bucket List Item</h3>

          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Description</Form.Label>
              <Form.Control required type="text" name="title" value={title} placeholder="Title" onChange={this.handleChange} />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control required type="text" name="description" value={description} placeholder="Description" onChange={this.handleChange} />
            </Form.Group>

            <Button variant="outline-primary" block type="submit">Edit Bucket List Item</Button>

          </Form>

        </div>
      </div>
    )
  }
}

export default withRouter(EditBucketItem)
