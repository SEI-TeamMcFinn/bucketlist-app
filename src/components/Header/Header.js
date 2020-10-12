import React, { Fragment } from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import bucket from './../../public/images/bucket.png'

const authenticatedOptions = (
  <Fragment>
    <Nav.Link href="#buckets">Home</Nav.Link>
    <Nav.Link href="#change-password">Change Password</Nav.Link>
    <Nav.Link href="#sign-out">Sign Out</Nav.Link>
  </Fragment>
)

const unauthenticatedOptions = (
  <Fragment>
    <Nav.Link href="#sign-up">Sign Up</Nav.Link>
    <Nav.Link href="#sign-in">Sign In</Nav.Link>
  </Fragment>
)

const linked = (
  <span className="navbar-text mr-2"><Link to="/buckets/public"><img src={bucket} width="10%" height="10%" /></Link>&nbsp;List</span>
)

const notLinked = (
  <span className="navbar-text mr-2"><img src={bucket} width="10%" height="10%" />&nbsp;List</span>
)

// const alwaysOptions = (
//   <Fragment>
//   </Fragment>
// )

const Header = ({ user }) => (
  <Navbar bg="primary" variant="dark" expand="md">
    <Navbar.Brand>
      {user ? linked : notLinked}
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        { user && <span className="navbar-text mr-2">Welcome, {user.firstName}</span>}
        {/* { alwaysOptions } */}
        { user ? authenticatedOptions : unauthenticatedOptions }
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default Header
