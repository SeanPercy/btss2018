import React from 'react';

export interface IAuthorListPropsInterface {
  allAuthors: Array<{ _id: string; fullName: string; age: number }>;
  subscribeToNewItems: () => void;
  subscribeToUpdatedItems: () => void;
}

export class AuthorList extends React.Component<IAuthorListPropsInterface, {}> {
  public constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.setState({ allAuthors: this.props.allAuthors });
    this.props.subscribeToNewItems();
    this.props.subscribeToUpdatedItems();
  }

  public render(): JSX.Element {
    return (
      <ol>
        {this.props.allAuthors.map(author => (
          <li key={author._id}>{author.fullName}</li>
        ))}
      </ol>
    );
  }
}
