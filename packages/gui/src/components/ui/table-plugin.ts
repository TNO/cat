import { PluginType } from 'mithril-ui-form';
import m from 'mithril';

export const tablePlugin: PluginType = () => {
  return {
    view: ({ attrs: { field, obj } }) => {
      const { id = '', label = '', options = [] } = field;
      if (obj instanceof Array || !(options instanceof Array)) return;
      const values = obj[id] as Array<Record<string, any>>;

      console.log(`Table plugin: ${values.join(', ')}`);

      return m('table.highlight.responsive-table', { style: 'margin-bottom: 30px' }, [
        label && m('caption', m('strong', label)),
        m(
          'thead',
          m(
            'tr',
            options.map((o) => m('th', o.label))
          )
        ),
        m(
          'tbody',
          values.map((v) =>
            m(
              'tr',
              options.map((o) => m('td', v[o.id] || ''))
            )
          )
        ),
      ]);
    },
  };
};
