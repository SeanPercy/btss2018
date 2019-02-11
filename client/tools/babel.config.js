"use strict";

module.exports = exports = (api) => {
	const isDevMode = api.env("development");
	
	const presets = [
		[
			"@babel/preset-env",
			{
				debug: isDevMode,
				modules: false,
				targets: {
					browsers: ["cover 99%"],
				},
			},
		],
		"@babel/preset-react",
		"@babel/typescript",
	];
	
	const plugins =  [
		"@babel/plugin-syntax-dynamic-import",
		"@babel/plugin-proposal-class-properties",
		"@babel/plugin-transform-runtime",
	];
	
	if (isDevMode) {
		plugins.push("react-hot-loader/babel");
	}
	
	return {
		plugins,
		presets,
	};
};
