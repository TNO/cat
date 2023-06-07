import m from 'mithril';

export type Message =
  | string
  | {
      plural: { [key: string]: string };
    };

export type Messages = {
  [key: string]: Message;
};

export type Interpolation = {
  count: number;
};

export type Interpolations = {
  count: number;
  [key: string]: string | number;
};

export type TextDirection = 'rtl' | 'ltr';

export type Locale = {
  /** Friendly name */
  name: string;
  /** Fully qualified name, e.g. 'en-UK' */
  fqn: string;
  /** Text direction: Left to right or right to left */
  dir?: TextDirection;
  /** Is the default language */
  default?: boolean;
};

export type Locales = {
  [key: string]: Locale | string;
} & {
  /** Default URL to load the language files, e.g. '/lang/{locale}.json' */
  url?: string;
};

export type LoadingStatus = 'loading' | 'idle';

export type Listener = (locale: string, dir: TextDirection) => void;

export const i18n = {
  defaultLocale: '',
  currentLocale: '',
  locales: {} as Locales,
  messages: {} as Messages,
  onChangeLocale: [] as Listener[],
  status: 'loading' as LoadingStatus,
  init,
  t,
  number,
  date,
  loadAndSetLocale,
  supported,
  dir,
  addOnChangeListener,
  removeOnChangeListener,
};

async function init(locales: Locales, selectedLocale: string) {
  i18n.locales = locales;
  const defaultLocale = Object.keys(locales)
    .filter((l) => (locales[l] as Locale).default)
    .shift();
  if (defaultLocale) {
    i18n.defaultLocale = defaultLocale || selectedLocale;
  }
  await loadAndSetLocale(selectedLocale);
}

function pluralForm(message: string | Message, count: number) {
  if (typeof message === 'string' || typeof message === 'undefined') {
    return message;
  }
  const rules = new Intl.PluralRules(i18n.currentLocale);

  return message.plural[rules.select(count)];
}

function number(num: number, options = {} as Intl.NumberFormatOptions) {
  const formatter = new Intl.NumberFormat(
    (i18n.locales[i18n.currentLocale] as Locale).fqn,
    options
  );

  return formatter.format(num);
}

function date(date: Date, options = {}) {
  const formatter = new Intl.DateTimeFormat(
    (i18n.locales[i18n.currentLocale] as Locale).fqn,
    options
  );

  return formatter.format(new Date(date));
}

function interpolate(message: string, interpolations: Interpolations) {
  return Object.keys(interpolations).reduce(
    (msg, variableName) =>
      msg.replace(
        new RegExp(`{\\s*${variableName}\\s*}`, 'g'),
        interpolations[variableName].toString()
      ),
    message
  );
}

function formatNumbersInObject(obj: Interpolations) {
  const result = {} as Interpolations;

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    result[key] = typeof value === 'number' ? number(value) : value;
  });

  return result;
}

async function loadAndSetLocale(newLocale: string) {
  if (i18n.currentLocale === newLocale) {
    return;
  }

  const resolvedLocale = supported(newLocale) ? newLocale : i18n.defaultLocale;

  i18n.status = 'loading';

  await fetchMessages(resolvedLocale, (messages) => {
    i18n.messages = messages;
    i18n.currentLocale = resolvedLocale;
    i18n.status = 'idle';

    i18n.onChangeLocale.forEach((listener) => listener(i18n.currentLocale, dir()));
  });
}

function supported(locale: string) {
  return Object.keys(i18n.locales).indexOf(locale) >= 0;
}

function dir(locale = i18n.currentLocale) {
  return (i18n.locales[locale] as Locale).dir || 'ltr';
}

async function fetchMessages(locale: string, onComplete: (messages: Messages) => void) {
  const messages = await m.request<Messages>(
    (i18n.locales.url || '/lang/{locale}.json').replace('{locale}', locale)
  );
  onComplete(messages);
}

function addOnChangeListener(listener: Listener) {
  i18n.onChangeLocale.push(listener);
}

function removeOnChangeListener(listener: Listener) {
  i18n.onChangeLocale = i18n.onChangeLocale.filter(
    (currentListener) => currentListener !== listener
  );
}

export function t(key: string, interpolations = {} as Interpolations) {
  const message = i18n.messages[key] || key;

  const pluralizedMessage = pluralForm(message, interpolations.count);

  const numberFormattedInterpolations = formatNumbersInObject(interpolations);

  return interpolate(pluralizedMessage, numberFormattedInterpolations);
}
