import React from 'react';
import { branch, renderComponent } from 'recompose';

const LoadingComponent = () => <div>... LOADING ...</div>;
export const renderWhileLoading = () =>
  branch(({ loading }) => loading, renderComponent(LoadingComponent));
