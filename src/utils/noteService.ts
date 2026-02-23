import notesData from '../assets/data/notes.json';

export interface Note {
    id: number;
    title_zh: string;
    title_en: string;
    category: string;
    date: string;
    author: string;
    readTime: string;
    tags: string[];
    summary_zh: string;
    summary_en: string;
    content_zh: string;
    content_en: string;
}

const LOCAL_STORAGE_KEY = 'pzn_custom_notes';

export const noteService = {
    getNotes: (): Note[] => {
        const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
        const customNotes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];

        // Merge static notes from JSON with custom notes from localStorage
        // Avoid duplicates if we ever transition some custom notes to the JSON file
        const allNotes = [...(notesData as Note[])];

        customNotes.forEach(customNote => {
            if (!allNotes.find(n => n.id === customNote.id)) {
                allNotes.push(customNote);
            }
        });

        return allNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    saveNote: (note: Note): void => {
        const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
        const customNotes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];

        const index = customNotes.findIndex(n => n.id === note.id);
        if (index > -1) {
            customNotes[index] = note;
        } else {
            customNotes.push(note);
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customNotes));
    },

    deleteNote: (id: number): void => {
        const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!storedNotes) return;
        const customNotes: Note[] = (JSON.parse(storedNotes) as Note[]).filter(n => n.id !== id);

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customNotes));
    },

    getNoteById: (id: number | string): Note | undefined => {
        const notes = noteService.getNotes();
        return notes.find(n => n.id.toString() === id.toString());
    }
};
