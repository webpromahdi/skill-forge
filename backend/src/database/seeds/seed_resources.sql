-- ─── Seed: Resources for Recommendation Topics ──────────────────────────────
-- Each learning topic has 3 resources: video, article, project

DELETE FROM resources;

INSERT INTO resources (title, topic, type, difficulty, duration, rating, author, url) VALUES
-- ═══════════════════════════════════════════════════════════════════════════
-- FRONTEND DEVELOPER
-- ═══════════════════════════════════════════════════════════════════════════

-- HTML Fundamentals
('HTML Crash Course for Beginners', 'HTML Fundamentals', 'video', 'Beginner', '45 min', 4.8, 'Traversy Media', 'https://example.com/html-crash-course'),
('Introduction to HTML Elements', 'HTML Fundamentals', 'article', 'Beginner', '20 min', 4.6, 'MDN Web Docs', 'https://example.com/html-elements'),
('Build Your First Web Page', 'HTML Fundamentals', 'project', 'Beginner', '60 min', 4.7, 'freeCodeCamp', 'https://example.com/first-webpage'),

-- CSS Fundamentals
('CSS Tutorial - Full Course', 'CSS Fundamentals', 'video', 'Beginner', '50 min', 4.8, 'freeCodeCamp', 'https://example.com/css-full-course'),
('CSS Selectors & Properties Guide', 'CSS Fundamentals', 'article', 'Beginner', '25 min', 4.5, 'CSS-Tricks', 'https://example.com/css-selectors'),
('Style a Landing Page from Scratch', 'CSS Fundamentals', 'project', 'Beginner', '90 min', 4.7, 'Kevin Powell', 'https://example.com/css-landing-page'),

-- Flexbox Layout
('Flexbox in 20 Minutes', 'Flexbox Layout', 'video', 'Beginner', '20 min', 4.9, 'Traversy Media', 'https://example.com/flexbox-tutorial'),
('A Complete Guide to Flexbox', 'Flexbox Layout', 'article', 'Beginner', '15 min', 4.8, 'CSS-Tricks', 'https://example.com/flexbox-guide'),
('Flexbox Navigation Bar Project', 'Flexbox Layout', 'project', 'Beginner', '45 min', 4.6, 'Kevin Powell', 'https://example.com/flexbox-navbar'),

-- CSS Grid
('CSS Grid Layout Full Tutorial', 'CSS Grid', 'video', 'Intermediate', '40 min', 4.8, 'Wes Bos', 'https://example.com/css-grid-tutorial'),
('CSS Grid Complete Reference', 'CSS Grid', 'article', 'Intermediate', '20 min', 4.7, 'MDN Web Docs', 'https://example.com/css-grid-reference'),
('Build a Dashboard with CSS Grid', 'CSS Grid', 'project', 'Intermediate', '75 min', 4.6, 'Kevin Powell', 'https://example.com/grid-dashboard'),

-- Responsive Design
('Responsive Web Design Crash Course', 'Responsive Design', 'video', 'Intermediate', '35 min', 4.7, 'Traversy Media', 'https://example.com/responsive-crash'),
('Media Queries & Breakpoints Guide', 'Responsive Design', 'article', 'Intermediate', '20 min', 4.6, 'CSS-Tricks', 'https://example.com/media-queries'),
('Build a Responsive Portfolio', 'Responsive Design', 'project', 'Intermediate', '90 min', 4.8, 'Kevin Powell', 'https://example.com/responsive-portfolio'),

-- JavaScript Basics
('JavaScript Full Course for Beginners', 'JavaScript Basics', 'video', 'Beginner', '60 min', 4.9, 'freeCodeCamp', 'https://example.com/js-full-course'),
('JavaScript Fundamentals Handbook', 'JavaScript Basics', 'article', 'Beginner', '30 min', 4.7, 'MDN Web Docs', 'https://example.com/js-handbook'),
('Build a Calculator with JavaScript', 'JavaScript Basics', 'project', 'Beginner', '60 min', 4.6, 'The Odin Project', 'https://example.com/js-calculator'),

-- DOM Manipulation
('JavaScript DOM Manipulation Course', 'DOM Manipulation', 'video', 'Intermediate', '45 min', 4.7, 'Traversy Media', 'https://example.com/dom-course'),
('Understanding the DOM', 'DOM Manipulation', 'article', 'Intermediate', '25 min', 4.6, 'DigitalOcean', 'https://example.com/understanding-dom'),
('Build an Interactive Todo App', 'DOM Manipulation', 'project', 'Intermediate', '75 min', 4.8, 'freeCodeCamp', 'https://example.com/dom-todo'),

-- Async JavaScript
('Async JS - Callbacks, Promises, Async/Await', 'Async JavaScript', 'video', 'Intermediate', '40 min', 4.8, 'Traversy Media', 'https://example.com/async-js'),
('Understanding Promises in JavaScript', 'Async JavaScript', 'article', 'Intermediate', '20 min', 4.7, 'javascript.info', 'https://example.com/promises-guide'),
('Build a Weather App with Fetch API', 'Async JavaScript', 'project', 'Intermediate', '60 min', 4.6, 'freeCodeCamp', 'https://example.com/weather-app'),

