import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/site";
import { decodeHtml, stripHtml } from "@/lib/seo";
import { getFeaturedImage, getPageBySlug, getPostBySlug } from "@/lib/wordpress";

interface SlugPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getContent(slugPath: string) {
  const slug = slugPath.split("/").filter(Boolean).at(-1);
  if (!slug) return null;

  try {
    return (await getPageBySlug(slug)) ?? (await getPostBySlug(slug));
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const item = await getContent(slugPath);

  if (!item) {
    return {
      title: "找不到頁面"
    };
  }

  const featuredImage = getFeaturedImage(item);
  const title = decodeHtml(item.yoast_head_json?.title || stripHtml(item.title.rendered));
  const description = decodeHtml(
    item.yoast_head_json?.description || stripHtml(item.excerpt?.rendered || "").slice(0, 155)
  );
  const canonical = absoluteUrl(`/${slugPath}/`);
  const ogImage = item.yoast_head_json?.og_image?.[0]?.url || featuredImage?.source_url;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined
    }
  };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const slugPath = slug.join("/");
  const item = await getContent(slugPath);

  if (!item?.content?.rendered) notFound();

  return (
    <main className="wp-page">
      <article className="wp-content">
        <h1 dangerouslySetInnerHTML={{ __html: item.title.rendered }} />
        <div dangerouslySetInnerHTML={{ __html: item.content.rendered }} />
      </article>
    </main>
  );
}
