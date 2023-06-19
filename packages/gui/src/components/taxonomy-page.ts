import m from 'mithril';
import { FlatButton, ModalPanel } from 'mithril-materialized';
import { FormAttributes, LayoutForm, UIForm, render } from 'mithril-ui-form';
import { Dashboards } from '../models';
import {
  ICapabilityDataModel,
  ICapabilityModel,
} from '../models/capability-model/capability-model';
import { MeiosisComponent } from '../services';
import { TextInputWithClear } from './ui';
import { t } from 'mithriljs-i18n';

const createTextFilter = (txt: string) => {
  if (!txt) return () => true;
  const checker = new RegExp(txt, 'i');
  return ({ label = '', id = '' }: { label: string; id?: string }) =>
    checker.test(id) || checker.test(label);
};

export type Taxonomy = {
  lexicon: Array<{ id: string; label: string; ref: string; url: string }>;
};

const TaxonomyForm = () =>
  [
    {
      id: 'lexicon',
      label: t('defs'),
      repeat: true,
      pageSize: 1,
      propertyFilter: 'label',
      sortProperty: 'id',
      type: [
        { id: 'id', type: 'text', label: t('term'), className: 'col s4 m3' },
        { id: 'label', type: 'text', label: t('desc'), className: 'col s8 m9' },
        { id: 'ref', type: 'text', label: t('ref'), className: 'col s4 m3' },
        { id: 'url', type: 'url', label: t('ref_url'), className: 'col s8 m9' },
      ],
    },
  ] as UIForm<Pick<ICapabilityDataModel, 'lexicon'>>;

let textFilter = '';

export const TaxonomyPage: MeiosisComponent = () => ({
  oninit: ({
    attrs: {
      actions: { setPage },
    },
  }) => setPage(Dashboards.TAXONOMY),
  view: ({
    attrs: {
      state: {
        app: {
          catModel = {
            form: [] as UIForm,
            settings: [] as UIForm,
            data: {} as ICapabilityDataModel,
          } as Partial<ICapabilityModel>,
        },
      },
      actions: { saveModel },
    },
  }) => {
    const { data = {} as ICapabilityDataModel } = catModel;
    const { lexicon } = data;

    const filteredLexicon =
      lexicon &&
      lexicon instanceof Array &&
      lexicon
        .filter(createTextFilter(textFilter))
        .filter((l) => typeof l.id !== 'undefined' && typeof l.label !== 'undefined')
        .sort((a, b) => (a.id.toLowerCase() > b.id.toLowerCase() ? 1 : -1));

    return [
      m('.row', { style: 'height: 100vh' }, [
        m(FlatButton, {
          label: t('add_term'),
          iconName: 'add',
          className: 'col s6 l3',
          modalId: 'add-term',
        }),
        m(TextInputWithClear, {
          label: t('filter_text'),
          id: 'filter',
          initialValue: textFilter,
          placeholder: t('filter_text_ph'),
          iconName: 'filter_list',
          onchange: (v?: string) => (textFilter = v ? v : ''),
          style: 'margin-bottom: -4rem',
          className: 'col s6 offset-l6 l3',
        }),
        m('.intro.col.s12', m.trust(render(t('tax_def'), false))),
        filteredLexicon &&
          m('table.highlight', { style: 'margin-bottom: 3rem' }, [
            m(
              'thead',
              m('tr', [
                m('th', t('term')),
                m('th', t('desc')),
                // m('th.hide-on-med-and-down', t('ref')),
              ])
            ),
            m(
              'tbody',
              filteredLexicon.map((l) =>
                m('tr', [
                  m('td', m('strong', l.id)),
                  m('td', m.trust(render(l.label))),
                  // l.ref &&
                  //   m(
                  //     'td.hide-on-med-and-down',
                  //     l.url
                  //       ? m(
                  //           'a',
                  //           {
                  //             target: '_',
                  //             alt: l.ref,
                  //             href: l.url,
                  //           },
                  //           l.ref
                  //         )
                  //       : l.ref
                  //   ),
                ])
              )
            ),
          ]),
        m(ModalPanel, {
          id: 'add-term',
          title: t('add_term'),
          description: m(LayoutForm, {
            form: TaxonomyForm(),
            obj: data,
            onchange: () => {
              console.log(JSON.stringify(catModel, null, 2));
              saveModel(catModel);
            },
          } as FormAttributes),
          bottomSheet: true,
        }),
      ]),
    ];
  },
});
