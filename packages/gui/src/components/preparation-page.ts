import m from 'mithril';
import { ITabItem, Tabs } from 'mithril-materialized';
import {
  LayoutForm,
  UIForm,
  render,
  resolveExpression,
  capitalizeFirstLetter,
} from 'mithril-ui-form';
import { Dashboards, ICapabilityModel } from '../models';
import { MeiosisComponent } from '../services';
import { t } from 'mithriljs-i18n';

const getPath = <O extends {}>(obj: O, s: string) => {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, ''); // strip a leading dot
  const a = s.split('.');
  let o = { ...obj };
  // console.log(o)
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i];
    console.log(k);
    if (k in o) {
      o = (o as Record<string, any>)[k];
    } else if (o instanceof Array) {
      const id = (obj as any)[k] || k;
      const m = /([A-Z]\w+)/.exec(k); // categoryId => match Id, myNameLabel => NameLabel
      const key = (m && m[0][0].toLowerCase() + m[0].substr(1)) || k; // key = id or nameLabel
      const found = o.filter((i) => i[key] === id).shift();
      if (found) {
        o = found;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
  return o as any;
};
export const PreparationPage: MeiosisComponent = () => {
  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => setPage(Dashboards.PREPARATION),
    view: ({
      attrs: {
        state: {
          app: { catModel = { preparations: [], data: {} } as Partial<ICapabilityModel> },
        },
        actions: { saveModel },
      },
    }) => {
      const { preparations = [], data = {} } = catModel;
      const prepare = preparations.filter((i) => i.type === 'section') as UIForm;
      const opt = resolveExpression('categories[capabilities.categoryId]', [data]);

      const options = (
        opt && opt instanceof Array
          ? opt
              .filter(
                (o) => typeof o.id !== 'undefined' && (o.label || !/[0-9]/.test(o.id)) && !o.show
              )
              .map((o) => (o.label ? o : { ...o, label: capitalizeFirstLetter(o.id) }))
          : []
      ) as Array<{
        id: string;
        label: string;
        disabled?: boolean;
        icon?: string;
        show?: string | string[];
      }>;
      const tabs = prepare.map(
        (s, i) =>
          ({
            id: s.id,
            title: `${i + 1}. ${s.label}`,
            vnode: m(LayoutForm, {
              form: preparations,
              obj: data,
              section: s.id,
              onchange: () => {
                saveModel(catModel);
              },
            }),
          } as ITabItem)
      );
      return m('.row', { style: 'height: 90vh' }, [
        m('.col.s12', m('h4', t('preparation'))),
        m('.col.s12', m('p', m.trust(render(t('prep_content'), true)))),
        m(Tabs, { tabs, tabWidth: 'fill' }),
      ]);
    },
  };
};
