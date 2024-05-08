import { UIForm } from 'mithril-ui-form';
import { ICapabilityDataModel } from './capability-model';
import { t } from 'mithriljs-i18n';

export const settingsModel = () =>
  [
    { id: 'general-settings', type: 'section', label: t('general_settings') },
    {
      id: 'enableSolutionAssessmentSupport',
      label: t('enable_sol_ass_support'),
      className: 'col s12 m9',
      type: 'switch',
      options: [
        { id: 'no', label: t('no') },
        { id: 'yes', label: t('yes') },
      ],
    },
    {
      id: 'logo',
      label: t('logo'),
      type: 'base64',
      className: 'col s12 m3',
      options: [{ id: '.png' }, { id: '.jpg ' }],
    },
    {
      id: 'attributionText',
      label: t('attribution_text'),
      type: 'textarea',
      className: 'col s12 m9',
    },
    {
      id: 'attributionLogo',
      label: t('attribution_logo'),
      type: 'base64',
      className: 'col s12 m3',
      options: [{ id: '.png' }, { id: '.jpg ' }],
    },

    { id: 'task-settings', type: 'section', label: t('tasks') },
    { type: 'md', value: t('task_settings') },
    {
      id: 'taskScale',
      label: t('goal_scale'),
      repeat: true,
      sortProperty: 'id',
      type: [
        { id: 'id', label: t('id'), type: 'text', className: 'col s3 m2' },
        { id: 'label', label: t('value'), type: 'text', className: 'col s6 m8' },
        { id: 'color', label: t('color'), value: '#ffffff', type: 'color', className: 'col s3 m2' },
      ],
    },
    { id: 'performance-settings', type: 'section', label: t('perf') },
    { type: 'md', value: t('perf_settings') },
    {
      id: 'performanceAspects',
      label: t('perf_asps'),
      repeat: true,
      sortProperty: 'id',
      type: [
        { id: 'id', label: t('id'), type: 'text', className: 'col s3 m2' },
        { id: 'label', label: t('task'), type: 'text', className: 'col s9 m10' },
        { id: 'desc', label: t('expl2'), type: 'textarea', className: 'col s12' },
      ],
    },
    {
      id: 'performanceScale',
      label: t('perf_scale'),
      repeat: true,
      sortProperty: 'id',
      type: [
        { id: 'id', label: t('id'), type: 'text', className: 'col s3 m2' },
        { id: 'label', label: t('value'), type: 'text', className: 'col s6 m8' },
        { id: 'color', label: t('color'), value: '#ffffff', type: 'color', className: 'col s3 m2' },
      ],
    },
    { id: 'gap-settings', type: 'section', label: t('gaps') },
    { type: 'md', value: t('gap_settings') },
    {
      id: 'mainGaps',
      label: t('gaps_common'),
      repeat: true,
      sortProperty: 'id',
      type: [
        { id: 'id', label: t('id'), type: 'text', className: 'col s3 m2' },
        { id: 'label', label: t('gap'), type: 'text', className: 'col s9 m10' },
        { id: 'desc', label: t('desc'), type: 'textarea', className: 'col s12' },
      ],
    },
    {
      id: 'gapScale',
      label: t('gap_scale'),
      repeat: true,
      sortProperty: 'id',
      type: [
        { id: 'id', label: t('id'), type: 'text', className: 'col s3 m2' },
        { id: 'label', label: t('value'), type: 'text', className: 'col s6 m8' },
        { id: 'color', label: t('color'), value: '#ffffff', type: 'color', className: 'col s3 m2' },
      ],
    },
    { id: 'assessment-settings', type: 'section', label: t('ass_setting') },
    { type: 'md', value: t('task2perf') },
    {
      id: 'assessmentScale',
      label: t('ass_scale'),
      repeat: true,
      sortProperty: 'id',
      type: [
        { id: 'id', label: t('id'), type: 'text', className: 'col s3 m2' },
        { id: 'label', label: t('value'), type: 'text', className: 'col s6 m8' },
        { id: 'color', label: t('color'), value: '#ffffff', type: 'color', className: 'col s3 m2' },
      ],
    },
    {
      id: 'assessmentTable',
      type: 'create-lookup-table',
      options: 'assessmentScale',
      rows: 'taskScale',
      cols: 'performanceScale',
      label: t('ass_perf_scale'),
      rowHeader: t('ass_task_scale'),
    },
  ] as UIForm<ICapabilityDataModel>;
