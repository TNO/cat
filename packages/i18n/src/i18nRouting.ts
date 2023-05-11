import m, { RouteDefs, RouteLinkAttrs, Vnode } from 'mithril';
import { i18n } from './i18n';

const localeParam = 'locale';

export function localizedRoutes(routes: RouteDefs) {
  const result = {} as RouteDefs;

  Object.keys(routes).forEach((path) => {
    result['/:' + localeParam + path] = routes[path];
  });

  return result;
}

export function setLocaleFromRoute() {
  const routeLocale = m.route.param(localeParam);

  if (routeLocale === i18n.currentLocale) {
    return;
  }

  if (i18n.supported(routeLocale)) {
    i18n.loadAndSetLocale(routeLocale);
  } else {
    m.route.set(`/${i18n.defaultLocale}`);
  }
}

export function localizeHref(href: string) {
  return '/' + i18n.currentLocale + href;
}

/**
 * `localizedLink("/uri", children)`
 * or
 * `localizedLink("/uri", attrs, children)`
 * @param {string} href
 * @returns Vnode
 */
export function localizedLink(href: string, ...args: Array<RouteLinkAttrs | string | Vnode>) {
  const [attrs, children] = (args.length === 1 ? [{} as RouteLinkAttrs, args[0]] : args) as [
    RouteLinkAttrs,
    Array<string | Vnode>
  ];

  return m(
    m.route.Link,
    {
      ...attrs,
      href: localizeHref(href),
    },
    children
  );
}

export function currentPathToLocale(newLocale: string) {
  const pathParts = m.route.get().split('/');
  pathParts[1] = newLocale;
  return pathParts.join('/');
}
