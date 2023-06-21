import m from 'mithril';
import { Select, FlatButton } from 'mithril-materialized';
import { Dashboards } from '../models';
import {
  ICapability,
  ICapabilityDataModel,
  ICapabilityModel,
  ICategory,
  ILabelled,
} from '../models/capability-model/capability-model';
import { MeiosisComponent } from '../services';
import { TextInputWithClear } from './ui';
import { t } from 'mithriljs-i18n';

type ISubcategoryVM = ILabelled & {
  capabilities: ICapability[];
};

type ICategoryVM = ICategory & {
  subcategories: ISubcategoryVM[];
};

const createTextFilter = (txt: string) => {
  if (!txt) return () => true;
  const checker = new RegExp(txt, 'i');
  return ({ label = '', desc = '' }: { label: string; desc?: string }) =>
    checker.test(label) || checker.test(desc);
};

const createStakeholderFilter = (shs: string[]) => {
  if (!shs || shs.length === 0) return () => true;
  console.log(shs);
  return ({
    capabilityStakeholders,
  }: {
    capabilityStakeholders?: Array<{ stakeholderId: string }>;
  }) =>
    capabilityStakeholders && capabilityStakeholders.some((p) => shs.indexOf(p.stakeholderId) >= 0);
};

export const OverviewPage: MeiosisComponent = () => {
  const colors = [
    '#e41a1c',
    '#377eb8',
    '#4daf4a',
    '#984ea3',
    '#ff7f00',
    '#ffff33',
    '#a65628',
    '#f781bf',
    '#999999',
  ];

  let key = 1;

  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => setPage(Dashboards.OVERVIEW),
    view: ({
      attrs: {
        state: {
          app: { catModel = {} as ICapabilityModel, stakeholderFilter, textFilter },
        },
        actions: { createRoute, update },
      },
    }) => {
      const {
        data = {
          categories: [],
          capabilities: [],
        } as Partial<ICapabilityDataModel>,
      } = catModel;
      catModel.data = data;
      const {
        categories,
        capabilities,
        projectProposals = [],
        assessmentScale = [],
        stakeholders = [],
      } = data;
      const filterText = createTextFilter(textFilter);
      const filterStakeholders = createStakeholderFilter(stakeholderFilter as string[]);
      const filteredCapabilities =
        capabilities && capabilities.filter(filterText).filter(filterStakeholders);

      const stakeholderOpts = stakeholders
        .filter((s) => s.id)
        .map((p) => ({ id: p.id, label: p.id }));
      const filteredCategories =
        categories &&
        filteredCapabilities &&
        categories.reduce((acc, cat) => {
          const { subcategories = [], ...params } = cat;
          const category = { ...params } as ICategoryVM;
          category.subcategories = subcategories
            .map(({ id, label, desc }) => ({
              id,
              label,
              desc,
              capabilities: filteredCapabilities.filter((cap) => cap.subcategoryId === id),
            }))
            .filter((sc) => sc.capabilities.length > 0);
          if (category.subcategories.length > 0) acc.push(category);
          return acc;
        }, [] as Array<ICategoryVM>);

      const maxItems = filteredCategories
        ? Math.max(
            ...filteredCategories.map((cat) =>
              Math.max(
                ...(cat.subcategories as ISubcategoryVM[]).map((sc) => sc.capabilities.length)
              )
            )
          )
        : 0;
      const height = 90 + maxItems * 30;

      return m('.row.overview.page', [
        m(
          '.col.s12.m3',
          m(
            'ul#slide-out.sidenav.sidenav-fixed',
            {
              style: 'height: 95vh',
              oncreate: ({ dom }) => {
                M.Sidenav.init(dom);
              },
            },
            [
              m('h5', { style: 'margin-left: 0.5em;' }, t('filters')),
              [
                m(TextInputWithClear, {
                  key,
                  label: t('filter_caps'),
                  id: 'filter',
                  initialValue: textFilter,
                  placeholder: t('filter_ph'),
                  iconName: 'filter_list',
                  onchange: (v?: string) => update({ app: { textFilter: v as string } }),
                  style: 'margin-right:100px',
                  className: 'col s12',
                }),
              ],
              stakeholderOpts &&
                m(Select, {
                  placeholder: t('select_m_ph'),
                  label: t('sh_filter'),
                  checkedId: stakeholderFilter,
                  options: stakeholderOpts,
                  iconName: 'person',
                  multiple: true,
                  disabled: stakeholderOpts.length === 0,
                  onchange: (f) => update({ app: { stakeholderFilter: f as string[] } }),
                  className: 'col s12',
                }),
              m(FlatButton, {
                label: t('clear_all'),
                iconName: 'clear_all',
                class: 'col s11',
                style: 'margin: 1em;',
                onclick: () => {
                  key++;
                  update({ app: { stakeholderFilter: [], textFilter: '' } });
                },
              }),
            ]
          )
        ),
        filteredCategories &&
          m('.col.s12.m9.cards', [
            filteredCategories.map(({ label, subcategories }, i) =>
              m('.category', [
                i > 0 && m('.divider'),
                m(i > 0 ? '.section' : 'div', [
                  m('h5', label),
                  subcategories &&
                    m(
                      '.row',
                      (subcategories as ISubcategoryVM[]).map((sc) =>
                        m(
                          '.col.s12.m4.xl3',
                          m(
                            '.card',
                            {
                              style: `background: ${
                                colors[i % colors.length]
                              }; height: ${height}px`,
                            },
                            [
                              m('.card-content.white-text', [
                                m(
                                  'span.card-title.black-text.white.center-align',
                                  { style: 'padding: 0.4rem' },
                                  m('strong', sc.label)
                                ),
                                m(
                                  'ul.caps',
                                  sc.capabilities &&
                                    sc.capabilities.map((cap) => {
                                      const { assessmentId } = cap;
                                      const assessment = assessmentScale
                                        .filter((a) => a.id === assessmentId)
                                        .shift();
                                      const color = assessment ? assessment.color : undefined;
                                      const title = assessment ? assessment.label : undefined;
                                      return m(
                                        'li',
                                        m(
                                          'a.white-text',
                                          {
                                            alt: cap.label,
                                            href: createRoute(Dashboards.ASSESSMENT, {
                                              id: cap.id,
                                            }),
                                          },
                                          m('.capability', [
                                            m('.square', {
                                              title,
                                              style: `background-color: ${color}`,
                                            }),
                                            m('.name', cap.label),
                                            m(
                                              '.badges.right-align',
                                              m.trust(
                                                `${
                                                  cap.capabilityStakeholders &&
                                                  cap.capabilityStakeholders.length > 0
                                                    ? `${cap.capabilityStakeholders.length}<i class="inline-icon material-icons">people</i> `
                                                    : ''
                                                }${cap.shouldDevelop ? '✓' : ''}
                                                  ${
                                                    projectProposals.length > 0 &&
                                                    projectProposals.filter(
                                                      (p) =>
                                                        !p.approved &&
                                                        p.capabilityIds &&
                                                        p.capabilityIds.includes(cap.id)
                                                    ).length > 0
                                                      ? `${
                                                          projectProposals.filter(
                                                            (p) =>
                                                              !p.approved &&
                                                              p.capabilityIds &&
                                                              p.capabilityIds.includes(cap.id)
                                                          ).length
                                                        }<i class="inline-icon material-icons">lightbulb</i>`
                                                      : ''
                                                  }
                                                  ${
                                                    projectProposals.length > 0 &&
                                                    projectProposals.filter(
                                                      (p) =>
                                                        p.approved &&
                                                        p.capabilityIds &&
                                                        p.capabilityIds.includes(cap.id)
                                                    ).length > 0
                                                      ? `${
                                                          projectProposals.filter(
                                                            (p) =>
                                                              p.approved &&
                                                              p.capabilityIds &&
                                                              p.capabilityIds.includes(cap.id)
                                                          ).length
                                                        }<i class="inline-icon material-icons">engineering</i>`
                                                      : ''
                                                  }`
                                              )
                                            ),
                                          ])
                                        )
                                      );
                                    })
                                ),
                              ]),
                            ]
                          )
                        )
                      )
                    ),
                ]),
              ])
            ),
          ]),
      ]);
    },
  };
};
