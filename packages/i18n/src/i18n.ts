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

export type Locales = {
  /** Fully qualified name, e.g. 'en-UK' or 'nl-NL' */
  [fqn: string]: {
    /** Friendly name */
    name: string;
    /** Text direction: Left to right or right to left, @default ltr */
    dir?: TextDirection;
    /** Is the default language */
    default?: boolean;
  };
};

export type LoadingStatus = 'loading' | 'idle';

export type Listener = (locale: string, dir: TextDirection) => void;

export const i18n = {
  /** Default URL to load the language files, e.g. '/lang/{locale}.json' */
  url: '',
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

/**
 * Initialize the i18n object, needs to be called before you do anything else!
 * @param locales Locales object
 * @param currentLocale e.g. 'en-UK'
 * @param url Should contain the {local} bit, which will be replaced by the requested language code, e.g. 'en-UK'
 * @default /lang/{locale}.json
 */
function init(locales: Locales, currentLocale?: string, url = '/lang/{locale}.json') {
  i18n.url = url;
  i18n.locales = locales;
  const defaultLocale =
    Object.keys(locales)
      .filter((l) => locales[l].default)
      .shift() || currentLocale;
  if (!defaultLocale) {
    throw Error('No default locale set, and no current locale supplied!');
  }
  i18n.defaultLocale = defaultLocale;
}

export function t(key: string, interpolations = {} as Interpolations) {
  const message = i18n.messages[key] || key;

  const pluralizedMessage = pluralForm(message, interpolations.count);

  const numberFormattedInterpolations = formatNumbersInObject(interpolations);

  return interpolate(pluralizedMessage, numberFormattedInterpolations);
}

function number(num: number, options = {} as Intl.NumberFormatOptions) {
  const formatter = new Intl.NumberFormat(i18n.currentLocale, options);

  return formatter.format(num);
}

function date(date: Date, options = {}) {
  const formatter = new Intl.DateTimeFormat(i18n.currentLocale, options);

  return formatter.format(new Date(date));
}

function pluralForm(message: string | Message, count: number) {
  if (typeof message === 'string') {
    return message;
  }

  const rules = new Intl.PluralRules(i18n.currentLocale);

  return message.plural[rules.select(count)];
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

    i18n.onChangeLocale.forEach((listener) => listener(resolvedLocale, dir()));
  });
}

function supported(locale: string) {
  return Object.keys(i18n.locales).indexOf(locale) >= 0;
}

function dir(locale = i18n.currentLocale) {
  return i18n.locales[locale].dir || 'ltr';
}

async function fetchMessages(locale: string, onComplete: (messages: Messages) => void) {
  await m.request<Messages>(i18n.url.replace('{locale}', locale)).then(onComplete);
}

function addOnChangeListener(listener: Listener) {
  i18n.onChangeLocale.push(listener);
}

function removeOnChangeListener(listener: Listener) {
  i18n.onChangeLocale = i18n.onChangeLocale.filter(
    (currentListener) => currentListener !== listener
  );
}

// export default i18n;
