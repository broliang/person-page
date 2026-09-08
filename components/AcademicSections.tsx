import React from 'react';
import { Patent, Project, Publication } from '../types';

const isKnownValue = (value?: string) => Boolean(value && value.trim() && value.trim() !== '-');

const externalLinkProps = {
  target: '_blank',
  rel: 'noreferrer noopener',
};

interface AcademicSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const AcademicSection: React.FC<AcademicSectionProps> = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-20 bg-white py-14">
    <div className="container mx-auto max-w-5xl px-6">
      <h2 className="mb-8 border-b border-slate-200 pb-3 text-left text-lg font-semibold text-slate-900">
        {title}
      </h2>
      {children}
    </div>
  </section>
);

export const ProjectsSection: React.FC<{ projects: Project[] }> = ({ projects }) => (
  <AcademicSection id="projects" title="科研项目">
    <ol className="list-decimal space-y-0 pl-6 text-[15px] leading-[1.6] text-slate-700 marker:text-slate-400">
      {projects.map((project, index) => {
        const summary = [project.source, project.role, project.period].filter(isKnownValue);
        const details = [
          isKnownValue(project.code) ? `项目编号：${project.code}` : '',
          isKnownValue(project.funding) ? `经费：${project.funding}` : '',
        ].filter(Boolean);

        return (
          <li key={`${project.title}-${index}`} className="break-words border-b border-slate-100 py-4 pl-2 first:pt-0 last:border-b-0 last:pb-0">
            <div className="font-semibold text-slate-900">{project.title}</div>
            {summary.length > 0 && <div className="mt-1 text-[14px] text-slate-600">{summary.join(' · ')}</div>}
            {details.length > 0 && <div className="mt-0.5 text-[14px] text-slate-400">{details.join(' · ')}</div>}
          </li>
        );
      })}
    </ol>
  </AcademicSection>
);

const sortPublicationsByYear = (publications: Publication[]) => publications
  .map((publication, index) => ({ publication, index }))
  .sort((a, b) => {
    const yearDifference = (Number.parseInt(b.publication.year, 10) || 0) - (Number.parseInt(a.publication.year, 10) || 0);
    return yearDifference || a.index - b.index;
  })
  .map(({ publication }) => publication);

const splitVenue = (venue: string, year: string) => {
  const yearPattern = year.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const withoutYear = venue
    .replace(new RegExp(`\\s*\\(${yearPattern}\\)\\s*$`), '')
    .replace(new RegExp(`\\s+${yearPattern}(?=\\s*:|\\s*$)`), '')
    .trim();
  const colonIndex = withoutYear.indexOf(':');
  const beforeColon = colonIndex >= 0 ? withoutYear.slice(0, colonIndex).trim() : withoutYear;
  const afterColon = colonIndex >= 0 ? withoutYear.slice(colonIndex + 1).trim() : '';
  const volumeMatch = beforeColon.match(/^(.*?)(?:\s+(\d+(?:\(\d+\))?))$/);

  if (volumeMatch) {
    return {
      name: volumeMatch[1],
      details: [volumeMatch[2], afterColon].filter(Boolean).join(': '),
    };
  }

  return { name: beforeColon, details: afterColon };
};

const HighlightedAuthors: React.FC<{ authors: string }> = ({ authors }) => (
  <>
    {authors.split(/(Shuang Liang\*?|梁爽\*?)/g).map((part, index) => (
      /^(Shuang Liang|梁爽)/.test(part)
        ? <strong key={`${part}-${index}`} className="font-semibold text-slate-900">{part}</strong>
        : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
    ))}
  </>
);

const PublicationTitle: React.FC<{ publication: Publication }> = ({ publication }) => {
  const href = publication.pageUrl || publication.pdfUrl;
  const className = href
    ? 'font-medium text-blue-700 underline-offset-2 hover:underline'
    : 'font-medium text-slate-900';

  return href ? (
    <a href={href} className={className} {...externalLinkProps}>{publication.title}</a>
  ) : (
    <span className={className}>{publication.title}</span>
  );
};

