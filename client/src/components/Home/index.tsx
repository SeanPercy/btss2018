// tslint:disable:no-console
import React from 'react';
import { hot } from 'react-hot-loader';

export interface IHomeStateInterface {
  counter: number;
  subView: JSX.Element | null;
}

type HomeState = Readonly<IHomeStateInterface>;

class Index extends React.Component<{}, HomeState> {
  public readonly state: HomeState = {
    counter: 0,
    subView: null
  };

  public render() {
    return (
      <>
        Counter: {this.state.counter}
        <br />
        <button
          type="button"
          className="btn btn-primary"
          onClick={this.incrementCounter}
        >
          add
        </button>
        <br />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={this.addSubView}
        >
          add sub view
        </button>
        {this.state.subView}
      </>
    );
  }

  private incrementCounter = (): void => {
    this.setState({ counter: this.state.counter + 1 });
  };
  // , webpackPrefetch: true
  private addSubView = (): void => {
    import(/* webpackChunkName: "SubView" */ '../SubView/index')
      .then(module => {
        const Component = module.default;
        this.setState({
          subView: <Component counter={this.state.counter} />
        });
      })
      .catch(error => console.error(error));
  };
}

export default hot(module)(Index);
