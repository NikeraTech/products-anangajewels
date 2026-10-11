import Script from "next/script";
import { Toaster } from "sonner";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd, organizationSchema } from "@/components/JsonLd";
import { QuickViewProvider } from "@/components/QuickView";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { getSettings } from "@/lib/data";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-12183NR13G";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <QuickViewProvider>
      <AnnouncementBar messages={settings.announcement} />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFab />
      <Toaster position="bottom-center" toastOptions={{ className: "!rounded-full !bg-emerald-900 !text-ivory !border-0" }} />
      <JsonLd data={organizationSchema} />
      {process.env.NODE_ENV === "production" && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
    </QuickViewProvider>
  );
}
