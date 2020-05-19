import * as sapper from '@sapper/app';

import "./style/materialize/js/bin/materialize.min.js";
//import "lightweight-charts";
import "../node_modules/lightweight-charts/dist/lightweight-charts.standalone.production.js";

sapper.start({
  target: document.querySelector('#sapper'),
  ssr: false
});
