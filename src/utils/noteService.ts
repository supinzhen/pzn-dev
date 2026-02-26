import notesData from '../assets/data/notes.json';

export interface Note {
    id: number;
    slug: string; // URL-friendly version of title
    title: string;
    title_zh?: string;
    title_en?: string;
    category: string;
    date: string;
    author: string;
    readTime: string;
    tags: string[];
    summary: string;
    summary_zh?: string;
    summary_en?: string;
    content?: string;
    content_zh?: string;
    content_en?: string;
}

const LOCAL_STORAGE_KEY = 'pzn_custom_notes';
const DELETED_NOTES_KEY = 'pzn_deleted_notes';

const getSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/-+/g, '-')      // Remove consecutive -
        .trim();
};

interface RawNote extends Partial<Note> {
    id: number;
}

export const noteService = {
    getNotes: (): Note[] => {
        const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
        const customNotes: RawNote[] = storedNotes ? JSON.parse(storedNotes) : [];

        const storedDeleted = localStorage.getItem(DELETED_NOTES_KEY);
        const deletedIds: number[] = storedDeleted ? JSON.parse(storedDeleted) : [];

        // 1. Get static notes and map legacy zh/en fields to unified fields
        const staticNotes = (notesData as RawNote[])
            .filter(n => !deletedIds.includes(n.id))
            .map(n => {
                const title = n.title || n.title_zh || n.title_en || '';
                const title_en_for_slug = n.title_en || n.title || '';
                return {
                    ...n,
                    title,
                    slug: n.slug || getSlug(title_en_for_slug),
                    summary: n.summary || n.summary_zh || n.summary_en || '',
                    content: n.content || n.content_zh || n.content_en || ''
                };
            });

        // 2. Build final list
        const notesMap = new Map<number, Note>();

        staticNotes.forEach(n => notesMap.set(n.id, n as Note));
        customNotes.forEach(n => {
            const title = n.title || n.title_zh || n.title_en || '';
            const title_en_for_slug = n.title_en || n.title || '';
            const mapped = {
                ...n,
                title,
                slug: n.slug || getSlug(title_en_for_slug),
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
        const slugTitle = note.title_en || note.title || '';
        const noteWithSlug = {
            ...note,
            title: note.title || note.title_zh || note.title_en || '',
            slug: getSlug(slugTitle)
        };

        if (index > -1) {
            customNotes[index] = noteWithSlug;
        } else {
            customNotes.push(noteWithSlug);
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
        const isStatic = (notesData as RawNote[]).some(n => n.id === id);
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
    },

    getNoteBySlug: (slug: string): Note | undefined => {
        const notes = noteService.getNotes();
        return notes.find(n => n.slug === slug);
    },

    getNoteContent: async (slug: string): Promise<{ content: string, content_zh?: string, content_en?: string } | null> => {
        try {
            // Check local storage first (for newly created notes not yet synced)
            const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedNotes) {
                const customNotes: Note[] = JSON.parse(storedNotes);
                const localNote = customNotes.find(n => n.slug === slug);
                if (localNote && localNote.content) {
                    return {
                        content: localNote.content,
                        content_zh: localNote.content_zh,
                        content_en: localNote.content_en
                    };
                }
            }

            // Fetch from public/posts
            const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
            const response = await fetch(`${baseUrl}/posts/${slug}.json`);
            if (!response.ok) return null;
            const data = await response.json();
            return {
                content: data.content,
                content_zh: data.content_zh,
                content_en: data.content_en
            };
        } catch (error) {
            console.error('Failed to fetch note content:', error);
            return null;
        }
    }
};
