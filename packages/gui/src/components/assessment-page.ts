import m from 'mithril';
import { Select } from 'mithril-materialized';
import { ILayoutForm, LayoutForm, render } from 'mithril-ui-form';
import { Dashboards, ICapability, ICapabilityModel } from '../models';
import { MeiosisComponent } from '../services';

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
        state: {
          app: {
            catModel = { data: {} } as ICapabilityModel,
            categoryId,
            subcategoryId,
            capabilityId,
          },
        },
        actions: { saveModel, update },
      },
    }) => {
      const { assessment = [], data = {} } = catModel;
      const { categories = [], capabilities } = data;
      const category = categoryId && categories.filter((cat) => cat.id === categoryId).shift();
      const caps =
        capabilities && capabilities.filter((cap) => cap.subcategoryId === subcategoryId);
      const cap = capabilities && capabilities.filter((cap) => cap.id === capabilityId).shift();

      return m(
        '.assessment-page',
        { style: 'min-height: 95vh; padding-bottom: 20px' },
        [
          m('.row', [
            m('.col.s12', m('h4', 'Assessment')),
            m(
              '.col.s12',
              m(
                'p',
                m.trust(
                  render(
                    `_Assess the contribution of a capability towards your goals, and the room for improvement. Start by selecting a capability._`,
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
                initialValue: subcategoryId,
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
              form: assessment,
              obj: cap,
              context: data as any,
              onchange: () => {
                saveModel(catModel);
              },
            } as ILayoutForm<any>)
          )
      );
    },
  };
};
