import m from 'mithril';
import { Select } from 'mithril-materialized';
import { FormAttributes, LayoutForm, render } from 'mithril-ui-form';
import { Dashboards, ICapability, ICapabilityModel } from '../models';
import { MeiosisComponent } from '../services';
import { t, i18n } from 'mithriljs-i18n';

export const AssessmentPage: MeiosisComponent = () => {
  let version = 0;

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
        actions: { saveModel, update },
      },
    }) => {
      const { catModel = { data: {} } as ICapabilityModel, assessment = [] } = app;
      const { data = {} } = catModel;
      const { categories = [], capabilities = [] } = data;
      const capabilityId = app.capabilityId || m.route.param('id');
      const cap = (capabilities.filter((cap) => cap.id === capabilityId).shift() ||
        {}) as ICapability;
      const { categoryId = app.categoryId, subcategoryId = app.subcategoryId } = cap;
      const category = categoryId && categories.filter((cat) => cat.id === categoryId).shift();
      const caps =
        capabilities && capabilities.filter((cap) => cap.subcategoryId === subcategoryId);
      return m(
        '.assessment.page',
        [
          m('.row', [
            m('.col.s12', m('h4', t('ass'))),
            m('.col.s12', m('p', m.trust(render(t('ass_instr'), true)))),
            m(Select, {
              className: 'col s4',
              placeholder: t('pick_one'),
              label: t('select_cat'),
              checkedId: categoryId,
              options: categories,
              onchange: (v) => {
                version++;
                update({
                  app: {
                    categoryId: v[0] as string,
                    subcategoryId: undefined,
                    capabilityId: undefined,
                  },
                });
              },
            }),
            category &&
              m(Select, {
                className: 'col s4',
                placeholder: t('pick_one'),
                label: t('select_subcat'),
                checkedId: subcategoryId,
                options: category && category.subcategories,
                onchange: (v) => {
                  version++;
                  update({ app: { subcategoryId: v[0] as string, capabilityId: undefined } });
                },
              }),
            caps &&
              caps.length > 0 &&
              m(Select, {
                className: 'col s4',
                placeholder: t('pick_one'),
                label: t('select_cap'),
                checkedId: capabilityId,
                options: caps,
                onchange: (v) => {
                  version++;
                  update({ app: { capabilityId: v[0] as string } });
                },
              }),
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
              onchange: () => {
                saveModel(catModel);
                console.table(catModel);
              },
              // i18n: i18n,
            } as FormAttributes<Partial<ICapability>>)
          ),
        ]
      );
    },
  };
};
