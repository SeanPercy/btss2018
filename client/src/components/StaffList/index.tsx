import React from 'react';

export interface IStaffListPropsInterface {
  allStaff: Array<{ _id: string; fullName: string; age: number }>;
  subscribeToNewItems: () => void;
}

export class StaffList extends React.Component<IStaffListPropsInterface, {}> {
  public componentDidMount() {
    this.props.subscribeToNewItems();
  }

  public render(): JSX.Element {
    return (
      <ol>
        {this.props.allStaff.map(staff => (
          <li key={staff._id}>{staff.fullName}</li>
        ))}
      </ol>
    );
  }
}
