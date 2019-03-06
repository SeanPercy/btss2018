import React from 'react';
import { withApollo } from "react-apollo";
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

;

class Header extends React.PureComponent<{history:any}> {
    public render() {
        const authToken = localStorage.getItem('auth-token');

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav">
                        <div className="navbar-brand">Client Stub</div>
                        <Link to="/" className="nav-item nav-link">
                            Home
                        </Link>
                        { authToken && (
                            <Link to="/authors" className="nav-item nav-link">
                                Authors
                            </Link>
                        )}
                        { authToken && (
                            <Link to="/books" className="nav-item nav-link">
                                Books
                            </Link>
                        )}
                        { authToken && (
                            <Link to="/staff" className="nav-item nav-link">
                                Staff
                            </Link>
                        )}
                        {authToken ? (
                            <button className="btn btn-outline-success" type="button" onClick={() => {
                                    localStorage.removeItem('auth-token');
                                    this.props.client.clearStore()
                                        .then(() => this.props.history.push(`/`))
                                }}
                            >
                                LOGOUT
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-outline-success">
                                LOGIN
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        )
    }
}

export default withApollo(withRouter(Header))

/*
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
*/
