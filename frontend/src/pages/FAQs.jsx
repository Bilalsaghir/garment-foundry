import React, { useEffect, useState } from "react";
import axios from "axios";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/Section";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    axios.get(`${API}/faqs`).then((r) => setFaqs(r.data || [])).catch(() => setFaqs([]));
  }, []);

  return (
    <div data-testid="page-faqs" className="bg-black">
      <section className="pt-40 pb-16 px-6 lg:px-12 border-b border-[#1a1a1a]">
        <div className="max-w-[1440px] mx-auto">
          <span className="overline">CHAPTER · FREQUENTLY ASKED</span>
          <h1 className="mt-6 font-display text-5xl lg:text-7xl text-[#F5F4F0] leading-[1.05] max-w-4xl">
            Answers — quietly considered.
          </h1>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <SectionHeading eyebrow="QUESTIONS" number="— 001" title="What clients usually ask." />
          <Accordion type="single" collapsible className="mt-16 w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={f.id || i} value={`item-${i}`} data-testid={`faq-${i}`} className="border-b border-[#1a1a1a]">
                <AccordionTrigger className="font-display text-lg lg:text-xl text-[#F5F4F0] py-6 hover:no-underline text-left">
                  <span className="flex items-baseline gap-6"><span className="font-display text-xs text-[#666] tracking-luxe">{String(i + 1).padStart(2, "0")}</span>{f.question}</span>
                </AccordionTrigger>
                <AccordionContent className="font-body text-[14px] leading-[1.9] text-[#aaa] pb-6 pl-14">
                  <div dangerouslySetInnerHTML={{ __html: f.answer }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-12 bg-[#070707] text-center">
        <h2 className="font-display text-3xl lg:text-5xl text-[#F5F4F0] max-w-3xl mx-auto leading-tight">Still have a question?</h2>
        <Link to="/contact" data-testid="faq-cta" className="gf-btn gf-btn-solid mt-10">Speak to the Studio</Link>
      </section>
    </div>
  );
}
