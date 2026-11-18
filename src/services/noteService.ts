// Функції для виконання HTTP-запитів винесіть в окремий файл src/services/noteService.ts. 
// Типізуйте їх параметри, результат, який вони повертають, та відповідь від Axios.
//  У вас мають бути наступні функції:

//     fetchNotes : має виконувати запит для отримання колекції нотаток із сервера.
//  Повинна підтримувати пагінацію (через параметр сторінки) та фільтрацію за ключовим словом 
// (пошук);
//     createNote: має виконувати запит для створення нової нотатки на сервері. 
// Приймає вміст нової нотатки та повертає створену нотатку у відповіді;
//     deleteNote: має виконувати запит для видалення нотатки за заданим ідентифікатором. 
// Приймає ID нотатки та повертає інформацію про видалену нотатку у відповіді.


  import axios from 'axios';
  import type { Note, NoteTag } from '../types/note';
  
  const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
  
  const api = axios.create({
    baseURL: 'https://notehub-public.goit.study/api',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  
  // Тип ответа GET-запроса
interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
  }
  
  // Тип данных для создания заметки
export interface CreateNoteData {
    title: string;
    content: string;
    tag: NoteTag;
  }
  
  // Получение заметок
  export const fetchNotes = async (
    query: string,
    page: number
  ): Promise<FetchNotesResponse> => {
    const response = await api.get<FetchNotesResponse>('/notes', {
      params: {
        search: query,
        page,
        perPage: 12,
      },
    });
  console.log(response.data);
  
    return response.data;
  };
  
  // Создание заметки
  export const createNote = async (
    newNote: CreateNoteData
  ): Promise<Note> => {
    const response = await api.post<Note>('/notes', newNote);
  
    return response.data;
  };
  
  // Удаление заметки
  export const deleteNote = async (id: string): Promise<Note> => {
    const response = await api.delete<Note>(`/notes/${id}`);
  
    return response.data;
  };
  