import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import { Card, Accordion } from 'react-bootstrap'
import trash from './../../public/images/trash-outline.svg'
// import Clock from 'react-clock'
import messages from './../AutoDismissAlert/messages'

class BucketIndex extends Component {
  constructor () {
    super()
    // setting state to an empty array and not loaded
    this.state = {
      buckets: [],
      isLoaded: false
    }
  }

  componentDidMount () {
    const { msgAlert } = this.props
    // making the API call
    axios.get(apiUrl + '/buckets/public', {
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
      .catch(() => {
        msgAlert({
          heading: 'Failed to Retrieve Public Bucket List',
          message: messages.failure,
          variant: 'danger'
        })
      })
  }

  render () {
    let jsx = []
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
          <p>The Public Bucket list is empty.</p>
        </div>
      )
    // if you have buckets
    } else {
      const owners = []

      this.state.buckets.forEach((bucket) => {
        if (!owners.includes(bucket.owner._id)) {
          owners.push(bucket.owner._id)
        }
      })
      owners.map((owner, index) => {
        const filteredBuckets = this.state.buckets.filter((buckets) => buckets.owner._id === owner)
        jsx.push(
          <div key={index}>
            <Accordion className="accordian-border-bottom">
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey={index}>
                  <span className={filteredBuckets.completed ? 'completed' : ''}>{filteredBuckets[0].owner.firstName} {filteredBuckets[0].owner.lastName} -- Bucketlist</span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index}>
                  <Card.Body>
                    {filteredBuckets.map(bucket => (
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
                                </div>
                              </div>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                    ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        )
      })
    }
    // returning the list with the jsx in it
    return (
      <div className="row">
        <div className="col-sm-10 col-md-8 mx-auto mt-5">
          <span>
            <h3>Public BucketList Page</h3>
          </span>
        </div>
        <div className="col-sm-10 col-md-8 mx-auto">
          {jsx}
        </div>
      </div>
    )
  }
}

export default withRouter(BucketIndex)
