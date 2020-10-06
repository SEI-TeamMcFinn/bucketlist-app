import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import { Card, Accordion } from 'react-bootstrap'

class BucketIndex extends Component {
  constructor () {
    super()
    // setting state to an empty array and not loaded
    this.state = {
      buckets: [],
      isLoaded: false,
      didDelete: false
    }
  }

  componentDidMount () {
    // making the API call
    console.log('Token: ', this.props.user.token)
    axios.get(apiUrl + '/buckets', {
      headers: {
        'Authorization': `Bearer ${this.props.user.token}`
      }
    })
    // taking the response and setting state to the response
      .then(response => {
        // console.log(response)
        this.setState({
          isLoaded: true,
          buckets: response.data.buckets
        })
      })
      // catching any errors
      .catch(console.error)
  }

  render () {
    let jsx
    // while the buckets are loading
    if (this.state.isLoaded === false) {
      jsx = <p>Loading...</p>
      // if there are no buckets
    } else if (this.state.buckets.length === 0) {
      jsx = (
        <div>
          <p><Link to="/bucketCreate">Create a new item for your bucket list...</Link></p>
          <p>No buckets, please add one.</p>
        </div>
      )
    // if you have buckets
    } else {
      console.log(this.props.user.token)
      jsx = (
        <div className="accordian-border-bottom">
          {this.state.buckets.map(bucket => (
            <Accordion key={bucket._id}>
              <Card>
                <Accordion.Toggle as={Card.Header} variant="link" eventKey={bucket._id}>
                  {bucket.title}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={bucket._id}>
                  <Card.Body>
                    <div>
                      <div>{bucket.description}</div>
                      <div className='d-flex flex-row-reverse'>
                        <span className='actions'><Link to={`/buckets/edit/${bucket._id}`}>[Edit]</Link></span>
                        <span className='actions'><Link to='#'>[Mark Complete]&nbsp;</Link></span>
                        <span className='actions'><Link to={`/buckets/delete/${bucket._id}`}>[Delete]</Link></span>
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
      <div>
        <h2>Buckets Page</h2>
        {jsx}
      </div>
    )
  }
}
export default withRouter(BucketIndex)
