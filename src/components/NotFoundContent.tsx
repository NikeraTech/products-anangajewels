import Link from "next/link";

export function NotFoundContent() {
  return (
    <section className="container-x grid place-items-center py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-5xl font-medium text-emerald-900 sm:text-6xl">This piece has wandered off</h1>
      <p className="mt-4 max-w-md text-muted">The page you&apos;re looking for doesn&apos;t exist or the item is no longer listed.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-primary">
          Browse the collection
        </Link>
        <Link href="/" className="btn btn-outline text-emerald-900 hover:!bg-cream">
          Back home
        </Link>
      </div>
    </section>
  );
}
