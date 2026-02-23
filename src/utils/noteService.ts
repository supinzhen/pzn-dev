import notesData from '../assets/data/notes.json';

export interface Note {
    id: number;
    title: string;
    category: string;
    date: string;
    author: string;
    readTime: string;
    tags: string[];
    summary: string;
    content: string;
}

const LOCAL_STORAGE_KEY = 'pzn_custom_notes';
const DELETED_NOTES_KEY = 'pzn_deleted_notes';

export const noteService = {
    getNotes: (): Note[] => {
        const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
        const customNotes: any[] = storedNotes ? JSON.parse(storedNotes) : [];

        const storedDeleted = localStorage.getItem(DELETED_NOTES_KEY);
        const deletedIds: number[] = storedDeleted ? JSON.parse(storedDeleted) : [];

        // 1. Get static notes and map legacy zh/en fields to unified fields
        const staticNotes = (notesData as any[])
            .filter(n => !deletedIds.includes(n.id))
            .map(n => ({
                ...n,
                title: n.title || n.title_zh || n.title_en || '',
                summary: n.summary || n.summary_zh || n.summary_en || '',
                content: n.content || n.content_zh || n.content_en || ''
            }));

        // 2. Build final list
        const notesMap = new Map<number, Note>();

        staticNotes.forEach(n => notesMap.set(n.id, n as Note));
        customNotes.forEach(n => {
            const mapped = {
                ...n,
                title: n.title || n.title_zh || n.title_en || '',
                summary: n.summary || n.summary_zh || n.summary_en || '',
                content: n.content || n.content_zh || n.content_en || ''
            };
            notesMap.set(n.id, mapped as Note);
        });

        return Array.from(notesMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

        // If we are saving an edit to a static note that was previously "deleted", 
        // we should undelete it because the user is providing a new version.
        const storedDeleted = localStorage.getItem(DELETED_NOTES_KEY);
        if (storedDeleted) {
            let deletedIds: number[] = JSON.parse(storedDeleted);
            if (deletedIds.includes(note.id)) {
                deletedIds = deletedIds.filter(id => id !== note.id);
                localStorage.setItem(DELETED_NOTES_KEY, JSON.stringify(deletedIds));
            }
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customNotes));
    },

    deleteNote: (id: number): void => {
        // 1. Remove from customNotes (if it was an edit or a new note)
        const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedNotes) {
            const customNotes: Note[] = JSON.parse(storedNotes);
            const filtered = customNotes.filter(n => n.id !== id);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
        }

        // 2. Track as deleted if it's one of the original static notes
        const isStatic = (notesData as Note[]).some(n => n.id === id);
        if (isStatic) {
            const storedDeleted = localStorage.getItem(DELETED_NOTES_KEY);
            const deletedIds: number[] = storedDeleted ? JSON.parse(storedDeleted) : [];
            if (!deletedIds.includes(id)) {
                deletedIds.push(id);
                localStorage.setItem(DELETED_NOTES_KEY, JSON.stringify(deletedIds));
            }
        }
    },

    getNoteById: (id: number | string): Note | undefined => {
        const notes = noteService.getNotes();
        return notes.find(n => n.id.toString() === id.toString());
    }
};
