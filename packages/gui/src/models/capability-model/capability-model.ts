import { UIForm } from 'mithril-ui-form';
import { assessmentModel } from './assessment';
import { developmentModel } from './development';
import { evaluationModel, projectEvaluationModel } from './evaluation';
import { preparationModel } from './preparation';
import { settingsModel } from './settings';
import { lexicon } from './lexicon';

export type ProjectProposal = {
  id: number;
  label?: string;
  start?: string;
  duration?: string;
  proposal?: string;
  capabilityIds?: string[];
  projectStakeholders?: Array<{
    stakeholderId?: string;
    persons?: string;
  }>;
  gapAssessment?: Array<{
    id: string;
    value?: string;
    desc?: string;
  }>;
  performanceAssessment?: Array<{
    id: string;
    value?: string;
    desc?: string;
  }>;
  approved?: boolean;
};

export interface ICapabilityDataModel {
  stakeholders?: IStakeholder[];
  categories?: ICategory[];
  capabilities?: ICapability[];
  projectProposals?: Array<ProjectProposal>;
  mainTasks?: ILabelled[];
  taskScale?: ILabelled[];
  performanceAspects?: ILabelled[];
  performanceScale?: ILabelled[];
  assessmentTable?: Array<{ rowId: string; colId: string; optionId: string }>;
  assessmentScale?: ILabelled[];
  mainGaps?: ILabelled[];
  gapScale?: ILabelled[];
  lexicon?: Array<ILabelled & { ref?: string; url?: string }>;
}

export interface ICapabilityModel {
  version?: number;
  preparations?: UIForm<any>;
  assessment?: UIForm<any>;
  development?: UIForm<any>;
  evaluation?: UIForm<any>;
  projectEvaluation?: UIForm<any>;
  settings?: UIForm<any>;
  data: ICapabilityDataModel;
}

export interface ILabelled {
  id: string;
  label: string;
  desc?: string;
  color?: string;
}

export interface ICategory extends ILabelled {
  subcategories: ILabelled[];
}

export interface ICapability extends ILabelled {
  categoryId: string;
  subcategoryId: string;
  desc?: string;
  goal?: string;
  capabilityStakeholders?: Array<{ stakeholderId: string; goal?: string }>;
  documentation?: Array<{ documentId?: string; label?: string; url?: string; location?: string }>;
  assessmentId?: string;
  shouldDevelop?: boolean;
}

export interface IStakeholder extends ILabelled {
  typeId: string;
}

const redGreenColors = ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'];
const towardsRedColors = ['#fef0d9', '#fdcc8a', '#fc8d59', '#e34a33', '#b30000'];

