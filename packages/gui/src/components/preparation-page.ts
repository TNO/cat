import m from 'mithril';
import { ITabItem, Tabs } from 'mithril-materialized';
import { ILayoutForm, LayoutForm, UIForm, render } from 'mithril-ui-form';
import { Dashboards, ICapabilityModel } from '../models';
import { MeiosisComponent } from '../services';

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
          app: { catModel = { preparations: [], data: {} } as ICapabilityModel },
        },
        actions: { saveModel },
      },
    }) => {
      const { preparations = [], data = {} } = catModel;

      const prepare = preparations.filter((i) => i.type === 'section') as UIForm;
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
                // console.log(JSON.stringify(data.capabilities ? data.capabilities : '', null, 2));
                saveModel(catModel);
              },
            } as ILayoutForm<any>),
          } as ITabItem)
      );
      return m('.row', { style: 'height: 90vh' }, [
        m('.col.s12', m('h4', 'Preparation')),
        m(
          '.col.s12',
          m(
            'p',
            m.trust(
              render(
                `_Define your organisation's goals, and your most important capabilities._`,
                true
              )
            )
          )
        ),
        m(Tabs, { tabs, tabWidth: 'fill' }),
      ]);
    },
  };
};