-- React Fundamentals
('React JS Full Course', 'React Fundamentals', 'video', 'Intermediate', '60 min', 4.9, 'freeCodeCamp', 'https://example.com/react-full-course'),
('React Official Tutorial', 'React Fundamentals', 'article', 'Intermediate', '45 min', 4.8, 'React Team', 'https://example.com/react-tutorial'),
('Build a Task Manager in React', 'React Fundamentals', 'project', 'Intermediate', '90 min', 4.7, 'Traversy Media', 'https://example.com/react-task-mgr'),

-- React Hooks
('React Hooks Explained', 'React Hooks', 'video', 'Intermediate', '35 min', 4.8, 'Web Dev Simplified', 'https://example.com/react-hooks'),
('A Complete Guide to useEffect', 'React Hooks', 'article', 'Intermediate', '25 min', 4.9, 'Dan Abramov', 'https://example.com/useeffect-guide'),
('Build a Custom Hooks Library', 'React Hooks', 'project', 'Intermediate', '60 min', 4.6, 'Kent C. Dodds', 'https://example.com/custom-hooks'),

-- Frontend Performance
('Web Performance Fundamentals', 'Frontend Performance', 'video', 'Advanced', '50 min', 4.7, 'Google Chrome', 'https://example.com/perf-fundamentals'),
('Core Web Vitals Guide', 'Frontend Performance', 'article', 'Advanced', '20 min', 4.8, 'web.dev', 'https://example.com/core-vitals'),
('Optimize a Slow Website', 'Frontend Performance', 'project', 'Advanced', '90 min', 4.6, 'Google Chrome', 'https://example.com/optimize-site'),

-- ═══════════════════════════════════════════════════════════════════════════
-- BACKEND DEVELOPER
-- ═══════════════════════════════════════════════════════════════════════════

-- Programming Basics
('Programming 101: Variables & Logic', 'Programming Basics', 'video', 'Beginner', '40 min', 4.7, 'CS50', 'https://example.com/prog-101'),
('Learn to Code Guide', 'Programming Basics', 'article', 'Beginner', '25 min', 4.6, 'freeCodeCamp', 'https://example.com/learn-code'),
('Build a CLI Quiz Game', 'Programming Basics', 'project', 'Beginner', '45 min', 4.5, 'The Odin Project', 'https://example.com/cli-quiz'),

-- Node.js Fundamentals
('Node.js Crash Course', 'Node.js Fundamentals', 'video', 'Beginner', '50 min', 4.8, 'Traversy Media', 'https://example.com/node-crash'),
('Introduction to Node.js', 'Node.js Fundamentals', 'article', 'Beginner', '20 min', 4.6, 'Node.js Foundation', 'https://example.com/node-intro'),
('Build a CLI Tool with Node', 'Node.js Fundamentals', 'project', 'Beginner', '60 min', 4.7, 'freeCodeCamp', 'https://example.com/node-cli'),

-- Express.js APIs
('Express.js Full Course', 'Express.js APIs', 'video', 'Intermediate', '55 min', 4.8, 'Traversy Media', 'https://example.com/express-course'),
('REST API with Express Tutorial', 'Express.js APIs', 'article', 'Intermediate', '30 min', 4.7, 'DigitalOcean', 'https://example.com/express-rest'),
('Build a CRUD API with Express', 'Express.js APIs', 'project', 'Intermediate', '75 min', 4.8, 'freeCodeCamp', 'https://example.com/express-crud'),

-- Authentication Systems
('Authentication & Authorization Explained', 'Authentication Systems', 'video', 'Intermediate', '40 min', 4.7, 'Fireship', 'https://example.com/auth-explained'),
('JWT Authentication Guide', 'Authentication Systems', 'article', 'Intermediate', '25 min', 4.6, 'Auth0', 'https://example.com/jwt-guide'),
('Build Login System with JWT', 'Authentication Systems', 'project', 'Intermediate', '90 min', 4.8, 'Traversy Media', 'https://example.com/jwt-login'),

-- Database Design
('Database Design Fundamentals', 'Database Design', 'video', 'Intermediate', '45 min', 4.7, 'freeCodeCamp', 'https://example.com/db-design'),
('Normalization & Schema Design', 'Database Design', 'article', 'Intermediate', '25 min', 4.6, 'PostgreSQL Docs', 'https://example.com/normalization'),
('Design a Social Media Database', 'Database Design', 'project', 'Intermediate', '60 min', 4.5, 'The Odin Project', 'https://example.com/social-db'),

-- REST API Architecture
('REST API Design Best Practices', 'REST API Architecture', 'video', 'Intermediate', '35 min', 4.8, 'Fireship', 'https://example.com/rest-best-practices'),
('RESTful API Guidelines', 'REST API Architecture', 'article', 'Intermediate', '20 min', 4.7, 'Microsoft', 'https://example.com/rest-guidelines'),
('Design a RESTful E-commerce API', 'REST API Architecture', 'project', 'Intermediate', '90 min', 4.6, 'freeCodeCamp', 'https://example.com/ecommerce-api'),

