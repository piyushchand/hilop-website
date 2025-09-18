import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Hilop',

  openGraph: {
    title: 'About Us',
    description:
      'hilop',
    images: [
      {
        url: '',
        width: 1200,
        height: 630,
        alt: 'About Hilop',
      },
    ],
  },

  twitter: {
    title: 'About Us',
    description:
      'Hilop',
    images: [
      {
        url: '',
        width: 1200,
        height: 630,
        alt: 'About Hilop',
      },
    ],
  },
};

import MyOrder from './MyOrderContent';
export default function MyOrderPage() {
  return <MyOrder />;
}
