import {
  Department,
  FacultyProfile,
  Course,
  Module,
  CourseOutcome,
  KLevel,
  QuestionType,
  Mark,
  Question,
  ExamTemplate,
  GeneratedPaper
} from '@/types';

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: '11111111-1111-1111-1111-111111111111', code: 'CSE', name: 'Department of Computer Science & Engineering' },
  { id: '22222222-2222-2222-2222-222222222222', code: 'ECE', name: 'Department of Electronics & Communication Engineering' },
  { id: '33333333-3333-3333-3333-333333333333', code: 'MECH', name: 'Department of Mechanical Engineering' },
  { id: '44444444-4444-4444-4444-444444444444', code: 'EEE', name: 'Department of Electrical & Electronics Engineering' }
];

export const INITIAL_FACULTY: FacultyProfile[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    full_name: 'System Administrator',
    email: 'admin@pmu.edu',
    role: 'admin',
    department_id: '11111111-1111-1111-1111-111111111111',
    status: 'active',
    can_create_faculty: true,
    can_create_courses: true,
    can_create_questions: true,
    department: INITIAL_DEPARTMENTS[0]
  },
  {
    id: 'f2222222-2222-2222-2222-222222222222',
    full_name: 'Dr. Aris Thorne',
    email: 'faculty@pmu.edu',
    role: 'faculty',
    department_id: '11111111-1111-1111-1111-111111111111',
    status: 'active',
    can_create_faculty: false,
    can_create_courses: true,
    can_create_questions: true,
    department: INITIAL_DEPARTMENTS[0]
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    code: 'CS8591',
    name: 'Computer Networks',
    department_id: '11111111-1111-1111-1111-111111111111',
    semester: 5,
    academic_year: '2025-2026',
    department: INITIAL_DEPARTMENTS[0]
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    code: 'CS8491',
    name: 'Database Management Systems',
    department_id: '11111111-1111-1111-1111-111111111111',
    semester: 4,
    academic_year: '2025-2026',
    department: INITIAL_DEPARTMENTS[0]
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    code: 'CS8392',
    name: 'Object Oriented Programming',
    department_id: '11111111-1111-1111-1111-111111111111',
    semester: 3,
    academic_year: '2025-2026',
    department: INITIAL_DEPARTMENTS[0]
  }
];