-- Backend Security
('Web Security Essentials', 'Backend Security', 'video', 'Advanced', '50 min', 4.8, 'OWASP', 'https://example.com/web-security'),
('OWASP Top 10 Explained', 'Backend Security', 'article', 'Advanced', '30 min', 4.9, 'OWASP Foundation', 'https://example.com/owasp-top10'),
('Secure an Express.js Application', 'Backend Security', 'project', 'Advanced', '75 min', 4.7, 'PortSwigger', 'https://example.com/secure-express'),

-- Microservices Basics
('Microservices Architecture Explained', 'Microservices Basics', 'video', 'Advanced', '45 min', 4.7, 'Fireship', 'https://example.com/microservices-explained'),
('Introduction to Microservices', 'Microservices Basics', 'article', 'Advanced', '25 min', 4.6, 'Martin Fowler', 'https://example.com/intro-microservices'),
('Split a Monolith into Services', 'Microservices Basics', 'project', 'Advanced', '120 min', 4.5, 'freeCodeCamp', 'https://example.com/split-monolith'),

-- ═══════════════════════════════════════════════════════════════════════════
-- FULL STACK DEVELOPER
-- ═══════════════════════════════════════════════════════════════════════════

-- HTML & CSS
('HTML & CSS for Beginners', 'HTML & CSS', 'video', 'Beginner', '55 min', 4.8, 'freeCodeCamp', 'https://example.com/html-css-beginners'),
('HTML & CSS Quick Reference', 'HTML & CSS', 'article', 'Beginner', '20 min', 4.6, 'MDN Web Docs', 'https://example.com/html-css-ref'),
('Build a Portfolio with HTML & CSS', 'HTML & CSS', 'project', 'Beginner', '75 min', 4.7, 'Kevin Powell', 'https://example.com/portfolio-html-css'),

-- JavaScript Fundamentals
('JavaScript Essentials for Full Stack', 'JavaScript Fundamentals', 'video', 'Beginner', '50 min', 4.8, 'freeCodeCamp', 'https://example.com/js-essentials'),
('JavaScript Core Concepts', 'JavaScript Fundamentals', 'article', 'Beginner', '25 min', 4.7, 'javascript.info', 'https://example.com/js-core'),
('Build a Quiz App with JavaScript', 'JavaScript Fundamentals', 'project', 'Beginner', '60 min', 4.6, 'Web Dev Simplified', 'https://example.com/quiz-app-js'),

-- React Frontend Development
('React for Full Stack Developers', 'React Frontend Development', 'video', 'Intermediate', '60 min', 4.8, 'Traversy Media', 'https://example.com/react-fullstack'),
('Building SPAs with React', 'React Frontend Development', 'article', 'Intermediate', '30 min', 4.7, 'React Team', 'https://example.com/react-spa'),
('Build a Dashboard in React', 'React Frontend Development', 'project', 'Intermediate', '120 min', 4.9, 'freeCodeCamp', 'https://example.com/react-dashboard'),

-- Node.js Backend Development
('Node.js Backend Essentials', 'Node.js Backend Development', 'video', 'Intermediate', '55 min', 4.7, 'Traversy Media', 'https://example.com/node-backend'),
('Express & MongoDB Tutorial', 'Node.js Backend Development', 'article', 'Intermediate', '30 min', 4.6, 'DigitalOcean', 'https://example.com/node-mongo'),
('Build a REST API Backend', 'Node.js Backend Development', 'project', 'Intermediate', '90 min', 4.8, 'freeCodeCamp', 'https://example.com/node-rest-api'),

-- Database Systems
('SQL & NoSQL Databases Explained', 'Database Systems', 'video', 'Intermediate', '40 min', 4.7, 'Fireship', 'https://example.com/db-explained'),
('Choosing the Right Database', 'Database Systems', 'article', 'Intermediate', '20 min', 4.6, 'DigitalOcean', 'https://example.com/choosing-db'),
('Design & Build a Full Database', 'Database Systems', 'project', 'Intermediate', '75 min', 4.5, 'The Odin Project', 'https://example.com/full-db'),

-- REST API Design
('REST API Design Patterns', 'REST API Design', 'video', 'Intermediate', '35 min', 4.8, 'Fireship', 'https://example.com/rest-patterns'),
('API Versioning & Best Practices', 'REST API Design', 'article', 'Intermediate', '20 min', 4.7, 'Postman', 'https://example.com/api-versioning'),
('Build a Full REST API', 'REST API Design', 'project', 'Intermediate', '90 min', 4.6, 'freeCodeCamp', 'https://example.com/full-rest-api'),

-- Deployment & DevOps
('Deploy to Production Guide', 'Deployment & DevOps', 'video', 'Advanced', '45 min', 4.7, 'Fireship', 'https://example.com/deploy-guide'),
('CI/CD for Full Stack Apps', 'Deployment & DevOps', 'article', 'Advanced', '25 min', 4.6, 'GitHub', 'https://example.com/cicd-fullstack'),
('Deploy a Full Stack App', 'Deployment & DevOps', 'project', 'Advanced', '90 min', 4.8, 'Vercel', 'https://example.com/deploy-fullstack'),

