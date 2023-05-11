import { UIForm } from 'mithril-ui-form';
import { ICapabilityModel } from './capability-model';

export const settingsModel = [
  { id: 'stakeholder-settings', type: 'section', label: 'Stakeholders' },
  { type: 'md', value: '##### Stakeholder/stakeholder settings' },
  {
    id: 'stakeholderTypes',
    label: 'Stakeholder types',
    repeat: true,
    pageSize: 1,
    propertyFilter: 'label',
    sortProperty: 'id',
    type: [
      { id: 'id', type: 'text', className: 'col s4 m3' },
      { id: 'label', type: 'text', label: 'Name', className: 'col s8 m9' },
    ],
  },

  { id: 'task-settings', type: 'section', label: 'Tasks' },
  { type: 'md', value: '##### Task settings' },
  {
    id: 'taskScale',
    label: 'Scale for the main goals',
    repeat: true,
    pageSize: 1,
    sortProperty: 'id',
    type: [
      { id: 'id', label: 'ID', type: 'text', className: 'col s3 m2' },
      { id: 'label', label: 'Value', type: 'text', className: 'col s6 m8' },
      { id: 'color', label: 'Color', value: '#ffffff', type: 'color', className: 'col s3 m2' },
    ],
  },
  { id: 'performance-settings', type: 'section', label: 'Performance' },
  { type: 'md', value: '##### Performance settings' },
  {
    id: 'performanceAspects',
    label: 'Performance aspects',
    repeat: true,
    pageSize: 1,
    sortProperty: 'id',
    type: [
      { id: 'id', label: 'ID', type: 'text', className: 'col s3 m2' },
      { id: 'label', label: 'Task', type: 'text', className: 'col s9 m10' },
      { id: 'desc', label: 'Description', type: 'textarea', className: 'col s12' },
    ],
  },
  {
    id: 'performanceScale',
    label: 'Scale for performance score',
    repeat: true,
    pageSize: 1,
    sortProperty: 'id',
    type: [
      { id: 'id', label: 'ID', type: 'text', className: 'col s3 m2' },
      { id: 'label', label: 'Value', type: 'text', className: 'col s6 m8' },
      { id: 'color', label: 'Color', value: '#ffffff', type: 'color', className: 'col s3 m2' },
    ],
  },
  { id: 'gap-settings', type: 'section', label: 'Gaps' },
  { type: 'md', value: '##### Gaps settings' },
  {
    id: 'mainGaps',
    label: 'Common gaps or causes of problems',
    repeat: true,
    pageSize: 1,
    sortProperty: 'id',
    type: [
      { id: 'id', label: 'ID', type: 'text', className: 'col s3 m2' },
      { id: 'label', label: 'Gap', type: 'text', className: 'col s9 m10' },
      { id: 'desc', label: 'Description', type: 'textarea', className: 'col s12' },
    ],
  },
  {
    id: 'gapScale',
    label: 'Scale for the gap',
    repeat: true,
    pageSize: 1,
    sortProperty: 'id',
    type: [
      { id: 'id', label: 'ID', type: 'text', className: 'col s3 m2' },
      { id: 'label', label: 'Value', type: 'text', className: 'col s6 m8' },
      { id: 'color', label: 'Color', value: '#ffffff', type: 'color', className: 'col s3 m2' },
    ],
  },
  { id: 'assessment-settings', type: 'section', label: 'Assessment' },
  { type: 'md', value: '##### Task to performance table lookup' },
  {
    id: 'assessmentScale',
    label: 'Scale for assessment score',
    repeat: true,
    pageSize: 1,
    sortProperty: 'id',
    type: [
      { id: 'id', label: 'ID', type: 'text', className: 'col s3 m2' },
      { id: 'label', label: 'Value', type: 'text', className: 'col s6 m8' },
      { id: 'color', label: 'Color', value: '#ffffff', type: 'color', className: 'col s3 m2' },
    ],
  },
  {
    id: 'assessmentTable',
    type: 'create-lookup-table',
    label: 'task \\ perf. scale',
    options: 'assessmentScale',
    rows: 'taskScale',
    cols: 'performanceScale',
  },
] as UIForm<ICapabilityModel>;