export const INITIAL_MODULES: Module[] = [
  // CS8591 - Computer Networks
  { id: 'b1111111-1111-1111-1111-111111111111', course_id: 'c1111111-1111-1111-1111-111111111111', module_number: 1, title: 'Direct Link Networks & Physical Layer', description: 'Encoding, Framing, Error Detection, Media Access Control' },
  { id: 'b2222222-2222-2222-2222-222222222222', course_id: 'c1111111-1111-1111-1111-111111111111', module_number: 2, title: 'Packet Switching & Routing Algorithms', description: 'Distance Vector, Link State, IPv4, IPv6 Architecture' },
  { id: 'b3333333-3333-3333-3333-333333333333', course_id: 'c1111111-1111-1111-1111-111111111111', module_number: 3, title: 'Internetworking & Subnetting', description: 'ARP, DHCP, ICMP, CIDR and Subnet Mask Calculations' },
  { id: 'b4444444-4444-4444-4444-444444444444', course_id: 'c1111111-1111-1111-1111-111111111111', module_number: 4, title: 'Transport Layer Protocols', description: 'TCP Congestion Control, UDP Datagrams, Flow Control' },
  { id: 'b5555555-5555-5555-5555-555555555555', course_id: 'c1111111-1111-1111-1111-111111111111', module_number: 5, title: 'Application Layer & Network Security', description: 'DNS, HTTP, SMTP, Cryptography and Digital Signatures' },

  // CS8491 - Database Management Systems
  { id: 'b6666666-6666-6666-6666-666666666666', course_id: 'c2222222-2222-2222-2222-222222222222', module_number: 1, title: 'Relational Database Concepts & ER Modeling', description: 'ER Diagrams, Entity Sets, Attributes, Relational Schema Design' },
  { id: 'b7777777-7777-7777-7777-777777777777', course_id: 'c2222222-2222-2222-2222-222222222222', module_number: 2, title: 'Relational Algebra & Structured Query Language (SQL)', description: 'DDL, DML, DCL, Complex JOINs, Subqueries, Views & Constraints' },
  { id: 'b8888888-8888-8888-8888-888888888888', course_id: 'c2222222-2222-2222-2222-222222222222', module_number: 3, title: 'Database Normalization & Functional Dependencies', description: '1NF, 2NF, 3NF, BCNF, Lossless Join & Dependency Preservation' },
  { id: 'b9999999-9999-9999-9999-999999999999', course_id: 'c2222222-2222-2222-2222-222222222222', module_number: 4, title: 'Transaction Management & Concurrency Control', description: 'ACID Properties, Serializability, Two-Phase Locking, Deadlock Management' },
  { id: 'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', course_id: 'c2222222-2222-2222-2222-222222222222', module_number: 5, title: 'Storage Structures, Indexing & Query Optimization', description: 'B+ Trees, Static & Dynamic Hashing, Query Evaluation & Cost Models' },

  // CS8392 - Object Oriented Programming
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', course_id: 'c3333333-3333-3333-3333-333333333333', module_number: 1, title: 'Introduction to OOP Paradigm & Java Fundamentals', description: 'Classes, Objects, Methods, Constructors, Data Types & Control Flow' },
  { id: 'bccccccc-cccc-cccc-cccc-cccccccccccc', course_id: 'c3333333-3333-3333-3333-333333333333', module_number: 2, title: 'Inheritance, Interfaces & Polymorphism', description: 'Single/Multilevel Inheritance, Method Overriding, Abstract Classes, Interfaces' },
  { id: 'bddddddd-dddd-dddd-dddd-dddddddddddd', course_id: 'c3333333-3333-3333-3333-333333333333', module_number: 3, title: 'Exception Handling & Multithreaded Programming', description: 'Try-Catch-Finally, Custom Exception Classes, Thread Lifecycle & Synchronization' },
  { id: 'beeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', course_id: 'c3333333-3333-3333-3333-333333333333', module_number: 4, title: 'Java I/O Streams, Generics & Collection Framework', description: 'Byte & Character Streams, Serialization, ArrayList, HashMap & Iterators' },
  { id: 'bfffffff-ffff-ffff-ffff-ffffffffffff', course_id: 'c3333333-3333-3333-3333-333333333333', module_number: 5, title: 'Event-Driven GUI Programming & Swing Components', description: 'AWT, Swing Containers, Event Delegation Model, Layout Managers' }
];

