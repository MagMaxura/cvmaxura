import React from 'react';
    import { User as UserIcon, Link as LinkIcon, MapPin, Phone, Mail, Globe, Users, CalendarDays } from 'lucide-react';

    const DetailItem = ({ icon, value, link }) => {
      if (!value) return null;
      const IconComponent = icon;
      return (
        <div className="flex items-start text-xs md:text-sm text-slate-600 dark:text-slate-300 mb-0.5">
          {IconComponent && <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-500 dark:text-slate-400 mr-1.5 mt-0.5 flex-shrink-0" />}
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline text-sky-600 dark:text-sky-400 break-all">{value}</a>
          ) : (
            <span className="break-words flex-grow">{value}</span>
          )}
        </div>
      );
    };

    const CVHeader = ({ personalInfo }) => {
      return (
        <header className="grid grid-cols-[auto_1fr] gap-x-6 items-start mb-4 md:mb-6">
          <div className="col-span-1 flex-shrink-0 mb-3 md:mb-0">
            {personalInfo.profilePicture ? (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-teal-500 dark:border-teal-400 shadow-lg">
                <img src={personalInfo.profilePicture} alt="Foto de perfil" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-slate-300 dark:border-slate-600 shadow-sm">
                <UserIcon className="w-12 h-12 md:w-16 md:h-16" />
              </div>
            )}
          </div>
          <div className="col-span-1 text-center md:text-left">
            <h1 className="text-xl md:text-3xl font-bold text-teal-600 dark:text-teal-300 break-words">{personalInfo.fullName || "Nombre Completo"}</h1>
            {personalInfo.professionalSummary && <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1 italic whitespace-pre-wrap">{personalInfo.professionalSummary}</p>}
            
            <div className="mt-2 md:mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
              {/* Columna izquierda: Contacto con iconos */}
              <div>
                <DetailItem icon={Mail} value={personalInfo.email} link={`mailto:${personalInfo.email}`} />
                <DetailItem icon={Phone} value={personalInfo.phone} link={`tel:${personalInfo.phone}`} />
                <DetailItem icon={MapPin} value={personalInfo.currentLocation || personalInfo.address} />
              </div>
              {/* Columna derecha: Detalles personales sin iconos, y enlaces */}
              <div>
                {personalInfo.nationality && <DetailItem value={personalInfo.nationality} />}
                {personalInfo.age && <DetailItem value={personalInfo.age ? `${personalInfo.age} años` : ''} />}
                {personalInfo.maritalStatus && <DetailItem value={personalInfo.maritalStatus} />}
                {personalInfo.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline text-xs md:text-sm flex items-center mt-0.5"><LinkIcon size={14} className="mr-1"/>LinkedIn</a>}
                {personalInfo.otherSocialProfile && <a href={personalInfo.otherSocialProfile} target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline text-xs md:text-sm flex items-center mt-0.5"><LinkIcon size={14} className="mr-1"/>Otro Perfil</a>}
                {personalInfo.portfolio && <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline text-xs md:text-sm flex items-center mt-0.5"><LinkIcon size={14} className="mr-1"/>Portfolio</a>}
              </div>
            </div>
          </div>
        </header>
      );
    };

    export default CVHeader;