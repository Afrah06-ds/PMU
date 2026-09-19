const COURSE_ID = 'c0000601-0000-4000-8000-000000000601';
const DEPT_ID = 'd3badb28-42c1-4fe6-be2e-94ce46161cac';
const MODULE_ID = 'b0000601-0002-4000-8000-000000000002';

const CO_IDS = {
  CO2: 'ca000601-0002-4000-8000-000000000002'
};

const K_IDS = {
  K1: 'e1111111-1111-1111-1111-111111111111',
  K2: 'e2222222-2222-2222-2222-222222222222',
  K3: 'e3333333-3333-3333-3333-333333333333',
  K4: 'e4444444-4444-4444-4444-444444444444'
};

const TYPE_IDS = {
  MCQ: 'd1111111-1111-1111-1111-111111111111',
  SHORT: 'd2222222-2222-2222-2222-222222222222',
  LONG: 'd3333333-3333-3333-3333-333333333333'
};

const MARK_IDS = {
  1: 'e0000001-0000-0000-0000-000000000001',
  2: 'e0000002-0000-0000-0000-000000000002',
  10: 'e0000010-0000-0000-0000-000000000010',
  15: 'e0000015-0000-0000-0000-000000000015'
};

const module2Questions = [
  // SECTION A: Objective Type Questions (Q1 - Q30)
  {
    id: 'xds601-u2-a-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 1,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Cluster computing refers to ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Single computer processing', is_correct: false },
      { option_letter: 'b', option_text: 'Group of interconnected computers working together', is_correct: true },
      { option_letter: 'c', option_text: 'Cloud storage', is_correct: false },
      { option_letter: 'd', option_text: 'Database clustering only', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 2,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'The main goal of cluster computing is ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Data visualization', is_correct: false },
      { option_letter: 'b', option_text: 'High performance computing', is_correct: true },
      { option_letter: 'c', option_text: 'Data compression', is_correct: false },
      { option_letter: 'd', option_text: 'Data deletion', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 3,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Distributed computing systems share ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Data and resources', is_correct: true },
      { option_letter: 'b', option_text: 'Hardware only', is_correct: false },
      { option_letter: 'c', option_text: 'Software only', is_correct: false },
      { option_letter: 'd', option_text: 'Networks only', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 4,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'A distributed file system allows data to be stored across ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Single computer', is_correct: false },
      { option_letter: 'b', option_text: 'Multiple machines', is_correct: true },
      { option_letter: 'c', option_text: 'Only servers', is_correct: false },
      { option_letter: 'd', option_text: 'Only clients', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 5,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Which of the following is an example of a distributed file system?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'HDFS', is_correct: true },
      { option_letter: 'b', option_text: 'NTFS', is_correct: false },
      { option_letter: 'c', option_text: 'FAT32', is_correct: false },
      { option_letter: 'd', option_text: 'ext4', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 6,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Relational databases store data in the form of ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Graphs', is_correct: false },
      { option_letter: 'b', option_text: 'Tables', is_correct: true },
      { option_letter: 'c', option_text: 'Documents', is_correct: false },
      { option_letter: 'd', option_text: 'Key-value pairs', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-07',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 7,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'NoSQL databases are mainly designed to handle ______.',
    key_answer: '(c)',
    options: [
      { option_letter: 'a', option_text: 'Small data', is_correct: false },
      { option_letter: 'b', option_text: 'Structured data only', is_correct: false },
      { option_letter: 'c', option_text: 'Big and unstructured data', is_correct: true },
      { option_letter: 'd', option_text: 'Temporary data', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-08',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 8,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Which of the following is a NoSQL database?',
    key_answer: '(c)',
    options: [
      { option_letter: 'a', option_text: 'MySQL', is_correct: false },
      { option_letter: 'b', option_text: 'Oracle', is_correct: false },
      { option_letter: 'c', option_text: 'MongoDB', is_correct: true },
      { option_letter: 'd', option_text: 'SQL Server', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 9,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'MongoDB stores data in the form of ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Tables', is_correct: false },
      { option_letter: 'b', option_text: 'Documents', is_correct: true },
      { option_letter: 'c', option_text: 'Rows', is_correct: false },
      { option_letter: 'd', option_text: 'Columns', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 10,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Cassandra is mainly a ______ database.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Relational', is_correct: false },
      { option_letter: 'b', option_text: 'Column-oriented NoSQL', is_correct: true },
      { option_letter: 'c', option_text: 'Graph database', is_correct: false },
      { option_letter: 'd', option_text: 'Hierarchical database', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-11',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 11,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'NoSQL architecture mainly focuses on ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Scalability and flexibility', is_correct: true },
      { option_letter: 'b', option_text: 'Data normalization', is_correct: false },
      { option_letter: 'c', option_text: 'Fixed schema', is_correct: false },
      { option_letter: 'd', option_text: 'Small datasets', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-12',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 12,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Scaling up means ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Adding more machines', is_correct: false },
      { option_letter: 'b', option_text: 'Increasing hardware power of one machine', is_correct: true },
      { option_letter: 'c', option_text: 'Reducing storage', is_correct: false },
      { option_letter: 'd', option_text: 'Deleting nodes', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-13',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 13,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Scaling out means ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Increasing CPU speed', is_correct: false },
      { option_letter: 'b', option_text: 'Adding more machines to system', is_correct: true },
      { option_letter: 'c', option_text: 'Increasing RAM only', is_correct: false },
      { option_letter: 'd', option_text: 'Reducing cluster size', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-14',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 14,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Sharding is used to ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Backup data', is_correct: false },
      { option_letter: 'b', option_text: 'Partition large databases', is_correct: true },
      { option_letter: 'c', option_text: 'Delete data', is_correct: false },
      { option_letter: 'd', option_text: 'Compress files', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-15',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 15,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Replication in databases is used for ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Data backup and availability', is_correct: true },
      { option_letter: 'b', option_text: 'Data deletion', is_correct: false },
      { option_letter: 'c', option_text: 'Data compression', is_correct: false },
      { option_letter: 'd', option_text: 'Data encryption', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-16',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 16,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'In master-slave architecture, the master node ______.',
    key_answer: '(c)',
    options: [
      { option_letter: 'a', option_text: 'Stores backup only', is_correct: false },
      { option_letter: 'b', option_text: 'Handles read operations only', is_correct: false },
      { option_letter: 'c', option_text: 'Handles write operations', is_correct: true },
      { option_letter: 'd', option_text: 'Deletes data', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-17',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 17,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Peer-to-peer replication means ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'One master and many slaves', is_correct: false },
      { option_letter: 'b', option_text: 'All nodes act equally', is_correct: true },
      { option_letter: 'c', option_text: 'Only two nodes communicate', is_correct: false },
      { option_letter: 'd', option_text: 'Only client-server model', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-18',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 18,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'The CAP theorem was proposed by ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Eric Brewer', is_correct: true },
      { option_letter: 'b', option_text: 'Bill Gates', is_correct: false },
      { option_letter: 'c', option_text: 'Tim Berners-Lee', is_correct: false },
      { option_letter: 'd', option_text: 'Larry Page', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-19',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 19,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'CAP theorem includes ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Consistency, Availability, Partition tolerance', is_correct: true },
      { option_letter: 'b', option_text: 'Capacity, Access, Processing', is_correct: false },
      { option_letter: 'c', option_text: 'Consistency, Accuracy, Performance', is_correct: false },
      { option_letter: 'd', option_text: 'Control, Access, Protection', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-20',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 20,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Consistency in CAP theorem means ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Data is identical across nodes', is_correct: true },
      { option_letter: 'b', option_text: 'Data stored locally', is_correct: false },
      { option_letter: 'c', option_text: 'Data deleted automatically', is_correct: false },
      { option_letter: 'd', option_text: 'Data compressed', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-21',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 21,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Availability means ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'System always responds to requests', is_correct: true },
      { option_letter: 'b', option_text: 'Data replication only', is_correct: false },
      { option_letter: 'c', option_text: 'Node shutdown', is_correct: false },
      { option_letter: 'd', option_text: 'Network partition', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-22',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 22,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Partition tolerance means ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'System continues despite network failures', is_correct: true },
      { option_letter: 'b', option_text: 'Data compression', is_correct: false },
      { option_letter: 'c', option_text: 'File deletion', is_correct: false },
      { option_letter: 'd', option_text: 'Database locking', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-23',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 23,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'ACID properties are mainly used in ______ databases.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'NoSQL', is_correct: false },
      { option_letter: 'b', option_text: 'Relational', is_correct: true },
      { option_letter: 'c', option_text: 'Graph', is_correct: false },
      { option_letter: 'd', option_text: 'Document', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-24',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 24,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'ACID stands for ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Atomicity, Consistency, Isolation, Durability', is_correct: true },
      { option_letter: 'b', option_text: 'Accuracy, Consistency, Integration, Data', is_correct: false },
      { option_letter: 'c', option_text: 'Access, Control, Integrity, Data', is_correct: false },
      { option_letter: 'd', option_text: 'Atomicity, Clustering, Integration, Durability', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-25',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 25,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Atomicity ensures that ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Transactions are completed fully or not at all', is_correct: true },
      { option_letter: 'b', option_text: 'Data stored once', is_correct: false },
      { option_letter: 'c', option_text: 'Data compressed', is_correct: false },
      { option_letter: 'd', option_text: 'Data deleted', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-26',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 26,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'BASE model is commonly associated with ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Relational databases', is_correct: false },
      { option_letter: 'b', option_text: 'NoSQL databases', is_correct: true },
      { option_letter: 'c', option_text: 'File systems', is_correct: false },
      { option_letter: 'd', option_text: 'Operating systems', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-27',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 27,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'BASE stands for ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Basically Available, Soft state, Eventually consistent', is_correct: true },
      { option_letter: 'b', option_text: 'Basic Access Storage Engine', is_correct: false },
      { option_letter: 'c', option_text: 'Binary Access Storage Engine', is_correct: false },
      { option_letter: 'd', option_text: 'Basic Atomic Storage Entity', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-28',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 28,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Soft state in BASE means ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Data state may change over time', is_correct: true },
      { option_letter: 'b', option_text: 'Data never changes', is_correct: false },
      { option_letter: 'c', option_text: 'Data is deleted', is_correct: false },
      { option_letter: 'd', option_text: 'Data is compressed', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-29',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 29,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Eventually consistent means ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Immediate consistency', is_correct: false },
      { option_letter: 'b', option_text: 'Data becomes consistent over time', is_correct: true },
      { option_letter: 'c', option_text: 'No consistency', is_correct: false },
      { option_letter: 'd', option_text: 'Permanent inconsistency', is_correct: false }
    ]
  },
  {
    id: 'xds601-u2-a-30',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 30,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'NoSQL systems prefer ______ model over ACID.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'BASE', is_correct: true },
      { option_letter: 'b', option_text: 'CAP', is_correct: false },
      { option_letter: 'c', option_text: 'SQL', is_correct: false },
      { option_letter: 'd', option_text: 'OLAP', is_correct: false }
    ]
  },

  // SECTION B: Short Answers Questions (Q1 - Q15)
  {
    id: 'xds601-u2-b-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 1,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Define Cluster Computing.',
    key_answer: 'A group of interconnected computers working together as a single system to perform tasks.'
  },
  {
    id: 'xds601-u2-b-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 2,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'What is a distributed computing model?',
    key_answer: 'A model where multiple computers share resources and work together to complete tasks.'
  },
  {
    id: 'xds601-u2-b-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 3,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'What is a distributed file system?',
    key_answer: 'A file system that stores and manages data across multiple machines in a network.'
  },
  {
    id: 'xds601-u2-b-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 4,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'State the difference between relational and non-relational databases.',
    key_answer: 'Relational databases use tables and fixed schema; non-relational databases use flexible schema and store unstructured data.'
  },
  {
    id: 'xds601-u2-b-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 5,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'What is NoSQL?',
    key_answer: 'A type of database designed to handle large volumes of structured, semi-structured, and unstructured data.'
  },
  {
    id: 'xds601-u2-b-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 6,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'List any two NoSQL databases.',
    key_answer: 'MongoDB and Cassandra.'
  },
  {
    id: 'xds601-u2-b-07',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 7,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Define MongoDB.',
    key_answer: 'A document-oriented NoSQL database that stores data in JSON-like documents.'
  },
  {
    id: 'xds601-u2-b-08',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 8,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'What is Cassandra database?',
    key_answer: 'A distributed column-oriented NoSQL database designed for high scalability and availability.'
  },
  {
    id: 'xds601-u2-b-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 9,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'What is meant by scaling up?',
    key_answer: 'Increasing the hardware capacity (CPU, RAM, storage) of a single machine.'
  },
  {
    id: 'xds601-u2-b-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 10,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'What is scaling out?',
    key_answer: 'Adding more machines or nodes to a system to increase capacity.'
  },
  {
    id: 'xds601-u2-b-11',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 11,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Define sharding in databases.',
    key_answer: 'A technique of splitting a large database into smaller parts called shards across multiple servers.'
  },
  {
    id: 'xds601-u2-b-12',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 12,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'What is replication in distributed databases?',
    key_answer: 'The process of copying and maintaining the same data across multiple database servers.'
  },
  {
    id: 'xds601-u2-b-13',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 13,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'State the CAP theorem.',
    key_answer: 'A distributed system can guarantee only two of the three: Consistency, Availability, and Partition Tolerance.'
  },
  {
    id: 'xds601-u2-b-14',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 14,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'List the ACID properties.',
    key_answer: 'Atomicity, Consistency, Isolation, Durability.'
  },
  {
    id: 'xds601-u2-b-15',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 15,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'What is the BASE model?',
    key_answer: 'A NoSQL model meaning Basically Available, Soft state, Eventually consistent.'
  },

  // SECTION C: Descriptive Questions (Q1 - Q10)
  {
    id: 'xds601-u2-c-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 1,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Explain the concept of cluster computing and distributed computing models.',
    evaluation_scheme: `K2 (60% = 10 Marks)
Concept of computing models:
• Definition of cluster computing
• Definition of distributed computing
• Basic architecture and purpose
K2 (40% = 5 Marks)
Examples and differences between cluster and distributed systems`
  },
  {
    id: 'xds601-u2-c-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[10],
    mark_value: 10,
    section_type: 'SECTION_C',
    q_no: 2,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Describe file systems and distributed file systems with examples.',
    evaluation_scheme: `K2 (60% = 6 Marks)
Concept of file systems:
• Traditional file system definition
• Data storage and organization
K4 (40% = 4 Marks)
Distributed file systems:
• Concept and advantages
• Examples such as HDFS and Google File System`
  },
  {
    id: 'xds601-u2-c-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 3,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Compare relational and NoSQL databases with advantages and limitations.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of database models:
• Relational databases
• NoSQL databases
K4 (40% = 6 Marks)
Comparison aspects:
• Data structure
• Scalability
K4 (20% = 3 Mark)
Advantages and limitations`
  },
  {
    id: 'xds601-u2-c-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 4,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Explain the NoSQL data architecture and its importance in managing Big Data.',
    evaluation_scheme: `K2 (40% = 7 Marks)
Concept of NoSQL architecture:
• Non-relational data storage
• Flexible schema
K4 (40% = 5 Marks)
Types of NoSQL databases:
• Key-value stores
• Document databases
• Column-family stores
K4 (20% = 3 Mark)
Importance in Big Data management`
  },
  {
    id: 'xds601-u2-c-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[10],
    mark_value: 10,
    section_type: 'SECTION_C',
    q_no: 5,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Discuss how MongoDB and Cassandra are used for managing Big Data.',
    evaluation_scheme: `K2 (40% = 4 Marks)
Concept of Big Data databases:
• Role of NoSQL databases
K4 (40% = 4 Marks)
Explanation of:
• MongoDB (document-oriented database)
• Cassandra (column-family database)
K4 (20% = 2 Mark)
Applications in Big Data management`
  },
  {
    id: 'xds601-u2-c-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[10],
    mark_value: 10,
    section_type: 'SECTION_C',
    q_no: 6,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Explain the concepts of scaling up and scaling out storage systems.',
    evaluation_scheme: `K2 (40% = 4 Marks)
Concept of scalability in storage systems:
• Need for scalable systems
K4 (40% = 4 Marks)
Types of scaling:
• Scaling up (vertical scaling)
• Scaling out (horizontal scaling)
K4 (20% = 2 Marks)
Examples and comparison`
  },
  {
    id: 'xds601-u2-c-07',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[10],
    mark_value: 10,
    section_type: 'SECTION_C',
    q_no: 7,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Describe database sharding and replication techniques including master-slave and peer-to-peer models.',
    evaluation_scheme: `K2 (40% = 4 Marks)
Concept of database sharding:
• Partitioning of large databases
• Distribution of data across servers
K4 (40% = 4 Marks)
Replication techniques:
• Master–slave replication
• Peer-to-peer replication
K4 (20% = 2 Marks)
Advantages of sharding and replication`
  },
  {
    id: 'xds601-u2-c-08',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[10],
    mark_value: 10,
    section_type: 'SECTION_C',
    q_no: 8,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Explain the CAP theorem and its significance in distributed systems.',
    evaluation_scheme: `K2 (40% = 4 Marks)
Concept of CAP theorem:
• Consistency
• Availability
• Partition tolerance
K4 (40% = 4 Marks)
Trade-offs in distributed systems:
• CP systems
• AP systems
K4 (20% = 2 Marks)
Importance in designing distributed databases`
  },
  {
    id: 'xds601-u2-c-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[10],
    mark_value: 10,
    section_type: 'SECTION_C',
    q_no: 9,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Discuss the ACID properties in relational databases with examples.',
    evaluation_scheme: `K2 (40% = 4 Marks)
Concept of ACID properties:
• Importance in database transactions
K2 (40% = 4 Marks)
Explanation of ACID:
• Atomicity
• Consistency
• Isolation
• Durability
K2 (20% = 2 Marks)
Example illustrating ACID in relational databases`
  },
  {
    id: 'xds601-u2-c-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[10],
    mark_value: 10,
    section_type: 'SECTION_C',
    q_no: 10,
    unit_name: 'BIG DATA STORAGE CONCEPTS',
    question_text: 'Compare ACID and BASE models in database systems.',
    evaluation_scheme: `K2 (40% = 4 Marks)
Concept of database consistency models:
• ACID model
• BASE model
K4 (40% = 4 Marks)
Comparison factors:
• Transaction guarantees
• Consistency approach
• System performance
K4 (20% = 2 Marks)
Applications in relational and NoSQL databases`
  }
];

module.exports = module2Questions;
