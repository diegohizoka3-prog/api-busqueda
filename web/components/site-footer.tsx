import Link from "next/link"

export function SiteFooter() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"
  return (
    <footer className="mt-auto border-t py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} Catálogo Académico · v{version}</p>
        <div className="flex gap-6"><Link href="/api/v1/docs">API Docs</Link><Link href="/about">About</Link><a href="https://github.com/diegohizoka3-prog/api-busqueda" target="_blank" rel="noopener noreferrer">GitHub</a></div>
      </div>
    </footer>
  )
}