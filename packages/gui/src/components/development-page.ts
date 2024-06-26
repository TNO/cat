import m from 'mithril';
import { Select, Collapsible, FlatButton, ModalPanel } from 'mithril-materialized';
import { FormAttributes, LayoutForm, render } from 'mithril-ui-form';
import { Dashboards, Development, ICapabilityModel, ProjectProposal } from '../models';
import { MeiosisComponent } from '../services';
import { t } from 'mithriljs-i18n';

export const DevelopmentPage: MeiosisComponent = () => {
  let selectedProject: ProjectProposal;

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
            development = [],
          },
        },
        actions: { saveModel, update },
      },
    }) => {
      const { data = {} } = catModel;
      const { categories = [], capabilities = [], projectProposals = [] } = data;
      if (!data.projectProposals) {
        data.projectProposals = projectProposals;
        saveModel(catModel);
      }
      const category = categoryId && categories.filter((cat) => cat.id === categoryId).shift();
      const caps =
        capabilities && capabilities.filter((cap) => cap.subcategoryId === subCategoryId);
      const cap = capabilities && capabilities.filter((cap) => cap.id === capabilityId).shift();

      const projects =
        cap && projectProposals.filter((p) => !p.capabilityIds || p.capabilityIds.includes(cap.id));

      return m(
        '.development.page',
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
              body: m('.row', [
                m(
                  '.col.s12.right-align.red-text',
                  m(FlatButton, {
                    iconName: 'delete',
                    iconClass: 'red-text',
                    modalId: 'deleteProject',
                    onclick: () => (selectedProject = p),
                  })
                ),
                m(LayoutForm, {
                  form: development,
                  obj: p,
                  context: [data],
                  onchange: () => {
                    if (p.capabilityIds)
                      if (p.capabilityIds.indexOf(cap.id) < 0) {
                        p.capabilityIds.push(cap.id);
                      }
                    saveModel(catModel);
                  },
                } as FormAttributes<Development>),
              ]),
              iconName: p.approved ? 'engineering' : 'lightbulb',
            })),
          }),
        m(ModalPanel, {
          id: 'deleteProject',
          title: t('del_proj') + `: ${selectedProject?.label}`,
          buttons: [
            {
              label: t('yes'),
              iconName: 'delete',
              onclick: () => {
                catModel.data.projectProposals = catModel.data.projectProposals?.filter(
                  (p) => p.id !== selectedProject.id
                );
                saveModel(catModel);
              },
            },
            { label: t('no'), iconName: 'cancel' },
          ],
        })
      );
    },
  };
};
