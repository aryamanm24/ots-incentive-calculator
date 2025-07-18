import './globals.css'

export const metadata = {
  title: 'OTS Incentive Calculator - Professional BC Incentive Tool',
  description: 'Calculate Business Correspondent incentive for One Time Settlement (OTS) with detailed breakdown. Professional tool for DPD-based incentive calculations.',
  keywords: 'OTS, incentive calculator, business correspondent, settlement, DPD, principal waiver, interest waiver',
  authors: [{ name: 'OTS Calculator Team' }],
  viewport: 'width=device-width, initial-scale=1',
  
  // Open Graph tags for social media sharing
  openGraph: {
    title: 'OTS Incentive Calculator - Professional BC Tool',
    description: 'Calculate Business Correspondent incentive for One Time Settlement with detailed breakdown. Enter DPD, amounts, and get instant results.',
    url: 'https://ots-incentive-calculator.vercel.app',
    siteName: 'OTS Incentive Calculator',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png', // We'll create this optional image
        width: 1200,
        height: 630,
        alt: 'OTS Incentive Calculator - Professional Tool',
      }
    ],
  },
  
  // Twitter Card tags
  twitter: {
    card: 'summary_large_image',
    title: 'OTS Incentive Calculator - Professional BC Tool',
    description: 'Calculate Business Correspondent incentive for One Time Settlement with detailed breakdown.',
    images: ['/og-image.png'],
  },
  
  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* Additional meta tags for better social sharing */}
        <meta property="og:title" content="OTS Incentive Calculator - Professional BC Tool" />
        <meta property="og:description" content="Calculate Business Correspondent incentive for One Time Settlement with detailed breakdown. Enter DPD, amounts, and get instant results." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ots-incentive-calculator.vercel.app" />
        <meta property="og:site_name" content="OTS Incentive Calculator" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="OTS Incentive Calculator - Professional BC Tool" />
        <meta name="twitter:description" content="Calculate Business Correspondent incentive for One Time Settlement with detailed breakdown." />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
