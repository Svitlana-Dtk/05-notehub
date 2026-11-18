
import { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import {
  fetchNotes,
  createNote,
  deleteNote,
  type CreateNoteData,
} from '../../services/noteService';

import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import css from './App.module.css';

export default function App() {
  const queryClient = useQueryClient();

  // Поисковая строка в поле ввода
  const [searchText, setSearchText] = useState('');

  // Поисковая строка, которая отправляется на сервер
  const [searchQuery, setSearchQuery] = useState('');

  // Текущая страница
  const [page, setPage] = useState(1);

  // Состояние модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Отложенный поиск
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      setSearchQuery(value);
      setPage(1);
    },
    500
  );

  // Получение заметок
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['notes', searchQuery, page],
    queryFn: () => fetchNotes(searchQuery, page),
  });

  // Создание заметки
  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });

      setIsModalOpen(false);
    },
  });

  // Удаление заметки
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
  });

  // Обработка изменения поиска
  const handleSearchChange = (value: string) => {
    setSearchText(value);
    debouncedSearch(value);
  };

  // Создание заметки
  const handleCreateNote = async (newNote: CreateNoteData) => {
    await createMutation.mutateAsync(newNote);
  };

  // Удаление заметки
  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchText}
          onChange={handleSearchChange}
        />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button
          className={css.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p>Loading notes...</p>}

        {isError && <p>Could not load notes.</p>}

        {!isLoading && !isError && notes.length === 0 && (
          <p>No notes found.</p>
        )}

        {!isLoading && !isError && notes.length > 0 && (
          <NoteList
            notes={notes}
            onDelete={handleDeleteNote}
          />
        )}

        {deleteMutation.isError && (
          <p>Could not delete note.</p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}

      {createMutation.isError && (
        <p>Could not create note.</p>
      )}
    </div>
  );
}