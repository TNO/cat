import m from 'mithril';
import { ITabItem, Tabs } from 'mithril-materialized';
import { ILayoutForm, LayoutForm } from 'mithril-ui-form';
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
        app: { catModel = { form: [], settings: [], data: {} } as ICapabilityModel },
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
            onchange: () => {
              console.log(
                JSON.stringify(
                  catModel.data.capabilities ? catModel.data.capabilities[0] : '',
                  null,
                  2
                )
              );
              saveModel(catModel);
            },
          } as ILayoutForm<any>),
        } as ITabItem)
    );
    return m('.row', { style: 'height: 90vh' }, m(Tabs, { tabs, tabWidth: 'fill' }));
    // console.log(catModel);
    // return [
    //   m(
    //     '.row',
    //     { style: 'height: 95vh' },
    //     m(LayoutForm, {
    //       form: settings,
    //       obj: data,
    //       onchange: () => {
    //         console.log('Settings updated');
    //         saveModel(catModel);
    //       },
    //     })
    //   ),
    // ];
  },
});
