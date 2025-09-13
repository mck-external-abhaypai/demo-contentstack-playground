'use client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getJsonCookie } from '@/utils'
import { localeCookieName } from '@/config'

const useRouterHook = () => {
    const [localesCodeArray, setlocalesCodeArray] = useState<string[]>([])
    const router = useRouter();
    const { pathname, asPath, query, locale } = router;

    useEffect(() => {
        const locales = getJsonCookie(localeCookieName)
        locales?.length > 0 && setlocalesCodeArray(locales.map((loc: { code: string }) => loc.code))
    },[])
    
    // const getLocale = () => { // returns current locale from params
    //     return Params?.locale as string
    // }

    const getUnlocalizedPath = () => {
        const pathArray = asPath.split('/')
        if ( pathArray?.length === 2 && pathArray?.[0] === '' && localesCodeArray?.includes(pathArray?.[1]) ) {
            return '/'
        }
        if (asPath?.length && localesCodeArray?.length > 0) {
            return asPath.split('/').filter(slug => !localesCodeArray?.includes(slug)).join('/')
        } else {
            return pathArray?.length > 2 ? '/' + pathArray.slice(2).join('/') : '/'
        }
    }

    const getLocalizedPath = () => {
        return asPath
    }

    const getStringfiedSearchParams = () => {
        const searchParams = new URLSearchParams(query as Record<string, string>).toString()
        return searchParams?.length ? `?${searchParams}` : ''
    }

    return {
        path: getUnlocalizedPath(),
        locale: locale,
        localizedPath: getLocalizedPath(),
        searchParams: query,
        stringfiedSearchParams: getStringfiedSearchParams(),
    }
}

export default useRouterHook