export const PublicationsSection: React.FC<{ publications: Publication[] }> = ({ publications }) => {
  const sortedPublications = sortPublicationsByYear(publications);

  return (
    <AcademicSection id="publications" title="科研论文">
      <p className="mb-5 text-[14px] leading-[1.6] text-slate-500">* 表示通讯作者</p>
      <ol className="list-decimal space-y-0 pl-6 text-[15px] leading-[1.6] text-slate-700 marker:text-slate-400">
        {sortedPublications.map((publication, index) => {
          const venue = splitVenue(publication.venue, publication.year);

          return (
            <li key={`${publication.title}-${index}`} className="break-words border-b border-slate-100 py-3.5 pl-2 first:pt-0 last:border-b-0 last:pb-0">
              <p>
                <HighlightedAuthors authors={publication.authors} />,
                {' “'}<PublicationTitle publication={publication} />{',” '}
                <em className="text-slate-800">{venue.name}</em>
                {venue.details && <>, {venue.details}</>}
                {publication.year && <>, {publication.year}</>}.
                {publication.status === 'accepted' && <span className="ml-2 text-[14px] lowercase text-slate-500">accept</span>}
                {publication.tags?.map(tag => (
                  <span key={tag} className="ml-2 whitespace-nowrap text-[13px] text-slate-500">[{tag}]</span>
                ))}
                {publication.pdfUrl && (
                  <a href={publication.pdfUrl} className="ml-2 whitespace-nowrap text-[14px] text-blue-700 hover:underline" {...externalLinkProps}>[PDF]</a>
                )}
              </p>
            </li>
          );
        })}
      </ol>
    </AcademicSection>
  );
};

const formatPeople = (people: string) => people
  .split(/[;；]/)
  .map(person => person.trim())
  .filter(Boolean)
  .join('，');

const PatentList: React.FC<{ patents: Patent[]; kind: 'patent' | 'software' }> = ({ patents, kind }) => (
  <ol className="list-decimal space-y-0 pl-6 text-[15px] leading-[1.6] text-slate-700 marker:text-slate-400">
    {patents.map((patent, index) => {
      const isSoftware = kind === 'software';
      const numberLabel = isSoftware ? '登记号' : patent.number.startsWith('ZL') ? '专利号' : '申请号';
      const dateLabel = isSoftware ? '日期' : patent.number.startsWith('ZL') ? '授权日期' : '申请日期';

      return (
        <li
          key={`${patent.number}-${index}`}
          data-kind={kind}
          className="break-words border-b border-slate-100 py-3.5 pl-2 first:pt-0 last:border-b-0 last:pb-0"
        >
          <p>
            {formatPeople(patent.inventors)}.{' '}
            <strong className="font-semibold text-slate-900">{patent.title}</strong>.
            {isKnownValue(patent.number) && <> {numberLabel} {patent.number}</>}
            {isKnownValue(patent.date) && <>, {dateLabel} {patent.date}</>}
            {isKnownValue(patent.status) && <>, {patent.status}</>}.
            {patent.link && (
              <a href={patent.link} className="ml-2 whitespace-nowrap text-[14px] text-blue-700 hover:underline" {...externalLinkProps}>[证明文件]</a>
            )}
          </p>
        </li>
      );
    })}
  </ol>
);

export const PatentsSection: React.FC<{ patents: Patent[] }> = ({ patents }) => {
  const inventionPatents = patents.filter(patent => !patent.type.includes('软件') && !patent.type.includes('软著'));
  const softwareCopyrights = patents.filter(patent => patent.type.includes('软件') || patent.type.includes('软著'));

  return (
    <AcademicSection id="patents" title="专利软著">
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-base font-semibold text-slate-900">专利</h3>
          <PatentList patents={inventionPatents} kind="patent" />
        </div>
        <div>
          <h3 className="mb-4 text-base font-semibold text-slate-900">软件著作权</h3>
          <PatentList patents={softwareCopyrights} kind="software" />
        </div>
      </div>
    </AcademicSection>
  );
};
