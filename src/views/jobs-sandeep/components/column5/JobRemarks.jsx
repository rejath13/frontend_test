import React, { useEffect, useState } from "react";
import { Button, Form, OverlayTrigger, Popover } from "react-bootstrap";
import { truncateString } from "../../helpers/job-card-helper";
import "./JobRemarks.scss";

const JobRemarks = ({ jobRemarks, jobId }) => {
  //
  const [modifiedJobRemarks, setModifiedJobRemarks] = useState(jobRemarks);

  function convertToWhatsAppNumber(normalNumber, countryCode) {
    // Remove any non-digit characters
    normalNumber = normalNumber.replace(/\D/g, '');

    console.log('normal Number: ', normalNumber);

    // Remove leading zeros
    normalNumber = normalNumber.replace(/^0+/, '');

    // Add country code prefix
    if (!normalNumber.startsWith(countryCode)) {
        normalNumber = countryCode + normalNumber;
    }

    return normalNumber;
}



  
  const findAndFormatPhoneNumbers = () => {
    const pattern = /\b(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})\b/g;
    const countryCode = '+971';

    // Replace phone numbers with WhatsApp links
    const formatted = jobRemarks.replace(pattern, (match) => {
      console.log('match before ',  match)
      match = match.replace(/\D/g, '');
      if(match.startsWith('05')) {
        console.log('yes start with 05')
         // Remove leading zeros
         match = convertToWhatsAppNumber(match, countryCode)
         console.log('match is ', match)


      }
      return `<a href="https://wa.me/${match}?text=Hi," target="_blank">${match}</a>`;
    });

    setModifiedJobRemarks(formatted);
  }

  useEffect(() => {
    if (jobRemarks) {

      findAndFormatPhoneNumbers()
    }
  }, [jobRemarks])
 
 
  const [showPopover, setShowPopover] = useState(false);

  const popoverContent = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Job Remarks</Popover.Title>
      <Popover.Content><div dangerouslySetInnerHTML={{__html: modifiedJobRemarks}}></div></Popover.Content>
    </Popover>
  );

  const handleMouseEnter = () => {
    setShowPopover(true);
  };

  const handleMouseLeave = () => {
    setShowPopover(false);
  };

  return (
    <div
      className="job-remarks"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {modifiedJobRemarks && <div dangerouslySetInnerHTML={{__html: truncateString(modifiedJobRemarks, 130)
        
      }}>{}</div>}
      {modifiedJobRemarks && (
        <OverlayTrigger
          trigger="hover focus"
          placement="right"
          show={showPopover}
          overlay={popoverContent}
        >
          <div></div>
        </OverlayTrigger>
      )}
    </div>
  );
};

export default JobRemarks;