-- ═══════════════════════════════════════════════════════════════════════════
-- JAVASCRIPT DEVELOPER
-- ═══════════════════════════════════════════════════════════════════════════

-- Functions & Scope
('JavaScript Functions Masterclass', 'Functions & Scope', 'video', 'Beginner', '35 min', 4.7, 'Traversy Media', 'https://example.com/functions-master'),
('Scope & Hoisting Explained', 'Functions & Scope', 'article', 'Beginner', '20 min', 4.6, 'javascript.info', 'https://example.com/scope-hoisting'),
('Refactor Code with Functions', 'Functions & Scope', 'project', 'Beginner', '40 min', 4.5, 'The Odin Project', 'https://example.com/refactor-functions'),

-- Closures
('JavaScript Closures Visualized', 'Closures', 'video', 'Intermediate', '30 min', 4.8, 'Web Dev Simplified', 'https://example.com/closures-visual'),
('Closures In Depth', 'Closures', 'article', 'Intermediate', '20 min', 4.7, 'MDN Web Docs', 'https://example.com/closures-depth'),
('Build a Counter with Closures', 'Closures', 'project', 'Intermediate', '30 min', 4.5, 'javascript.info', 'https://example.com/counter-closures'),

-- Promises & Async/Await
('Promises & Async/Await Masterclass', 'Promises & Async/Await', 'video', 'Intermediate', '45 min', 4.9, 'Fireship', 'https://example.com/promises-master'),
('Async JavaScript Patterns', 'Promises & Async/Await', 'article', 'Intermediate', '25 min', 4.8, 'javascript.info', 'https://example.com/async-patterns'),
('Build an API Client Library', 'Promises & Async/Await', 'project', 'Intermediate', '60 min', 4.6, 'freeCodeCamp', 'https://example.com/api-client'),

-- JavaScript Design Patterns
('Design Patterns in JavaScript', 'JavaScript Design Patterns', 'video', 'Advanced', '50 min', 4.7, 'Traversy Media', 'https://example.com/js-patterns'),
('Gang of Four Patterns for JS', 'JavaScript Design Patterns', 'article', 'Advanced', '30 min', 4.6, 'patterns.dev', 'https://example.com/gof-js'),
('Refactor with Design Patterns', 'JavaScript Design Patterns', 'project', 'Advanced', '90 min', 4.5, 'The Odin Project', 'https://example.com/refactor-patterns'),

-- ═══════════════════════════════════════════════════════════════════════════
-- REACT DEVELOPER
-- ═══════════════════════════════════════════════════════════════════════════

-- JavaScript ES6
('ES6 Features Explained', 'JavaScript ES6', 'video', 'Beginner', '40 min', 4.8, 'Traversy Media', 'https://example.com/es6-features'),
('Modern JavaScript Cheatsheet', 'JavaScript ES6', 'article', 'Beginner', '20 min', 4.7, 'GitHub', 'https://example.com/es6-cheatsheet'),
('Convert ES5 Code to ES6', 'JavaScript ES6', 'project', 'Beginner', '45 min', 4.5, 'freeCodeCamp', 'https://example.com/es5-to-es6'),

-- React Router
('React Router v6 Tutorial', 'React Router', 'video', 'Intermediate', '35 min', 4.7, 'Web Dev Simplified', 'https://example.com/react-router-v6'),
('React Router Official Docs', 'React Router', 'article', 'Intermediate', '25 min', 4.8, 'Remix Team', 'https://example.com/router-docs'),
('Build a Multi-Page App', 'React Router', 'project', 'Intermediate', '75 min', 4.6, 'freeCodeCamp', 'https://example.com/multi-page-app'),

-- State Management
('State Management in React', 'State Management', 'video', 'Intermediate', '45 min', 4.8, 'Jack Herrington', 'https://example.com/state-mgmt'),
('Redux vs Context vs Zustand', 'State Management', 'article', 'Intermediate', '20 min', 4.7, 'Kent C. Dodds', 'https://example.com/state-comparison'),
('Build a Store with Zustand', 'State Management', 'project', 'Intermediate', '60 min', 4.6, 'Web Dev Simplified', 'https://example.com/zustand-store'),

-- React Performance Optimization
('React Performance Deep Dive', 'React Performance Optimization', 'video', 'Advanced', '50 min', 4.8, 'Jack Herrington', 'https://example.com/react-perf-dive'),
('React Profiler & Optimization', 'React Performance Optimization', 'article', 'Advanced', '25 min', 4.7, 'React Team', 'https://example.com/react-profiler'),
('Optimize a Slow React App', 'React Performance Optimization', 'project', 'Advanced', '90 min', 4.6, 'Kent C. Dodds', 'https://example.com/optimize-react'),

-- ═══════════════════════════════════════════════════════════════════════════
-- NODE.JS DEVELOPER
-- ═══════════════════════════════════════════════════════════════════════════

