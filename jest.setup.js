// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, className }) => {
    return (
      <img src={src} alt={alt} className={className} style={fill ? { objectFit: 'cover' } : {}} />
    );
  },
}));
