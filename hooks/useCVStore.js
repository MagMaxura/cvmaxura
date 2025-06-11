import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

    const initialCVDataGlobal = {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        currentLocation: '',
        address: '',
        nationality: '',
        age: '',
        maritalStatus: '',
        linkedin: '',
        otherSocialProfile: '', 
        portfolio: '',
        profilePicture: null, 
        professionalSummary: '', 
      },
      education: [], 
      educationDetails: {
        studyLocationAndStatus: '',
        studyEnjoyment: '',
        futureStudies: '',
        additionalEducationInfo: '',
      },
      experience: [],
      experienceDetails: {
        currentEmployment: '',
        pastExperiences: '',
        favoriteJob: '',
        favoriteJobTasks: '',
      },
      skills: { // Cambiar a un objeto para las subcategorías
        technical: [],
        soft: [],
        languages: [], // Los idiomas del formulario de habilidades
      },
      skillsDetails: {
        naturalTalents: '',
        toolsAndSkills: '',
        workStyle: '',
      languages: [], // Mantener este para el paso de idiomas si es diferente
      languageDetails: {
        languageProficiency: '',
      },
      interests: {
        idealJob: '',
        workplaceValues: '',
        careerPath: '',
      },
      otherInfo: {
        travelAvailability: '',
        computerSkills: '',
        drivingLicense: '',
      },
      projects: [], 
      certifications: [], 
    };
    
    const useCVStore = () => {
      const { toast } = useToast();
      const [cvData, setCvData] = useState(initialCVDataGlobal); // Siempre inicializar con el objeto completo

      useEffect(() => {
        if (typeof window !== 'undefined') {
          try {
            const item = window.localStorage.getItem('cvData');
            if (item) {
              const parsedItem = JSON.parse(item);
              
              const currentPersonalInfo = { ...initialCVDataGlobal.personalInfo, ...parsedItem.personalInfo };
              delete currentPersonalInfo.github;
              delete currentPersonalInfo.profileSummary;
              if (parsedItem.personalInfo && parsedItem.personalInfo.address && !parsedItem.personalInfo.currentLocation) {
                currentPersonalInfo.currentLocation = parsedItem.personalInfo.address;
              }
              
              const mergedData = { ...initialCVDataGlobal };
              for (const key in initialCVDataGlobal) {
                if (parsedItem[key] !== undefined) {
                  if (key === 'skills') {
                    // Manejar la migración de 'skills' de array a objeto
                    if (Array.isArray(parsedItem[key])) {
                      mergedData[key] = {
                        technical: parsedItem[key], // Asumir que las habilidades antiguas eran técnicas
                        soft: [],
                        languages: [],
                      };
                    } else if (typeof parsedItem[key] === 'object' && parsedItem[key] !== null) {
                      mergedData[key] = { ...initialCVDataGlobal[key], ...parsedItem[key] };
                    } else {
                      mergedData[key] = initialCVDataGlobal[key]; // Fallback si no es ni array ni objeto
                    }
                  } else if (Array.isArray(initialCVDataGlobal[key])) {
                    mergedData[key] = Array.isArray(parsedItem[key]) ? parsedItem[key] : initialCVDataGlobal[key];
                  } else if (typeof initialCVDataGlobal[key] === 'object' && initialCVDataGlobal[key] !== null) {
                    mergedData[key] = { ...initialCVDataGlobal[key], ...parsedItem[key] };
                  } else {
                    mergedData[key] = parsedItem[key];
                  }
                }
              }
              mergedData.personalInfo = currentPersonalInfo;
              setCvData(mergedData); // Actualizar el estado solo si hay datos en localStorage
            }
          } catch (error) {
            console.error("Error reading from localStorage", error);
          }
        }
      }, []); // Se ejecuta solo una vez al montar el componente

      useEffect(() => {
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem('cvData', JSON.stringify(cvData));
            console.log("useCVStore - cvData actualizado y guardado en localStorage:", cvData);
          } catch (error) {
            console.error("Error writing to localStorage", error);
          }
        }
      }, [cvData]);

      const updateCVData = (section, dataOrField, valueIfField) => {
        setCvData(prevData => {
          let newData;
          if (typeof dataOrField === 'string' && valueIfField !== undefined) {
            newData = {
              ...prevData,
              [section]: {
                ...prevData[section],
                [dataOrField]: valueIfField,
              },
            };
          } else {
            newData = {
              ...prevData,
              [section]: dataOrField,
            };
          }
          console.log(`useCVStore - updateCVData: Sección '${section}' actualizada. Nuevo cvData:`, newData);
          return newData;
        });
      };
      
      const updateCVField = (sectionName, fieldName, fieldValue) => {
        setCvData(prevData => {
          if (typeof prevData[sectionName] === 'object' && prevData[sectionName] !== null && !Array.isArray(prevData[sectionName])) {
            const newData = {
              ...prevData,
              [sectionName]: {
                ...prevData[sectionName],
                [fieldName]: fieldValue,
              },
            };
            console.log(`useCVStore - updateCVField: Campo '${fieldName}' en sección '${sectionName}' actualizado. Nuevo cvData:`, newData);
            toast({
              title: "Campo Actualizado",
              description: `El campo '${fieldName}' en la sección '${sectionName}' ha sido actualizado.`,
              duration: 2000,
            });
            return newData;
          }
          console.log(`useCVStore - updateCVField: No se pudo actualizar el campo '${fieldName}' en sección '${sectionName}'. cvData actual:`, prevData);
          return prevData;
        });
      };
      
      const addListItem = (section, item) => {
        setCvData(prevData => {
          const newData = {
            ...prevData,
            [section]: [...(prevData[section] || []), item],
          };
          console.log(`useCVStore - addListItem: Elemento añadido a sección '${section}'. Nuevo cvData:`, newData);
          return newData;
        });
      };

      const updateListItem = (section, index, item) => {
        setCvData(prevData => {
          const newData = {
            ...prevData,
            [section]: prevData[section].map((existingItem, i) => (i === index ? item : existingItem)),
          };
          console.log(`useCVStore - updateListItem: Elemento en índice ${index} de sección '${section}' actualizado. Nuevo cvData:`, newData);
          return newData;
        });
      };

      const removeListItem = (section, index) => {
        setCvData(prevData => {
          const newData = {
            ...prevData,
            [section]: prevData[section].filter((_, i) => i !== index),
          };
          console.log(`useCVStore - removeListItem: Elemento en índice ${index} de sección '${section}' eliminado. Nuevo cvData:`, newData);
          return newData;
        });
      };
      
      const resetCVData = () => {
        console.log("useCVStore - Reiniciando cvData.");
        setCvData(initialCVDataGlobal);
        try {
          window.localStorage.removeItem('cvData');
        } catch (error) {
          console.error("Error removing from localStorage", error);
        }
      };

      const getInitialCVData = () => {
        return JSON.parse(JSON.stringify(initialCVDataGlobal)); 
      };

      return {
        cvData, // cvData ya está inicializado con initialCVDataGlobal
        updateCVData,
        updateCVField,
        addListItem,
        updateListItem,
        removeListItem,
        resetCVData,
        getInitialCVData,
        // Funciones de actualización específicas para cada sección
        updatePersonalInfo: (field, value) => updateCVField('personalInfo', field, value),
        updateEducation: (data) => updateCVData('education', data),
        updateEducationDetails: (field, value) => updateCVField('educationDetails', field, value),
        updateExperience: (data) => updateCVData('experience', data),
        updateExperienceDetails: (field, value) => updateCVField('experienceDetails', field, value),
        updateSkills: (category, data) => updateCVData('skills', { ...cvData.skills, [category]: data }),
        updateSkillsDetails: (field, value) => updateCVField('skillsDetails', field, value),
        updateLanguages: (data) => updateCVData('languages', data),
        updateLanguageDetails: (field, value) => updateCVField('languageDetails', field, value),
        updateInterests: (field, value) => updateCVField('interests', field, value),
        updateOtherInfo: (field, value) => updateCVField('otherInfo', field, value),
        updateProjects: (data) => updateCVData('projects', data),
        updateCertifications: (data) => updateCVData('certifications', data),
      };
    };

    export default useCVStore;