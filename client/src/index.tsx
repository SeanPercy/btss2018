import * as React from 'react';
import * as ReactDOM from 'react-dom';

const title = 'Testing React Webpack Babel Setup';

ReactDOM.render(
	<div>{title}</div>,
	document.getElementById('app')
);

module.hot.accept();
