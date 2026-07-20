import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/site";
import { stripHtml } from "@/lib/seo";
import { getProductBySlug } from "@/lib/woocommerce";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) return { title: "找不到商品" };

  const description = stripHtml(product.short_description || product.description || "").slice(0, 155);

  return {
    title: product.name,
    description,
    alternates: {
      canonical: absoluteUrl(`/product/${slug}/`)
    },
    openGraph: {
      title: product.name,
      description,
      url: absoluteUrl(`/product/${slug}/`),
      images: product.images?.[0]?.src ? [{ url: product.images[0].src }] : undefined
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) notFound();

  const image = product.images?.[0];

  return (
    <main className="product-page">
      {image?.src ? (
        <Image src={image.src} alt={image.alt || product.name} width={900} height={600} />
      ) : null}
      <article>
        <h1>{product.name}</h1>
        {product.prices?.price ? (
          <p className="product-price">
            {product.prices.currency_symbol}
            {product.prices.price}
          </p>
        ) : null}
        <div dangerouslySetInnerHTML={{ __html: product.description || product.short_description || "" }} />
        <a className="btn btn-primary" href="/checkout/">
          前往結帳
        </a>
      </article>
    </main>
  );
}
