-- ─── Seed: Learning Topics ───────────────────────────────────────────────────
-- Populates the learning_topics table with valid recommendation topics
-- for the 7 learning goals that have full module/lesson content.

INSERT INTO learning_topics (goal_id, title, difficulty, estimated_time, xp) VALUES
-- Frontend Web Development
('d0000000-0000-0000-0000-000000000001', 'HTML Fundamentals', 'Beginner', 25, 50),
('d0000000-0000-0000-0000-000000000001', 'CSS Fundamentals', 'Beginner', 30, 50),
('d0000000-0000-0000-0000-000000000001', 'Flexbox Layout', 'Beginner', 25, 50),
('d0000000-0000-0000-0000-000000000001', 'CSS Grid', 'Intermediate', 30, 60),
('d0000000-0000-0000-0000-000000000001', 'Responsive Design', 'Intermediate', 35, 60),
('d0000000-0000-0000-0000-000000000001', 'JavaScript Basics', 'Beginner', 40, 60),
('d0000000-0000-0000-0000-000000000001', 'DOM Manipulation', 'Intermediate', 35, 70),
('d0000000-0000-0000-0000-000000000001', 'Async JavaScript', 'Intermediate', 40, 70),
('d0000000-0000-0000-0000-000000000001', 'React Fundamentals', 'Intermediate', 45, 80),
('d0000000-0000-0000-0000-000000000001', 'React Hooks', 'Intermediate', 40, 80),
('d0000000-0000-0000-0000-000000000001', 'Frontend Performance', 'Advanced', 35, 90),

-- Backend Web Development
('d0000000-0000-0000-0000-000000000002', 'Programming Basics', 'Beginner', 30, 50),
('d0000000-0000-0000-0000-000000000002', 'Node.js Fundamentals', 'Beginner', 35, 60),
('d0000000-0000-0000-0000-000000000002', 'Express.js APIs', 'Intermediate', 40, 70),
('d0000000-0000-0000-0000-000000000002', 'Authentication Systems', 'Intermediate', 40, 70),
('d0000000-0000-0000-0000-000000000002', 'Database Design', 'Intermediate', 45, 80),
('d0000000-0000-0000-0000-000000000002', 'REST API Architecture', 'Intermediate', 35, 70),
('d0000000-0000-0000-0000-000000000002', 'Backend Security', 'Advanced', 40, 90),
('d0000000-0000-0000-0000-000000000002', 'Microservices Basics', 'Advanced', 45, 90),

-- Full-Stack Web Development
('d0000000-0000-0000-0000-000000000003', 'HTML & CSS', 'Beginner', 30, 50),
('d0000000-0000-0000-0000-000000000003', 'JavaScript Fundamentals', 'Beginner', 35, 60),
('d0000000-0000-0000-0000-000000000003', 'React Frontend Development', 'Intermediate', 45, 80),
('d0000000-0000-0000-0000-000000000003', 'Node.js Backend Development', 'Intermediate', 45, 80),
('d0000000-0000-0000-0000-000000000003', 'Database Systems', 'Intermediate', 40, 70),
('d0000000-0000-0000-0000-000000000003', 'REST API Design', 'Intermediate', 35, 70),
('d0000000-0000-0000-0000-000000000003', 'Authentication Systems', 'Intermediate', 40, 70),
('d0000000-0000-0000-0000-000000000003', 'Deployment & DevOps', 'Advanced', 45, 90),

-- User Interface (UI) Design
('d0000000-0000-0000-0000-00000000001e', 'Design Principles', 'Beginner', 25, 50),
('d0000000-0000-0000-0000-00000000001e', 'Color Theory', 'Beginner', 20, 40),
('d0000000-0000-0000-0000-00000000001e', 'Typography', 'Beginner', 20, 40),
('d0000000-0000-0000-0000-00000000001e', 'Wireframing', 'Intermediate', 30, 60),
('d0000000-0000-0000-0000-00000000001e', 'Prototyping', 'Intermediate', 35, 70),
('d0000000-0000-0000-0000-00000000001e', 'User Testing', 'Advanced', 30, 80),

-- Data Analysis
('d0000000-0000-0000-0000-00000000000e', 'Python Basics', 'Beginner', 30, 50),
('d0000000-0000-0000-0000-00000000000e', 'Data Cleaning', 'Intermediate', 35, 60),
('d0000000-0000-0000-0000-00000000000e', 'Data Visualization', 'Intermediate', 35, 70),
('d0000000-0000-0000-0000-00000000000e', 'SQL Queries', 'Intermediate', 40, 70),
('d0000000-0000-0000-0000-00000000000e', 'Statistical Analysis', 'Advanced', 45, 90),

-- Machine Learning
('d0000000-0000-0000-0000-000000000011', 'Python for ML', 'Beginner', 35, 50),
('d0000000-0000-0000-0000-000000000011', 'Linear Algebra Basics', 'Intermediate', 40, 70),
('d0000000-0000-0000-0000-000000000011', 'Machine Learning Algorithms', 'Intermediate', 45, 80),
('d0000000-0000-0000-0000-000000000011', 'Model Training', 'Intermediate', 45, 80),
('d0000000-0000-0000-0000-000000000011', 'Deep Learning Basics', 'Advanced', 50, 100),

-- DevOps
('d0000000-0000-0000-0000-000000000018', 'Linux Fundamentals', 'Beginner', 30, 50),
('d0000000-0000-0000-0000-000000000018', 'Networking Basics', 'Beginner', 25, 50),
('d0000000-0000-0000-0000-000000000018', 'Docker Containers', 'Intermediate', 40, 70),
('d0000000-0000-0000-0000-000000000018', 'CI/CD Pipelines', 'Intermediate', 40, 70),
('d0000000-0000-0000-0000-000000000018', 'Cloud Infrastructure', 'Advanced', 50, 100),
('d0000000-0000-0000-0000-000000000018', 'Monitoring Systems', 'Advanced', 35, 80);
