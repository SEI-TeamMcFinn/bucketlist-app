import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import axios from 'axios'
import apiUrl from './../../apiConfig'
import { Card, Accordion, Button, Row, Col } from 'react-bootstrap'
import trash from './../../public/images/trash-outline.svg'
import edit from './../../public/images/create-outline.svg'
import complete from './../../public/images/checkbox-outline.svg'

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
          <p>No buckets, please add one.</p>
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
                  <span className={bucket.completed ? 'completed' : ''}></span>{bucket.title}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={bucket._id}>
                  <Card.Body>
                    <div>
                      <div className={bucket.completed ? 'completed' : ''}>{bucket.description}</div>
                      <div className='d-flex flex-row-reverse'>
                        <span className='actions'><Link to={`/buckets/delete/${bucket._id}`}><img className='icons-delete' src={trash} alt='Delete' /></Link></span>
                        <span className='actions'><Link to={`/buckets/edit/${bucket._id}`}><img className='icons-edit' src={edit} alt='Edit' /></Link></span>
                        <span className='actions'><Link to={/buckets/}><img className='icons-complete' src={complete} alt='Mark Complete' /></Link></span>
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
        {/* <div className="col-sm-10 col-md-8 mx-auto mt-5"> */}
        {/* <Container> */}
        <Row className="col-sm-10 col-md-8 mx-auto mt-5">
          <Col>
            <h3>Buckets Page</h3>
          </Col>
          <Col className="d-flex flex-row-reverse">
            <Link to="/bucketCreate">
              <Button variant="primary" type="submit">Create New Item...</Button>
            </Link>
          </Col>
        </Row>
        {/* </Container> */}
        {/* </div> */}
        {jsx}
      </div>
    )
  }
}
export default withRouter(BucketIndex)
