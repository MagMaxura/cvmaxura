import React from 'react';
    import ConversationalDetailBlock from '@/components/cv-preview/ConversationalDetailBlock';

    const CVSectionContent = ({
      formItems = [],
      conversationalDetails = {},
      renderFormItem,
      formItemKeyPrefix,
      showConversationalDataWhenFormIsEmpty = false,
    }) => {
      const hasFormItems = formItems && formItems.length > 0;
      const hasConversationalDetails = conversationalDetails && Object.values(conversationalDetails).some(v => v);

      if (!hasFormItems && !hasConversationalDetails) {
        return null;
      }

      return (
        <>
          {hasFormItems && formItems.map((item, index) => (
            <div key={`${formItemKeyPrefix}-${index}`} className="mb-2.5 md:mb-3 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
              {renderFormItem(item, index)}
            </div>
          ))}
          {(hasConversationalDetails && (hasFormItems || showConversationalDataWhenFormIsEmpty)) && (
            <ConversationalDetailBlock detailsObject={conversationalDetails} isSubtle={hasFormItems} />
          )}
        </>
      );
    };

    export default CVSectionContent;