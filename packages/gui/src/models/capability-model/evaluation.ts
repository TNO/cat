import { UIForm } from 'mithril-ui-form';
import { t } from 'mithriljs-i18n';

export const evaluationModel = () =>
  [
    {
      id: 'evaluation',
      label: t('evaluation'),
      type: 'textarea',
    },
  ] as UIForm<Partial<any>>;

export const projectEvaluationModel = () =>
  [
    {
      id: 'label',
      label: t('proj_name'),
      type: 'text',
      className: 'col s6 m4',
      readonly: true,
    },
    {
      id: 'start',
      label: t('Start time'),
      placeholder: t('period'),
      type: 'text',
      className: 'col s3 m2',
      readonly: true,
    },
    {
      id: 'duration',
      label: t('duration'),
      placeholder: t('in_months'),
      type: 'text',
      className: 'col s3 m2',
      readonly: true,
    },
    {
      id: 'capabilityIds',
      label: t('caps'),
      placeholder: t('pick_more'),
      type: 'select',
      multiple: true,
      options: 'capabilities',
      className: 'col s12 m4',
      readonly: true,
    },
    {
      id: 'proposal',
      label: t('proj_sum'),
      type: 'textarea',
      className: 'col s12',
      readonly: true,
    },
    {
      id: 'evaluation',
      label: t('evaluation'),
      type: 'textarea',
    },
    {
      id: 'projectStakeholders',
      label: t('shs'),
      type: 'table',
      disabled: true,
      className: 'col m12',
      options: [
        {
          id: 'stakeholderId',
          label: t('sh'),
          type: 'select',
          options: 'stakeholders',
          className: 'col s4 m2',
          readonly: true,
        },
        {
          id: 'persons',
          label: t('pers_inv'),
          type: 'textarea',
          className: 'col s8 m10',
          readonly: true,
        },
      ],
    },
    {
      id: 'gapAssessment',
      type: 'assessment',
      options: 'mainGaps',
      optionLabel: t('prob_areas'),
      assessmentOptions: 'gapScale',
      assessmentLabel: t('addressed'),
      descriptionLabel: t('addr_how?'),
      readonly: true,
    },
    {
      id: 'performanceAssessment',
      type: 'assessment',
      options: 'performanceAspects',
      optionLabel: t('perf_asp'),
      assessmentOptions: 'performanceScale',
      assessmentLabel: t('perf'),
      descriptionLabel: t('expl'),
      overallAssessmentLabel: t('exp_perf'),
      overallAssessment: 'avg',
      readonly: true,
    },
  ] as UIForm<any>;
