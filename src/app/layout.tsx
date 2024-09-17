"use client"

import "../styles/global.css";

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {

  return (
      <html lang="fr">
      <head>
        <link rel="icon" href="/public/favicon.ico" />
      </head>
      <body className="font-akaya" suppressHydrationWarning={true}>
          {children}
      </body>
      </html>
  );
}
