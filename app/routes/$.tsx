import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import {
  json,
  Link,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from "remix";
import { getPost } from "~/utils/post";
import Comments from "~/components/Comments";
import Pre from "~/components/pre";

export const meta: MetaFunction = ({ data }: { data: any }) => {
  return {
    title: `${data.frontmatter.title} - Oldweb2 blog`,
    description: `${data.frontmatter.description}`,
    "og:image":
      "https://www.oldweb2.com/_next/image?url=https%3A%2F%2Fcdn11.bigcommerce.com%2Fs-9d0tcmsrxy%2Fimages%2Fstencil%2Foriginal%2Fproducts%2F170%2F497%2Fwhite-glossy-mug-15oz-front-view-61d5f33b88981__20229.1641412782.jpg&w=640&q=85",
  };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark-dimmed.min.css",
    },
  ];
};

type LoaderData = {
  frontmatter: any;
  code: string;
  slug: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params["*"];
  if (!slug) throw new Response("Not found", { status: 404 });

  const post = await getPost(slug);
  if (post) {
    const { frontmatter, code } = post;
    return json({ frontmatter, code, slug });
  } else {
    throw new Response("Not found", { status: 404 });
  }
};

export default function Post() {
  const { code, frontmatter, slug } = useLoaderData<LoaderData>();
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <div className="lg:flex flex-col justify-center">
      <h1
        className={`lg:my-20 animate__animated animate__slideInDown my-10 py-10 lg:py-40 lg:text-8xl text-center drop-shadow-2xl text-white decoration-black decoration-double bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl`}
      >
        Oldweb2 Blog
      </h1>
      <div className="prose lg:prose-xl lg:py-10">
        <Link to="/">← Back to blog index</Link>
        {frontmatter.image && (
          <div className="mb-6 -mt-6">
            <div className="text-center">
              <div>
                <img
                  src={frontmatter.image.url}
                  className="object-cover object-center w-full"
                />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Credit:{" "}
                <a href={frontmatter.image.credit.url}>
                  {frontmatter.image.credit.text}
                </a>
              </p>
            </div>
          </div>
        )}

        <h1 className="my-20">{frontmatter.title}</h1>

        <Component components={{ pre: Pre }} />

        <div className="my-10">
          <a
            href={`https://github.com/jmn/oldweb2-blog/edit/main/blog-posts/${slug}.mdx`}
          >
            Edit on GitHub
          </a>
          .
        </div>
        {/* <div className="hero">Sign up to get notified about new posts.</div> */}
        <Comments />
      </div>
    </div>
  );
}
