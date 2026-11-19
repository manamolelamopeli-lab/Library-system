import { useState, useEffect } from 'react';
import './App.css';

const initialBooks = [
  { id: 1, title: 'Things Fall Apart', author: 'Chinua Achebe', category: 'Fiction', total: 5, available: 4 },
  { id: 2, title: 'The Power of Vision', author: 'Myles Munroe', category: 'Motivation', total: 4, available: 3 },
  { id: 3, title: 'Atomic Habits', author: 'James Clear', category: 'Self Development', total: 6, available: 6 },
  { id: 4, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', category: 'Business', total: 3, available: 2 },
];

const initialMembers = [
  { id: 1, name: 'John Smith', email: 'john@gmail.com' },
  { id: 2, name: 'Mary James', email: 'mary@gmail.com' },
  { id: 3, name: 'Peter Brown', email: 'peter@gmail.com' },
];

function App() {
  const [page, setPage] = useState('Dashboard');

  const [books, setBooks] = useState(() =>
    JSON.parse(localStorage.getItem('books')) || initialBooks
  );

  const [members, setMembers] = useState(() =>
    JSON.parse(localStorage.getItem('members')) || initialMembers
  );

  const [loans, setLoans] = useState(() =>
    JSON.parse(localStorage.getItem('loans')) || []
  );

  const [search, setSearch] = useState('');

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    category: '',
    total: ''
  });

  const [newMember, setNewMember] = useState({
    name: '',
    email: ''
  });

  const [borrowForm, setBorrowForm] = useState({
    bookId: '',
    memberId: ''
  });

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('loans', JSON.stringify(loans));
  }, [loans]);

  // Add a new book
  const addBook = (e) => {
    e.preventDefault();

    const book = {
      id: Date.now(),
      ...newBook,
      total: Number(newBook.total),
      available: Number(newBook.total)
    };

    setBooks([...books, book]);

    setNewBook({
      title: '',
      author: '',
      category: '',
      total: ''
    });

    alert('Book added successfully!');
  };
// Update an existing book
const updateBook = (book) => {
  const title = window.prompt('Enter book title:', book.title);
  if (title === null || !title.trim()) return;

  const author = window.prompt('Enter author:', book.author);
  if (author === null || !author.trim()) return;

  const category = window.prompt('Enter category:', book.category);
  if (category === null || !category.trim()) return;

  const total = window.prompt('Enter total quantity:', book.total);

  if (total === null) return;

  const newTotal = Number(total);

  if (!Number.isInteger(newTotal) || newTotal < 1 ||
      newTotal < book.total - book.available) {
    alert('Invalid quantity. It cannot be less than borrowed copies.');
    return;
  }

  setBooks(books.map(b =>
    b.id === book.id
      ? {
          ...b,
          title: title.trim(),
          author: author.trim(),
          category: category.trim(),
          total: newTotal,
          available: newTotal - (book.total - book.available)
        }
      : b
  ));

  alert('Book updated successfully!');
};

