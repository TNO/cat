import { UIForm } from 'mithril-ui-form';
import { t } from 'mithriljs-i18n';

export type Development = {
  label: string;
  start: string;
};

export const developmentModel = () =>
  [
    {
      id: 'label',
      label: t('prop_name'),
      show: '!approved',
      type: 'text',
      className: 'col s6 m4',
    },
    {
      id: 'label',
      label: t('proj_name'),
      show: 'approved',
      type: 'text',
      className: 'col s6 m4',
    },
    {
      id: 'start',
      label: t('start_time'),
      placeholder: t('period'),
      type: 'text',
      className: 'col s3 m2',
    },
    {
      id: 'duration',
      label: t('duration'),
      placeholder: t('in_months'),
      type: 'text',
      className: 'col s3 m2',
    },
    {
      id: 'capabilityIds',
      label: t('caps'),
      placeholder: t('pick_more'),
      type: 'select',
      multiple: true,
      options: 'capabilities',
      className: 'col s12 m4',
    },
    {
      id: 'proposal',
      label: t('proj_sum'),
      type: 'textarea',
      className: 'col s12',
    },
    {
      id: 'projectStakeholders',
      label: t('sh_org'),
      pageSize: 5,
      repeat: true,
      type: [
        {
          id: 'stakeholderId',
          label: t('sh'),
          type: 'select',
          options: 'stakeholders',
          className: 'col s4 m2',
        },
        {
          id: 'persons',
          label: t('pers_inv'),
          type: 'textarea',
          className: 'col s8 m10',
        },
      ],
      className: 'col m12',
    },
    {
      id: 'gapAssessment',
      type: 'assessment',
      options: 'mainGaps',
      optionLabel: t('prob_areas'),
      assessmentOptions: 'gapScale',
      assessmentLabel: t('addressed'),
      descriptionLabel: t('addr_how'),
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
    },
    { type: 'md', value: t('proj_app'), className: 'margins right-align' },
    {
      id: 'approved',
      type: 'switch',
      className: 'margins right-align',
      label: t(''),
      options: [
        { id: 'no', label: t('no') },
        { id: 'yes', label: t('yes') },
      ],
    },
  ] as UIForm<Development>;
