import React from 'react';
import {Popover, Typography} from 'antd';
import {InfoCircleOutlined} from '@ant-design/icons';
import {blue} from '@ant-design/colors';
import {LiftDayData} from '@/types';

const {Text} = Typography;

interface NotesPopoverProps {
  session: LiftDayData;
}

// Helper function to process and split notes
const processNoteString = (noteString?: string): string[] => {
  if (!noteString || noteString.trim() === "") {
    return [];
  }
  return noteString
    .trim()
    .split('\\n')
    .map(line => line.trim())
    .filter(line => line !== "");
};

// Sub-component to display a section of notes
interface NoteSectionProps {
  title: string;
  notes: string[];
  style?: React.CSSProperties;
}

const NoteDisplaySection: React.FC<NoteSectionProps> = ({
                                                          title,
                                                          notes
                                                        }) => {
  if (notes.length === 0) {
    return null;
  }
  return (
    <div>
      <Text italic>{title}:</Text>
      {notes.map((note, index) => (
        <div
          key={index}
          style={{paddingLeft: '8px', whiteSpace: 'pre-line'}}>
          {note}
        </div>
      ))}
    </div>
  );
};

export const NotesPopover: React.FC<NotesPopoverProps> = ({session}) => {
  const sessionNoteLines = processNoteString(session.sessionNotes);
  const liftNoteLines: string[] = processNoteString(session.liftNotes);
  if (sessionNoteLines.length === 0 && liftNoteLines.length === 0) {
    return null;
  }

  const content = (<>
    <NoteDisplaySection title="Session" notes={sessionNoteLines}/>
    <NoteDisplaySection title="Lift" notes={liftNoteLines}/>
  </>);

  return (
    <Popover
      content={content}
      title="Notes"
      placement="right"
    >
      <InfoCircleOutlined
        style={{marginLeft: 8, cursor: 'pointer', color: blue.primary}}
      />
    </Popover>
  );
};
