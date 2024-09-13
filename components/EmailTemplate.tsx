import * as React from 'react';

interface Program {
  programName: string;
  date: string;
  startTime: string;
  endTime: string;
  facilitatorsNeeded: string;
}

interface EmailTemplateProps {
  programs: Program[];
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  programs,
}) => (
  <div>
    <h1>Programs Requiring Facilitators</h1>
    {programs.map((program, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <h2>{program.programName}</h2>
        <p>Date: {program.date}</p>
        <p>Start Time: {program.startTime}</p>
        <p>End Time: {program.endTime}</p>
        <p>Facilitators Needed: {program.facilitatorsNeeded}</p>
      </div>
    ))}
    <div style={{ marginTop: '40px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
      <p>
        Please email us at <a href="mailto:teambuilding@cornell.edu">teambuilding@cornell.edu</a> or 
        send a facilitator request at <a href="https://hr-project-ten.vercel.app/app/schedule/scheduleDisplay">our scheduling website</a>.
      </p>
      <p>Thank you</p>
      <p>
        Student Program Coordinators<br />
        Cornell Team & Leadership Center<br />
        Bartels Hall, Campus Rd.<br />
        Ithaca, NY 14853<br />
        p: (607) 254-4897<br />
        f: (607) 255-9881<br />
        <a href="mailto:teambuilding@cornell.edu">teambuilding@cornell.edu</a><br />
        <a href="http://ctlc.cornell.edu/">http://ctlc.cornell.edu/</a><br />
        Teamwork, Leadership and Growth through Active Learning
      </p>
      <p style={{ fontWeight: 'bold' }}>Please do not reply directly to this email</p>
    </div>
  </div>
);