import m from 'mithril';
import 'material-icons/iconfont/material-icons.css';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
import './css/style.css';
import { routingSvc } from './services/routing-service';
import { registerPlugin } from 'mithril-ui-form';
import {
  assessmentPlugin,
  lookupTable,
  lookupTableCreatorPlugin,
  tablePlugin,
} from './components/ui';
import { i18n } from 'mithriljs-i18n';

console.info(`BUILD DATE: ${process.env.BUILD_DATE}`);

registerPlugin('assessment', assessmentPlugin);
registerPlugin('create-lookup-table', lookupTableCreatorPlugin);
registerPlugin('lookup-table', lookupTable);
registerPlugin('table', tablePlugin);

i18n.init(
  {
    en: { name: 'English', fqn: 'en-UK', default: true },
    nl: { name: 'Nederlands', fqn: 'nl-NL' },
    url: `${process.env.SERVER}/lang/{locale}.json`,
  },
  window.localStorage.getItem('CAT_LANGUAGE') || 'nl'
);

i18n.addOnChangeListener((locale: string) => {
  console.log(`Language loaded`);
  document.documentElement.setAttribute('lang', locale);
  routingSvc.init();
  m.route(document.body, routingSvc.defaultRoute, routingSvc.routingTable());
});
