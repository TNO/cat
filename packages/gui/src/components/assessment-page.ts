import m from 'mithril';
import { FormAttributes, LayoutForm, SlimdownView, render } from 'mithril-ui-form';
import { Dashboards, ICapability, ICapabilityModel } from '../models';
import { MeiosisComponent } from '../services';
import { t, i18n } from 'mithriljs-i18n';
import { FlatButton } from 'mithril-materialized';
import { formatDate, toWord } from '../utils';

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
      const { catModel = { data: {} } as ICapabilityModel, assessment: assessmentForm = [] } = app;
      const { data = {}, version = 0 } = catModel;
      const { capabilities = [], assessmentScale = [], title = 'cat', categories = [] } = data;
      const capabilityId = app.capabilityId || m.route.param('id');
      const cap = (capabilities.filter((cap) => cap.id === capabilityId).shift() ||
        {}) as ICapability;

      const { assessmentId } = cap;
      const assessment = assessmentScale.filter((a) => a.id === assessmentId).shift();
      const color = assessment ? assessment.color : undefined;

      const filename = `${formatDate(Date.now(), '')}_${title}_v${version}.docx`;

      return m(
        '.assessment.page',
        [
          cap &&
            m('.row', [
              color &&
                m('div.square.right', {
                  style: `background-color: ${color}; width: 40px; height: 40px; border-radius: 20px`,
                }),
              m(FlatButton, {
                title: 'Save to Word',
                className: 'right',
                iconName: 'download',
                onclick: () => toWord(filename, data, cap),
              }),
              m('h5.col.s12', `${t('cap')} '${cap.label}'`),
              m('.col.s12', m(SlimdownView, { md: t('ass_instr'), removeParagraphs: true })),
            ]),
        ],
        cap && [
          m(
            'form.row',
            { lang: i18n.currentLocale, spellcheck: false },
            m(LayoutForm, {
              key: capabilityId,
              form: assessmentForm,
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
