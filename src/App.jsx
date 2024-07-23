import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';
import './App.css'; 

const App = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem('books');
    return savedBooks ? JSON.parse(savedBooks) : [];
  });

  const handleSearch = async () => {
    if (query.trim() === '') {
      setError('El campo de búsqueda no puede estar vacío');
      return;
    }
    setError('');
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const book = data.items[0].volumeInfo;
      const newBook = {
        id: uuidv4(),
        title: book.title,
        authors: book.authors ? book.authors.join(', ') : 'Autor desconocido',
        publishedDate: book.publishedDate || 'Fecha desconocida',
        categories: book.categories ? book.categories.join(', ') : 'Categoría desconocida',
        image: book.imageLinks ? book.imageLinks.thumbnail : null,
      };
      setBooks([...books, newBook]);
      localStorage.setItem('books', JSON.stringify([...books, newBook]));
    } else {
      setResult(null);
      setError('No se encontraron resultados');
    }
  };

  const handleDelete = (id) => {
    const updatedBooks = books.filter(book => book.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  const handleEdit = (id) => {
    const bookToEdit = books.find(book => book.id === id);
    setQuery(bookToEdit.title);
    handleDelete(id);
  };

  const handleClear = () => {
    setQuery('');
  };

  useEffect(() => {
    if (books.length > 0) {
      setResult(books[books.length - 1]);
    }
  }, [books]);

  return (
    <div className="container">
      <h1 className="my-4 text-center">Buscador de Libros</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <div className="form-group">
              <label htmlFor="book-search">Ingrese el nombre del libro</label>
              <input
                type="text"
                className="form-control"
                id="book-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button className="btn btn-custom" onClick={handleSearch}>
                Buscar
              </button>
              <button className="btn btn-custom" onClick={handleClear}>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger mt-4 text-center" role="alert">
          {error}
        </div>
      )}
      {result && (
        <div className="row justify-content-center mt-4">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                {result.image && (
                  <div className="text-center mb-4">
                    <img src={result.image} alt={result.title} className="img-fluid" />
                  </div>
                )}
                <h3 className="card-title">{result.title}</h3>
                <p className="card-text"><strong>Autor(es):</strong> {result.authors}</p>
                <p className="card-text"><strong>Fecha de publicación:</strong> {result.publishedDate}</p>
                <p className="card-text"><strong>Categorías:</strong> {result.categories}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor(es)</th>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.authors}</td>
                  <td>{book.publishedDate}</td>
                  <td>{book.categories}</td>
                  <td>
                    <button className="btn btn-custom btn-sm" onClick={() => handleEdit(book.id)}>Editar</button>
                    <button className="btn btn-custom btn-sm ml-2" onClick={() => handleDelete(book.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;

/*Contenido sacado de: https://www.w3schools.com y foros de REDDIT 🤪🧐🍷 */