import m from 'mithril';
import lz from 'lz-string';
import { Button, Icon, ModalPanel } from 'mithril-materialized';
import background from '../assets/background.jpg';
import { dashboardSvc, MeiosisComponent } from '../services';
import { Dashboards } from '../models';
import { formatDate } from '../utils';
import {
  defaultCapabilityModel,
  ICapabilityModel,
} from '../models/capability-model/capability-model';
import { t } from 'mithriljs-i18n';

export const HomePage: MeiosisComponent = () => {
  const readerAvailable = window.File && window.FileReader && window.FileList && window.Blob;

  return {
    oninit: ({
      attrs: {
        actions: { setPage, saveModel, changePage },
      },
    }) => {
      setPage(Dashboards.HOME);
      const model = m.route.param('model');
      if (!model) return;
      try {
        const decompressed = lz.decompressFromEncodedURIComponent(model);
        if (!decompressed) return;
        const catModel = JSON.parse(decompressed);
        saveModel(catModel);
        changePage(Dashboards.OVERVIEW);
      } catch (err) {
        console.error(err);
      }
    },
    view: ({
      attrs: {
        state: {
          app: { catModel },
        },
        actions: { saveModel },
      },
    }) => [
      m('div', { style: 'position: relative;' }, [
        m(
          '.overlay.center',
          {
            style: 'position: absolute; width: 100%',
          },
          [m('h3.white-text', 'Capability Assessment Tool (CAT)')]
        ),
        m('img.responsive-img.center', { src: background }),
        m('.buttons.center', { style: 'margin: 10px auto;' }, [
          m(Button, {
            iconName: 'clear',
            className: 'btn-large',
            label: 'Clear',
            modalId: 'clearAll',
          }),
          typeof catModel.version === 'number' &&
            m(Button, {
              iconName: 'edit',
              className: 'btn-large',
              label: t('clear_btn'),
              onclick: () => {
                dashboardSvc.switchTo(Dashboards.OVERVIEW);
              },
            }),
          m('a#downloadAnchorElem', { style: 'display:none' }),
          m(Button, {
            iconName: 'download',
            className: 'btn-large',
            label: t('download_btn'),
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
              label: t('upload_btn'),
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
          m(Button, {
            iconName: 'link',
            className: 'btn-large',
            label: t('permalink_btn'),
            onclick: () => {
              const permLink = document.createElement('input') as HTMLInputElement;
              document.body.appendChild(permLink);
              if (!permLink) return;
              const compressed = lz.compressToEncodedURIComponent(JSON.stringify(catModel));
              const url = `${window.location.href}${
                /\?/.test(window.location.href) ? '&' : '?'
              }model=${compressed}`;
              permLink.value = url;
              permLink.select();
              permLink.setSelectionRange(0, 999999); // For mobile devices
              try {
                const successful = document.execCommand('copy');
                if (successful)
                  M.toast({
                    html: 'Copied permanent link to clipboard.',
                    classes: 'yellow black-text',
                  });
              } catch (err) {
                M.toast({ html: 'Failed copying link to clipboard: ' + err, classes: 'red' });
              } finally {
                document.body.removeChild(permLink);
              }
            },
          }),
        ]),
        m(
          '.section.white',
          m('.row.container.center', [
            m('.row', [
              m(
                '.col.s12.m4',
                m('.icon-block', [
                  m('.center', m(Icon, { iconName: 'dashboard' })),
                  m('h5.center', t('prepare')),
                  m('p.light', t('prepare_txt')),
                ])
              ),
              m(
                '.col.s12.m4',
                m('.icon-block', [
                  m('.center', m(Icon, { iconName: 'flash_on' })),
                  m('h5.center', t('assess')),
                  m('p.light', t('assess_txt')),
                ])
              ),
              m(
                '.col.s12.m4',
                m('.icon-block', [
                  m('.center', m(Icon, { iconName: 'group' })),
                  m('h5.center', t('develop')),
                  m('p.light', t('develop_txt')),
                ])
              ),
            ]),
          ])
        ),
        m(ModalPanel, {
          id: 'clearAll',
          title: 'Do you really want to delete everything?',
          description: 'Are you sure that you want to delete your model?',
          buttons: [
            {
              label: 'Yes',
              iconName: 'delete',
              onclick: () => {
                saveModel(defaultCapabilityModel);
                dashboardSvc.switchTo(Dashboards.PREPARATION);
              },
            },
            { label: 'No', iconName: 'cancel' },
          ],
        }),
      ]),
    ],
  };
};
