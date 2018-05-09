/**
 * Created by Vladyslav_Filonenko on 1/11/2018.
 */
const tests = require.context('../src/app/', true, /\.test\.js$/);

tests.keys().forEach(tests);

// requires all components in `project/src/components/**/index.js`
const components = require.context('../src/app/components/', true, /\.js$/);

components.keys().forEach(components);

const pages = require.context('../src/app/pages/', true, /\.js$/);
pages.keys().forEach(pages);
