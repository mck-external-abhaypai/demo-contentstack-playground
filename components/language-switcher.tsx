// components/LanguageSwitcher.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locales, locale: currentLocale, asPath } = router;
  const [isOpen, setIsOpen] = useState(false);

  // Return nothing if locale data isn't available yet
  if (!locales || !currentLocale) {
    return null; 
  }

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="language-switcher-container relative">
      <button 
        onClick={toggleDropdown} 
        className="language-switcher-button text-gray-700 font-semibold text-sm py-1 px-1 whitespace-nowrap rounded-md border border-gray-300"
      >
        {currentLocale.toLocaleLowerCase()}
      </button>

      {isOpen && (
        <div className="language-switcher-dropdown absolute top-full right-0 bg-white shadow-lg rounded-md mt-2 z-10 w-32">
          <ul className="py-1">
            {locales.map((locale) => (
              <li key={locale}>
                <Link href={asPath} locale={locale} className={`block px-4 py-2 hover:bg-gray-100 ${locale === currentLocale ? 'font-bold' : ''}`}>
                {locale.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}