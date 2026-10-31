'use client';

import React, { useState } from 'react';
import { Book, BookCategory, BookStatus } from '@/types';
import { 
  BookOpen, 
  Plus, 
  Star, 
  Brain, 
  CandlestickChart, 
  Globe2, 
  CheckCircle, 
  Bookmark, 
  Edit3,
  X,
  Save
} from 'lucide-react';

interface BooksLibraryProps {
  books: Book[];
  onSaveBook: (book: Book) => Promise<void>;
}

export const BooksLibrary: React.FC<BooksLibraryProps> = ({ books, onSaveBook }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | BookCategory>('All');
  const [activeBookModal, setActiveBookModal] = useState<Book | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New book form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState<BookCategory>('Psychology');
  const [newSummary, setNewSummary] = useState('');
  const [newTakeaways, setNewTakeaways] = useState('');
  const [newPersonalNotes, setNewPersonalNotes] = useState('');
  const [newStatus, setNewStatus] = useState<BookStatus>('Reading');
  const [newRating, setNewRating] = useState(5);

  // Filter books
  const filteredBooks = books.filter((b) => {
    if (selectedCategory === 'All') return true;
    return b.category === selectedCategory;
  });

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;

    const takeawaysArray = newTakeaways
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const book: Book = {
      id: `b-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      category: newCategory,
      summary: newSummary.trim() || 'No summary provided.',
      keyTakeaways: takeawaysArray.length > 0 ? takeawaysArray : ['Discipline and patience prevail.'],
      personalNotes: newPersonalNotes.trim() || undefined,
      status: newStatus,
      rating: newRating,
    };

    await onSaveBook(book);
    setIsAddModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewAuthor('');
    setNewSummary('');
    setNewTakeaways('');
    setNewPersonalNotes('');
  };

  const handleUpdateNotes = async (book: Book, updatedNotes: string) => {
    const updated = { ...book, personalNotes: updatedNotes };
    await onSaveBook(updated);
    setActiveBookModal(updated);
  };

  const getCategoryIcon = (category: BookCategory) => {
    switch (category) {
      case 'Psychology':
        return <Brain className="w-4 h-4 text-turquoise-600" />;
      case 'Technical':
        return <CandlestickChart className="w-4 h-4 text-emerald-600" />;
      case 'Fundamental':
        return <Globe2 className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Category Filters */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-turquoise-700 font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Trader Knowledge Base</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">The Trader's Library</h2>
          <p className="text-xs text-slate-500 mt-1">
            Core reading in Psychology, Macro Fundamentals, and Technical Analysis with personal notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl space-x-1">
            {(['All', 'Psychology', 'Technical', 'Fundamental'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-turquoise-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Add Book Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-turquoise-600 hover:bg-turquoise-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all shadow-turquoise-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => setActiveBookModal(book)}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-turquoise-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Book Cover Image */}
              {book.coverUrl && (
                <div className="w-full h-36 rounded-xl overflow-hidden mb-3.5 relative bg-slate-100 border border-slate-100">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-sm">
                    {book.category}
                  </span>
                </div>
              )}

              {/* Top Badges */}
              <div className="flex items-center justify-between mb-2">
                {!book.coverUrl && (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                    {getCategoryIcon(book.category)}
                    <span>{book.category}</span>
                  </span>
                )}

                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ml-auto ${
                    book.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : book.status === 'Reading'
                      ? 'bg-turquoise-50 text-turquoise-700 border border-turquoise-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {book.status}
                </span>
              </div>

              {/* Title & Author */}
              <h3 className="text-base font-bold text-slate-900 group-hover:text-turquoise-700 transition-colors">
                {book.title}
              </h3>
              <p className="text-xs font-medium text-slate-500 mb-3">by {book.author}</p>

              {/* Star Rating */}
              <div className="flex items-center space-x-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < book.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Summary snippet */}
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                {book.summary}
              </p>
            </div>

            {/* Footer with personal note hint */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium text-turquoise-700 group-hover:underline">
                View Lessons & Notes →
              </span>
              {book.personalNotes && (
                <span className="flex items-center space-x-1 text-[11px] text-slate-400">
                  <Bookmark className="w-3.5 h-3.5 text-turquoise-600" />
                  <span>Has study notes</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Book Details & Notes Editor */}
      {activeBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-turquoise-100 text-turquoise-800 rounded-xl">
                  {getCategoryIcon(activeBookModal.category)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{activeBookModal.title}</h3>
                  <p className="text-xs text-slate-500">by {activeBookModal.author} • {activeBookModal.category}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveBookModal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Book Overview
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {activeBookModal.summary}
                </p>
              </div>

              {/* Core Takeaways */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Key Rules & Takeaways
                </h4>
                <ul className="space-y-2">
                  {activeBookModal.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-turquoise-50/50 p-2.5 rounded-lg border border-turquoise-100">
                      <CheckCircle className="w-4 h-4 text-turquoise-600 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Editable Personal Study Notes */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-turquoise-600" />
                    <span>My Personal Application Notes</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Edits save automatically</span>
                </div>
                <textarea
                  rows={4}
                  defaultValue={activeBookModal.personalNotes || ''}
                  onBlur={(e) => handleUpdateNotes(activeBookModal, e.target.value)}
                  placeholder="How do you apply the concepts from this book to your trading system? Write down personal rules or page references..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-turquoise-500 outline-none"
                />
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveBookModal(null)}
                className="px-4 py-2 bg-turquoise-600 text-white rounded-lg text-xs font-bold hover:bg-turquoise-700 transition-colors"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add New Book */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Book to Library</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Best Loser Wins"
                  className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Tom Hougaard"
                    className="w-full text-sm p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full text-sm p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-turquoise-500 outline-none"
                  >
                    <option value="Psychology">Psychology</option>
                    <option value="Technical">Technical</option>
                    <option value="Fundamental">Fundamental</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Summary / Core Concept
                </label>
                <textarea
                  rows={2}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Brief summary of what this book teaches..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Key Takeaways (one per line)
                </label>
                <textarea
                  rows={3}
                  value={newTakeaways}
                  onChange={(e) => setNewTakeaways(e.target.value)}
                  placeholder="Enter main rules or insights on each line..."
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-turquoise-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Reading Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e: any) => setNewStatus(e.target.value)}
                    className="w-full text-sm p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-turquoise-500 outline-none"
                  >
                    <option value="Want to Read">Want to Read</option>
                    <option value="Reading">Reading</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Rating (1 - 5 Stars)
                  </label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full text-sm p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-turquoise-500 outline-none"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-turquoise-600 hover:bg-turquoise-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
