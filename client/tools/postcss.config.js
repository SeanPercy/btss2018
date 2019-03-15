'use strict';

module.exports = exports = {
	plugins: [
		// Contains plugins for Sass-like features, like variables, nesting, and mixins.
		// https://github.com/jonathantneal/precss
		require('precss'),
		// Add vendor prefixes to CSS rules using values from caniuse.com
		// https://github.com/postcss/autoprefixer
		require('autoprefixer'),
	],
};
