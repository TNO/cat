import m from 'mithril';
import { Button, Icon } from 'mithril-materialized';
import background from '../assets/background.jpg';
import { dashboardSvc, MeiosisComponent } from '../services';
import { Dashboards } from '../models';
import { formatDate } from '../utils';
import {
  defaultCapabilityModel,
  ICapabilityModel,
} from '../models/capability-model/capability-model';

export const HomePage: MeiosisComponent = () => {
  const readerAvailable = window.File && window.FileReader && window.FileList && window.Blob;

  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => {
      setPage(Dashboards.HOME);
    },
    view: ({
      attrs: {
        state: {
          app: { catModel },
        },
        actions: { saveModel },
      },
    }) => [
      m('.row', [
        m(
          '.overlay.center',
          {
            style: 'position: relative; top: 550px;',
          },
          m('.buttons', [
            m(Button, {
              iconName: 'fiber_new',
              className: 'btn-large',
              label: 'Start new',
              onclick: () => {
                saveModel(defaultCapabilityModel);
                dashboardSvc.switchTo(Dashboards.OVERVIEW);
              },
            }),
            typeof catModel.version === 'number' &&
              m(Button, {
                iconName: 'edit',
                className: 'btn-large',
                label: 'Continue',
                onclick: () => {
                  dashboardSvc.switchTo(Dashboards.OVERVIEW);
                },
              }),
            m('a#downloadAnchorElem', { style: 'display:none' }),
            m(Button, {
              iconName: 'download',
              className: 'btn-large',
              label: 'Download',
              onclick: () => {
                const dlAnchorElem = document.getElementById('downloadAnchorElem');
                if (!dlAnchorElem) return;
                const version = typeof catModel.version === 'undefined' ? 1 : catModel.version++;
                const dataStr =
                  'data:text/json;charset=utf-8,' +
                  encodeURIComponent(JSON.stringify({ version, ...catModel }, null, 2));
                dlAnchorElem.setAttribute('href', dataStr);
                dlAnchorElem.setAttribute(
                  'download',
                  `${formatDate()}_v${version}_capability_model.json`
                );
                dlAnchorElem.click();
              },
            }),
            m('input#selectFiles[type=file]', { style: 'display:none' }),
            readerAvailable &&
              m(Button, {
                iconName: 'upload',
                className: 'btn-large',
                label: 'Upload',
                onclick: () => {
                  const fileInput = document.getElementById('selectFiles') as HTMLInputElement;
                  fileInput.onchange = () => {
                    if (!fileInput) return;
                    const files = fileInput.files;
                    if (files && files.length <= 0) {
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = (e: ProgressEvent<FileReader>) => {
                      const result =
                        e &&
                        e.target &&
                        e.target.result &&
                        (JSON.parse(e.target.result.toString()) as ICapabilityModel);
                      result && result.version && saveModel(result);
                    };
                    const data = files && files.item(0);
                    data && reader.readAsText(data);
                    dashboardSvc.switchTo(Dashboards.OVERVIEW);
                  };
                  fileInput.click();
                },
              }),
          ])
        ),
        m('img.responsive-img', { src: background }),
        m(
          '.section.white',
          m('.row.container.center', [
            m('.row', [
              m(
                '.col.s12.m4',
                m('.icon-block', [
                  m('.center', m(Icon, { iconName: 'dashboard' })),
                  m('h5.center', 'Prepare'),
                  m(
                    'p.light',
                    'Create or select the capabilities that are important for your organisations.'
                  ),
                ])
              ),
              m(
                '.col.s12.m4',
                m('.icon-block', [
                  m('.center', m(Icon, { iconName: 'flash_on' })),
                  m('h5.center', 'Assess'),
                  m(
                    'p.light',
                    `Determine for each capability how important it is, and your current performance, so you can prioritise and focus on the ones you really need.`
                  ),
                ])
              ),
              m(
                '.col.s12.m4',
                m('.icon-block', [
                  m('.center', m(Icon, { iconName: 'group' })),
                  m('h5.center', 'Develop'),
                  m(
                    'p.light',
                    'Start working on developing your capabilities, alone or with other organisations, and create your roadmap.'
                  ),
                ])
              ),
            ]),
          ])
        ),
      ]),
    ],
  };
};
