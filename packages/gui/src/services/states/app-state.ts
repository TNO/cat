import Stream from 'mithril/stream';
import { i18n } from 'mithriljs-i18n';
import { routingSvc, ModelUpdateFunction } from '..';
import {
  Dashboards,
  assessmentModel,
  developmentModel,
  evaluationModel,
  preparationModel,
  projectEvaluationModel,
  settingsModel,
} from '../../models';
import {
  defaultCapabilityModel,
  ICapabilityModel,
} from '../../models/capability-model/capability-model';
import { IAppModel, UpdateStream } from '../meiosis';
/** Application state */

const catModelKey = 'catModel';

export interface IAppStateModel {
  app: {
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
  };
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
  setLanguage: (locale: string) => Promise<void>;
}

export interface IAppState {
  initial: IAppStateModel;
  actions: (us: UpdateStream, states: Stream<IAppModel>) => IAppStateActions;
}

// console.log(`API server: ${process.env.SERVER}`);

const localizeCatModel = (cat: Partial<ICapabilityModel>) => {
  cat.assessment = assessmentModel();
  cat.development = developmentModel();
  cat.settings = settingsModel();
  cat.evaluation = evaluationModel();
  cat.projectEvaluation = projectEvaluationModel();
  cat.preparations = preparationModel();
  return cat;
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
        cat = localizeCatModel(cat);
        localStorage.setItem(catModelKey, JSON.stringify(cat));
        update({ app: { catModel: () => cat } });
      },
      setLanguage: async (locale: string) => {
        const state = states();
        const catModel = state.app.catModel;
        localStorage.setItem('CAT_LANGUAGE', locale);
        await i18n.loadAndSetLocale(locale);
        update({ app: { catModel: () => localizeCatModel(catModel) } });
      },
    };
  },
} as IAppState;
