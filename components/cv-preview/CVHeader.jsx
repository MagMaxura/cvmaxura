import React from 'react';
    import { User as UserIcon, Link as LinkIcon, MapPin, Phone, Mail, Globe, Users, CalendarDays, HeartHandshake, Briefcase } from 'lucide-react';

    const DetailItem = ({ icon: IconComponent, value, link }) => {
      if (!value) return null;
      return (
        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 mb-0.5">
          <div className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2 flex-shrink-0">
            {IconComponent && <IconComponent className="w-full h-full" />}
          </div>
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline text-sky-600 dark:text-sky-400 break-all">{value}</a>
          ) : (
            <span className="break-words">{value}</span>
          )}
        </div>
      );
    };

    const CVHeader = ({ personalInfo }) => {
      return (
        <header className="grid grid-cols-[auto_1fr] gap-x-6 items-center mb-4 md:mb-6">
          <div className="col-span-1 flex-shrink-0 mb-3 md:mb-0">
            {personalInfo.profilePicture ? (
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-teal-500 dark:border-teal-400 shadow-lg">
                <img src={personalInfo.profilePicture} alt="Foto de perfil" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-slate-300 dark:border-slate-600 shadow-sm">
                <UserIcon className="w-14 h-14 md:w-20 md:h-20" />
              </div>
            )}
          </div>
          <div className="col-span-1 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-teal-600 dark:text-teal-300 break-words">{personalInfo.fullName || "Nombre Completo"}</h1>
            {personalInfo.professionalSummary && <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 italic whitespace-pre-wrap">{personalInfo.professionalSummary}</p>}
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              {/* Columna izquierda: Contacto con iconos */}
              <div className="space-y-1">
                <DetailItem icon={Mail} value={personalInfo.email} link={`mailto:${personalInfo.email}`} />
                <DetailItem icon={Phone} value={personalInfo.phone} link={`tel:${personalInfo.phone}`} />
                {personalInfo.address && <DetailItem icon={MapPin} value={personalInfo.address} />}
                {!personalInfo.address && personalInfo.currentLocation && <DetailItem icon={MapPin} value={personalInfo.currentLocation} />}
              </div>
              {/* Columna derecha: Detalles personales con iconos, y enlaces */}
              <div className="space-y-1">
                {personalInfo.nationality && <DetailItem icon={Globe} value={personalInfo.nationality} />}
                {personalInfo.age && <DetailItem icon={CalendarDays} value={personalInfo.age ? `${personalInfo.age} años` : ''} />}
                {personalInfo.maritalStatus && <DetailItem icon={HeartHandshake} value={personalInfo.maritalStatus} />}
                {personalInfo.linkedin && <DetailItem icon={LinkIcon} value="LinkedIn" link={personalInfo.linkedin} />}
                {personalInfo.otherSocialProfile && <DetailItem icon={LinkIcon} value="Otro Perfil" link={personalInfo.otherSocialProfile} />}
                {personalInfo.portfolio && <DetailItem icon={Briefcase} value="Portfolio" link={personalInfo.portfolio} />}
              </div>
            </div>
          </div>
        </header>
      );
    };

    export default CVHeader;