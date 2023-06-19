import m from 'mithril';
import { ITabItem, Tabs } from 'mithril-materialized';
import { FormAttributes, LayoutForm, UIForm } from 'mithril-ui-form';
import { Dashboards } from '../models';
import { ICapabilityModel } from '../models/capability-model/capability-model';
import { MeiosisComponent } from '../services';

export const SettingsPage: MeiosisComponent = () => ({
  oninit: ({
    attrs: {
      actions: { setPage },
    },
  }) => setPage(Dashboards.SETTINGS),
  view: ({
    attrs: {
      state: {
        app: {
          catModel = {
            form: [] as UIForm,
            settings: [] as UIForm,
            data: {},
          } as Partial<ICapabilityModel>,
        },
      },
      actions: { saveModel },
    },
  }) => {
    const { settings: form = [], data = {} } = catModel;
    const sections = form.filter((i) => i.type === 'section');
    const tabs = sections.map(
      (s) =>
        ({
          id: s.id,
          title: s.label,
          vnode: m(LayoutForm, {
            form,
            obj: data,
            section: s.id,
            context: [data],
            onchange: () => {
              console.log(
                JSON.stringify(
                  catModel.data && catModel.data.capabilities ? catModel.data.capabilities[0] : '',
                  null,
                  2
                )
              );
              saveModel(catModel);
            },
          } as FormAttributes),
        } as ITabItem)
    );
    return m('.settings.page', m('.row', m(Tabs, { tabs, tabWidth: 'fill' })));
  },
});
