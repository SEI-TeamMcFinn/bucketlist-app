import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import { Card, Accordion } from 'react-bootstrap'
import trash from './../../public/images/trash-outline.svg'
import edit from './../../public/images/create-outline.svg'
import complete from './../../public/images/checkbox-outline.svg'
import Clock from 'react-clock'
import messages from './../AutoDismissAlert/messages'

class BucketIndex extends Component {
  constructor () {
    super()
    // setting state to an empty array and not loaded
    this.state = {
      buckets: [],
      isLoaded: false,
      didDelete: false,
      didComplete: false
    }

    this.onCompleted = this.onCompleted.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  componentDidMount () {
    // making the API call
    axios.get(apiUrl + '/buckets', {
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`
      }
    })
    // taking the response and setting state to the response
      .then(response => {
        this.setState({
          isLoaded: true,
          buckets: response.data.buckets
        })
      })
      // catching any errors
      .catch(console.error)
  }

  onCompleted (event) {
    console.log(event.target.id)
    // Set buckets = the value of this.state.buckets (ALL BUCKETS)
    const buckets = this.state.buckets
    // Find the specific bucket that was clicked on
    const bucket = buckets.find(el => el._id === event.target.id)
    // Find the index within the buckets array of the bucket that was clicked on
    const bucketIndex = buckets.indexOf(bucket)
    // create a copy of the specific bucket so that we can use it to change state
    const itemCopy = Object.assign({}, bucket)
    // toggling the state of complteed within the copy
    itemCopy.completed = !bucket.completed
    // updating the state with our new copy
    axios({
      url: `${apiUrl}/buckets/${event.target.id}`,
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${this.props.user.token}` },
      data: {
        bucket: itemCopy
      }
    })
      // Use the index to set the bucket that was clicked on to our copy
      .then(this.setState(buckets[bucketIndex] = itemCopy))
      // .then(this.forceUpdate())
  }

  onDelete (event) {
    const { msgAlert } = this.props

    // Set buckets = the value of this.state.buckets (ALL BUCKETS)
    const buckets = this.state.buckets
    // Find the specific bucket that was clicked on
    const bucket = buckets.find(el => el._id === event.target.id)
    // Find the index within the buckets array of the bucket that was clicked on
    const bucketIndex = buckets.indexOf(bucket)
    // updating the state with our new copy
    axios({
      url: `${apiUrl}/buckets/${event.target.id}`,
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.props.user.token}` }
    })
      .then(() => {
        msgAlert({
          heading: 'Delete succesfull',
          message: messages.deleteSuccess,
          variant: 'success'
        })
      })
      // Use the index to set the bucket that was clicked on to our copy
      .then(this.setState(buckets.splice(bucketIndex, 1)))
      // .then(this.forceUpdate())
  }

  render () {
    let jsx
    // while the buckets are loading
    if (this.state.isLoaded === false) {
      jsx = (
        <div className="col-sm-10 col-md-8 mx-auto">
          <p>Loading...</p>
        </div>
      )
      // if there are no buckets
    } else if (this.state.buckets.length === 0) {
      jsx = (
        <div className="col-sm-10 col-md-8 mx-auto">
          <p>Your Bucket list is empty...  tic toc...</p>
          <Clock />
        </div>
      )
    // if you have buckets
    } else {
      jsx = (
        <div className="col-sm-10 col-md-8 mx-auto">
          {this.state.buckets.map(bucket => (
            <Accordion key={bucket._id} className="accordian-border-bottom">
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey={bucket._id}>
                  <span className={bucket.completed ? 'completed' : ''}>{bucket.title}</span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={bucket._id}>
                  <Card.Body>
                    <div>
                      <div className={bucket.completed ? 'completed' : ''}>{bucket.description}</div>
                      <div className='d-flex flex-row-reverse'>
                        <span className='actions pointer' onClick={this.onDelete}><img className='icons-delete' id={bucket._id} src={trash} alt='Delete Item' /></span>
                        <span className='actions'><Link to={`/buckets/edit/${bucket._id}`}><img className='icons-edit' src={edit} alt='Edit' /></Link></span>
                        <span className='actions pointer' onClick={this.onCompleted}><img className='icons-complete' id={bucket._id} src={complete} alt='Mark Complete' /></span>
                      </div>
                    </div>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          ))}
        </div>
      )
    }
    // returning the list with the jsx in it
    return (
      <div className="row">
        <div className="col-sm-10 col-md-8 mx-auto mt-5">
          <span>
            <h3>Buckets Page</h3>
          </span>
          <span className="d-flex flex-row-reverse">
            <Link to="/bucketCreate">Create New Item...</Link>
          </span>
        </div>
        {jsx}
      </div>
    )
  }
}
export default withRouter(BucketIndex)