-- Authentication & JWT
('JWT Authentication Full Guide', 'Authentication & JWT', 'video', 'Intermediate', '40 min', 4.8, 'Traversy Media', 'https://example.com/jwt-full-guide'),
('Token-Based Auth Explained', 'Authentication & JWT', 'article', 'Intermediate', '20 min', 4.7, 'Auth0', 'https://example.com/token-auth'),
('Build a JWT Auth System', 'Authentication & JWT', 'project', 'Intermediate', '75 min', 4.6, 'freeCodeCamp', 'https://example.com/build-jwt'),

-- Database Integration
('Database Integration with Node', 'Database Integration', 'video', 'Intermediate', '45 min', 4.7, 'Traversy Media', 'https://example.com/db-integration'),
('PostgreSQL with Node.js Guide', 'Database Integration', 'article', 'Intermediate', '25 min', 4.6, 'DigitalOcean', 'https://example.com/pg-node'),
('Build a Data-Driven API', 'Database Integration', 'project', 'Intermediate', '90 min', 4.7, 'freeCodeCamp', 'https://example.com/data-driven-api'),

-- API Security
('API Security Best Practices', 'API Security', 'video', 'Advanced', '40 min', 4.8, 'OWASP', 'https://example.com/api-security'),
('Securing REST APIs Guide', 'API Security', 'article', 'Advanced', '25 min', 4.7, 'PortSwigger', 'https://example.com/securing-apis'),
('Harden an API Against Attacks', 'API Security', 'project', 'Advanced', '75 min', 4.6, 'OWASP', 'https://example.com/harden-api'),

-- Scalable Backend Architecture
('Scalable Node.js Architecture', 'Scalable Backend Architecture', 'video', 'Advanced', '50 min', 4.7, 'Fireship', 'https://example.com/scalable-node'),
('Patterns for Scalable Backends', 'Scalable Backend Architecture', 'article', 'Advanced', '30 min', 4.6, 'Martin Fowler', 'https://example.com/scalable-patterns'),
('Design a Scalable API System', 'Scalable Backend Architecture', 'project', 'Advanced', '120 min', 4.5, 'freeCodeCamp', 'https://example.com/scalable-api'),

-- ═══════════════════════════════════════════════════════════════════════════
-- UI/UX DESIGNER
-- ═══════════════════════════════════════════════════════════════════════════

-- Design Principles
('Design Principles for Developers', 'Design Principles', 'video', 'Beginner', '30 min', 4.8, 'Google Design', 'https://example.com/design-principles'),
('Principles of Good UI Design', 'Design Principles', 'article', 'Beginner', '20 min', 4.7, 'Nielsen Norman', 'https://example.com/good-ui'),
('Redesign a Bad Interface', 'Design Principles', 'project', 'Beginner', '60 min', 4.6, 'Figma', 'https://example.com/redesign-ui'),

-- Color Theory
('Color Theory for UI Designers', 'Color Theory', 'video', 'Beginner', '25 min', 4.7, 'Google Design', 'https://example.com/color-theory'),
('Color Palette Creation Guide', 'Color Theory', 'article', 'Beginner', '15 min', 4.6, 'Smashing Magazine', 'https://example.com/color-palette'),
('Build a Color Scheme Explorer', 'Color Theory', 'project', 'Beginner', '45 min', 4.5, 'Figma', 'https://example.com/color-explorer'),

-- Typography
('Typography Fundamentals', 'Typography', 'video', 'Beginner', '25 min', 4.7, 'The Futur', 'https://example.com/typography-fund'),
('Web Typography Best Practices', 'Typography', 'article', 'Beginner', '15 min', 4.6, 'Smashing Magazine', 'https://example.com/web-typography'),
('Design a Type Hierarchy System', 'Typography', 'project', 'Beginner', '40 min', 4.5, 'Figma', 'https://example.com/type-hierarchy'),

-- Wireframing
('Wireframing Crash Course', 'Wireframing', 'video', 'Intermediate', '30 min', 4.7, 'Figma', 'https://example.com/wireframing-crash'),
('Wireframe Best Practices', 'Wireframing', 'article', 'Intermediate', '20 min', 4.6, 'Nielsen Norman', 'https://example.com/wireframe-best'),
('Wireframe a Mobile App', 'Wireframing', 'project', 'Intermediate', '60 min', 4.7, 'Figma', 'https://example.com/wireframe-app'),

-- Prototyping
('Prototyping in Figma', 'Prototyping', 'video', 'Intermediate', '35 min', 4.8, 'Figma', 'https://example.com/figma-prototyping'),
('Interactive Prototyping Guide', 'Prototyping', 'article', 'Intermediate', '25 min', 4.7, 'InVision', 'https://example.com/interactive-proto'),
('Build a Clickable Prototype', 'Prototyping', 'project', 'Intermediate', '75 min', 4.6, 'Figma', 'https://example.com/clickable-proto'),

