import { UIForm } from 'mithril-ui-form';
import { ICapabilityDataModel } from './capability-model';
import { t } from 'mithriljs-i18n';

export const settingsModel = () =>
  [
    { id: 'stakeholder-settings', type: 'section', label: t('sh') },
    { type: 'md', value: t('sh_settings') },
    {
      id: 'stakeholderTypes',
      label: t('sh_types'),
      repeat: true,
      propertyFilter: 'label',
      sortProperty: 'id',
      type: [
        { id: 'id', type: 'text', className: 'col s4 m3' },
        { id: 'label', type: 'text', label: t('name'), className: 'col s8 m9' },
      ],
    },
    {
      id: 'stakeholders',
      label: t('sh'),
      repeat: true,
      propertyFilter: 'label',
      sortProperty: 'id',
      type: [
        { id: 'id', type: 'text', className: 'col s3 m3' },
        { id: 'label', type: 'text', label: t('name'), className: 'col s6 m6' },
        {
          id: 'type',
          type: 'select',
          label: t('sh_type'),
          options: 'stakeholderTypes',
          className: 'col s3 m3',
        },
      ],
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
        { id: 'desc', label: t('desc'), type: 'textarea', className: 'col s12' },
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
      label: t('task_perf_scale'),
      options: 'assessmentScale',
      rows: 'taskScale',
      cols: 'performanceScale',
    },
  ] as UIForm<ICapabilityDataModel>;
