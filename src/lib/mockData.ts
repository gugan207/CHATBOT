// =============================================================================
// Mock Database & Realistic Seed Data
// Includes Books, Loans, Members, and Rules with localStorage sync
// =============================================================================

import { Book, Loan, Member, Rule } from './types';

export const INITIAL_BOOKS: Book[] = [
  {
    book_id: 'BK-CS-001',
    title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow',
    author: 'Aurélien Géron',
    category: 'Computer Science',
    subject: 'Machine Learning',
    isbn: '978-1492032649',
    edition: '3rd Edition',
    publish_year: 2022,
    total_copies: 6,
    available_copies: 4,
    shelf_section: 'Shelf CS-2 (2nd Floor)',
    is_digital: true,
    digital_link: 'https://archive.org/details/hands-on-machine-learning',
    cover_image_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80',
    summary: 'Through a series of recent breakthroughs, deep learning has boosted the entire field of machine learning. Now, even programmers who know close to nothing about this technology can use simple, efficient tools to implement programs capable of learning from data.',
    format: 'eBook'
  },
  {
    book_id: 'BK-CS-002',
    title: 'Pattern Recognition and Machine Learning',
    author: 'Christopher M. Bishop',
    category: 'Computer Science',
    subject: 'Machine Learning',
    isbn: '978-0387310732',
    edition: '1st Edition',
    publish_year: 2006,
    total_copies: 5,
    available_copies: 2,
    shelf_section: 'Shelf CS-3 (2nd Floor)',
    is_digital: false,
    digital_link: null,
    cover_image_url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80',
    summary: 'This is the first textbook on pattern recognition to present the Bayesian viewpoint. The book presents approximate inference algorithms that permit fast approximate answers in situations where exact answers are not feasible.',
    format: 'Physical Book'
  },
  {
    book_id: 'BK-CS-003',
    title: 'Deep Learning Foundations & Neural Networks',
    author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville',
    category: 'Artificial Intelligence',
    subject: 'Deep Learning',
    isbn: '978-0262035613',
    edition: '1st Edition',
    publish_year: 2016,
    total_copies: 4,
    available_copies: 1,
    shelf_section: 'Shelf AI-04 (3rd Floor)',
    is_digital: true,
    digital_link: 'https://www.deeplearningbook.org/',
    cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    summary: 'An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background, deep learning techniques used in industry, and research perspectives.',
    format: 'eBook'
  },
  {
    book_id: 'BK-CS-004',
    title: 'Machine Learning Yearning: Technical Strategy for AI Engineers',
    author: 'Andrew Ng',
    category: 'Artificial Intelligence',
    subject: 'Machine Learning',
    isbn: '978-0999999999',
    edition: 'Draft Edition',
    publish_year: 2021,
    total_copies: 8,
    available_copies: 5,
    shelf_section: 'Shelf AI-01 (3rd Floor)',
    is_digital: true,
    digital_link: 'https://mlyearning.org',
    cover_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    summary: 'AI is transforming multiple industries. Machine Learning Yearning teaches you how to structure Machine Learning projects, set up development/test sets, and debug errors effectively.',
    format: 'eBook'
  },
  {
    book_id: 'BK-CS-005',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Computer Science',
    subject: 'Software Engineering',
    isbn: '978-0132350884',
    edition: '1st Edition',
    publish_year: 2008,
    total_copies: 7,
    available_copies: 0,
    shelf_section: 'Shelf CS-1 (2nd Floor)',
    is_digital: false,
    digital_link: null,
    cover_image_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80',
    summary: 'Even bad code can function. But if code is not clean, it can bring a development organization to its knees. This book is a must-read for any developer looking to write readable, maintainable software.',
    format: 'Physical Book'
  },
  {
    book_id: 'BK-CS-006',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Data Engineering',
    subject: 'Distributed Systems',
    isbn: '978-1449373320',
    edition: '1st Edition',
    publish_year: 2017,
    total_copies: 5,
    available_copies: 3,
    shelf_section: 'Shelf DB-2 (2nd Floor)',
    is_digital: true,
    digital_link: 'https://dataintensive.net',
    cover_image_url: 'https://images.unsplash.com/photo-1507842229452-97b794101e4a?auto=format&fit=crop&w=600&q=80',
    summary: 'Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability.',
    format: 'Physical Book'
  },
  {
    book_id: 'BK-CS-007',
    title: 'Python Crash Course: A Hands-On, Project-Based Introduction',
    author: 'Eric Matthes',
    category: 'Computer Science',
    subject: 'Python',
    isbn: '978-1593279288',
    edition: '3rd Edition',
    publish_year: 2023,
    total_copies: 10,
    available_copies: 6,
    shelf_section: 'Shelf CS-5 (2nd Floor)',
    is_digital: true,
    digital_link: 'https://nostarch.com/pythoncrashcourse2e',
    cover_image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    summary: 'A fast-paced, thorough introduction to programming with Python that will have you writing programs, solving problems, and making things that work in no time.',
    format: 'eBook'
  },
  {
    book_id: 'BK-DS-008',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    category: 'Design & Architecture',
    subject: 'Human-Computer Interaction',
    isbn: '978-0465050659',
    edition: 'Revised Edition',
    publish_year: 2013,
    total_copies: 4,
    available_copies: 0,
    shelf_section: 'Shelf DES-01 (1st Floor)',
    is_digital: false,
    digital_link: null,
    cover_image_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
    summary: 'A primer on design, ergonomics, and human usability. Shows how usable design can delight people and avoid costly, frustrating mistakes.',
    format: 'Physical Book'
  },
  {
    book_id: 'BK-MATH-009',
    title: 'Linear Algebra and Its Applications',
    author: 'Gilbert Strang',
    category: 'Mathematics',
    subject: 'Linear Algebra',
    isbn: '978-0030105678',
    edition: '5th Edition',
    publish_year: 2020,
    total_copies: 6,
    available_copies: 3,
    shelf_section: 'Shelf MATH-A (1st Floor)',
    is_digital: true,
    digital_link: 'https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/',
    cover_image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    summary: 'Renowned professor Gilbert Strang introduces students to linear algebra, vector spaces, eigenvalues, and real-world matrix transformations essential for modern computational science.',
    format: 'eBook'
  },
  {
    book_id: 'BK-AI-010',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell, Peter Norvig',
    category: 'Artificial Intelligence',
    subject: 'Artificial Intelligence',
    isbn: '978-0134610993',
    edition: '4th Edition',
    publish_year: 2020,
    total_copies: 8,
    available_copies: 4,
    shelf_section: 'Shelf AI-02 (3rd Floor)',
    is_digital: true,
    digital_link: 'https://aima.cs.berkeley.edu',
    cover_image_url: 'https://images.unsplash.com/photo-1534972195531-a756b11269d5?auto=format&fit=crop&w=600&q=80',
    summary: 'The leading textbook in Artificial Intelligence. Used in over 1,500 universities across the world, offering an authoritative overview of intelligent agents, search algorithms, probability, and robotics.',
    format: 'Physical Book'
  },
  {
    book_id: 'BK-CS-011',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
    category: 'Computer Science',
    subject: 'Algorithms & Data Structures',
    isbn: '978-0262046305',
    edition: '4th Edition',
    publish_year: 2022,
    total_copies: 9,
    available_copies: 5,
    shelf_section: 'Shelf CS-4 (2nd Floor)',
    is_digital: true,
    digital_link: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/',
    cover_image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80',
    summary: 'Comprehensive and rigorous introduction to algorithms spanning graph algorithms, dynamic programming, greedy methods, and NP-completeness.',
    format: 'Physical Book'
  },
  {
    book_id: 'BK-MATH-012',
    title: 'Mathematics for Machine Learning',
    author: 'Marc Peter Deisenroth, A. Aldo Faisal, Cheng Soon Ong',
    category: 'Mathematics',
    subject: 'Machine Learning',
    isbn: '978-1108455145',
    edition: '1st Edition',
    publish_year: 2020,
    total_copies: 5,
    available_copies: 2,
    shelf_section: 'Shelf MATH-C (1st Floor)',
    is_digital: true,
    digital_link: 'https://mml-book.github.io/',
    cover_image_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    summary: 'The fundamental mathematical tools needed to understand machine learning include linear algebra, analytic geometry, matrix decompositions, vector calculus, optimization, probability and statistics.',
    format: 'eBook'
  }
];

