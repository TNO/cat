import m from 'mithril';
import { ITabItem, Tabs } from 'mithril-materialized';
import { LayoutForm, UIForm, render, FormAttributes } from 'mithril-ui-form';
import { Dashboards, ICapabilityDataModel, ICapabilityModel } from '../models';
import { MeiosisComponent } from '../services';
import { t } from 'mithriljs-i18n';

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
          app: {
            preparations = [] as UIForm<ICapabilityDataModel>,
            catModel = { preparations: [], data: {} } as Partial<ICapabilityModel>,
          },
        },
        actions: { saveModel },
      },
    }) => {
      const { data = {} } = catModel;
      const prepare = preparations.filter(
        (i) => i.type === 'section'
      ) as UIForm<ICapabilityDataModel>;

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
            } as FormAttributes<ICapabilityDataModel>),
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
