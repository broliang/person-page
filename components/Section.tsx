import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ id, title, children, className = "" }) => {
  return (
    <section id={id} className={`py-16 scroll-mt-20 ${className}`}>
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8 border-b-2 border-primary-100 pb-4 inline-block">
          {title}
        </h2>
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </section>
  );
};