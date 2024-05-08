import m from 'mithril';
import { Icon, Select, TextArea, TextInput } from 'mithril-materialized';
import { InputField, resolveExpression, render } from 'mithril-ui-form';
import { PluginType } from 'mithril-ui-form';
import { ILabelled } from '../../models/capability-model/capability-model';
import { getTextColorFromBackground } from '../../utils';
import { t } from 'mithriljs-i18n';

// const range = (start: number, end: number) =>
//   Array.from({ length: end - start + 1 }, (_, k) => k + start);

type AssessmentType = {
  assessmentId?: string;
  items: Array<{
    id: string;
    value?: string;
    desc?: string;
    placeholder?: string;
  }>;
};

type AssessmentFieldType = InputField & {
  assessmentOptions: string;
  optionLabel: string;
  assessmentLabel: string;
  descriptionLabel: string;
  overallAssessment: 'min' | 'max' | 'avg';
  overallAssessmentLabel: string;
  /** If set, the aspect can be ignored */
  excludeLabel?: string;
};

const EXCLUDE_ID = '__exclude__id__';

export const assessmentPlugin: PluginType = () => {
  let key = 1;

  const computeOutcome = (
    overallAssessment: 'max' | 'min' | 'avg',
    score: false | ILabelled[],
    items: Array<{ value?: string }>
  ) =>
    items.every((i) => typeof i.value === 'undefined' || i.value === EXCLUDE_ID)
      ? undefined
      : score &&
        Math.round(
          items
            .filter((i) => i.value && i.value !== EXCLUDE_ID)
            .reduce((acc, cur, _i, arr) => {
              const index = score.findIndex((s) => s.id === cur.value);
              return index < 0
                ? acc
                : overallAssessment === 'max'
                ? Math.max(index, acc)
                : overallAssessment === 'min'
                ? Math.min(index, acc)
                : acc + index / arr.length;
            }, 0)
        );

  return {
    view: ({ attrs: { field, obj, context = [], onchange } }) => {
      const {
        id = '',
        options = '',
        assessmentOptions = '',
        optionLabel,
        assessmentLabel,
        descriptionLabel = 'desc',
        overallAssessment,
        overallAssessmentLabel,
        readonly,
        excludeLabel,
      } = field as AssessmentFieldType;
      if (obj instanceof Array) return;
      if (!obj.hasOwnProperty(id)) obj[id] = { assessmentId: '', items: [] } as AssessmentType;

      const disabled = readonly;
      const ctx = context instanceof Array ? [obj, ...context] : [obj, context];
      const opt = typeof options === 'string' && (resolveExpression(options, ctx) as ILabelled[]);
      let items = (obj[id] as AssessmentType).items;
      if (opt instanceof Array && items instanceof Array) {
        const values = items.reduce((acc, cur) => {
          acc.set(cur.id, { value: cur.value, desc: cur.desc });
          return acc;
        }, new Map<string, { value?: string; desc?: string }>());
        items.length = 0;
        items.push(
          ...opt
            .filter((o) => !excludeLabel || o.id !== EXCLUDE_ID)
            .map((item) => ({
              ...item,
              placeholder: item.desc,
              desc: undefined,
              ...values.get(item.id),
            }))
        );
        (obj[id] as AssessmentType).items = items;
      }
      // console.log(`Assessment plugin ${optionLabel}: ${JSON.stringify(items)}`);

      const score =
        typeof options === 'string' &&
        (resolveExpression(assessmentOptions, ctx) as ILabelled[]).map((i) => i);
      if (score && excludeLabel) {
        score.push({
          id: EXCLUDE_ID,
          label: excludeLabel,
        });
      }

      const outcomeIndex =
        typeof overallAssessment !== 'undefined' && computeOutcome(overallAssessment, score, items);
      const outcome =
        typeof outcomeIndex === 'number' && score && score.length > outcomeIndex
          ? score[outcomeIndex]
          : { label: t('TBD'), color: '' };

      const assessmentStarted = items.filter((i) => i.value).length > 0;
      const color = assessmentStarted && outcome.color ? outcome.color : '#f0f8ff';

      const now = Date.now();

      return m('.assessment-plugin.section', { key: now }, [
        // m('.divider'),
        overallAssessmentLabel &&
          m(
            '.col.s12.right-align',
            m(
              `.assessment-score.en${getTextColorFromBackground(color)}`,
              {
                style: { background: color },
              },
              [
                m('strong', `${overallAssessmentLabel}: `),
                m('span', assessmentStarted ? outcome.label : t('TBD')),
              ]
            )
          ),
        m('div', [
          m('.col.s8.m5.l3', m('h6', m('strong', t(optionLabel)))),
          m('.col.s4.m2.l2', m('h6', m('strong', t(assessmentLabel)))),
          m('.col.s12.m5.l7', m('h6', m('strong', t(descriptionLabel)))),
          opt &&
            score &&
            opt.length > 0 &&
            opt.map((o, i) => {
              const existing = items.filter((i) => i.id === o.id).shift();
              if (!existing) items.push({ id: o.id });
              const item = existing || items[items.length - 1];
              return m('.condensed', [
                m(
                  '.col.s8.m5.l3.truncate',
                  {
                    style: 'margin: 9px auto 0 auto;',
                    className: item.value === EXCLUDE_ID ? 'disabled-option' : '',
                  },
                  o.label,
                  o.desc &&
                    m(Icon, {
                      iconName: 'info',
                      className: 'tooltipped grey-text info-icon',
                      'data-position': 'bottom',
                      'data-tooltip': `<div class="left-align">${render(o.desc).replace(
                        /<ul/,
                        '<ul class="browser-default"'
                      )}</div>`,
                      oncreate: ({ dom }) => o.desc && M.Tooltip.init(dom),
                    })
                ),
                m(
                  '.col.s4.m2.l2',
                  m(
                    '.row',
                    {
                      className: item.value === EXCLUDE_ID ? 'disabled-option' : undefined,
                    },
                    disabled
                      ? m(TextInput, {
                          disabled,
                          initialValue: score.filter((s) => s.id === item.value).shift()?.label,
                        })
                      : [
                          m(Select, {
                            key: `select_${key}_${i}`,
                            placeholder: t('pick_one'),
                            options: score,
                            className: 'col s10',
                            initialValue: item.value,
                            onchange: (v) => {
                              item.value = v[0] as string;
                              const o = computeOutcome(overallAssessment, score, items);
                              (obj[id] as AssessmentType).assessmentId =
                                typeof o === 'number' ? score[o].id : undefined;
                              onchange && onchange(obj[id]);
                            },
                          }),
                          m(Icon, {
                            key: 'icon',
                            iconName: 'clear',
                            className: 'tiny left-align clickable',
                            style: 'line-height: 48px',
                            onclick: () => {
                              if (item.value) {
                                item.value = undefined;
                                key++;
                                const o = computeOutcome(overallAssessment, score, items);
                                (obj[id] as AssessmentType).assessmentId =
                                  typeof o === 'number' ? score[o].id : undefined;
                                onchange && onchange(obj[id]);
                              }
                            },
                          }),
                        ]
                  )
                ),
                m(
                  '.col.s12.m5.l7',
                  m(
                    '.row',
                    m(TextArea, {
                      disabled,
                      placeholder: item.placeholder,
                      initialValue: item.desc,
                      onchange: (v) => {
                        item.desc = v;
                        onchange && onchange(obj[id]);
                        const o = computeOutcome(overallAssessment, score, items);
                        if (typeof o === 'number')
                          (obj[id] as AssessmentType).assessmentId = score[o].id;
                      },
                    })
                  )
                ),
              ]);
            }),
        ]),
      ]);
    },
  };
};
