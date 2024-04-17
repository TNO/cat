import { ComponentTypes } from 'mithril';
import { AppState } from '../services/states';

export type IconType = () => string | string;

export type IconResolver = () => string;

export interface IDashboard {
  id: Dashboards;
  default?: boolean;
  hasNavBar?: boolean;
  title: string | (() => string);
  icon: string | IconResolver;
  iconClass?: string;
  route: string;
  visible: boolean | ((app: AppState) => boolean);
  component: ComponentTypes<any, any>;
}

export enum Dashboards {
  HOME = 'HOME',
  OVERVIEW = 'OVERVIEW',
  CAPABILITY = 'CAPABILITY',
  TAXONOMY = 'TAXONOMY',
  ABOUT = 'ABOUT',
  SETTINGS = 'SETTINGS',
  PREPARATION = 'PREPARATION',
  ASSESSMENT = 'ASSESSMENT',
  DEVELOPMENT = 'DEVELOPMENT',
  EVALUATION = 'EVALUATION',
  HELP = 'HELP',
}
