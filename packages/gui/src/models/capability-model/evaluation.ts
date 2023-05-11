import { UIForm } from 'mithril-ui-form-plugin';

export const evaluationModel = [
  {
    id: 'evaluation',
    label: 'Evaluation',
    type: 'textarea',
  },
] as UIForm<any>;

export const projectEvaluationModel = [
  {
    id: 'label',
    label: 'Project name',
    type: 'text',
    className: 'col s6 m4',
    readonly: true,
  },
  {
    id: 'start',
    label: 'Start time',
    placeholder: 'YYYY Q1 or YYYY M1',
    type: 'text',
    className: 'col s3 m2',
    readonly: true,
  },
  {
    id: 'duration',
    label: 'Duration',
    placeholder: 'In months',
    type: 'text',
    className: 'col s3 m2',
    readonly: true,
  },
  {
    id: 'capabilityIds',
    label: 'Capabilities',
    placeholder: 'Pick one or more',
    type: 'select',
    multiple: true,
    options: 'capabilities',
    className: 'col s12 m4',
    readonly: true,
  },
  {
    id: 'proposal',
    label: 'Project summary',
    type: 'textarea',
    className: 'col s12',
    readonly: true,
  },
  ...evaluationModel,
  {
    id: 'projectStakeholders',
    label: 'Stakeholders',
    type: 'table',
    disabled: true,
    className: 'col m12',
    options: [
      {
        id: 'stakeholderId',
        label: 'Stakeholder',
        type: 'select',
        options: 'stakeholders',
        className: 'col s4 m2',
        readonly: true,
      },
      {
        id: 'persons',
        label: 'Persons involved',
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
    optionLabel: 'Problem areas',
    assessmentOptions: 'gapScale',
    assessmentLabel: 'Addressed',
    descriptionLabel: 'How is it addressed?',
    readonly: true,
  },
  {
    id: 'performanceAssessment',
    type: 'assessment',
    options: 'performanceAspects',
    optionLabel: 'Performance aspect',
    assessmentOptions: 'performanceScale',
    assessmentLabel: 'Performance',
    descriptionLabel: 'Explanation',
    overallAssessmentLabel: 'Expected performance',
    overallAssessment: 'avg',
    readonly: true,
  },
] as UIForm<any>;
