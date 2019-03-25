import React from 'react';
import { branch, renderComponent } from 'recompose';

const ErrorComponent = error => <div>{error.message}</div>;
export const renderForError = () =>
  branch(
    ({ error }) => error,
    renderComponent(({ error }) => ErrorComponent(error))
  );
