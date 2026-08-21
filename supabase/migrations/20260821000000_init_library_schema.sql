-- =============================================================================
-- Smart Library Assistant — Supabase Database Migration
-- Relational Schema, Indexes, RLS Policies, and Initial Seed Data
-- =============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Books Catalog Table
CREATE TABLE IF NOT EXISTS books (
    book_id          TEXT PRIMARY KEY,
    title            TEXT NOT NULL,
    author           TEXT NOT NULL,
    category         TEXT NOT NULL,           -- e.g. Computer Science, Artificial Intelligence, Mathematics
    subject          TEXT NOT NULL,           -- e.g. Machine Learning, Python, Database Systems
    isbn             TEXT,
    edition          TEXT,
    publish_year     INTEGER DEFAULT 2023,
    total_copies     INTEGER NOT NULL DEFAULT 5,
    available_copies INTEGER NOT NULL DEFAULT 5,
    shelf_section    TEXT NOT NULL,           -- e.g. "CS-2", "AI-04", "MATH-B"
    is_digital       BOOLEAN DEFAULT FALSE,
    digital_link     TEXT,
    cover_image_url  TEXT,
    summary          TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Members Table
CREATE TABLE IF NOT EXISTS members (
    member_id          TEXT PRIMARY KEY,
    name               TEXT NOT NULL,
    email              TEXT,
    membership_type    TEXT NOT NULL DEFAULT 'student', -- 'student', 'faculty', 'guest'
    max_books_allowed  INTEGER NOT NULL DEFAULT 3,
    max_days_allowed   INTEGER NOT NULL DEFAULT 14,
    active             BOOLEAN DEFAULT TRUE,
    fine_balance       NUMERIC(10, 2) DEFAULT 0.00,
    created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Borrowing / Loan Records Table
CREATE TABLE IF NOT EXISTS loans (
    loan_id            BIGSERIAL PRIMARY KEY,
    book_id            TEXT NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    member_id          TEXT NOT NULL REFERENCES members(member_id) ON DELETE CASCADE,
    issue_date         DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date           DATE NOT NULL,
    return_date        DATE,
    fine_amount        NUMERIC(10, 2) DEFAULT 0.00,
    renewal_count      INTEGER DEFAULT 0,
    status             TEXT NOT NULL DEFAULT 'active', -- 'active', 'returned', 'overdue'
    created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Rules Table (Dynamic Library Configuration)
CREATE TABLE IF NOT EXISTS rules (
    rule_key           TEXT PRIMARY KEY,
    rule_value         TEXT NOT NULL,
    category           TEXT DEFAULT 'general',
    description        TEXT,
    updated_at         TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Full-Text Search Indexes
CREATE INDEX IF NOT EXISTS idx_books_subject ON books (subject);
CREATE INDEX IF NOT EXISTS idx_books_category ON books (category);
CREATE INDEX IF NOT EXISTS idx_books_author ON books (author);
CREATE INDEX IF NOT EXISTS idx_loans_member ON loans (member_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON loans (status);

-- 6. Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Allow public read access to catalog and rules
CREATE POLICY "Public can view catalog" ON books FOR SELECT USING (true);
CREATE POLICY "Public can view rules" ON rules FOR SELECT USING (true);

-- Members and loans policies
CREATE POLICY "Members viewable by authenticated users" ON members FOR SELECT USING (true);
CREATE POLICY "Loans viewable by authenticated users" ON loans FOR SELECT USING (true);
CREATE POLICY "Loans can be updated for returns/renewals" ON loans FOR ALL USING (true);

-- 7. Seed Initial Rules Data
INSERT INTO rules (rule_key, rule_value, category, description) VALUES
('fine_per_day', '5', 'fines', 'Fine in currency units (₹ / $) per day after due date'),
('max_books_student', '3', 'borrowing', 'Max books a student can borrow at one time'),
('max_books_faculty', '10', 'borrowing', 'Max books faculty can borrow at one time'),
('max_days_student', '14', 'borrowing', 'Standard loan period in days for students'),
('max_days_faculty', '30', 'borrowing', 'Standard loan period in days for faculty'),
('library_open_time', '08:00', 'timings', 'Library opening time (Monday - Saturday)'),
('library_close_time', '20:00', 'timings', 'Library closing time (Staffed desk)'),
('digital_access_24_7', 'true', 'timings', 'Online eBook & study spaces open 24/7'),
('renewal_limit', '2', 'renewals', 'Maximum number of renewals allowed per book')
ON CONFLICT (rule_key) DO UPDATE 
SET rule_value = EXCLUDED.rule_value, description = EXCLUDED.description;

-- 8. Seed Initial Members
INSERT INTO members (member_id, name, email, membership_type, max_books_allowed, max_days_allowed, fine_balance) VALUES
('MEM-2026-001', 'Alex Rivera', 'alex.rivera@university.edu', 'student', 3, 14, 4.50),
('MEM-2026-002', 'Dr. Elena Rostova', 'elena.rostova@university.edu', 'faculty', 10, 30, 0.00),
('MEM-2026-003', 'Sarah Jenkins', 'sarah.j@university.edu', 'student', 3, 14, 0.00)
ON CONFLICT (member_id) DO NOTHING;

-- 9. Seed Initial Books Catalog
INSERT INTO books (book_id, title, author, category, subject, isbn, edition, publish_year, total_copies, available_copies, shelf_section, is_digital, digital_link, cover_image_url, summary) VALUES
('BK-CS-001', 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow', 'Aurélien Géron', 'Computer Science', 'Machine Learning', '978-1492032649', '3rd Edition', 2022, 6, 4, 'Shelf CS-2 (2nd Floor)', TRUE, 'https://library.edu/ebooks/hands-on-ml', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHgkWkGrTpDl5-YqKJt9BASKQYjAHPJRq3F0TU2ZqNN9ioe3L7LQtSQu8B3LXH_krOstii25E2KNTJouZBLPeLguSUHbkpEWCMxKi-O0YTesR9DKjG5qq6Q3uXn0vPUyXUdm2AJjffioe1OPIxYpoHigd_z4vCaLc0X5oZiYeo80nfQUBiAYgZqU84SP9AXxEYiSKKI6iZ400UqhqsyukI5jAUOzNmp1Vm-0I-A1-HI3xyUgMCq3Wo', 'Through a series of recent breakthroughs, deep learning has boosted the entire field of machine learning. Now, even programmers who know close to nothing about this technology can use simple, efficient tools to implement programs capable of learning from data.'),

('BK-CS-002', 'Pattern Recognition and Machine Learning', 'Christopher M. Bishop', 'Computer Science', 'Machine Learning', '978-0387310732', '1st Edition', 2006, 5, 2, 'Shelf CS-3 (2nd Floor)', FALSE, NULL, 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80', 'This is the first textbook on pattern recognition to present the Bayesian viewpoint. The book presents approximate inference algorithms that permit fast approximate answers in situations where exact answers are not feasible.'),

('BK-CS-003', 'Deep Learning', 'Ian Goodfellow, Yoshua Bengio, Aaron Courville', 'Artificial Intelligence', 'Deep Learning', '978-0262035613', '1st Edition', 2016, 4, 1, 'Shelf AI-04 (3rd Floor)', TRUE, 'https://library.edu/ebooks/deeplearning', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80', 'An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background, deep learning techniques used in industry, and research perspectives.'),

('BK-CS-004', 'Machine Learning Yearning', 'Andrew Ng', 'Artificial Intelligence', 'Machine Learning', '978-0999999999', 'Draft Edition', 2021, 8, 5, 'Shelf AI-01 (3rd Floor)', TRUE, 'https://library.edu/ebooks/mlyearning', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', 'AI is transforming multiple industries. Machine Learning Yearning teaches you how to structure Machine Learning projects, set up development/test sets, and debug errors effectively.'),

('BK-CS-005', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Computer Science', 'Software Engineering', '978-0132350884', '1st Edition', 2008, 7, 0, 'Shelf CS-1 (2nd Floor)', FALSE, NULL, 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80', 'Even bad code can function. But if code is not clean, it can bring a development organization to its knees. This book is a must-read for any developer looking to write readable, maintainable software.'),

('BK-CS-006', 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'Data Engineering', 'Distributed Systems', '978-1449373320', '1st Edition', 2017, 5, 3, 'Shelf DB-2 (2nd Floor)', TRUE, 'https://library.edu/ebooks/ddia', 'https://images.unsplash.com/photo-1507842229452-97b794101e4a?auto=format&fit=crop&w=600&q=80', 'Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability.'),

('BK-CS-007', 'Python Crash Course', 'Eric Matthes', 'Computer Science', 'Python', '978-1593279288', '3rd Edition', 2023, 10, 6, 'Shelf CS-5 (2nd Floor)', TRUE, 'https://library.edu/ebooks/python-crash-course', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', 'A fast-paced, thorough introduction to programming with Python that will have you writing programs, solving problems, and making things that work in no time.'),

('BK-DS-008', 'The Design of Everyday Things', 'Don Norman', 'Design & Architecture', 'Human-Computer Interaction', '978-0465050659', 'Revised Edition', 2013, 4, 0, 'Shelf DES-01 (1st Floor)', FALSE, NULL, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL_bk_NGywWYCw3q0-I0QyAUK7WblLDoq5CjJM-jGAH_Xlor-DA03qDF0rvpFjPifSVxZHa-KvSuEb1xJjySU5SbfWhdWRdGMObgdbqzMwiGd0YKhVLEFDLiB2aVOC8PMpNlj-ptqfocnaXYm0w4jZN12AFZ-FBJlNdQ_mC357rve0Xpaf6tL_IfIQkUlaKwEotcJutAHI1ntIvSFu3_T6rjM__djQ4Qn3AxRQmGPDHB_uDbvQin8J', 'A primer on design, ergonomics, and human usability. Shows how usable design can delight people and avoid costly, frustrating mistakes.'),

('BK-MATH-009', 'Linear Algebra and Its Applications', 'Gilbert Strang', 'Mathematics', 'Linear Algebra', '978-0030105678', '5th Edition', 2020, 6, 3, 'Shelf MATH-A (1st Floor)', TRUE, 'https://library.edu/ebooks/strang-linear-algebra', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80', 'Renowned professor Gilbert Strang introduces students to linear algebra, vector spaces, eigenvalues, and real-world matrix transformations essential for modern computational science.')
ON CONFLICT (book_id) DO NOTHING;

-- 10. Seed Initial Loans
INSERT INTO loans (loan_id, book_id, member_id, issue_date, due_date, return_date, fine_amount, renewal_count, status) VALUES
(1, 'BK-DS-008', 'MEM-2026-001', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '6 days', NULL, 4.50, 0, 'overdue'),
(2, 'BK-CS-006', 'MEM-2026-001', CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE + INTERVAL '6 days', NULL, 0.00, 1, 'active'),
(3, 'BK-CS-003', 'MEM-2026-001', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE + INTERVAL '10 days', NULL, 0.00, 0, 'active'),
(4, 'BK-CS-005', 'MEM-2026-001', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE - INTERVAL '31 days', CURRENT_DATE - INTERVAL '30 days', 0.50, 0, 'returned')
ON CONFLICT (loan_id) DO NOTHING;