export const INITIAL_COS: CourseOutcome[] = [
  // CS8591 COs
  { id: 'ca111111-1111-1111-1111-111111111111', course_id: 'c1111111-1111-1111-1111-111111111111', co_number: 1, code: 'CO1', description: 'Understand physical layer concepts, framing, and link level error detection algorithms.', k_level_code: 'K2' },
  { id: 'ca222222-2222-2222-2222-222222222222', course_id: 'c1111111-1111-1111-1111-111111111111', co_number: 2, code: 'CO2', description: 'Analyze packet switching strategies and distance-vector/link-state routing protocols.', k_level_code: 'K4' },
  { id: 'ca333333-3333-3333-3333-333333333333', course_id: 'c1111111-1111-1111-1111-111111111111', co_number: 3, code: 'CO3', description: 'Apply subnet masking, IPv4/v6 addressing, and address resolution protocols.', k_level_code: 'K3' },
  { id: 'ca444444-4444-4444-4444-444444444444', course_id: 'c1111111-1111-1111-1111-111111111111', co_number: 4, code: 'CO4', description: 'Evaluate transport layer flow control, sliding window mechanisms, and TCP congestion control.', k_level_code: 'K5' },
  { id: 'ca555555-5555-5555-5555-555555555555', course_id: 'c1111111-1111-1111-1111-111111111111', co_number: 5, code: 'CO5', description: 'Design application layer architectures (DNS, HTTP) and implement network security fundamentals.', k_level_code: 'K6' },

  // CS8392 COs
  { id: 'ca666666-6666-6666-6666-666666666666', course_id: 'c3333333-3333-3333-3333-333333333333', co_number: 1, code: 'CO1', description: 'Develop Java applications using fundamental OOP principles, classes, and objects.', k_level_code: 'K3' },
  { id: 'ca777777-7777-7777-7777-777777777777', course_id: 'c3333333-3333-3333-3333-333333333333', co_number: 2, code: 'CO2', description: 'Apply inheritance, polymorphism, and interfaces to achieve code reusability.', k_level_code: 'K3' },
  { id: 'ca888888-8888-8888-8888-888888888888', course_id: 'c3333333-3333-3333-3333-333333333333', co_number: 3, code: 'CO3', description: 'Implement robust error handling using exceptions and multithreaded execution.', k_level_code: 'K4' },
  { id: 'ca999999-9999-9999-9999-999999999999', course_id: 'c3333333-3333-3333-3333-333333333333', co_number: 4, code: 'CO4', description: 'Utilize Java I/O streams and Collections Framework for data manipulation.', k_level_code: 'K4' },
  { id: 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', course_id: 'c3333333-3333-3333-3333-333333333333', co_number: 5, code: 'CO5', description: 'Design interactive GUI applications using Swing and event-driven delegation.', k_level_code: 'K6' }
];

export const INITIAL_KLEVELS: KLevel[] = [
  { id: 'e1111111-1111-1111-1111-111111111111', code: 'K1', name: 'Remember', description: 'Recall basic facts, terms, concepts and answers' },
  { id: 'e2222222-2222-2222-2222-222222222222', code: 'K2', name: 'Understand', description: 'Demonstrate understanding of facts and ideas' },
  { id: 'e3333333-3333-3333-3333-333333333333', code: 'K3', name: 'Apply', description: 'Solve problems in new situations by applying acquired knowledge' },
  { id: 'e4444444-4444-4444-4444-444444444444', code: 'K4', name: 'Analyze', description: 'Examine and break information into parts' },
  { id: 'e5555555-5555-5555-5555-555555555555', code: 'K5', name: 'Evaluate', description: 'Present and defend opinions by making judgments' },
  { id: 'e6666666-6666-6666-6666-666666666666', code: 'K6', name: 'Create', description: 'Compile information together in a different way' }
];

export const INITIAL_QUESTION_TYPES: QuestionType[] = [
  { id: 'd1111111-1111-1111-1111-111111111111', code: 'MCQ', name: 'Multiple Choice Question', default_marks: 1 },
  { id: 'd2222222-2222-2222-2222-222222222222', code: 'SHORT', name: 'Short Answer Question', default_marks: 2 },
  { id: 'd3333333-3333-3333-3333-333333333333', code: 'LONG', name: 'Long Answer Question', default_marks: 15 }
];

export const INITIAL_MARKS: Mark[] = [
  { id: 'e0000001-0000-0000-0000-000000000001', mark_value: 1 },
  { id: 'e0000002-0000-0000-0000-000000000002', mark_value: 2 },
  { id: 'e0000010-0000-0000-0000-000000000010', mark_value: 10 },
  { id: 'e0000015-0000-0000-0000-000000000015', mark_value: 15 },
  { id: 'e0000020-0000-0000-0000-000000000020', mark_value: 20 }
];

export const INITIAL_QUESTIONS: Question[] = [
  // 1-MARK MCQs
  {
    id: '01010101-0000-0000-0000-000000000001',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b1111111-1111-1111-1111-111111111111',
    course_outcome_id: 'ca111111-1111-1111-1111-111111111111',
    k_level_id: 'e1111111-1111-1111-1111-111111111111',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'Which protocol layer is responsible for bit-level transmission across a physical medium?',
    options: [
      { option_letter: 'a', option_text: 'Data Link Layer', is_correct: false },
      { option_letter: 'b', option_text: 'Physical Layer', is_correct: true },
      { option_letter: 'c', option_text: 'Network Layer', is_correct: false },
      { option_letter: 'd', option_text: 'Transport Layer', is_correct: false }
    ]
  },
  {
    id: '01010101-0000-0000-0000-000000000002',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b1111111-1111-1111-1111-111111111111',
    course_outcome_id: 'ca111111-1111-1111-1111-111111111111',
    k_level_id: 'e1111111-1111-1111-1111-111111111111',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'What is the standard length of an Ethernet MAC address?',
    options: [
      { option_letter: 'a', option_text: '32 bits', is_correct: false },
      { option_letter: 'b', option_text: '48 bits', is_correct: true },
      { option_letter: 'c', option_text: '64 bits', is_correct: false },
      { option_letter: 'd', option_text: '128 bits', is_correct: false }
    ]
  },
  {
    id: '01010101-0000-0000-0000-000000000003',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b2222222-2222-2222-2222-222222222222',
    course_outcome_id: 'ca222222-2222-2222-2222-222222222222',
    k_level_id: 'e2222222-2222-2222-2222-222222222222',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'Which routing algorithm relies on the Bellman-Ford equation?',
    options: [
      { option_letter: 'a', option_text: 'Link State Routing', is_correct: false },
      { option_letter: 'b', option_text: 'Distance Vector Routing', is_correct: true },
      { option_letter: 'c', option_text: 'Hierarchical Routing', is_correct: false },
      { option_letter: 'd', option_text: 'Flooding Algorithm', is_correct: false }
    ]
  },
  {
    id: '01010101-0000-0000-0000-000000000004',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b2222222-2222-2222-2222-222222222222',
    course_outcome_id: 'ca222222-2222-2222-2222-222222222222',
    k_level_id: 'e1111111-1111-1111-1111-111111111111',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'What is the default header size of an IPv4 packet without options?',
    options: [
      { option_letter: 'a', option_text: '16 Bytes', is_correct: false },
      { option_letter: 'b', option_text: '20 Bytes', is_correct: true },
      { option_letter: 'c', option_text: '32 Bytes', is_correct: false },
      { option_letter: 'd', option_text: '40 Bytes', is_correct: false }
    ]
  },
  {
    id: '01010101-0000-0000-0000-000000000005',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b3333333-3333-3333-3333-333333333333',
    course_outcome_id: 'ca333333-3333-3333-3333-333333333333',
    k_level_id: 'e2222222-2222-2222-2222-222222222222',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'Which protocol maps a known IPv4 address to an unknown physical MAC address?',
    options: [
      { option_letter: 'a', option_text: 'RARP', is_correct: false },
      { option_letter: 'b', option_text: 'ARP', is_correct: true },
      { option_letter: 'c', option_text: 'ICMP', is_correct: false },
      { option_letter: 'd', option_text: 'DHCP', is_correct: false }
    ]
  },
  {
    id: '01010101-0000-0000-0000-000000000006',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b3333333-3333-3333-3333-333333333333',
    course_outcome_id: 'ca333333-3333-3333-3333-333333333333',
    k_level_id: 'e3333333-3333-3333-3333-333333333333',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'What is the default subnet mask for Class C IPv4 addresses?',
    options: [
      { option_letter: 'a', option_text: '255.0.0.0', is_correct: false },
      { option_letter: 'b', option_text: '255.255.0.0', is_correct: false },
      { option_letter: 'c', option_text: '255.255.255.0', is_correct: true },
      { option_letter: 'd', option_text: '255.255.255.255', is_correct: false }
    ]
  },
  {
    id: '01010101-0000-0000-0000-000000000007',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b4444444-4444-4444-4444-444444444444',
    course_outcome_id: 'ca444444-4444-4444-4444-444444444444',
    k_level_id: 'e1111111-1111-1111-1111-111111111111',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'Which TCP flag is transmitted to establish a connection handshake?',
    options: [
      { option_letter: 'a', option_text: 'ACK', is_correct: false },
      { option_letter: 'b', option_text: 'SYN', is_correct: true },
      { option_letter: 'c', option_text: 'FIN', is_correct: false },
      { option_letter: 'd', option_text: 'RST', is_correct: false }
    ]
  },
  {
    id: '01010101-0000-0000-0000-000000000008',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b4444444-4444-4444-4444-444444444444',
    course_outcome_id: 'ca444444-4444-4444-4444-444444444444',
    k_level_id: 'e2222222-2222-2222-2222-222222222222',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'What distinguishes UDP from TCP regarding connection state?',
    options: [
      { option_letter: 'a', option_text: 'UDP uses a 3-way handshake', is_correct: false },
      { option_letter: 'b', option_text: 'UDP is connectionless and lightweight', is_correct: true },
      { option_letter: 'c', option_text: 'UDP guarantees segment ordering', is_correct: false },
      { option_letter: 'd', option_text: 'UDP provides sliding window flow control', is_correct: false }
    ]
  },
  {
    id: '01010101-0000-0000-0000-000000000009',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b5555555-5555-5555-5555-555555555555',
    course_outcome_id: 'ca555555-5555-5555-5555-555555555555',
    k_level_id: 'e1111111-1111-1111-1111-111111111111',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'What is the default TCP port number reserved for unencrypted HTTP traffic?',
    options: [
      { option_letter: 'a', option_text: '21', is_correct: false },
      { option_letter: 'b', option_text: '25', is_correct: false },
      { option_letter: 'c', option_text: '80', is_correct: true },
      { option_letter: 'd', option_text: '443', is_correct: false }
    ]
  },
  {
    id: '01010101-0000-0000-0000-000000000010',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b5555555-5555-5555-5555-555555555555',
    course_outcome_id: 'ca555555-5555-5555-5555-555555555555',
    k_level_id: 'e2222222-2222-2222-2222-222222222222',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'What is the primary role of DNS in domain name resolution?',
    options: [
      { option_letter: 'a', option_text: 'Encrypting HTTP session payloads', is_correct: false },
      { option_letter: 'b', option_text: 'Resolving domain names into numeric IP addresses', is_correct: true },
      { option_letter: 'c', option_text: 'Dynamic IP assignment to clients', is_correct: false },
      { option_letter: 'd', option_text: 'Filtering malicious packet payloads', is_correct: false }
    ]
  },

  // 2-MARK SHORT QUESTIONS
  {
    id: '02020202-0000-0000-0000-000000000001',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b1111111-1111-1111-1111-111111111111',
    course_outcome_id: 'ca111111-1111-1111-1111-111111111111',
    k_level_id: 'e2222222-2222-2222-2222-222222222222',
    question_type_id: 'd2222222-2222-2222-2222-222222222222',
    marks_id: 'e0000002-0000-0000-0000-000000000002',
    mark_value: 2,
    question_text: 'Define bit stuffing and explain why it is required in synchronous data link framing.'
  },
  {
    id: '02020202-0000-0000-0000-000000000002',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b2222222-2222-2222-2222-222222222222',
    course_outcome_id: 'ca222222-2222-2222-2222-222222222222',
    k_level_id: 'e2222222-2222-2222-2222-222222222222',
    question_type_id: 'd2222222-2222-2222-2222-222222222222',
    marks_id: 'e0000002-0000-0000-0000-000000000002',
    mark_value: 2,
    question_text: 'Differentiate between adaptive and non-adaptive routing algorithms with standard examples.'
  },
  {
    id: '02020202-0000-0000-0000-000000000003',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b3333333-3333-3333-3333-333333333333',
    course_outcome_id: 'ca333333-3333-3333-3333-333333333333',
    k_level_id: 'e3333333-3333-3333-3333-333333333333',
    question_type_id: 'd2222222-2222-2222-2222-222222222222',
    marks_id: 'e0000002-0000-0000-0000-000000000002',
    mark_value: 2,
    question_text: 'Calculate the network address and broadcast address for IP 192.168.10.45/26.'
  },
  {
    id: '02020202-0000-0000-0000-000000000004',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b4444444-4444-4444-4444-444444444444',
    course_outcome_id: 'ca444444-4444-4444-4444-444444444444',
    k_level_id: 'e2222222-2222-2222-2222-222222222222',
    question_type_id: 'd2222222-2222-2222-2222-222222222222',
    marks_id: 'e0000002-0000-0000-0000-000000000002',
    mark_value: 2,
    question_text: 'What is Silly Window Syndrome in TCP, and how does Nagle’s algorithm solve it?'
  },
  {
    id: '02020202-0000-0000-0000-000000000005',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b5555555-5555-5555-5555-555555555555',
    course_outcome_id: 'ca555555-5555-5555-5555-555555555555',
    k_level_id: 'e2222222-2222-2222-2222-222222222222',
    question_type_id: 'd2222222-2222-2222-2222-222222222222',
    marks_id: 'e0000002-0000-0000-0000-000000000002',
    mark_value: 2,
    question_text: 'State the key differences between symmetric key and public-key asymmetric encryption.'
  },

  // 15-MARK LONG QUESTIONS (WITH PAIRS FOR OR PATTERN)
  {
    id: '15151515-0000-0000-0000-000000000001',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b1111111-1111-1111-1111-111111111111',
    course_outcome_id: 'ca111111-1111-1111-1111-111111111111',
    k_level_id: 'e3333333-3333-3333-3333-333333333333',
    question_type_id: 'd3333333-3333-3333-3333-333333333333',
    marks_id: 'e0000015-0000-0000-0000-000000000015',
    mark_value: 15,
    question_text: 'Explain the ISO/OSI 7-Layer Reference Model with neat diagrams and detail the exact functions of each layer.'
  },
  {
    id: '15151515-0000-0000-0000-000000000002',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b1111111-1111-1111-1111-111111111111',
    course_outcome_id: 'ca111111-1111-1111-1111-111111111111',
    k_level_id: 'e3333333-3333-3333-3333-333333333333',
    question_type_id: 'd3333333-3333-3333-3333-333333333333',
    marks_id: 'e0000015-0000-0000-0000-000000000015',
    mark_value: 15,
    question_text: 'Describe the Cyclic Redundancy Check (CRC) error detection mechanism. Given data 1101011011 and generator polynomial G(x) = x^4 + x + 1, calculate the transmitted codeword.'
  },
  {
    id: '15151515-0000-0000-0000-000000000003',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b2222222-2222-2222-2222-222222222222',
    course_outcome_id: 'ca222222-2222-2222-2222-222222222222',
    k_level_id: 'e4444444-4444-4444-4444-444444444444',
    question_type_id: 'd3333333-3333-3333-3333-333333333333',
    marks_id: 'e0000015-0000-0000-0000-000000000015',
    mark_value: 15,
    question_text: 'Construct Dijkstra’s Shortest Path Routing Algorithm step-by-step for a network with 6 nodes. Draw the link state routing table for node A.'
  },
  {
    id: '15151515-0000-0000-0000-000000000004',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b2222222-2222-2222-2222-222222222222',
    course_outcome_id: 'ca222222-2222-2222-2222-222222222222',
    k_level_id: 'e4444444-4444-4444-4444-444444444444',
    question_type_id: 'd3333333-3333-3333-3333-333333333333',
    marks_id: 'e0000015-0000-0000-0000-000000000015',
    mark_value: 15,
    question_text: 'Explain the Count-to-Infinity problem in Distance Vector Routing protocols. Discuss how Split Horizon and Poison Reverse mitigate this issue.'
  },
  {
    id: '15151515-0000-0000-0000-000000000005',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b3333333-3333-3333-3333-333333333333',
    course_outcome_id: 'ca333333-3333-3333-3333-333333333333',
    k_level_id: 'e3333333-3333-3333-3333-333333333333',
    question_type_id: 'd3333333-3333-3333-3333-333333333333',
    marks_id: 'e0000015-0000-0000-0000-000000000015',
    mark_value: 15,
    question_text: 'An organization is allocated the IP block 192.168.1.0/24. Design a Classless Inter-Domain Routing (CIDR) subnet scheme for 4 departments requiring 60, 30, 30, and 10 hosts respectively.'
  },
  {
    id: '15151515-0000-0000-0000-000000000006',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b3333333-3333-3333-3333-333333333333',
    course_outcome_id: 'ca333333-3333-3333-3333-333333333333',
    k_level_id: 'e3333333-3333-3333-3333-333333333333',
    question_type_id: 'd3333333-3333-3333-3333-333333333333',
    marks_id: 'e0000015-0000-0000-0000-000000000015',
    mark_value: 15,
    question_text: 'Compare IPv4 and IPv6 header formats. Explain the role of Extension Headers, Neighbor Discovery Protocol (NDP), and dual-stack transition mechanisms.'
  },
  {
    id: '15151515-0000-0000-0000-000000000007',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b4444444-4444-4444-4444-444444444444',
    course_outcome_id: 'ca444444-4444-4444-4444-444444444444',
    k_level_id: 'e4444444-4444-4444-4444-444444444444',
    question_type_id: 'd3333333-3333-3333-3333-333333333333',
    marks_id: 'e0000015-0000-0000-0000-000000000015',
    mark_value: 15,
    question_text: 'Detail the TCP Congestion Control algorithms: Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery with a congestion window progression graph.'
  },
  {
    id: '15151515-0000-0000-0000-000000000008',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b4444444-4444-4444-4444-444444444444',
    course_outcome_id: 'ca444444-4444-4444-4444-444444444444',
    k_level_id: 'e4444444-4444-4444-4444-444444444444',
    question_type_id: 'd3333333-3333-3333-3333-333333333333',
    marks_id: 'e0000015-0000-0000-0000-000000000015',
    mark_value: 15,
    question_text: 'Compare Go-Back-N ARQ and Selective Repeat ARQ sliding window protocols. Calculate protocol efficiency when window size N=7 and frame error rate p=0.1.'
  },

  // 20-MARK COMPREHENSIVE QUESTION
  {
    id: '20202020-0000-0000-0000-000000000001',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    module_id: 'b5555555-5555-5555-5555-555555555555',
    course_outcome_id: 'ca555555-5555-5555-5555-555555555555',
    k_level_id: 'e5555555-5555-5555-5555-555555555555',
    question_type_id: 'd3333333-3333-3333-3333-333333333333',
    marks_id: 'e0000020-0000-0000-0000-000000000020',
    mark_value: 20,
    question_text: 'Design an end-to-end secure enterprise network architecture for PMU University. Integrate DNS server redundancy, HTTPS web services, WPA3 enterprise authentication, RSA public-key encryption for confidential data transfer, and stateful firewall packet inspection rules.'
  },

  // CS8392 - OBJECT ORIENTED PROGRAMMING QUESTIONS
  {
    id: '33839201-0000-0000-0000-000000000001',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c3333333-3333-3333-3333-333333333333',
    module_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    course_outcome_id: 'ca666666-6666-6666-6666-666666666666',
    k_level_id: 'e1111111-1111-1111-1111-111111111111',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'Which keyword in Java is used to prevent a method from being overridden in a subclass?',
    options: [
      { option_letter: 'a', option_text: 'static', is_correct: false },
      { option_letter: 'b', option_text: 'final', is_correct: true },
      { option_letter: 'c', option_text: 'abstract', is_correct: false },
      { option_letter: 'd', option_text: 'volatile', is_correct: false }
    ]
  },
  {
    id: '33839201-0000-0000-0000-000000000002',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c3333333-3333-3333-3333-333333333333',
    module_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    course_outcome_id: 'ca666666-6666-6666-6666-666666666666',
    k_level_id: 'e2222222-2222-2222-2222-222222222222',
    question_type_id: 'd2222222-2222-2222-2222-222222222222',
    marks_id: 'e0000002-0000-0000-0000-000000000002',
    mark_value: 2,
    question_text: 'Explain the difference between primitive data types and reference data types in Java with examples.'
  },
  {
    id: '33839201-0000-0000-0000-000000000003',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c3333333-3333-3333-3333-333333333333',
    module_id: 'bccccccc-cccc-cccc-cccc-cccccccccccc',
    course_outcome_id: 'ca777777-7777-7777-7777-777777777777',
    k_level_id: 'e1111111-1111-1111-1111-111111111111',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'What feature of OOP allows multiple methods in the same class to have the same name but different parameters?',
    options: [
      { option_letter: 'a', option_text: 'Method Overriding', is_correct: false },
      { option_letter: 'b', option_text: 'Method Overloading', is_correct: true },
      { option_letter: 'c', option_text: 'Abstraction', is_correct: false },
      { option_letter: 'd', option_text: 'Encapsulation', is_correct: false }
    ]
  },
  {
    id: '33839201-0000-0000-0000-000000000004',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c3333333-3333-3333-3333-333333333333',
    module_id: 'bccccccc-cccc-cccc-cccc-cccccccccccc',
    course_outcome_id: 'ca777777-7777-7777-7777-777777777777',
    k_level_id: 'e3333333-3333-3333-3333-333333333333',
    question_type_id: 'd3333333-3333-3333-3333-333333333333',
    marks_id: 'e0000010-0000-0000-0000-000000000010',
    mark_value: 10,
    question_text: 'Define Abstract Classes and Interfaces in Java. Write a Java program illustrating dynamic method dispatch using interfaces.'
  },
  {
    id: '33839201-0000-0000-0000-000000000005',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c3333333-3333-3333-3333-333333333333',
    module_id: 'bddddddd-dddd-dddd-dddd-dddddddddddd',
    course_outcome_id: 'ca888888-8888-8888-8888-888888888888',
    k_level_id: 'e1111111-1111-1111-1111-111111111111',
    question_type_id: 'd1111111-1111-1111-1111-111111111111',
    marks_id: 'e0000001-0000-0000-0000-000000000001',
    mark_value: 1,
    question_text: 'Which block in Java exception handling ALWAYS executes whether an exception occurs or not?',
    options: [
      { option_letter: 'a', option_text: 'try', is_correct: false },
      { option_letter: 'b', option_text: 'catch', is_correct: false },
      { option_letter: 'c', option_text: 'finally', is_correct: true },
      { option_letter: 'd', option_text: 'throw', is_correct: false }
    ]
  },
  {
    id: '33839201-0000-0000-0000-000000000006',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c3333333-3333-3333-3333-333333333333',
    module_id: 'bddddddd-dddd-dddd-dddd-dddddddddddd',
    course_outcome_id: 'ca888888-8888-8888-8888-888888888888',
    k_level_id: 'e4444444-4444-4444-4444-444444444444',
    question_type_id: 'd3333333-3333-3333-3333-333333333333',
    marks_id: 'e0000015-0000-0000-0000-000000000015',
    mark_value: 15,
    question_text: 'Explain Thread Synchronization in Java. Demonstrate the Producer-Consumer problem solved using synchronized methods and wait()/notify() communication.'
  },
  {
    id: '33839201-0000-0000-0000-000000000007',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c3333333-3333-3333-3333-333333333333',
    module_id: 'beeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    course_outcome_id: 'ca999999-9999-9999-9999-999999999999',
    k_level_id: 'e2222222-2222-2222-2222-222222222222',
    question_type_id: 'd2222222-2222-2222-2222-222222222222',
    marks_id: 'e0000002-0000-0000-0000-000000000002',
    mark_value: 2,
    question_text: 'Differentiate between Byte Streams (InputStream/OutputStream) and Character Streams (Reader/Writer) in Java.'
  },
  {
    id: '33839201-0000-0000-0000-000000000008',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c3333333-3333-3333-3333-333333333333',
    module_id: 'bfffffff-ffff-ffff-ffff-ffffffffffff',
    course_outcome_id: 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    k_level_id: 'e6666666-6666-6666-6666-666666666666',
    question_type_id: 'd3333333-3333-3333-3333-333333333333',
    marks_id: 'e0000015-0000-0000-0000-000000000015',
    mark_value: 15,
    question_text: 'Design a Java Swing GUI application for a Student Grade Calculator with ActionListener implementation, JFrame, JTextField, and JButton controls.'
  }
];

export const INITIAL_EXAM_TEMPLATES: ExamTemplate[] = [
  {
    id: 'f1111111-1111-1111-1111-111111111111',
    title: 'End Semester Examination Template (100 Marks)',
    department_id: '11111111-1111-1111-1111-111111111111',
    course_id: 'c1111111-1111-1111-1111-111111111111',
    total_marks: 100,
    duration_minutes: 180,
    instructions: [
      'Answer all questions.',
      'Part A consists of 10 MCQs carrying 1 mark each.',
      'Part B consists of 5 Short Answer Questions carrying 2 marks each.',
      'Part C consists of 4 Long Answer Questions with OR pattern carrying 15 marks each.',
      'Part D consists of 1 Comprehensive Design Question carrying 20 marks.'
    ],
    sections: [
      { id: 'f0000001-0000-0000-0000-000000000001', template_id: 'f1111111-1111-1111-1111-111111111111', section_name: 'PART - A', section_order: 1, num_questions: 10, marks_per_question: 1, question_type_id: 'd1111111-1111-1111-1111-111111111111', has_or_pattern: false },
      { id: 'f0000002-0000-0000-0000-000000000002', template_id: 'f1111111-1111-1111-1111-111111111111', section_name: 'PART - B', section_order: 2, num_questions: 5, marks_per_question: 2, question_type_id: 'd2222222-2222-2222-2222-222222222222', has_or_pattern: false },
      { id: 'f0000003-0000-0000-0000-000000000003', template_id: 'f1111111-1111-1111-1111-111111111111', section_name: 'PART - C', section_order: 3, num_questions: 4, marks_per_question: 15, question_type_id: 'd3333333-3333-3333-3333-333333333333', has_or_pattern: true },
      { id: 'f0000004-0000-0000-0000-000000000004', template_id: 'f1111111-1111-1111-1111-111111111111', section_name: 'PART - D', section_order: 4, num_questions: 1, marks_per_question: 20, question_type_id: 'd3333333-3333-3333-3333-333333333333', has_or_pattern: false }
    ]
  }
];

export const INITIAL_GENERATED_PAPERS: GeneratedPaper[] = [];
