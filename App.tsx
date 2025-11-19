import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Briefcase, 
  Menu, 
  X, 
  FileText,
  Loader2,
  Stamp
} from 'lucide-react';
import { Section } from './components/Section';
import { Badge } from './components/Badge';
import { ResumeData } from './types';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from public/profile.json
  useEffect(() => {
    fetch('./profile.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load profile data');
        }
        return response.json();
      })
      .then(data => {
        setResumeData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load profile data. Please ensure public/profile.json exists.');
        setLoading(false);
      });
  }, []);

  // Process publications: Sort by year descending
  const sortedPublications = useMemo(() => {
    if (!resumeData) return [];
    return [...resumeData.publications].sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      return yearB - yearA;
    });
  }, [resumeData]);

  // Dynamic stats
  const stats = useMemo(() => {
    if (!sortedPublications.length) return { total: 0, highLevel: 0, esi: 0 };
    const total = sortedPublications.length;
    const highLevel = sortedPublications.filter(p => 
      p.tags?.some(t => t.includes('CCF-A') || t.includes('CCF-B') || t.includes('一区'))
    ).length;
    const esi = sortedPublications.filter(p => 
      p.tags?.some(t => t.toLowerCase().includes('esi'))
    ).length;
    return { total, highLevel, esi };
  }, [sortedPublications]);

  // Close menu when clicking a link on mobile
  const handleNavClick = (id: string) => {
    setIsMenuOpen(false);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll spy effect
  useEffect(() => {
    if (loading || !resumeData) return;

    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'publications', 'patents'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, resumeData]);

  const navItems = [
    { id: 'home', label: '首页' },
    { id: 'about', label: '简介 & 经历' },
    { id: 'projects', label: '科研项目' },
    { id: 'publications', label: '论文专著' },
    { id: 'patents', label: '专利软著' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-600">
        <Loader2 className="animate-spin mb-4 text-primary-600" size={48} />
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (error || !resumeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-600 p-4 text-center">
        <div className="text-xl font-bold mb-2">Error</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Name */}
            <div className="text-xl font-serif font-bold text-slate-900 cursor-pointer" onClick={() => handleNavClick('home')}>
              {resumeData.profile.name.split(' ')[0]}
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    activeSection === item.id 
                      ? 'text-primary-700' 
                      : 'text-slate-600 hover:text-primary-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
            <div className="flex flex-col py-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="px-6 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-16 md:pt-48 md:pb-24 bg-gradient-to-br from-slate-50 via-blue-50 to-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Avatar / Image */}
            <div className="relative shrink-0">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-primary-100">
                <img 
                  src={resumeData.profile.avatarUrl} 
                  alt={resumeData.profile.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="text-center md:text-left space-y-4 flex-1">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
                {resumeData.profile.name}
              </h1>
              <div className="text-lg md:text-xl text-primary-700 font-medium">
                {resumeData.profile.title}
              </div>
              <div className="text-slate-600 flex items-center justify-center md:justify-start gap-2">
                <Briefcase size={18} />
                <span>{resumeData.profile.affiliation}</span>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2 text-sm text-slate-600">
                <a href={`mailto:${resumeData.profile.email}`} className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                  <Mail size={16} /> {resumeData.profile.email}
                </a>
                <div className="flex items-center gap-2">
                  <Phone size={16} /> {resumeData.profile.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} /> 成都, 中国
                </div>
              </div>

              {/* Research Interests Pills */}
              <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-2">
                {resumeData.profile.researchInterests.map((interest, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-700 shadow-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Timeline Section */}
      <Section id="about" title="简介 & 教育背景" className="bg-white">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Biography */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
              个人简介
            </h3>
            <p className="text-slate-600 leading-relaxed text-justify">
              {resumeData.profile.bio}
            </p>
            
            {/* Experience Subset */}
             <div className="pt-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
                工作经历
              </h3>
              <div className="space-y-4 border-l-2 border-slate-200 ml-2 pl-6">
                {resumeData.experience.map((job, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white bg-primary-500 shadow-sm"></div>
                    <div className="font-bold text-slate-900">{job.role}</div>
                    <div className="text-slate-700">{job.institution} {job.department}</div>
                    <div className="text-sm text-slate-500 font-mono">{job.period}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education Timeline */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <GraduationCap className="text-primary-600" />
              教育背景
            </h3>
            <div className="space-y-8 border-l-2 border-slate-100 ml-1.5 pl-6 py-2">
              {resumeData.education.map((edu, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-200 group-hover:bg-primary-400 transition-colors border-2 border-white"></div>
                  <h4 className="font-bold text-slate-900">{edu.degree}</h4>
                  <div className="text-slate-700">{edu.institution}</div>
                  {edu.major && <div className="text-slate-600 text-sm">{edu.major}</div>}
                  <div className="text-xs text-slate-400 mt-1 font-mono">{edu.period}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Projects Section */}
      <Section id="projects" title="科研项目" className="bg-slate-50">
        <div className="grid md:grid-cols-2 gap-6">
          {resumeData.projects.map((project, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                  project.role.includes("主持") ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
                }`}>
                  {project.role}
                </span>
                <span className="text-xs font-mono text-slate-400">{project.period}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                {project.title}
              </h3>
              <div className="mt-auto space-y-2 text-sm text-slate-600 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <Award size={14} className="shrink-0 text-slate-400"/>
                  <span>{project.source}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="shrink-0 text-slate-400"/>
                    <span className="font-mono text-xs">{project.code}</span>
                  </div>
                  {project.funding && (
                     <span className="font-bold text-primary-700">{project.funding}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Publications Section */}
      <Section id="publications" title="代表性论文" className="bg-white">
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-8 flex items-start gap-3">
          <BookOpen className="text-primary-600 mt-0.5 shrink-0" size={20} />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">出版概况</p>
            <p>
              发表学术论文 <span className="font-bold">{stats.total}</span> 篇，
             包含 <span className="font-bold">{stats.highLevel}</span> 篇 CCF-A/B 类及一区学术论文
              {stats.esi > 0 && <span>，其中 ESI 高被引论文 <span className="font-bold">{stats.esi}</span> 篇</span>}。
              <br/>
              <span className="text-xs opacity-80 mt-1 block">* 表示通讯作者</span>
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {sortedPublications.map((pub, idx) => {
            // Highlight the user's name in the author list
            const parts = pub.authors.split(/(S\. Liang\*?|梁爽\*?)/g);
            
            return (
              <div key={idx} className="flex gap-4 group">
                <div className="text-slate-300 font-mono text-sm font-bold w-8 shrink-0 pt-0.5">
                  [{idx + 1}]
                </div>
                <div className="flex-1 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                  <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {pub.title}
                  </h4>
                  <div className="text-slate-700 mb-2 text-sm leading-relaxed">
                    {parts.map((part, i) => (
                      part.includes('Liang') || part.includes('梁爽') 
                        ? <span key={i} className="font-bold text-slate-900 underline decoration-primary-300 decoration-2">{part}</span> 
                        : <span key={i}>{part}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-y-2">
                     <span className="font-serif italic text-slate-600 mr-3">
                       {pub.venue}, {pub.year}
                     </span>
                     <div className="flex flex-wrap">
                       {pub.tags?.map((tag, tIdx) => (
                         <Badge key={tIdx} text={tag} />
                       ))}
                     </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
      
      {/* Patents Section */}
      <Section id="patents" title="专利软著" className="bg-slate-50">
        {resumeData.patents && resumeData.patents.length > 0 ? (
          <div className="grid gap-4">
            {resumeData.patents.map((patent, idx) => (
              <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-primary-200 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      patent.type.includes("软著") || patent.type.includes("软件")
                        ? "bg-purple-50 text-purple-700 border-purple-100"
                        : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                      {patent.type}
                    </span>
                     <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                       <Stamp size={12} /> {patent.number}
                     </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-primary-700 transition-colors">{patent.title}</h3>
                  <p className="text-sm text-slate-600">
                    {patent.inventors.split(/[;；]/).map((person, pIdx, arr) => (
                       <span key={pIdx} className={person.includes('梁爽') ? 'font-bold text-slate-900' : ''}>
                         {person.trim()}{pIdx < arr.length - 1 ? '，' : ''}
                       </span>
                    ))}
                  </p>
                </div>
                <div className="text-sm text-slate-500 whitespace-nowrap flex items-center gap-2 md:flex-col md:items-end md:justify-center">
                  <span>{patent.date}</span>
                  {patent.country && <span className="hidden md:inline text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">{patent.country}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 text-center py-8">暂无专利信息</div>
        )}
      </Section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6 max-w-6xl text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-white mb-2">{resumeData.profile.name}</h2>
            <p className="text-sm opacity-70">© {new Date().getFullYear()} All Rights Reserved.</p>
          </div>
          
          <div className="flex flex-col md:items-end gap-2 text-sm">
             <p className="flex items-center gap-2">
               <Mail size={16} /> {resumeData.profile.email}
             </p>
             <p className="opacity-60">
               Designed based on personal resume
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;