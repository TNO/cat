import { UIForm } from 'mithril-ui-form-plugin';
import { CapabilityStakeholder, Documentation } from './capability-model';
import { t } from 'mithriljs-i18n';

export type Assessment = Partial<{
  desc: string;
  capabilityStakeholders: CapabilityStakeholder[];
  documentation: Documentation[];
  taskAssessment: unknown;
  performanceAssessment: unknown;
  gapAssessment: unknown;
  assessmentId: unknown;
  shouldDevelop: 'GO' | 'NO GO';
}>;

export const assessmentModel = () =>
  [
    {
      id: 'desc',
      label: t('desc'),
      placeholder: t('desc_cap_instr'),
      type: 'textarea',
      className: 'col s12',
    },
    {
      id: 'capabilityStakeholders',
      label: t('shs'),
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
          id: 'goal',
          label: t('goals'),
          placeholder: t('goals_instr'),
          type: 'textarea',
          className: 'col s8 m10',
        },
      ],
      className: 'col m12',
    },
    {
      id: 'documentation',
      label: t('doc'),
      repeat: true,
      pageSize: 5,
      type: [
        {
          id: 'documentId',
          label: t('doc_id'),
          type: 'text',
          className: 'col s3 m2',
        },
        {
          id: 'label',
          label: t('title'),
          type: 'text',
          className: 'col s6 m6',
        },
        {
          id: 'link',
          label: t('url'),
          type: 'url',
          className: 'col s3 m4',
        },
      ],
      className: 'col m12',
    },
    {
      id: 'taskAssessment',
      type: 'assessment',
      options: 'mainTasks',
      optionLabel: t('main_goals'),
      assessmentOptions: 'taskScale',
      assessmentLabel: t('importance'),
      descriptionLabel: t('Explanation'),
      overallAssessmentLabel: t('max_imp'),
      overallAssessment: 'max',
    },
    {
      id: 'performanceAssessment',
      type: 'assessment',
      options: 'performanceAspects',
      optionLabel: t('perf_asp'),
      assessmentOptions: 'performanceScale',
      assessmentLabel: t('expl'),
      overallAssessmentLabel: t('avg_perf'),
      overallAssessment: 'avg',
    },
    {
      id: 'gapAssessment',
      type: 'assessment',
      options: 'mainGaps',
      optionLabel: t('prob_areas'),
      assessmentOptions: 'gapScale',
      assessmentLabel: t('expl'),
      overallAssessmentLabel: t('ass_label'),
      overallAssessment: 'max',
    },
    {
      id: 'assessmentId',
      label: t('ass_overall'),
      type: 'lookup-table',
      table: 'assessmentTable',
      options: 'assessmentScale',
      rowId: 'taskAssessment.assessmentId',
      colId: 'performanceAssessment.assessmentId',
    },
    { type: 'md', value: t('gng'), className: 'right-align' },
    {
      id: 'shouldDevelop',
      type: 'switch',
      className: 'right-align',
      label: '',
      options: [
        { id: 'NO GO', label: t('no_go') },
        { id: 'GO', label: t('go') },
      ],
    },
  ] as UIForm<Assessment>;
