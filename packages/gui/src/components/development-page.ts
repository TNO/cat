import m from 'mithril';
import { Select, Collapsible, FlatButton } from 'mithril-materialized';
import { FormAttributes, LayoutForm, render } from 'mithril-ui-form';
import { Dashboards, ICapabilityModel } from '../models';
import { MeiosisComponent } from '../services';
import { t } from 'mithriljs-i18n';

export const DevelopmentPage: MeiosisComponent = () => {
  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => setPage(Dashboards.DEVELOPMENT),
    view: ({
      attrs: {
        state: {
          app: {
            catModel = { data: {} } as ICapabilityModel,
            categoryId,
            subcategoryId: subCategoryId,
            capabilityId,
          },
        },
        actions: { saveModel, update },
      },
    }) => {
      const { development = [], data = {} } = catModel;
      const { categories = [], capabilities = [], projectProposals = [] } = data;
      if (!data.projectProposals) {
        data.projectProposals = projectProposals;
        saveModel(catModel);
      }
      const category = categoryId && categories.filter((cat) => cat.id === categoryId).shift();
      const caps =
        capabilities && capabilities.filter((cap) => cap.subcategoryId === subCategoryId);
      const cap = capabilities && capabilities.filter((cap) => cap.id === capabilityId).shift();
      console.log(caps);

      const projects =
        cap && projectProposals.filter((p) => !p.capabilityIds || p.capabilityIds.includes(cap.id));

      return m(
        '.development-page',
        { style: 'min-height: 95vh; padding-bottom: 20px' },
        [
          m('.row', [
            m('.col.s12', m('h4', t('development'))),
            m('.col.s12', m('p', m.trust(render(t('dev_cap'), true)))),
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
                initialValue: subCategoryId,
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
          cap &&
            m('.row', [
              m('h5.col.s12', `${t('cap')} '${cap.label}'`),
              m(
                '.col.s12.right-align',
                m(FlatButton, {
                  iconName: 'add',
                  iconClass: 'right',
                  label: t('proj_prop'),
                  onclick: () => {
                    projectProposals.push({
                      id: Date.now(),
                      label: t('prop_new'),
                      capabilityIds: [cap.id],
                    });
                    saveModel(catModel);
                  },
                })
              ),
            ]),
        ],
        projects &&
          projects.length > 0 &&
          m(Collapsible, {
            items: projects.map((p) => ({
              header: p.label,
              body: m(
                '.row',
                m(LayoutForm, {
                  form: development,
                  obj: p,
                  context: [data],
                  onchange: () => {
                    saveModel(catModel);
                  },
                } as FormAttributes)
              ),
              iconName: p.approved ? 'engineering' : 'lightbulb',
            })),
          })
      );
    },
  };
};
