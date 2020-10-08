import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import messages from './../AutoDismissAlert/messages'

class CreateBucketItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bucketItem: {
        title: '',
        description: ''
      },
      createdBucketItemId: null
    }
  }

  // handleChange = event => this.setState({
  //   [event.target.name]: event.target.value
  // })

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

  handleSubmit = (event) => {
    const { msgAlert } = this.props
    // preventing the default action of the SUBMIT
    event.preventDefault()
    const bucketItem = this.state.bucketItem
    axios({
      url: `${apiUrl}/buckets`,
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.props.user.token}` },
      data: {
        bucket: bucketItem
      }
    })
      // succesful return of data from the API call
      .then(res => this.setState({ createdBucketItemId: res.data.bucket._id }))
      .then(() => {
        msgAlert({
          heading: 'Create succesfull',
          message: messages.createSuccess,
          variant: 'success'
        })
      })
      .catch(() => {
        msgAlert({
          heading: 'Create Failed',
          message: messages.failure,
          variant: 'danger'
        })
      })
  }

  render () {
    if (this.state.createdBucketItemId) {
      return <Redirect to={'/buckets/'} />
    }

    const { title, description } = this.state

    return (
      <div className="row">
        <div className="col-sm-10 col-md-8 mx-auto mt-5">

          <h3>Create Bucket List Item</h3>

          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Description</Form.Label>
              <Form.Control required type="text" name="title" value={title} placeholder="Title" onChange={this.handleChange} />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control required type="text" name="description" value={description} placeholder="Description" onChange={this.handleChange} />
            </Form.Group>
            <Button variant="outline-primary" block type="submit">Create Bucket List Item</Button>

          </Form>

        </div>
      </div>
    )
  }
}

export default CreateBucketItem