-- User Testing
('User Testing Methods Explained', 'User Testing', 'video', 'Advanced', '40 min', 4.8, 'Nielsen Norman', 'https://example.com/user-testing'),
('Running Effective Usability Tests', 'User Testing', 'article', 'Advanced', '25 min', 4.7, 'Nielsen Norman', 'https://example.com/usability-tests'),
('Plan & Run a User Test', 'User Testing', 'project', 'Advanced', '90 min', 4.6, 'Google Design', 'https://example.com/run-user-test'),

-- ═══════════════════════════════════════════════════════════════════════════
-- WEB DESIGNER
-- ═══════════════════════════════════════════════════════════════════════════

-- HTML Structure
('HTML Document Structure', 'HTML Structure', 'video', 'Beginner', '30 min', 4.7, 'freeCodeCamp', 'https://example.com/html-structure'),
('Semantic HTML Guide', 'HTML Structure', 'article', 'Beginner', '20 min', 4.6, 'MDN Web Docs', 'https://example.com/semantic-html'),
('Build a Semantic Web Page', 'HTML Structure', 'project', 'Beginner', '45 min', 4.5, 'The Odin Project', 'https://example.com/semantic-page'),

-- CSS Styling
('CSS Styling Masterclass', 'CSS Styling', 'video', 'Beginner', '40 min', 4.8, 'Kevin Powell', 'https://example.com/css-styling'),
('CSS Properties Quick Reference', 'CSS Styling', 'article', 'Beginner', '20 min', 4.6, 'CSS-Tricks', 'https://example.com/css-props'),
('Style a Blog Page', 'CSS Styling', 'project', 'Beginner', '60 min', 4.7, 'Kevin Powell', 'https://example.com/style-blog'),

-- Layout Systems
('CSS Layout Systems Compared', 'Layout Systems', 'video', 'Intermediate', '35 min', 4.8, 'Kevin Powell', 'https://example.com/layout-compared'),
('Flexbox vs Grid Guide', 'Layout Systems', 'article', 'Intermediate', '20 min', 4.7, 'CSS-Tricks', 'https://example.com/flex-vs-grid'),
('Build a Magazine Layout', 'Layout Systems', 'project', 'Intermediate', '75 min', 4.6, 'Kevin Powell', 'https://example.com/magazine-layout'),

-- Visual Hierarchy
('Visual Hierarchy in Web Design', 'Visual Hierarchy', 'video', 'Advanced', '30 min', 4.7, 'The Futur', 'https://example.com/visual-hierarchy'),
('Principles of Visual Hierarchy', 'Visual Hierarchy', 'article', 'Advanced', '20 min', 4.6, 'Smashing Magazine', 'https://example.com/hierarchy-principles'),
('Redesign a Page Using Hierarchy', 'Visual Hierarchy', 'project', 'Advanced', '60 min', 4.5, 'Figma', 'https://example.com/redesign-hierarchy'),

-- ═══════════════════════════════════════════════════════════════════════════
-- SOFTWARE ENGINEER
-- ═══════════════════════════════════════════════════════════════════════════

-- Programming Fundamentals
('Programming Fundamentals Course', 'Programming Fundamentals', 'video', 'Beginner', '50 min', 4.9, 'CS50', 'https://example.com/prog-fundamentals'),
('How to Think Like a Programmer', 'Programming Fundamentals', 'article', 'Beginner', '20 min', 4.7, 'freeCodeCamp', 'https://example.com/think-programmer'),
('Solve 20 Programming Challenges', 'Programming Fundamentals', 'project', 'Beginner', '90 min', 4.6, 'The Odin Project', 'https://example.com/prog-challenges'),

-- Data Structures
('Data Structures Full Course', 'Data Structures', 'video', 'Intermediate', '60 min', 4.9, 'freeCodeCamp', 'https://example.com/ds-full-course'),
('Data Structures Cheat Sheet', 'Data Structures', 'article', 'Intermediate', '25 min', 4.7, 'GeeksforGeeks', 'https://example.com/ds-cheatsheet'),
('Implement Key Data Structures', 'Data Structures', 'project', 'Intermediate', '120 min', 4.8, 'The Odin Project', 'https://example.com/implement-ds'),

-- Algorithms
('Algorithms & Big O Explained', 'Algorithms', 'video', 'Intermediate', '55 min', 4.8, 'freeCodeCamp', 'https://example.com/algo-bigo'),
('Algorithm Complexity Guide', 'Algorithms', 'article', 'Intermediate', '25 min', 4.7, 'GeeksforGeeks', 'https://example.com/algo-complexity'),
('Solve 30 Algorithm Problems', 'Algorithms', 'project', 'Intermediate', '150 min', 4.6, 'LeetCode', 'https://example.com/algo-problems'),

-- System Design
('System Design for Beginners', 'System Design', 'video', 'Advanced', '60 min', 4.8, 'Fireship', 'https://example.com/system-design'),
('System Design Primer', 'System Design', 'article', 'Advanced', '40 min', 4.9, 'GitHub', 'https://example.com/design-primer'),
('Design a URL Shortener', 'System Design', 'project', 'Advanced', '90 min', 4.7, 'freeCodeCamp', 'https://example.com/design-url-shortener'),

