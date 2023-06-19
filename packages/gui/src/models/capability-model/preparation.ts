import { UIForm } from 'mithril-ui-form';
import { t } from 'mithriljs-i18n';

export const preparationModel = () =>
  [
    { type: 'section', id: 'goal_section', label: t('group_goals') },
    {
      type: 'md',
      label: t('group_goals_instr'),
    },
    {
      id: 'mainTasks',
      label: t('main_goals'),
      repeat: true,
      pageSize: 1,
      sortProperty: 'id',
      type: [
        { id: 'id', label: t('id'), type: 'text', className: 'col s3 m2' },
        { id: 'label', label: t('goal'), type: 'text', className: 'col s9 m10' },
        { id: 'desc', label: t('desc'), type: 'textarea', className: 'col s12' },
      ],
    },
    { type: 'section', id: 'stakeholder_section', label: t('spec_sh') },
    {
      type: 'md',
      label: t('spec_sh_instr'),
    },
    {
      id: 'stakeholders',
      label: t('sh_org'),
      repeat: true,
      pageSize: 1,
      propertyFilter: 'label',
      type: [
        { id: 'id', type: 'text', label: t('acronym'), className: 'col s3 m2' },
        {
          id: 'label',
          label: t('org_dept'),
          type: 'text',
          className: 'col s9 m7',
        },
        {
          id: 'type',
          label: t('sh_type'),
          type: 'select',
          options: 'stakeholderTypes',
          className: 'col s12 m3',
        },
        {
          id: 'goals',
          label: t('goals'),
          type: 'textarea',
        },
      ],
    },
    { type: 'section', id: 'category_section', label: t('spec_cat') },
    {
      type: 'md',
      label: t('spec_cat_instr'),
    },
    {
      id: 'categories',
      label: t('cap_cat'),
      repeat: true,
      pageSize: 1,
      propertyFilter: 'label',
      sortProperty: 'id',
      type: [
        { id: 'id', type: 'text', className: 'col s4 m3' },
        { id: 'label', type: 'text', label: t('name'), className: 'col s8 m9' },
        { id: 'desc', type: 'textarea', label: t('desc'), className: 'col s12' },
        {
          id: 'subcategories',
          label: t('subcat'),
          repeat: true,
          propertyFilter: 'label',
          sortProperty: 'id',
          tabindex: 2,
          className: 'col offset-s1 s11',
          type: [
            { id: 'id', type: 'text', className: 'col s4 m3' },
            { id: 'label', type: 'text', label: t('name'), className: 'col s8 m9' },
            { id: 'desc', type: 'textarea', label: t('desc'), className: 'col s12' },
          ],
        },
      ],
    },
    { type: 'section', id: 'capability_section', label: t('spec_cap') },
    {
      type: 'md',
      label: t('spec_cap_instr'),
    },
    {
      id: 'capabilities',
      label: t('create_cap'),
      repeat: true,
      pageSize: 1,
      propertyFilter: 'label',
      // sortProperty: 'categoryId',
      filterLabel: t('filter_cap'),
      type: [
        {
          id: 'categoryId',
          label: t('cat'),
          type: 'select',
          options: 'categories',
          className: 'col s12 m3',
        },
        {
          id: 'subcategoryId',
          label: t('subcat'),
          type: 'select',
          options: 'categories.categoryId.subcategories',
          className: 'col s12 m3',
        },
        {
          id: 'label',
          label: t('cap'),
          type: 'text',
          className: 'col s12 m4',
        },
        {
          id: 'id',
          label: t('id'),
          type: 'text',
          className: 'col s12 m2',
        },
        {
          id: 'desc',
          label: t('desc'),
          placeholder: 'desc_cap_instr',
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
              className: 'col s6 m4',
            },
            {
              id: 'link',
              label: t('url'),
              type: 'url',
              className: 'col s3 m3',
            },
            {
              id: 'location',
              label: t('loc'),
              type: 'text',
              className: 'col s6 m3',
            },
          ],
          className: 'col m12',
        },
      ],
    },
  ] as UIForm;
