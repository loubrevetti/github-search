const path = require("path");
const AntdScssThemePlugin = require('antd-scss-theme-plugin');

module.exports = function override(config, env) {
  console.log('applying antd scss override')
  config = addPlugin(
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    config
  );
  config = rewireLess.options({
    javascriptEnabled: true
  })(config, env);
  config.plugins.push(new AntdScssThemePlugin('./src/theme.scss'));
  // override the less loader to use the ones from AntdScssThemePlugin
  themify(config, '.less', 'less-loader');
  return config;
};

// override a loader with the one from AntdScssThemePlugin
function themify(config, ext, loaderName) {
  const rule = getLoader(
    config.module.rules,
    rule => rule.test && rule.test.test(ext)
  );

  const loader =
    rule && rule.use && rule.use.find(item => item.loader === loaderName);

  if (loader) {
    Object.assign(loader, AntdScssThemePlugin.themify(loader));
  }
}

function addLessLoader(lessLoaderOptions = {}) {
  return function(config, env) {
    const lessExtension = /.less$/;

    const fileLoader = getLoader(
      config.module.rules,
      rule => loaderNameMatches(rule, 'file-loader')
    );
    fileLoader.exclude.push(lessExtension);

    const cssRules = getLoader(
      config.module.rules,
      rule => String(rule.test) === String(/\.css$/)
    );

    let lessRules;
    if (env === "production") {
      const lessLoader = cssRules.loader || cssRules.use

      lessRules = {
        test: lessExtension,
        loader: [
          // TODO: originally this part is wrapper in extract-text-webpack-plugin
          //       which we cannot do, so some things like relative publicPath
          //       will not work.
          //       https://github.com/timarney/react-app-rewired/issues/33
          ...lessLoader,
          { loader: "less-loader", options: lessLoaderOptions }
        ]
      };
    } else {
      lessRules = {
        test: lessExtension,
        use: [
          ...cssRules.use,
          { loader: "less-loader", options: lessLoaderOptions }
        ]
      };
    }

    const oneOfRule = config.module.rules.find((rule) => rule.oneOf !== undefined);
    if (oneOfRule) {
      oneOfRule.oneOf.unshift(lessRules);
    }
    else {
      // Fallback to previous behaviour of adding to the end of the rules list.
      config.module.rules.push(lessRules);
    }

    return config;
  };
}
const rewireLess = addLessLoader();
rewireLess.options = addLessLoader;

const loaderNameMatches = function(rule, loader_name) {
  return rule && rule.loader && typeof rule.loader === 'string' &&
    (rule.loader.indexOf(`${path.sep}${loader_name}${path.sep}`) !== -1 ||
    rule.loader.indexOf(`@${loader_name}${path.sep}`) !== -1);
};

const babelLoaderMatcher = function(rule) {
  return loaderNameMatches(rule, 'babel-loader');
};
const getLoader = function(rules, matcher) {
  let loader;

  rules.some(rule => {
    return (loader = matcher(rule)
      ? rule
      : getLoader(rule.use || rule.oneOf || (Array.isArray(rule.loader) && rule.loader) || [], matcher));
  });

  return loader;
};

const getBabelLoader = function(rules) {
  return getLoader(rules, babelLoaderMatcher);
};

const addPlugin = function(pluginName, config) {
  const loader = getBabelLoader(config.module.rules);
  if (!loader) {
    console.log('babel-loader not found');
    return config;
  }
  // Older versions of webpack have `plugins` on `loader.query` instead of `loader.options`.
  const options = loader.options || loader.query;
  options.plugins =  [pluginName].concat(options.plugins || []);
  return config;
};