export const defaultCapabilityModel = {
  version: 0,
  preparations: preparationModel,
  assessment: assessmentModel,
  development: developmentModel,
  evaluation: evaluationModel,
  projectEvaluation: projectEvaluationModel,
  settings: settingsModel,
  data: {
    stakeholderTypes: [
      { id: 'ST1', label: 'Law enforcement' },
      { id: 'ST2', label: 'Governmental' },
      { id: 'ST3', label: 'Public safety' },
      { id: 'ST4', label: 'First response' },
      { id: 'ST5', label: 'RTO/University' },
      { id: 'ST6', label: 'Training institute' },
      { id: 'ST7', label: 'Other' },
    ],
    stakeholders: [
      { id: 'NCTV', label: 'NCTV', typeId: 'ST1' },
      { id: 'IFV', label: 'IFV', typeId: 'ST2' },
    ],
    categories: [
      {
        id: 'C1',
        label: 'Primary capabilities',
        subcategories: [
          { id: 'P1', label: 'Investigate' },
          { id: 'P2', label: 'Prevent' },
          { id: 'P3', label: 'Disrupt & Intervene' },
          { id: 'P4', label: 'Find & Arrest' },
          { id: 'P5', label: 'Prosecute & Evidence' },
        ],
      },
      {
        id: 'C2',
        label: 'Enabling capabilities',
        subcategories: [
          { id: 'E1', label: 'Intelligence' },
          { id: 'E2', label: 'Coordinate' },
          { id: 'E3', label: 'Collaborate' },
        ],
      },
      {
        id: 'C3',
        label: 'Preparatory capabilities',
        subcategories: [
          { id: 'Y1', label: 'Prepare' },
          { id: 'Y2', label: 'Training' },
          { id: 'Y3', label: 'Logistics' },
        ],
      },
    ],
    capabilities: [
      { id: 'IV1', categoryId: 'C1', subcategoryId: 'P1', label: 'Entity' },
      { id: 'IV2', categoryId: 'C1', subcategoryId: 'P1', label: 'Platform' },
      { id: 'IV3', categoryId: 'C1', subcategoryId: 'P1', label: 'Infrastructure' },
      { id: 'IV4', categoryId: 'C1', subcategoryId: 'P1', label: 'OSINT' },
      { id: 'IV5', categoryId: 'C1', subcategoryId: 'P1', label: 'Financial' },
      { id: 'PV1', categoryId: 'C1', subcategoryId: 'P2', label: 'Monitoring' },
      { id: 'PV2', categoryId: 'C1', subcategoryId: 'P2', label: 'Deterrence' },
      { id: 'PV3', categoryId: 'C1', subcategoryId: 'P2', label: 'Prevent money laundering' },
      { id: 'DI1', categoryId: 'C1', subcategoryId: 'P3', label: 'Platform disruption' },
      { id: 'DI2', categoryId: 'C1', subcategoryId: 'P3', label: 'Undercover work' },
      { id: 'DI3', categoryId: 'C1', subcategoryId: 'P3', label: 'Takedowns' },
      { id: 'DI4', categoryId: 'C1', subcategoryId: 'P3', label: 'Offensive work' },
      { id: 'DI5', categoryId: 'C1', subcategoryId: 'P3', label: 'Confiscate valuta' },
      { id: 'FA1', categoryId: 'C1', subcategoryId: 'P4', label: 'Digital forensics' },
      { id: 'FA1', categoryId: 'C1', subcategoryId: 'P4', label: 'Arrest' },
      { id: 'PE1', categoryId: 'C1', subcategoryId: 'P5', label: 'Digital evidence' },
      { id: 'PE2', categoryId: 'C1', subcategoryId: 'P5', label: 'Physical evidence' },
      {
        id: 'PE3',
        categoryId: 'C1',
        subcategoryId: 'P5',
        label: 'Making evidence understandable in court',
      },
      {
        id: 'PE4',
        categoryId: 'C1',
        subcategoryId: 'P5',
        label: 'Provide supportive documentation',
      },
      { id: 'IN1', categoryId: 'C2', subcategoryId: 'E1', label: 'Data collection & processing' },
      { id: 'IN2', categoryId: 'C2', subcategoryId: 'E1', label: 'Data analysis' },
      { id: 'IN3', categoryId: 'C2', subcategoryId: 'E1', label: 'Real time intelligence' },
      { id: 'CD1', categoryId: 'C2', subcategoryId: 'E2', label: 'Lead' },
      { id: 'CD2', categoryId: 'C2', subcategoryId: 'E2', label: 'Target identification' },
      { id: 'CD3', categoryId: 'C2', subcategoryId: 'E2', label: 'Planning & coordination' },
      { id: 'CL1', categoryId: 'C2', subcategoryId: 'E3', label: 'Standardisation' },
      { id: 'CL2', categoryId: 'C2', subcategoryId: 'E3', label: 'Joint investigations' },
      { id: 'CL3', categoryId: 'C2', subcategoryId: 'E3', label: 'Create non-LEA network' },
      { id: 'CL4', categoryId: 'C2', subcategoryId: 'E3', label: 'Stakeholder management' },
      { id: 'PP1', categoryId: 'C3', subcategoryId: 'Y1', label: 'Monitoring' },
      { id: 'PP2', categoryId: 'C3', subcategoryId: 'Y1', label: 'Trend identification' },
      { id: 'PP3', categoryId: 'C3', subcategoryId: 'Y1', label: 'Research & development' },
      {
        id: 'PP4',
        categoryId: 'C3',
        subcategoryId: 'Y1',
        label: 'Legislative & institutional framework',
      },
      { id: 'PP5', categoryId: 'C3', subcategoryId: 'Y1', label: 'Strategic foresight' },
      { id: 'TR1', categoryId: 'C3', subcategoryId: 'Y2', label: 'Skill training' },
      { id: 'TR2', categoryId: 'C3', subcategoryId: 'Y2', label: 'Education' },
      { id: 'TR3', categoryId: 'C3', subcategoryId: 'Y2', label: 'Evaluate' },
      { id: 'LO1', categoryId: 'C3', subcategoryId: 'Y3', label: 'Technical augmentation' },
      {
        id: 'LO2',
        categoryId: 'C3',
        subcategoryId: 'Y3',
        label: 'Material purchase & maintenance',
      },
      { id: 'LO3', categoryId: 'C3', subcategoryId: 'Y3', label: 'Sustainable personnel' },
      { id: 'LO4', categoryId: 'C3', subcategoryId: 'Y3', label: 'OPSEC' },
    ],
    mainTasks: [
      { id: 'MG1', label: 'Preventing dark web & cryptocurrency criminality' },
      { id: 'MG2', label: 'Reduce impact of dark web & cryptocurrency criminality' },
      {
        id: 'MG3',
        label: 'Finding, arresting and prosecuting criminals operating on the dark web',
      },
    ],
    taskScale: [
      { id: 'TS1', color: towardsRedColors[0], label: 'Barely' },
      { id: 'TS2', color: towardsRedColors[1], label: 'Low' },
      { id: 'TS3', color: towardsRedColors[2], label: 'Moderate' },
      { id: 'TS4', color: towardsRedColors[3], label: 'High' },
      { id: 'TS5', color: towardsRedColors[4], label: 'Essential' },
    ],
    performanceAspects: [
      {
        id: 'PA1',
        label: 'Effectivity of the capability',
        desc: `- Quality of the results
- Timeliness of the results
- The ability to deliver results as long as required`,
      },
      {
        id: 'PA2',
        label: 'Safe work environment professionals',
        desc: 'Physical and mental health of employees policing the dark web while carrying out or as the result of this capability.',
      },
      {
        id: 'PA3',
        label: 'Efficiency',
        desc: 'The extent to which financial resources for this capability are proportionate to the desired results (output) of this capability.',
      },
    ],
    performanceScale: [
      { id: 'PS1', color: redGreenColors[0], label: 'Bad' },
      { id: 'PS2', color: redGreenColors[1], label: 'Inadequate' },
      { id: 'PS3', color: redGreenColors[2], label: 'Moderate' },
      { id: 'PS4', color: redGreenColors[3], label: 'Adequate' },
      { id: 'PS5', color: redGreenColors[4], label: 'Good' },
    ],
    mainGaps: [
      { id: 'MG1', label: 'Organisation / procedure' },
      { id: 'MG2', label: 'Personnel capacity' },
      { id: 'MG3', label: 'Material capacity' },
      { id: 'MG4', label: 'ICT-capacity / provision' },
      { id: 'MG5', label: 'Technological support' },
      { id: 'MG6', label: 'Policy or policy development' },
      { id: 'MG7', label: 'Other' },
    ],
    gapScale: [
      { id: 'GS1', label: 'No' },
      { id: 'GS2', label: 'Unknown' },
      { id: 'GS3', label: 'Yes' },
    ],
    assessmentScale: [
      { id: 'AS1', color: towardsRedColors[0], label: 'None' },
      { id: 'AS2', color: towardsRedColors[1], label: 'Limited' },
      { id: 'AS3', color: towardsRedColors[2], label: 'Moderate' },
      { id: 'AS4', color: towardsRedColors[3], label: 'High' },
      { id: 'AS5', color: towardsRedColors[4], label: 'Very high' },
    ],
    assessmentTable: [
      { rowId: 'TS1', colId: 'PS1', optionId: 'AS3' },
      { rowId: 'TS1', colId: 'PS2', optionId: 'AS3' },
      { rowId: 'TS1', colId: 'PS3', optionId: 'AS2' },
      { rowId: 'TS1', colId: 'PS4', optionId: 'AS2' },
      { rowId: 'TS1', colId: 'PS5', optionId: 'AS1' },
      { rowId: 'TS2', colId: 'PS1', optionId: 'AS4' },
      { rowId: 'TS2', colId: 'PS2', optionId: 'AS3' },
      { rowId: 'TS2', colId: 'PS3', optionId: 'AS3' },
      { rowId: 'TS2', colId: 'PS4', optionId: 'AS2' },
      { rowId: 'TS2', colId: 'PS5', optionId: 'AS1' },
      { rowId: 'TS3', colId: 'PS1', optionId: 'AS4' },
      { rowId: 'TS3', colId: 'PS2', optionId: 'AS4' },
      { rowId: 'TS3', colId: 'PS3', optionId: 'AS3' },
      { rowId: 'TS3', colId: 'PS4', optionId: 'AS3' },
      { rowId: 'TS3', colId: 'PS5', optionId: 'AS1' },
      { rowId: 'TS4', colId: 'PS1', optionId: 'AS5' },
      { rowId: 'TS4', colId: 'PS2', optionId: 'AS4' },
      { rowId: 'TS4', colId: 'PS3', optionId: 'AS4' },
      { rowId: 'TS4', colId: 'PS4', optionId: 'AS3' },
      { rowId: 'TS4', colId: 'PS5', optionId: 'AS1' },
      { rowId: 'TS5', colId: 'PS1', optionId: 'AS5' },
      { rowId: 'TS5', colId: 'PS2', optionId: 'AS5' },
      { rowId: 'TS5', colId: 'PS3', optionId: 'AS4' },
      { rowId: 'TS5', colId: 'PS4', optionId: 'AS4' },
      { rowId: 'TS5', colId: 'PS5', optionId: 'AS1' },
    ],
    lexicon,
  },
} as ICapabilityModel;
