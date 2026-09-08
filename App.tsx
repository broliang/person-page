import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Menu, 
  X, 
  Loader2
} from 'lucide-react';
import { Section } from './components/Section';
import { PatentsSection, ProjectsSection, PublicationsSection } from './components/AcademicSections';
import { ResumeData } from './types';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from public/profile.json
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}profile.json`)
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch profile data: ${response.status} ${response.statusText}`);
        }
        try {
          return await response.json();
        } catch {
          throw new Error('Invalid profile.json format');
        }
      })
      .then(data => {
        setResumeData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load profile data.');
        setLoading(false);
      });
  }, []);

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

      <ProjectsSection projects={resumeData.projects} />

      <PublicationsSection publications={resumeData.publications} />

      <PatentsSection patents={resumeData.patents} />

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
