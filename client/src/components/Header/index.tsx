import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'


const Header: React.FC<{}> = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav">
                <div className="navbar-brand">Client Stub</div>
                <Link to="/" className="nav-item nav-link">
                    Home
                </Link>
                <Link to="/authors" className="nav-item nav-link">
                    Authors
                </Link>
                <Link to="/books" className="nav-item nav-link">
                    Books
                </Link>
                <Link to="/staff" className="nav-item nav-link">
                    Staff
                </Link>
            </div>
        </div>
    </nav>
);

export default withRouter(Header)