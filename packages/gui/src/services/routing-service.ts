import m, { RouteDefs } from 'mithril';
import { Dashboards, IDashboard } from '../models';
import { actions, states } from './meiosis';
import { Layout } from '../components/layout';
import {
  AboutPage,
  HomePage,
  SettingsPage,
  TaxonomyPage,
  OverviewPage,
  PreparationPage,
  AssessmentPage,
} from '../components';
import { DevelopmentPage } from '../components/development-page';
import { t } from 'mithriljs-i18n';

class RoutingService {
  private dashboards!: ReadonlyArray<IDashboard>;

  constructor() {}

  public init() {
    const routes = [
      {
        id: Dashboards.HOME,
        title: t('home'),
        icon: 'home',
        route: t('home_route'),
        visible: true,
        component: HomePage,
      },
      {
        id: Dashboards.OVERVIEW,
        title: t('overview'),
        icon: 'apps',
        route: t('overview_route'),
        visible: true,
        component: OverviewPage,
      },
      {
        id: Dashboards.ABOUT,
        title: t('about'),
        icon: 'info',
        route: t('about_route'),
        visible: true,
        component: AboutPage,
      },
      {
        id: Dashboards.TAXONOMY,
        title: t('taxonomy'),
        icon: 'book',
        route: t('taxonomy_route'),
        visible: true,
        component: TaxonomyPage,
      },
      {
        id: Dashboards.SETTINGS,
        title: t('settings'),
        icon: 'settings',
        iconClass: 'blue-text',
        route: t('settings_route'),
        visible: true,
        component: SettingsPage,
      },
      {
        id: Dashboards.PREPARATION,
        title: t('preparation'),
        icon: 'video_settings',
        iconClass: 'blue-text',
        route: t('preparation_route'),
        visible: true,
        component: PreparationPage,
      },
      {
        id: Dashboards.ASSESSMENT,
        title: t('assessment'),
        icon: 'assessment',
        iconClass: 'blue-text',
        route: t('assessment_route'),
        visible: true,
        component: AssessmentPage,
      },
      {
        id: Dashboards.DEVELOPMENT,
        title: t('development'),
        icon: 'engineering',
        iconClass: 'blue-text',
        route: t('development_route'),
        visible: ({ catModel }) => catModel.data && catModel.data.enableDecisionSupport,
        component: DevelopmentPage,
      },
      // {
      //   id: Dashboards.EVALUATION,
      //   title: t('evaluation'),
      //   icon: 'grading',
      //   iconClass: 'blue-text',
      //   route: '/evaluation',
      //   visible: true,
      //   component: EvaluationPage,
      // },
    ] as IDashboard[];
    // console.log(JSON.stringify(routes, null, 2));
    this.setList(routes);
    actions.setLanguage();
    // console.log(JSON.stringify(this.dashboards, null, 2));
  }

  public getList() {
    return this.dashboards;
  }

  public setList(list: IDashboard[]) {
    this.dashboards = Object.freeze(list);
  }

  public get defaultRoute() {
    const dashboard = this.dashboards.filter((d) => d.default).shift();
    return dashboard ? dashboard.route : this.dashboards[0].route;
  }

  public route(dashboardId: Dashboards, query?: { [key: string]: string | number | undefined }) {
    const dashboard = this.dashboards.filter((d) => d.id === dashboardId).shift();
    return dashboard
      ? '#!' + dashboard.route + (query ? '?' + m.buildQueryString(query) : '')
      : this.defaultRoute;
  }

  public href(dashboardId: Dashboards, params = '' as string | number) {
    const dashboard = this.dashboards.filter((d) => d.id === dashboardId).shift();
    return dashboard ? `#!${dashboard.route.replace(/:\w*/, '')}${params}` : this.defaultRoute;
  }

  public switchTo(
    dashboardId: Dashboards,
    params?: { [key: string]: string | number | undefined },
    query?: { [key: string]: string | number | undefined }
  ) {
    const dashboard = this.dashboards.filter((d) => d.id === dashboardId).shift();
    if (dashboard) {
      const url = dashboard.route + (query ? '?' + m.buildQueryString(query) : '');
      m.route.set(url, params);
    }
  }

  public routingTable() {
    return this.dashboards.reduce((p, c) => {
      p[c.route] =
        c.hasNavBar === false
          ? {
              render: () => m(c.component, { state: states(), actions }),
            }
          : {
              // onmatch:
              //   c.id === Dashboards.LOGIN
              //     ? undefined
              //     : () => {
              //         if (c.id !== Dashboards.HOME && !Auth.isLoggedIn()) m.route.set('/login');
              //       },
              render: () =>
                m(
                  Layout,
                  { state: states(), actions, options: {} },
                  m(c.component, {
                    state: states(),
                    actions,
                  })
                ),
            };
      return p;
    }, {} as RouteDefs);
  }
}

export const routingSvc: RoutingService = new RoutingService();
