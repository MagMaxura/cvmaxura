import React from 'react';
    import CVSection from '@/components/cv-preview/CVSection';
    import CVSectionContent from '@/components/cv-preview/CVSectionContent';

    const CVSectionRenderer = ({ sections }) => {
      return (
        <>
          {sections.map((section, index) => {
            const hasFormItems = section.formItems && section.formItems.length > 0;
            const hasConvDetails = section.conversationalDetails && Object.values(section.conversationalDetails).some(v => v);
            
            // Renderizar la sección si tiene datos de formulario O datos conversacionales
            if (!hasFormItems && !hasConvDetails) {
              return null;
            }

            return (
              <CVSection key={`${section.keyPrefix}-section-${index}`} icon={section.icon} title={section.title}>
                {section.isListContainer && hasFormItems ? (
                  <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1.5">
                      <CVSectionContent
                      formItems={section.formItems}
                      conversationalDetails={section.conversationalDetails}
                      renderFormItem={section.renderFormItem}
                      formItemKeyPrefix={section.keyPrefix}
                      showConversationalDataWhenFormIsEmpty={section.showConversationalDataWhenFormIsEmpty}
                    />
                  </ul>
                ) : (
                  <CVSectionContent
                    formItems={section.formItems}
                    conversationalDetails={section.conversationalDetails}
                    renderFormItem={section.renderFormItem}
                    formItemKeyPrefix={section.keyPrefix}
                    showConversationalDataWhenFormIsEmpty={section.showConversationalDataWhenFormIsEmpty}
                  />
                )}
              </CVSection>
            );
          })}
        </>
      );
    };

    export default CVSectionRenderer;