// Delete a book
const deleteBook = (id) => {
  const book = books.find(b => b.id === id);

  if (book.available !== book.total) {
    alert('This book cannot be deleted because some copies are borrowed.');
    return;
  }

  const confirmDelete = window.confirm(
    'Are you sure you want to delete this book?'
  );

  if (confirmDelete) {
    setBooks(books.filter(b => b.id !== id));
    alert('Book deleted successfully!');
  }
};
  // Add a new member
  const addMember = (e) => {
    e.preventDefault();

    setMembers([
      ...members,
      {
        id: Date.now(),
        ...newMember
      }
    ]);

    setNewMember({ name: '', email: '' });

    alert('Member added successfully!');
  };

  // Borrow a book
  const borrowBook = (e) => {
    e.preventDefault();

    const book = books.find(
      b => b.id === Number(borrowForm.bookId)
    );

    if (!book || book.available < 1) {
      alert('This book is not available.');
      return;
    }

    const member = members.find(
      m => m.id === Number(borrowForm.memberId)
    );

    if (!member) {
      alert('Please select a member.');
      return;
    }

    const newLoan = {
      id: Date.now(),
      bookId: book.id,
      memberId: member.id,
      date: new Date().toLocaleDateString(),
      status: 'Borrowed'
    };

    setLoans([...loans, newLoan]);

    setBooks(books.map(b =>
      b.id === book.id
        ? { ...b, available: b.available - 1 }
        : b
    ));

    setBorrowForm({ bookId: '', memberId: '' });

    alert('Book borrowed successfully!');
  };

  // Return a book
  const returnBook = (loan) => {
    setLoans(loans.map(l =>
      l.id === loan.id
        ? { ...l, status: 'Returned' }
        : l
    ));

    setBooks(books.map(b =>
      b.id === loan.bookId
        ? { ...b, available: b.available + 1 }
        : b
    ));

    alert('Book returned successfully!');
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );

  const borrowedBooks = loans.filter(
    loan => loan.status === 'Borrowed'
  ).length;

  const totalCopies = books.reduce(
    (sum, book) => sum + book.total, 0
  );

  const availableCopies = books.reduce(
    (sum, book) => sum + book.available, 0
  );

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          <span></span>
          <h2>My Library</h2>
        </div>

        <p className="menu-title">MAIN MENU</p>

        {['Dashboard', 'Books', 'Members', 'Borrow & Return'].map(item => (
          <button
            key={item}
            className={`nav-item ${page === item ? 'active' : ''}`}
            onClick={() => setPage(item)}
          >
            {item === 'Dashboard' && '▦'}
            {item === 'Books' && '▤'}
            {item === 'Members' && '♙'}
            {item === 'Borrow & Return' && '⇄'}
            <span>{item}</span>
          </button>
        ))}

        <div className="sidebar-bottom">
          <p>LIBRARY MANAGEMENT</p>
          <small>Simple • Organized • Efficient</small>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        <header className="topbar">
          <div>
            <h2>{page}</h2>
            <p>Welcome to your library management system.</p>
          </div>

          <div className="admin">
            <span></span>
            <div>
              <strong>Administrator</strong>
              <small>Library Manager</small>
            </div>
          </div>
        </header>

        {/* DASHBOARD */}
        {page === 'Dashboard' && (
          <section>

            <div className="welcome">
              <div>
                <h2>Library Overview</h2>
                <p>Here is what's happening in your library today.</p>
              </div>
              <span></span>
            </div>

            <div className="stats">

              <div className="stat-card">
                <span></span>
                <p>Total Books</p>
                <h2>{totalCopies}</h2>
              </div>

              <div className="stat-card">
                <span></span>
                <p>Registered Members</p>
                <h2>{members.length}</h2>
              </div>

              <div className="stat-card">
                <span></span>
                <p>Borrowed Books</p>
                <h2>{borrowedBooks}</h2>
              </div>

              <div className="stat-card">
                <span></span>
                <p>Available Books</p>
                <h2>{availableCopies}</h2>
              </div>

            </div>

            <div className="panel">
              <h3>Recent Borrowing Activities</h3>

              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Member</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {loans.slice(-5).reverse().map(loan => {
                    const book = books.find(b => b.id === loan.bookId);
                    const member = members.find(m => m.id === loan.memberId);

                    return (
                      <tr key={loan.id}>
                        <td>{book?.title || 'Unknown book'}</td>
                        <td>{member?.name || 'Unknown member'}</td>
                        <td>{loan.date}</td>
                        <td>
                          <span className={`badge ${loan.status === 'Borrowed' ? 'orange' : 'green'}`}>
                            {loan.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {loans.length === 0 && (
                    <tr>
                      <td colSpan="4" className="empty">
                        No borrowing activities yet.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>

          </section>
        )}

        {/* BOOKS PAGE */}
        {page === 'Books' && (
          <section>
            <div className="books-welcome">
  <div>
    <h2>Manage Your Books</h2>
    <p>Organize, update and keep track of your library collection.</p>
  </div>
  <span></span>
</div>

<div className="stats">

  <div className="stat-card">
    <span></span>
    <p>Total Titles</p>
    <h2>{books.length}</h2>
  </div>

  <div className="stat-card">
    <span></span>
    <p>Total Copies</p>
    <h2>{totalCopies}</h2>
  </div>

  <div className="stat-card">
    <span></span>
    <p>Available Copies</p>
    <h2>{availableCopies}</h2>
  </div>

  <div className="stat-card">
    <span></span>
    <p>Borrowed Copies</p>
    <h2>{totalCopies - availableCopies}</h2>
  </div>

</div>

            <div className="panel">
              <h3>Add New Book</h3>

              <form className="form-grid" onSubmit={addBook}>

                <input
                  placeholder="Book title"
                  value={newBook.title}
                  onChange={e => setNewBook({...newBook, title: e.target.value})}
                  required
                />

                <input
                  placeholder="Author"
                  value={newBook.author}
                  onChange={e => setNewBook({...newBook, author: e.target.value})}
                  required
                />

                <input
                  placeholder="Category"
                  value={newBook.category}
                  onChange={e => setNewBook({...newBook, category: e.target.value})}
                  required
                />

                <input
                  type="number"
                  min="1"
                  placeholder="Quantity"
                  value={newBook.total}
                  onChange={e => setNewBook({...newBook, total: e.target.value})}
                  required
                />

                <button className="primary-btn">Add Book</button>

              </form>
            </div>

            <div className="panel">

              <div className="panel-heading">
                <h3>Books Collection</h3>

                <input
                  className="search"
                  placeholder="Search books..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Total</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBooks.map(book => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.category}</td>
                      <td>{book.total}</td>
                      <td>{book.available}</td>
                      <td>
  <button
    className="edit-btn"
    onClick={() => updateBook(book)}
  >
    Update
  </button>

  <button
    className="delete-btn"
    onClick={() => deleteBook(book.id)}
  >
    Delete
  </button>
</td>
                    </tr>
                  ))}

                  {filteredBooks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty">
                        No books found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>

          </section>
        )}

        {/* MEMBERS PAGE */}
        {page === 'Members' && (
          <section>

            <div className="panel">
              <h3>Register New Member</h3>

              <form className="form-grid" onSubmit={addMember}>

                <input
                  placeholder="Full name"
                  value={newMember.name}
                  onChange={e => setNewMember({...newMember, name: e.target.value})}
                  required
                />

                <input
                  type="email"
                  placeholder="Email address"
                  value={newMember.email}
                  onChange={e => setNewMember({...newMember, email: e.target.value})}
                  required
                />

                <button className="primary-btn">Register Member</button>

              </form>
            </div>

            <div className="panel">
              <h3>Registered Members</h3>

              <table>
                <thead>
                  <tr>
                    <th>Member ID</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                  </tr>
                </thead>

                <tbody>
                  {members.map(member => (
                    <tr key={member.id}>
                      <td>MEM-{member.id}</td>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

          </section>
        )}

        {/* BORROW AND RETURN PAGE */}
        {page === 'Borrow & Return' && (
          <section>

            <div className="panel">
              <h3>Borrow a Book</h3>

              <form className="form-grid" onSubmit={borrowBook}>

                <select
                  value={borrowForm.bookId}
                  onChange={e => setBorrowForm({...borrowForm, bookId: e.target.value})}
                  required
                >
                  <option value="">Select a book</option>

                  {books.filter(b => b.available > 0).map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title} ({book.available} available)
                    </option>
                  ))}
                </select>

                <select
                  value={borrowForm.memberId}
                  onChange={e => setBorrowForm({...borrowForm, memberId: e.target.value})}
                  required
                >
                  <option value="">Select a member</option>

                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>

                <button className="primary-btn">Confirm Borrowing</button>

              </form>
            </div>

            <div className="panel">
              <h3>Borrowing Records</h3>

              <table>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Member</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loans.map(loan => {
                    const book = books.find(b => b.id === loan.bookId);
                    const member = members.find(m => m.id === loan.memberId);

                    return (
                      <tr key={loan.id}>
                        <td>{book?.title || 'Unknown book'}</td>
                        <td>{member?.name || 'Unknown member'}</td>
                        <td>{loan.date}</td>
                        <td>
                          <span className={`badge ${loan.status === 'Borrowed' ? 'orange' : 'green'}`}>
                            {loan.status}
                          </span>
                        </td>
                        <td>
                          {loan.status === 'Borrowed' && (
                            <button
                              className="return-btn"
                              onClick={() => returnBook(loan)}
                            >
                              Return
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {loans.length === 0 && (
                    <tr>
                      <td colSpan="6" className="empty">
                        No borrowing records yet.
                      </td>
                    </tr>
                  )}

                </tbody>
              </table>

            </div>

          </section>
        )}

        <footer>
          Library Management System 
        </footer>

      </main>
    </div>
  );
}

export default App;