import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Doggo AI",
  description: "Talk to a dog!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=G-FSSMZC02TG`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FSSMZC02TG');
          `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
