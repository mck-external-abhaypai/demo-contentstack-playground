const fallbackLocaleName = 'en'
const fallbackLocaleCookieName = 'languages'

const configuredLocale = () => {
    if (process.env.DEFAULT_LOCALE) {
        try {
            return new Intl.Locale(process.env.DEFAULT_LOCALE)
        } catch
        {
            console.warn('Error parsing configured locale, falling back to: ', fallbackLocaleName)
        }
    }
    return new Intl.Locale(fallbackLocaleName)
}

export const defaultLocale = configuredLocale().toString()

export const defaultLocaleName = configuredLocale().baseName.toString().toLocaleLowerCase()

export const localeCookieName = process.env.LOCALE_COOKIE_NAME ? process.env.LOCALE_COOKIE_NAME : fallbackLocaleCookieName

// Default locale for Contentstack and Next.js i18n fallback
// This should match the defaultLocale in next.config.js
export const DEFAULT_LOCALE = 'en-us'