-- Software Architecture
('Software Architecture Patterns', 'Software Architecture', 'video', 'Advanced', '50 min', 4.7, 'Fireship', 'https://example.com/arch-patterns'),
('Clean Architecture Guide', 'Software Architecture', 'article', 'Advanced', '30 min', 4.8, 'Martin Fowler', 'https://example.com/clean-arch'),
('Architect a Full Application', 'Software Architecture', 'project', 'Advanced', '120 min', 4.6, 'The Odin Project', 'https://example.com/arch-app'),

-- ═══════════════════════════════════════════════════════════════════════════
-- DATA ANALYST
-- ═══════════════════════════════════════════════════════════════════════════

-- Python Basics
('Python for Beginners Full Course', 'Python Basics', 'video', 'Beginner', '60 min', 4.9, 'freeCodeCamp', 'https://example.com/python-beginners'),
('Python Getting Started Guide', 'Python Basics', 'article', 'Beginner', '25 min', 4.7, 'Real Python', 'https://example.com/python-start'),
('Build a Data Scraper in Python', 'Python Basics', 'project', 'Beginner', '60 min', 4.6, 'freeCodeCamp', 'https://example.com/python-scraper'),

-- Data Cleaning
('Data Cleaning with Pandas', 'Data Cleaning', 'video', 'Intermediate', '40 min', 4.8, 'freeCodeCamp', 'https://example.com/pandas-cleaning'),
('Data Cleaning Best Practices', 'Data Cleaning', 'article', 'Intermediate', '20 min', 4.6, 'Towards Data Science', 'https://example.com/cleaning-practices'),
('Clean a Real-World Dataset', 'Data Cleaning', 'project', 'Intermediate', '75 min', 4.7, 'Kaggle', 'https://example.com/clean-dataset'),

-- Data Visualization
('Data Visualization with Python', 'Data Visualization', 'video', 'Intermediate', '45 min', 4.8, 'freeCodeCamp', 'https://example.com/dataviz-python'),
('Matplotlib & Seaborn Guide', 'Data Visualization', 'article', 'Intermediate', '25 min', 4.7, 'Real Python', 'https://example.com/matplotlib-guide'),
('Build an Interactive Dashboard', 'Data Visualization', 'project', 'Intermediate', '90 min', 4.6, 'Plotly', 'https://example.com/interactive-dash'),

-- SQL Queries
('SQL Full Course for Data Analysts', 'SQL Queries', 'video', 'Intermediate', '55 min', 4.8, 'freeCodeCamp', 'https://example.com/sql-data-analysts'),
('SQL Joins & Subqueries Guide', 'SQL Queries', 'article', 'Intermediate', '25 min', 4.7, 'DigitalOcean', 'https://example.com/sql-joins'),
('Analyze a Database with SQL', 'SQL Queries', 'project', 'Intermediate', '60 min', 4.6, 'Kaggle', 'https://example.com/sql-analyze'),

-- Statistical Analysis
('Statistics for Data Science', 'Statistical Analysis', 'video', 'Advanced', '50 min', 4.7, 'freeCodeCamp', 'https://example.com/stats-datascience'),
('Hypothesis Testing Explained', 'Statistical Analysis', 'article', 'Advanced', '25 min', 4.6, 'Towards Data Science', 'https://example.com/hypothesis-testing'),
('Perform Statistical Analysis on Sales Data', 'Statistical Analysis', 'project', 'Advanced', '90 min', 4.5, 'Kaggle', 'https://example.com/stats-sales'),

-- ═══════════════════════════════════════════════════════════════════════════
-- MACHINE LEARNING ENGINEER
-- ═══════════════════════════════════════════════════════════════════════════

-- Python for ML
('Python for Machine Learning', 'Python for ML', 'video', 'Beginner', '55 min', 4.8, 'freeCodeCamp', 'https://example.com/python-ml'),
('NumPy & Pandas for ML', 'Python for ML', 'article', 'Beginner', '25 min', 4.7, 'Real Python', 'https://example.com/numpy-pandas-ml'),
('Build an ML Data Pipeline', 'Python for ML', 'project', 'Beginner', '60 min', 4.6, 'Kaggle', 'https://example.com/ml-pipeline'),

-- Linear Algebra Basics
('Linear Algebra for ML', 'Linear Algebra Basics', 'video', 'Intermediate', '50 min', 4.7, '3Blue1Brown', 'https://example.com/linalg-ml'),
('Vectors & Matrices Guide', 'Linear Algebra Basics', 'article', 'Intermediate', '30 min', 4.6, 'Khan Academy', 'https://example.com/vectors-matrices'),
('Linear Algebra Practice Problems', 'Linear Algebra Basics', 'project', 'Intermediate', '60 min', 4.5, 'Khan Academy', 'https://example.com/linalg-practice'),

