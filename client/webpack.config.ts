import webpackMerge from 'webpack-merge';

import { common } from './webpackConfig/common';
import { development } from './webpackConfig/development';
import { production } from './webpackConfig/production';

const mergeConfigs = mode => webpackMerge.smart(mode, common);

const buildConfig = () => {
  const mode = process.env.NODE_ENV;
  process.stdout.write(`Start build for NODE_ENV: ${mode}\n`);
  return mode === 'production'
    ? mergeConfigs(production)
    : mergeConfigs(development);
};

export default buildConfig;
