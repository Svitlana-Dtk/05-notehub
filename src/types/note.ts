//тег заметки
export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

//типізація однієї нотатки
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
}