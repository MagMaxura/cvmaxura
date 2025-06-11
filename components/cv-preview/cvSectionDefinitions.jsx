import React from 'react';
    import { Briefcase, GraduationCap, Star, Code, Languages as LanguagesIconUI, Info, Award } from 'lucide-react';

    const renderExperienceItem = (exp) => (
      <>
        <h3 className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-100">{exp.role || "Cargo"}</h3>
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 font-normal">{exp.company || "Empresa"}</p>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{exp.startDate || "Fecha Inicio"} - {exp.endDate || "Fecha Fin"}</p>
        {exp.description && <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-wrap">{exp.description}</p>}
      </>
    );

    const renderEducationItem = (edu) => (
      <>
        <h3 className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-100">{edu.degree || "Título"}</h3>
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 font-normal">{edu.institution || "Institución"}</p>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Fecha de Fin: {edu.endDate || "Fecha"}</p>
        {edu.description && <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-wrap">{edu.description}</p>}
      </>
    );

    const renderSkillItem = (skill) => (
      <li className="text-sm md:text-base text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/60 px-2 py-1 rounded-md">
        {skill.name || "Habilidad"} <span className="text-xs text-slate-500 dark:text-slate-400">({skill.level || "Nivel"})</span>
      </li>
    );

    const renderProjectItem = (proj) => (
      <>
        <h3 className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-100">{proj.name || "Proyecto"}</h3>
        {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 dark:text-sky-400 hover:underline break-all flex items-center"><Code size={12} className="mr-1"/>{proj.link}</a>}
        {proj.technologies && <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 italic mt-0.5">Tecnologías: {proj.technologies}</p>}
        {proj.description && <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-wrap">{proj.description}</p>}
      </>
    );
    
    const renderCertificationItem = (cert) => (
      <>
        <h3 className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-100">{cert.name || "Certificación"}</h3>
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 font-normal">{cert.issuingOrganization || "Organización Emisora"}</p>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Fecha: {cert.dateObtained || "Fecha"}</p>
        {cert.link && <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-600 dark:text-sky-400 hover:underline break-all flex items-center"><Award size={12} className="mr-1"/>Ver Credencial</a>}
      </>
    );

    const renderLanguageItem = (lang) => (
       <li className="text-sm md:text-base text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/60 px-2 py-1 rounded-md">
        {lang.name || "Idioma"} <span className="text-xs text-slate-500 dark:text-slate-400">({lang.level || "Nivel"})</span>
      </li>
    );

    export const getSectionDefinitions = (cvData = {}) => {
      const { 
        experience = [],
        education = [],
        skills: { technical: technicalSkills = [], soft: softSkills = [], languages: formLanguages = [] } = {}, // Desestructurar skills
        projects = [],
        certifications = [],
        languages: otherLanguages = [], // Renombrar para evitar conflicto con languages de skills
        educationDetails = {}, 
        experienceDetails = {}, 
        skillsDetails = {}, 
        languageDetails = {}, 
        interests = {}, 
        otherInfo = {} 
      } = cvData;

      return [
        {
          title: "Experiencia Laboral",
          icon: Briefcase,
          formItems: experience,
          conversationalDetails: experienceDetails,
          renderFormItem: renderExperienceItem,
          keyPrefix: "exp",
          showConversationalDataWhenFormIsEmpty: true,
        },
        {
          title: "Educación",
          icon: GraduationCap,
          formItems: education,
          conversationalDetails: educationDetails,
          renderFormItem: renderEducationItem,
          keyPrefix: "edu",
          showConversationalDataWhenFormIsEmpty: true,
        },
        {
          title: "Habilidades",
          icon: Star,
          formItems: [...technicalSkills, ...softSkills], // Combinar habilidades técnicas y blandas
          conversationalDetails: skillsDetails,
          renderFormItem: renderSkillItem,
          keyPrefix: "skill",
          isListContainer: true,
          showConversationalDataWhenFormIsEmpty: true,
        },
        {
          title: "Proyectos",
          icon: Code,
          formItems: projects,
          renderFormItem: renderProjectItem,
          keyPrefix: "proj",
        },
        {
          title: "Certificaciones",
          icon: Award,
          formItems: certifications,
          renderFormItem: renderCertificationItem,
          keyPrefix: "cert",
        },
        {
          title: "Idiomas",
          icon: LanguagesIconUI,
          formItems: [...formLanguages, ...otherLanguages], // Combinar idiomas de habilidades y otros idiomas
          conversationalDetails: languageDetails,
          renderFormItem: renderLanguageItem,
          keyPrefix: "lang",
          isListContainer: true,
          showConversationalDataWhenFormIsEmpty: true,
        },
        {
          title: "Intereses y Preferencias",
          icon: Info,
          conversationalDetails: interests,
          keyPrefix: "interest",
          showConversationalDataWhenFormIsEmpty: true,
        },
        {
          title: "Información Adicional",
          icon: Info,
          conversationalDetails: otherInfo,
          keyPrefix: "other",
          showConversationalDataWhenFormIsEmpty: true,
        },
      ];
    };