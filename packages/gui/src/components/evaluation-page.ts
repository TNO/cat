import m from 'mithril';
import { Select, Collapsible } from 'mithril-materialized';
import { ILayoutForm, LayoutForm, render } from 'mithril-ui-form';
import { Dashboards, ICapabilityModel } from '../models';
import { MeiosisComponent } from '../services';

export const EvaluationPage: MeiosisComponent = () => {
  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => setPage(Dashboards.EVALUATION),
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
      const { projectEvaluation = [], evaluation = [], data = {} } = catModel;
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
        cap &&
        projectProposals.filter(
          (p) => p.approved && (!p.capabilityIds || p.capabilityIds.includes(cap.id))
        );

      return m(
        '.evaluation-page',
        { style: 'min-height: 95vh; padding-bottom: 20px' },
        [
          m('.row', [
            m('.col.s12', m('h4', 'Evaluation')),
            m(
              '.col.s12',
              m(
                'p',
                m.trust(
                  render(
                    `_Evaluate your capability and the associated projects. Start by selecting a capability._`,
                    true
                  )
                )
              )
            ),
            m(Select, {
              className: 'col s4',
              placeholder: 'Pick one',
              label: 'Select category',
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
                placeholder: 'Pick one',
                label: 'Select subcategory',
                initialValue: subCategoryId,
                options: category && category.subcategories,
                onchange: (v) =>
                  update({ app: { subcategoryId: v[0] as string, capabilityId: undefined } }),
              }),
            caps &&
              caps.length > 0 &&
              m(Select, {
                className: 'col s4',
                placeholder: 'Pick one',
                label: 'Select capability',
                initialValue: capabilityId,
                options: caps,
                onchange: (v) => update({ app: { capabilityId: v[0] as string } }),
              }),
          ]),
          cap && m('.row', m('h5.col.s12', `Capability '${cap.label}'`)),
        ],
        cap &&
          m(
            '.row',
            m(LayoutForm, {
              form: evaluation,
              obj: cap,
              context: data as any,
              onchange: () => {
                saveModel(catModel);
              },
            } as ILayoutForm<any>)
          ),
        projects &&
          projects.length > 0 &&
          m(Collapsible, {
            items: projects.map((p) => ({
              header: p.label,
              body: m(
                '.row',
                m(LayoutForm, {
                  form: projectEvaluation,
                  obj: p,
                  context: data as any,
                  onchange: () => {
                    saveModel(catModel);
                  },
                } as ILayoutForm<any>)
              ),
              iconName: p.approved ? 'engineering' : 'lightbulb',
            })),
          })
      );
    },
  };
};
