import m from 'mithril';
import { Select } from 'mithril-materialized';
import { FormAttributes, LayoutForm, UIForm, render } from 'mithril-ui-form';
import { Dashboards, ICapability, ICapabilityModel } from '../models';
import { MeiosisComponent } from '../services';
import { t, i18n } from 'mithriljs-i18n';

export const AssessmentPage: MeiosisComponent = () => {
  return {
    oninit: ({
      attrs: {
        state: {
          app: { catModel },
        },
        actions: { setPage, update },
      },
    }) => {
      const id = m.route.param('id');
      if (id && catModel) {
        const { capabilities = [] } = catModel.data;
        const capability =
          capabilities.filter((cap) => cap.id === id).shift() || ({} as ICapability);
        const { id: capabilityId, categoryId, subcategoryId } = capability;
        update({ app: { page: Dashboards.ASSESSMENT, capabilityId, categoryId, subcategoryId } });
      } else {
        setPage(Dashboards.ASSESSMENT);
      }
    },
    view: ({
      attrs: {
        state: { app },
        actions: { saveModel, update, changePage },
      },
    }) => {
      const capabilityId = m.route.param('id');
      if (!capabilityId) {
        changePage(Dashboards.HOME);
      }
      const { catModel = { data: {} } as ICapabilityModel, assessment = [] } = app;
      const { data = {} } = catModel;
      const { categories = [], capabilities = [] } = data;
      const cap = (capabilities.filter((cap) => cap.id === capabilityId).shift() ||
        {}) as ICapability;
      const { categoryId, subcategoryId } = cap;
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
              initialValue: categoryId,
              options: categories,
              onchange: (v) =>
                update({
                  app: {
                    categoryId: v[0] as string,
                    subcategoryId: undefined,
                    capabilityId: undefined,
                  },
                }),
            }),
            category &&
              m(Select, {
                className: 'col s4',
                placeholder: t('pick_one'),
                label: t('select_subcat'),
                initialValue: subcategoryId,
                options: category && category.subcategories,
                onchange: (v) =>
                  update({ app: { subcategoryId: v[0] as string, capabilityId: undefined } }),
              }),
            caps &&
              caps.length > 0 &&
              m(Select, {
                className: 'col s4',
                placeholder: t('pick_one'),
                label: t('select_cap'),
                initialValue: capabilityId,
                options: caps,
                onchange: (v) => update({ app: { capabilityId: v[0] as string } }),
              }),
          ]),
          cap && m('.row', m('h5.col.s12', `${t('cap')} '${cap.label}'`)),
        ],
        cap &&
          m(
            'form.row',
            { lang: i18n.currentLocale, spellcheck: false },
            m(LayoutForm, {
              form: assessment as UIForm<Partial<ICapability>>,
              obj: cap,
              context: [data],
              onchange: () => {
                saveModel(catModel);
                console.log(JSON.stringify(catModel, null, 2));
              },
            } as FormAttributes<Partial<ICapability>>)
          )
      );
    },
  };
};