export const INITIAL_RULES: Rule[] = [
  { rule_key: 'fine_per_day', rule_value: '5', category: 'fines', description: 'Fine in ₹ / $ per day after due date' },
  { rule_key: 'max_books_student', rule_value: '3', category: 'borrowing', description: 'Max books a student can borrow at one time' },
  { rule_key: 'max_books_faculty', rule_value: '10', category: 'borrowing', description: 'Max books faculty can borrow at one time' },
  { rule_key: 'max_days_student', rule_value: '14', category: 'borrowing', description: 'Standard loan period in days for students' },
  { rule_key: 'max_days_faculty', rule_value: '30', category: 'borrowing', description: 'Standard loan period in days for faculty' },
  { rule_key: 'library_open_time', rule_value: '08:00 AM', category: 'timings', description: 'Library opening time' },
  { rule_key: 'library_close_time', rule_value: '08:00 PM', category: 'timings', description: 'Staffed circulation desk closing time' },
  { rule_key: 'digital_access_24_7', rule_value: '24/7 Access', category: 'timings', description: 'Digital portal & study areas' },
  { rule_key: 'renewal_limit', rule_value: '2', category: 'renewals', description: 'Maximum renewals permitted per book' }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    member_id: 'MEM-2026-001',
    name: 'Alex Rivera',
    email: 'alex.rivera@university.edu',
    membership_type: 'student',
    max_books_allowed: 3,
    max_days_allowed: 14,
    active: true,
    fine_balance: 4.50
  },
  {
    member_id: 'MEM-2026-002',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@university.edu',
    membership_type: 'faculty',
    max_books_allowed: 10,
    max_days_allowed: 30,
    active: true,
    fine_balance: 0.00
  }
];

