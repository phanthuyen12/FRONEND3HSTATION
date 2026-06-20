import React from 'react';
import FeatherIcon from 'feather-icons-react';
import HostingLayout from '../layouts/HostingLayout';
import { defaultDisclaimerContent } from '../data/disclaimerContent';

const DisclaimerPage = () => {
  const [content] = React.useState(defaultDisclaimerContent);

  return (
    <HostingLayout>
      <section className="px-6 py-10 md:py-16 bg-[#070c0b]">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          {/* Header Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FCD34D]/25 bg-[#FCD34D]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#FCD34D]">
            <FeatherIcon icon="alert-triangle" size={14} />
            Miễn trừ trách nhiệm
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-black leading-tight text-white md:text-5xl mb-6">
            Chính Sách Miễn Trừ Trách Nhiệm AETRADING
          </h1>
          
          <p className="text-base leading-8 text-slate-300 md:text-lg mb-12 border-l-2 border-[#FCD34D] pl-4">
            {content.subtitle}
          </p>

          {/* Highlights Box */}
          <div className="mb-12 rounded-2xl border border-[#FCD34D]/18 bg-[#FCD34D]/5 p-6 md:p-8">
            <h3 className="text-xs font-black uppercase tracking-[0.24em] text-[#FCD34D] mb-4">Lưu ý quan trọng</h3>
            <div className="space-y-3">
              {content.highlights.map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="mt-1 text-[#FCD34D] shrink-0">
                    <FeatherIcon icon="info" size={16} />
                  </div>
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Document Sections */}
          <div className="space-y-8">
            {content.sections.map((section, idx) => (
              <div
                key={section.id}
                id={section.id}
                className="pb-8 border-b border-white/10 last:border-0"
              >
                <div className="text-xs font-black uppercase tracking-[0.22em] text-[#FCD34D] mb-2">
                  Mục {idx + 1}: {section.title}
                </div>
                <h2 className="text-xl font-bold text-white mb-4">{section.summary}</h2>
                <div className="space-y-3 pl-1">
                  {section.points.map((point, pIdx) => (
                    <div key={pIdx} className="flex gap-3 items-start">
                      <span className="text-[#FCD34D] text-sm mt-0.5">•</span>
                      <p className="text-sm leading-7 text-slate-400">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </HostingLayout>
  );
};

export default DisclaimerPage;
