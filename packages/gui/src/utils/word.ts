import {
  AlignmentType,
  Document,
  HeadingLevel,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  convertInchesToTwip,
} from 'docx';
import { saveAs } from 'file-saver';
import { ICapability, ICapabilityDataModel } from '../models';
import { t } from 'mithriljs-i18n';
import { FileChild } from 'docx/build/file/file-child';

const blue = '2F5496';

const toTable = (rows: string[][]) => {
  const table = new Table({
    width: {
      size: '100%',
      type: 'auto',
    },
    rows: rows.map(
      (row, i) =>
        new TableRow({
          children: row.map(
            (cell) =>
              new TableCell({
                shading:
                  i === 0
                    ? {
                        // fill: '880aa8',
                        type: ShadingType.SOLID,
                        color: blue,
                      }
                    : undefined,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: cell,
                        bold: i === 0,
                        color: i === 0 ? 'FFFFFF' : undefined,
                      }),
                    ],
                  }),
                ],
              })
          ),
        })
    ),
  });
  return table;
};

export const toWord = async (
  filename: string,
  data: Partial<ICapabilityDataModel>,
  cap: ICapability
) => {
  const {
    assessmentScale = [],
    title = 'cat',
    categories = [],
    stakeholders = [],
    taskScale = [],
    performanceScale = [],
    gapScale = [],
  } = data;
  const category = categories.find((c) => c.id === cap.categoryId);
  const subcategory = category && category.subcategories.find((c) => c.id === cap.subcategoryId);
  const shs =
    cap.capabilityStakeholders &&
    stakeholders.filter((s) => cap.capabilityStakeholders!.includes(s.id));

  const tasks = cap.taskAssessment?.items || [];
  const assRows = [
    [t('main_goals'), t('importance'), t('expl')],
    ...tasks.map((t) => [
      t.label || '',
      taskScale.find((ts) => ts.id === t.value)?.label || '',
      t.desc || '',
    ]),
  ];

  const perf = cap.performanceAssessment?.items || [];
  const perfRows = [
    [t('perf_asps'), t('level'), t('expl')],
    ...perf.map((t) => [
      t.label || '',
      performanceScale.find((ts) => ts.id === t.value)?.label || '',
      t.desc || '',
    ]),
  ];

  const gaps = cap.gapAssessment?.items || [];
  const gapRows = [
    [t('prob_areas'), t('relevance'), t('expl')],
    ...gaps.map((t) => [
      t.label || '',
      gapScale.find((ts) => ts.id === t.value)?.label || '',
      t.desc || '',
    ]),
  ];

  const stakeholderList = shs
    ? shs.map((s) => {
        return new Paragraph({
          text: s.label,
          numbering: {
            reference: 'my-numbering-reference',
            level: 0,
          },
          contextualSpacing: true,
          spacing: {
            before: 200,
          },
        });
      })
    : [];

  const doc = new Document({
    creator: 'TNO',
    title: `${title} Capability Assessment`,
    description: 'A capability assessment.',
    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
            color: '000000',
            language: {
              value: 'en-UK',
            },
          },
        },
      },
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            color: blue,
            size: `18pt`,
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            color: blue,
            size: `16pt`,
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            color: blue,
            size: `14pt`,
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        {
          id: 'Heading4',
          name: 'Heading 4',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            color: blue,
            size: `12pt`,
            bold: true,
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
        {
          id: 'aside',
          name: 'Aside',
          basedOn: 'Normal',
          next: 'Normal',
          run: {
            color: '999999',
            italics: true,
          },
          paragraph: {
            indent: {
              left: 720,
            },
            spacing: {
              line: 276,
            },
          },
        },
        {
          id: 'wellSpaced',
          name: 'Well Spaced',
          basedOn: 'Normal',
          quickFormat: true,
          paragraph: {
            spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },
          },
        },
        {
          id: 'ListParagraph',
          name: 'List Paragraph',
          basedOn: 'Normal',
          quickFormat: true,
        },
      ],
    },
    numbering: {
      config: [
        {
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1',
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: { left: convertInchesToTwip(0.5), hanging: convertInchesToTwip(0.18) },
                },
              },
            },
          ],
          reference: 'my-numbering-reference',
        },
      ],
    },
    sections: [
      {
        children: [
          new Paragraph({
            text: t('doc_title'),
            heading: HeadingLevel.TITLE,
          }),
          category &&
            new Paragraph({
              text: category.label,
              heading: HeadingLevel.HEADING_1,
            }),
          subcategory &&
            new Paragraph({
              text: subcategory.label,
              heading: HeadingLevel.HEADING_2,
            }),
          new Paragraph({
            text: `${t('cap')} "${cap.label}" - ${t('ass_overall')}: ${
              assessmentScale.find((ts) => ts.id === cap.assessmentId)?.label || ''
            }`,
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({
            text: cap.desc,
          }),
          new Paragraph({
            text: t('shs'),
            heading: HeadingLevel.HEADING_4,
          }),
          ...stakeholderList,
          new Paragraph({
            text: `${t('goal')} - ${t('max_imp')}: ${
              taskScale.find((ts) => ts.id === cap.taskAssessment?.assessmentId)?.label || ''
            }`,
            heading: HeadingLevel.HEADING_4,
          }),
          toTable(assRows),
          new Paragraph({
            text: `${t('perf_asps')} - ${t('avg_perf')}: ${
              performanceScale.find((ts) => ts.id === cap.performanceAssessment?.assessmentId)
                ?.label || ''
            }`,
            heading: HeadingLevel.HEADING_4,
          }),
          toTable(perfRows),
          new Paragraph({
            text: t('prob_areas'),
            heading: HeadingLevel.HEADING_4,
          }),
          toTable(gapRows),
        ].filter((i) => i) as readonly FileChild[],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    // saveAs from FileSaver will download the blob
    saveAs(blob, filename);
  });
};
