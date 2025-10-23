// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, className }) => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} style={fill ? { objectFit: 'cover' } : {}} />
    );
  },
}));

// Global mock for next-intl used across tests
jest.mock('next-intl', () => ({
  __esModule: true,
  NextIntlClientProvider: ({ children }) => children,
  useTranslations: () => (key) => key,
  useLocale: () => 'en',
}));