-- Machine Learning Algorithms
('ML Algorithms Explained', 'Machine Learning Algorithms', 'video', 'Intermediate', '60 min', 4.9, 'StatQuest', 'https://example.com/ml-algorithms'),
('Scikit-learn Algorithm Guide', 'Machine Learning Algorithms', 'article', 'Intermediate', '30 min', 4.8, 'scikit-learn', 'https://example.com/sklearn-guide'),
('Implement ML Algorithms from Scratch', 'Machine Learning Algorithms', 'project', 'Intermediate', '120 min', 4.7, 'freeCodeCamp', 'https://example.com/ml-from-scratch'),

-- Model Training
('Model Training & Evaluation', 'Model Training', 'video', 'Intermediate', '45 min', 4.8, 'StatQuest', 'https://example.com/model-training'),
('Cross-Validation & Hyperparameters', 'Model Training', 'article', 'Intermediate', '25 min', 4.7, 'Towards Data Science', 'https://example.com/cross-validation'),
('Train a Prediction Model', 'Model Training', 'project', 'Intermediate', '90 min', 4.6, 'Kaggle', 'https://example.com/train-model'),

-- Deep Learning Basics
('Deep Learning Crash Course', 'Deep Learning Basics', 'video', 'Advanced', '60 min', 4.8, 'freeCodeCamp', 'https://example.com/deep-learning'),
('Neural Networks Explained', 'Deep Learning Basics', 'article', 'Advanced', '30 min', 4.7, '3Blue1Brown', 'https://example.com/neural-nets'),
('Build a Neural Network from Scratch', 'Deep Learning Basics', 'project', 'Advanced', '120 min', 4.6, 'freeCodeCamp', 'https://example.com/build-nn'),

-- ═══════════════════════════════════════════════════════════════════════════
-- DEVOPS ENGINEER
-- ═══════════════════════════════════════════════════════════════════════════

-- Linux Fundamentals
('Linux Command Line Crash Course', 'Linux Fundamentals', 'video', 'Beginner', '40 min', 4.8, 'Traversy Media', 'https://example.com/linux-crash'),
('Essential Linux Commands', 'Linux Fundamentals', 'article', 'Beginner', '20 min', 4.7, 'DigitalOcean', 'https://example.com/linux-commands'),
('Set Up a Linux Dev Environment', 'Linux Fundamentals', 'project', 'Beginner', '60 min', 4.6, 'freeCodeCamp', 'https://example.com/linux-dev-env'),

-- Networking Basics
('Networking Crash Course', 'Networking Basics', 'video', 'Beginner', '35 min', 4.7, 'NetworkChuck', 'https://example.com/networking-crash'),
('TCP/IP & DNS Explained', 'Networking Basics', 'article', 'Beginner', '20 min', 4.6, 'Cloudflare', 'https://example.com/tcpip-dns'),
('Network Troubleshooting Lab', 'Networking Basics', 'project', 'Beginner', '45 min', 4.5, 'NetworkChuck', 'https://example.com/network-lab'),

-- Docker Containers
('Docker Full Course', 'Docker Containers', 'video', 'Intermediate', '55 min', 4.9, 'TechWorld with Nana', 'https://example.com/docker-course'),
('Dockerfile & Compose Guide', 'Docker Containers', 'article', 'Intermediate', '25 min', 4.8, 'Docker Docs', 'https://example.com/dockerfile-guide'),
('Containerize a Web Application', 'Docker Containers', 'project', 'Intermediate', '75 min', 4.7, 'freeCodeCamp', 'https://example.com/containerize-app'),

-- CI/CD Pipelines
('CI/CD with GitHub Actions', 'CI/CD Pipelines', 'video', 'Intermediate', '40 min', 4.8, 'Fireship', 'https://example.com/github-actions'),
('CI/CD Pipeline Best Practices', 'CI/CD Pipelines', 'article', 'Intermediate', '20 min', 4.7, 'GitHub', 'https://example.com/cicd-best'),
('Build a Full CI/CD Pipeline', 'CI/CD Pipelines', 'project', 'Intermediate', '90 min', 4.6, 'freeCodeCamp', 'https://example.com/build-cicd'),

-- Cloud Infrastructure
('AWS/GCP/Azure for Beginners', 'Cloud Infrastructure', 'video', 'Advanced', '60 min', 4.8, 'freeCodeCamp', 'https://example.com/cloud-beginners'),
('Terraform Getting Started', 'Cloud Infrastructure', 'article', 'Advanced', '30 min', 4.7, 'HashiCorp', 'https://example.com/terraform-start'),
('Provision Cloud Resources', 'Cloud Infrastructure', 'project', 'Advanced', '90 min', 4.6, 'freeCodeCamp', 'https://example.com/provision-cloud'),

-- Monitoring Systems
('Monitoring with Prometheus & Grafana', 'Monitoring Systems', 'video', 'Advanced', '45 min', 4.7, 'TechWorld with Nana', 'https://example.com/prometheus-grafana'),
('Observability & Alerting Guide', 'Monitoring Systems', 'article', 'Advanced', '25 min', 4.6, 'Grafana Labs', 'https://example.com/observability'),
('Set Up Full Monitoring Stack', 'Monitoring Systems', 'project', 'Advanced', '90 min', 4.5, 'freeCodeCamp', 'https://example.com/monitoring-stack');
