import m from 'mithril';
import 'material-icons/iconfont/material-icons.css';
import 'materialize-css/dist/css/materialize.min.css';
import './css/style.css';
import { dashboardSvc } from './services/dashboard-service';
import { registerPlugin } from 'mithril-ui-form';
import {
  assessmentPlugin,
  lookupTable,
  lookupTableCreatorPlugin,
  tablePlugin,
} from './components/ui';
import { TextDirection, i18n, t } from 'mithriljs-i18n';

i18n.init(
  {
    'en-UK': {
      dir: 'ltr',
      name: 'English',
      default: true,
    },
  },
  'en-UK',
  '/lang/{locale}.json'
);

const updateHtmlLocalization = (currentLocale: string, dir: TextDirection) => {
  document.documentElement.lang = currentLocale;
  document.documentElement.dir = dir;
  document.title = t('app_name');
};

i18n.addOnChangeListener(updateHtmlLocalization);
i18n.loadAndSetLocale('en-UK');

registerPlugin('assessment', assessmentPlugin);
registerPlugin('create-lookup-table', lookupTableCreatorPlugin);
registerPlugin('lookup-table', lookupTable);
registerPlugin('table', tablePlugin);

m.route(document.body, dashboardSvc.defaultRoute, dashboardSvc.routingTable());
