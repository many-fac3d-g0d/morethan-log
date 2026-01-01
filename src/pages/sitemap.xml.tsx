import { getPosts } from "../apis/notion-client/getPosts"
import { CONFIG } from "site.config"
import { GetStaticProps } from "next"

type SitemapField = {
  loc: string
  lastmod: string
  priority: number
  changefreq: string
}

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts()
  const dynamicPaths = posts.map((post) => `${CONFIG.link}/${post.slug}`)

  // Create an array of fields, each with a loc and lastmod
  const fields: SitemapField[] = dynamicPaths.map((path) => ({
    loc: path,
    lastmod: new Date().toISOString(),
    priority: 0.7,
    changefreq: "daily",
  }))

  // Include the site root separately
  fields.unshift({
    loc: CONFIG.link,
    lastmod: new Date().toISOString(),
    priority: 1.0,
    changefreq: "daily",
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${fields
  .map(
    (field) => `  <url>
    <loc>${field.loc}</loc>
    <lastmod>${field.lastmod}</lastmod>
    <priority>${field.priority}</priority>
    <changefreq>${field.changefreq}</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>`

  return {
    props: {
      sitemap,
    },
  }
}

function Sitemap({ sitemap }: { sitemap: string }) {
  return <div dangerouslySetInnerHTML={{ __html: sitemap }} />
}

export default Sitemap