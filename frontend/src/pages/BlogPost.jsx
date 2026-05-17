import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axios.get(`${API}/blog/${slug}`).then((r) => setPost(r.data)).catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) {
    return (
      <div className="bg-black min-h-screen pt-40 px-6 lg:px-12 text-center">
        <h1 className="font-display text-3xl text-[#F5F4F0]">Article not found</h1>
        <Link to="/blog" className="gf-btn gf-btn-light mt-8 inline-flex">Back to Journal</Link>
      </div>
    );
  }

  if (!post) return <div className="bg-black min-h-screen pt-40 px-6 lg:px-12 text-[#888] font-body text-[13px]">Loading…</div>;

  return (
    <article data-testid="page-blog-post" className="bg-black">
      <div className="max-w-3xl mx-auto px-6 lg:px-0 pt-32 pb-24">
        <Link to="/blog" className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#888] hover:text-white mb-12">
          <ArrowLeft size={14} /> Back to Journal
        </Link>
        <div className="font-body text-[10px] tracking-[0.2em] uppercase text-[#666] mb-4">
          {post.category || "ARTICLE"}{post.published_at ? ` · ${new Date(post.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}` : ""}
        </div>
        <h1 className="font-display text-4xl lg:text-6xl text-[#F5F4F0] leading-[1.05]">{post.title}</h1>
        {post.excerpt && <p className="mt-6 font-body text-[16px] leading-[1.9] text-[#bbb] italic">{post.excerpt}</p>}
        {post.cover_image && (
          <div className="my-12">
            <img src={post.cover_image} alt={post.title} className="w-full h-auto grayscale" />
          </div>
        )}
        <div className="prose-gf font-body text-[15px] leading-[1.95] text-[#ddd] space-y-6" dangerouslySetInnerHTML={{ __html: post.body || "" }} />
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#1a1a1a] flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="text-[11px] font-body tracking-[0.15em] uppercase text-[#888] border border-[#2a2a2a] px-3 py-1">#{t}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
