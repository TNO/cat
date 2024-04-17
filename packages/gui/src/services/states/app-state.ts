import Stream from 'mithril/stream';
import { i18n } from 'mithriljs-i18n';
import { routingSvc, ModelUpdateFunction } from '..';
import {
  Assessment,
  Dashboards,
  Development,
  assessmentModel,
  developmentModel,
  evaluationModel,
  preparationModel,
  projectEvaluationModel,
  settingsModel,
} from '../../models';
import {
  defaultCapabilityModel,
  ICapabilityDataModel,
  ICapabilityModel,
} from '../../models/capability-model/capability-model';
import { IAppModel, UpdateStream } from '../meiosis';
import { UIForm } from 'mithril-ui-form';
/** Application state */

const catModelKey = 'catModel';

export type AppState = {
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
  evaluation?: UIForm<Partial<ICapabilityModel>>;
  projectEvaluation?: UIForm;
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
  ) => void;
  saveModel: (cat: Partial<ICapabilityModel>) => void;
  setLanguage: (locale?: string) => Promise<void>;
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

export const appStateMgmt = {
  initial: {
    app: {
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
      setPage: (page: Dashboards) => update({ app: { page } }),
      update: (model: Partial<ModelUpdateFunction>) => update(model),
      search: (isSearching: boolean, searchQuery?: string) =>
        update({ app: { isSearching, searchQuery } }),
      changePage: (page, params, query) => {
        routingSvc && routingSvc.switchTo(page, params, query);
        update({ app: { page } });
      },
      createRoute: (page, params) => routingSvc && routingSvc.route(page, params),
      saveModel: (cat) => {
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
    };
  },
} as IAppState;
