import Stream from 'mithril/stream';
import { i18n } from 'mithriljs-i18n';
import { routingSvc, ModelUpdateFunction } from '..';
import {
  Assessment,
  Dashboards,
  Development,
  UserType,
  assessmentModel,
  developmentModel,
  evaluationModel,
  preparationModel,
  projectEvaluationModel,
  settingsModel,
} from '../../models';
import {
  defaultCapabilityModel,
  Evaluation,
  ICapabilityDataModel,
  ICapabilityModel,
  ProjectEvaluation,
} from '../../models/capability-model/capability-model';
import { IAppModel, UpdateStream } from '../meiosis';
import { UIForm } from 'mithril-ui-form';
/** Application state */

const catModelKey = 'catModel';
const CUR_USER_KEY = 'CAT_CUR_USER';

export type AppState = {
  curUser: UserType;
  apiService: string;
  isSearching: boolean;
  searchQuery?: string;
  page?: Dashboards;
  catModel: ICapabilityModel;
  textFilter: string;
  stakeholderFilter: string[];
  categoryId?: string;
  subcategoryId?: string;
  capabilityId?: string;
  // FORMS
  preparations?: UIForm<ICapabilityDataModel>;
  assessment?: UIForm<Assessment>;
  development?: UIForm<Development>;
  evaluation?: UIForm<Partial<Evaluation>>;
  projectEvaluation?: UIForm<Partial<ProjectEvaluation>>;
  settings?: UIForm<ICapabilityDataModel>;
};

export interface IAppStateModel {
  app: AppState;
}

export interface IAppStateActions {
  setPage: (page: Dashboards) => void;
  update: (model: Partial<ModelUpdateFunction>) => void;
  search: (isSearching: boolean, searchQuery?: string) => void;
  changePage: (
    page: Dashboards,
    params?: { [key: string]: string | number | undefined },
    query?: { [key: string]: string | number | undefined }
  ) => void;
  createRoute: (
    page: Dashboards,
    params?: { [key: string]: string | number | undefined },
    query?: { [key: string]: string | number | undefined }
  ) => string;
  saveModel: (cat: Partial<ICapabilityModel>) => void;
  setLanguage: (locale?: string) => Promise<void>;
  saveCurUser: (curUser: UserType) => void;
}

export interface IAppState {
  initial: IAppStateModel;
  actions: (us: UpdateStream, states: Stream<IAppModel>) => IAppStateActions;
}

// console.log(`API server: ${process.env.SERVER}`);

const localizeDataModel = ({ app }: Partial<IAppStateModel>) => {
  if (!app) return;
  app.assessment = assessmentModel(app.catModel && app.catModel.data ? app.catModel.data : {});
  app.development = developmentModel();
  app.settings = settingsModel();
  app.evaluation = evaluationModel();
  app.projectEvaluation = projectEvaluationModel();
  app.preparations = preparationModel();
  return app;
};

const cm = localStorage.getItem(catModelKey) || JSON.stringify(defaultCapabilityModel);
const catModel = JSON.parse(cm) as ICapabilityModel;
const curUser = (localStorage.getItem(CUR_USER_KEY) || 'user') as UserType;

export const setTitle = (title?: string) => {
  document.title = `Capability Assessment Tool${title ? ` | ${title}` : ''}`;
};

setTitle(catModel.data?.title);

export const appStateMgmt = {
  initial: {
    app: {
      curUser,
      /** During development, use this URL to access the server. */
      apiService: process.env.SERVER || window.location.origin,
      isSearching: false,
      searchQuery: '',
      catModel,
      textFilter: '',
      stakeholderFilter: [],
    },
  },
  actions: (update, states) => {
    return {
      setPage: (page: Dashboards) => {
        update({ app: { page } });
      },
      update: (model: Partial<ModelUpdateFunction>) => update(model),
      search: (isSearching: boolean, searchQuery?: string) =>
        update({ app: { isSearching, searchQuery } }),
      changePage: (page, params, query) => {
        routingSvc && routingSvc.switchTo(page, params, query);
        update({ app: { page } });
      },
      createRoute: (page, params) => (routingSvc ? routingSvc.route(page, params) : ''),
      saveModel: (cat) => {
        setTitle(cat.data?.title);
        localStorage.setItem(catModelKey, JSON.stringify(cat));
        const catModel = { version: cat.version, data: cat.data };
        update({ app: { catModel: () => catModel } });
      },
      setLanguage: async (locale = i18n.currentLocale) => {
        const state = states();
        localStorage.setItem('CAT_LANGUAGE', locale);
        await i18n.loadAndSetLocale(locale);
        update({ app: () => localizeDataModel(state) });
      },
      saveCurUser: (curUser) => {
        console.table(curUser);
        localStorage.setItem(CUR_USER_KEY, curUser);
        update({ app: { curUser } });
      },
    };
  },
} as IAppState;