export const INITIAL_LOANS: Loan[] = [
  {
    loan_id: 1,
    book_id: 'BK-DS-008',
    member_id: 'MEM-2026-001',
    issue_date: '2026-08-01',
    due_date: '2026-08-15',
    return_date: null,
    fine_amount: 4.50,
    renewal_count: 0,
    status: 'overdue',
    book: INITIAL_BOOKS.find(b => b.book_id === 'BK-DS-008')
  },
  {
    loan_id: 2,
    book_id: 'BK-CS-006',
    member_id: 'MEM-2026-001',
    issue_date: '2026-08-12',
    due_date: '2026-08-26',
    return_date: null,
    fine_amount: 0.00,
    renewal_count: 1,
    status: 'active',
    book: INITIAL_BOOKS.find(b => b.book_id === 'BK-CS-006')
  },
  {
    loan_id: 3,
    book_id: 'BK-CS-003',
    member_id: 'MEM-2026-001',
    issue_date: '2026-08-18',
    due_date: '2026-09-01',
    return_date: null,
    fine_amount: 0.00,
    renewal_count: 0,
    status: 'active',
    book: INITIAL_BOOKS.find(b => b.book_id === 'BK-CS-003')
  },
  {
    loan_id: 4,
    book_id: 'BK-CS-005',
    member_id: 'MEM-2026-001',
    issue_date: '2026-07-05',
    due_date: '2026-07-19',
    return_date: '2026-07-20',
    fine_amount: 0.50,
    renewal_count: 0,
    status: 'returned',
    book: INITIAL_BOOKS.find(b => b.book_id === 'BK-CS-005')
  }
];

// In-Memory / Local Storage Store Helper
const STORAGE_KEYS = {
  BOOKS: 'smart_lib_books_v2',
  LOANS: 'smart_lib_loans_v2',
  MEMBERS: 'smart_lib_members_v2',
  RULES: 'smart_lib_rules_v2'
};

export function getStoredBooks(): Book[] {
  if (typeof window === 'undefined') return INITIAL_BOOKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
      return INITIAL_BOOKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_BOOKS;
  }
}

export function saveStoredBooks(books: Book[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('Failed to save books to localStorage', e);
  }
}

export function getStoredLoans(): Loan[] {
  if (typeof window === 'undefined') return INITIAL_LOANS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOANS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(INITIAL_LOANS));
      return INITIAL_LOANS;
    }
    const loans: Loan[] = JSON.parse(raw);
    const books = getStoredBooks();
    return loans.map(l => ({
      ...l,
      book: books.find(b => b.book_id === l.book_id) || l.book
    }));
  } catch (e) {
    return INITIAL_LOANS;
  }
}

export function saveStoredLoans(loans: Loan[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  } catch (e) {
    console.error('Failed to save loans to localStorage', e);
  }
}

export function getStoredRules(): Rule[] {
  if (typeof window === 'undefined') return INITIAL_RULES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RULES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(INITIAL_RULES));
      return INITIAL_RULES;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_RULES;
  }
}

export function getStoredMembers(): Member[] {
  if (typeof window === 'undefined') return INITIAL_MEMBERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_MEMBERS;
  }
}

export function saveStoredMembers(members: Member[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save members to localStorage', e);
  }
}

export function resetLibraryStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(INITIAL_BOOKS));
  localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(INITIAL_LOANS));
  localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(INITIAL_RULES));
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
}
