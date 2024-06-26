import { UIForm } from 'mithril-ui-form';
import { Documentation, ICapabilityDataModel, ILabelled } from './capability-model';
import { t } from 'mithriljs-i18n';

export type AssessmentItem = {
  assessmentId: string;
  items: ILabelled[];
};

export type Assessment = Partial<{
  desc: string;
  capabilityStakeholders: string[];
  documentation: Documentation[];
  taskAssessment: AssessmentItem;
  performanceAssessment: AssessmentItem;
  gaps: AssessmentItem[];
  assessmentId: unknown;
  shouldDevelop: 'GO' | 'NO GO';
}>;

export const assessmentModel = (model: Partial<ICapabilityDataModel>) => {
  const assessmentModel = [
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
      type: 'options',
      options: 'stakeholders',
      checkboxClass: 'col s4',
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
      optionLabel: t('perf_asps'),
      assessmentOptions: 'performanceScale',
      assessmentLabel: t('level'),
      descriptionLabel: t('Explanation'),
      overallAssessmentLabel: t('avg_perf'),
      overallAssessment: 'avg',
      excludeLabel: t('ignore'),
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
    {
      id: 'gaps',
      label: t('add_gap'),
      repeat: true,
      pageSize: 1,
      // onNewItem: (obj: any, i: any) => {
      //   console.log('CALLED: ' + i);
      //   console.log(obj);
      //   return {};
      // },
      type: [
        { id: 'title', label: t('title'), type: 'text', className: 'col s8 m5 l3' },
        { id: 'desc', label: t('desc'), type: 'textarea', className: 'col m7 l9' },
        {
          id: 'gapAssessment',
          type: 'assessment',
          options: 'mainGaps',
          optionLabel: t('prob_areas'),
          assessmentOptions: 'gapScale',
          assessmentLabel: t('relevance'),
          descriptionLabel: t('Explanation'),
          // overallAssessmentLabel: t('ass_label'),
          overallAssessment: 'max',
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
      ],
    },
    ,
  ] as UIForm<Assessment>;
  if (model.enableSolutionAssessmentSupport) {
    assessmentModel.push(
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
      }
    );
  }
  return assessmentModel;
};
