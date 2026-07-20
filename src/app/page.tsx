import { HomeInteractions } from "@/components/home/HomeInteractions";
import { getHomeBodyHtml } from "@/lib/home-html";

export default function HomePage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: getHomeBodyHtml() }} />
      <HomeInteractions />
    </>
  );
}
