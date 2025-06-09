import React, { useState, useEffect } from 'react';

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
      skills: [],
      skillsDetails: {
        naturalTalents: '',
        toolsAndSkills: '',
        workStyle: '',
      },
      languages: [], 
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
      const [cvData, setCvData] = useState(() => {
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
                if (Array.isArray(initialCVDataGlobal[key])) {
                  mergedData[key] = Array.isArray(parsedItem[key]) ? parsedItem[key] : initialCVDataGlobal[key];
                } else if (typeof initialCVDataGlobal[key] === 'object' && initialCVDataGlobal[key] !== null) {
                  mergedData[key] = { ...initialCVDataGlobal[key], ...parsedItem[key] };
                } else {
                  mergedData[key] = parsedItem[key];
                }
              }
            }
            mergedData.personalInfo = currentPersonalInfo;

            console.log("useCVStore - Datos cargados/fusionados:", mergedData); // Añadir este log
            return mergedData;
          }
          console.log("useCVStore - Datos iniciales (localStorage vacío o error):", initialCVDataGlobal); // Añadir este log
          return initialCVDataGlobal;
        } catch (error)          {
          console.error("Error reading from localStorage", error);
          console.log("useCVStore - Datos iniciales (error de lectura):", initialCVDataGlobal); // Añadir este log
          return initialCVDataGlobal;
        }
      });

      useEffect(() => {
        try {
          window.localStorage.setItem('cvData', JSON.stringify(cvData));
        } catch (error) {
          console.error("Error writing to localStorage", error);
        }
      }, [cvData]);

      const updateCVData = (section, dataOrField, valueIfField) => {
        if (typeof dataOrField === 'string' && valueIfField !== undefined) {
          
          setCvData(prevData => ({
            ...prevData,
            [section]: {
              ...prevData[section],
              [dataOrField]: valueIfField,
            },
          }));
        } else {
          
          setCvData(prevData => ({
            ...prevData,
            [section]: dataOrField,
          }));
        }
      };
      

      const updateCVField = (sectionName, fieldName, fieldValue) => {
        setCvData(prevData => {
          if (typeof prevData[sectionName] === 'object' && prevData[sectionName] !== null && !Array.isArray(prevData[sectionName])) {
            return {
              ...prevData,
              [sectionName]: {
                ...prevData[sectionName],
                [fieldName]: fieldValue,
              },
            };
          }
          return prevData; 
        });
      };
      
      const addListItem = (section, item) => {
        setCvData(prevData => ({
          ...prevData,
          [section]: [...(prevData[section] || []), item],
        }));
      };

      const updateListItem = (section, index, item) => {
        setCvData(prevData => ({
          ...prevData,
          [section]: prevData[section].map((existingItem, i) => (i === index ? item : existingItem)),
        }));
      };

      const removeListItem = (section, index) => {
        setCvData(prevData => ({
          ...prevData,
          [section]: prevData[section].filter((_, i) => i !== index),
        }));
      };
      
      const resetCVData = () => {
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

      return { cvData, updateCVData, updateCVField, addListItem, updateListItem, removeListItem, resetCVData, getInitialCVData };
    };

    export default useCVStore;