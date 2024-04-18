import m from 'mithril';
import { FormAttributes, LayoutForm, render } from 'mithril-ui-form';
import { Dashboards, ICapability, ICapabilityModel } from '../models';
import { MeiosisComponent } from '../services';
import { t, i18n } from 'mithriljs-i18n';

export const AssessmentPage: MeiosisComponent = () => {
  return {
    oninit: ({
      attrs: {
        state: {
          app: { capabilityId, catModel = {} as ICapabilityModel },
        },
        actions: { setPage, update },
      },
    }) => {
      const id = m.route.param('id') || capabilityId;
      const { capabilities = [] } = catModel.data;
      if (id && catModel) {
        const capability =
          capabilities.filter((cap) => cap.id === id).shift() || ({} as ICapability);
        const { id: capabilityId, categoryId, subcategoryId } = capability;
        update({ app: { page: Dashboards.ASSESSMENT, capabilityId, categoryId, subcategoryId } });
      } else if (capabilities.length > 0) {
        const { id: capabilityId, categoryId, subcategoryId } = capabilities[0];
        update({ app: { page: Dashboards.ASSESSMENT, capabilityId, categoryId, subcategoryId } });
      } else {
        setPage(Dashboards.ASSESSMENT);
      }
    },
    view: ({
      attrs: {
        state: { app },
        actions: { saveModel },
      },
    }) => {
      const { catModel = { data: {} } as ICapabilityModel, assessment = [] } = app;
      const { data = {} } = catModel;
      const { capabilities = [] } = data;
      const capabilityId = app.capabilityId || m.route.param('id');
      const cap = (capabilities.filter((cap) => cap.id === capabilityId).shift() ||
        {}) as ICapability;
      return m(
        '.assessment.page',
        [
          m('.row', [
            m('.col.s12', m('h4', t('ass'))),
            m('.col.s12', m('p', m.trust(render(t('ass_instr'), true)))),
          ]),
          cap && m('.row', m('h5.col.s12', `${t('cap')} '${cap.label}'`)),
        ],
        cap && [
          m(
            'form.row',
            { lang: i18n.currentLocale, spellcheck: false },
            m(LayoutForm, {
              key: capabilityId,
              form: assessment,
              obj: cap,
              context: [data],
              onchange: (_, cap) => {
                // if (cap && catModel.data?.capabilities) {
                //   catModel.data.capabilities = catModel.data.capabilities.map(c => c.id === cap.id ? cap : c)
                // }
                saveModel(catModel);
                console.table(catModel);
                console.table(cap);
              },
              // i18n: i18n,
            } as FormAttributes<Partial<ICapability>>)
          ),
        ]
      );
    },
  };
};
