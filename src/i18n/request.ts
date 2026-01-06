import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { i18nConfig } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;

    const locale = hasLocale(i18nConfig.locales, requested)
        ? requested
        : i18nConfig.defaultLocale;

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});