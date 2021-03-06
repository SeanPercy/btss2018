// tslint:disable:no-console
import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';

import { AUTH_TOKEN } from 'helpers';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($credentials: UserLoginInput!) {
    login(credentials: $credentials) {
      token
    }
  }
`;

export class Login extends React.Component<
  { history: any },
  { password: string; email: string }
> {
  public constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  public render() {
    const { email, password } = this.state;
    return (
      <div>
        <div>Login in order to proceed</div>
        <div>
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Email address"
          />
          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Password"
          />
        </div>
        <div>
          <Mutation
            mutation={LOGIN_MUTATION}
            variables={{ credentials: { email, password } }}
            onCompleted={data => this.confirm(data)}
          >
            {(login, { client }) => (
              <div
                className="btn btn-outline-success"
                onClick={() => {
                  login().then(() =>
                    client
                      .resetStore()
                      .then(() => console.log('Reset Store on Login'))
                  );
                }}
              >
                Login
              </div>
            )}
          </Mutation>
        </div>
      </div>
    );
  }

  private confirm = async data => {
    const { token } = data.login;
    this.saveUserData(token);
    this.props.history.push(`/authors`);
  };

  private saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };
}

export default Login;
