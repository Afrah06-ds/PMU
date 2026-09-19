const COURSE_ID = 'c0000601-0000-4000-8000-000000000601';
const DEPT_ID = 'd3badb28-42c1-4fe6-be2e-94ce46161cac';
const MODULE_ID = 'b0000601-0004-4000-8000-000000000004';

const CO_IDS = {
  CO3: 'ca000601-0003-4000-8000-000000000003'
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
  15: 'e0000015-0000-0000-0000-000000000015'
};

const module4Questions = [
  // SECTION A: Objective Type Questions (Q1 - Q30)
  {
    id: 'xds601-u4-a-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 1,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'MapReduce is a programming model used for ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Data visualization', is_correct: false },
      { option_letter: 'b', option_text: 'Distributed data processing', is_correct: true },
      { option_letter: 'c', option_text: 'Web development', is_correct: false },
      { option_letter: 'd', option_text: 'Network security', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 2,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'In MapReduce, the ______ function processes input data and produces intermediate key-value pairs.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Reduce', is_correct: false },
      { option_letter: 'b', option_text: 'Map', is_correct: true },
      { option_letter: 'c', option_text: 'Sort', is_correct: false },
      { option_letter: 'd', option_text: 'Combine', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 3,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'The Reduce function in MapReduce is responsible for ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Data storage', is_correct: false },
      { option_letter: 'b', option_text: 'Aggregating intermediate results', is_correct: true },
      { option_letter: 'c', option_text: 'Data visualization', is_correct: false },
      { option_letter: 'd', option_text: 'Data encryption', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 4,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'The output of the Map function is in the form of ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Tables', is_correct: false },
      { option_letter: 'b', option_text: 'Key-value pairs', is_correct: true },
      { option_letter: 'c', option_text: 'Graphs', is_correct: false },
      { option_letter: 'd', option_text: 'Arrays', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 5,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Which step occurs between Map and Reduce phases?',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Compilation', is_correct: false },
      { option_letter: 'b', option_text: 'Shuffle and Sort', is_correct: true },
      { option_letter: 'c', option_text: 'Encryption', is_correct: false },
      { option_letter: 'd', option_text: 'Formatting', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 6,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'MapReduce framework is mainly used with ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'MySQL', is_correct: false },
      { option_letter: 'b', option_text: 'HDFS', is_correct: true },
      { option_letter: 'c', option_text: 'Oracle', is_correct: false },
      { option_letter: 'd', option_text: 'Excel', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-07',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 7,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Fault tolerance in Hadoop MapReduce is achieved by ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Task replication', is_correct: true },
      { option_letter: 'b', option_text: 'Ignoring errors', is_correct: false },
      { option_letter: 'c', option_text: 'Manual recovery', is_correct: false },
      { option_letter: 'd', option_text: 'Disabling nodes', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-08',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 8,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'The main advantage of MapReduce is ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Real-time analytics', is_correct: false },
      { option_letter: 'b', option_text: 'Parallel processing', is_correct: true },
      { option_letter: 'c', option_text: 'Low storage', is_correct: false },
      { option_letter: 'd', option_text: 'Limited scalability', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 9,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Hive is a ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Programming language', is_correct: false },
      { option_letter: 'b', option_text: 'Data warehouse infrastructure', is_correct: true },
      { option_letter: 'c', option_text: 'Operating system', is_correct: false },
      { option_letter: 'd', option_text: 'Visualization tool', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 10,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Hive runs on top of ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'HDFS', is_correct: true },
      { option_letter: 'b', option_text: 'Windows', is_correct: false },
      { option_letter: 'c', option_text: 'Linux Kernel', is_correct: false },
      { option_letter: 'd', option_text: 'SQL Server', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-11',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 11,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'The query language used in Hive is ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'SQL+', is_correct: false },
      { option_letter: 'b', option_text: 'HiveQL', is_correct: true },
      { option_letter: 'c', option_text: 'PigQL', is_correct: false },
      { option_letter: 'd', option_text: 'MapQL', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-12',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 12,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'HiveQL is similar to ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Java', is_correct: false },
      { option_letter: 'b', option_text: 'SQL', is_correct: true },
      { option_letter: 'c', option_text: 'Python', is_correct: false },
      { option_letter: 'd', option_text: 'C++', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-13',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 13,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Which command is used to create tables in Hive?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'CREATE TABLE', is_correct: true },
      { option_letter: 'b', option_text: 'INSERT TABLE', is_correct: false },
      { option_letter: 'c', option_text: 'ADD TABLE', is_correct: false },
      { option_letter: 'd', option_text: 'MAKE TABLE', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-14',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 14,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Hive supports which type of operations?',
    key_answer: '(d)',
    options: [
      { option_letter: 'a', option_text: 'DDL', is_correct: false },
      { option_letter: 'b', option_text: 'DML', is_correct: false },
      { option_letter: 'c', option_text: 'Querying', is_correct: false },
      { option_letter: 'd', option_text: 'All of the above', is_correct: true }
    ]
  },
  {
    id: 'xds601-u4-a-15',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 15,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'The clause used to combine rows from multiple tables is ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'GROUP BY', is_correct: false },
      { option_letter: 'b', option_text: 'JOIN', is_correct: true },
      { option_letter: 'c', option_text: 'ORDER BY', is_correct: false },
      { option_letter: 'd', option_text: 'LIMIT', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-16',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 16,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Which clause groups rows that have the same values?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'GROUP BY', is_correct: true },
      { option_letter: 'b', option_text: 'JOIN', is_correct: false },
      { option_letter: 'c', option_text: 'WHERE', is_correct: false },
      { option_letter: 'd', option_text: 'SORT', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-17',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 17,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Hive tables are stored in ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Local file system', is_correct: false },
      { option_letter: 'b', option_text: 'HDFS', is_correct: true },
      { option_letter: 'c', option_text: 'RAM', is_correct: false },
      { option_letter: 'd', option_text: 'Cache', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-18',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 18,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Apache Pig is a ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Query language', is_correct: false },
      { option_letter: 'b', option_text: 'High-level platform for analyzing large datasets', is_correct: true },
      { option_letter: 'c', option_text: 'Database', is_correct: false },
      { option_letter: 'd', option_text: 'Hardware tool', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-19',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 19,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'The scripting language used in Apache Pig is ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Pig Latin', is_correct: true },
      { option_letter: 'b', option_text: 'HiveQL', is_correct: false },
      { option_letter: 'c', option_text: 'SQL', is_correct: false },
      { option_letter: 'd', option_text: 'Python', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-20',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 20,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Pig Latin is designed to simplify ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'MapReduce programming', is_correct: true },
      { option_letter: 'b', option_text: 'Database design', is_correct: false },
      { option_letter: 'c', option_text: 'Web development', is_correct: false },
      { option_letter: 'd', option_text: 'Network security', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-21',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 21,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Pig Latin data model supports ______.',
    key_answer: '(d)',
    options: [
      { option_letter: 'a', option_text: 'Atom', is_correct: false },
      { option_letter: 'b', option_text: 'Tuple', is_correct: false },
      { option_letter: 'c', option_text: 'Bag', is_correct: false },
      { option_letter: 'd', option_text: 'All of the above', is_correct: true }
    ]
  },
  {
    id: 'xds601-u4-a-22',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 22,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'A collection of tuples in Pig is called ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Atom', is_correct: false },
      { option_letter: 'b', option_text: 'Bag', is_correct: true },
      { option_letter: 'c', option_text: 'Record', is_correct: false },
      { option_letter: 'd', option_text: 'Field', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-23',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 23,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Pig scripts are executed using ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Pig interpreter', is_correct: true },
      { option_letter: 'b', option_text: 'Java compiler', is_correct: false },
      { option_letter: 'c', option_text: 'SQL engine', is_correct: false },
      { option_letter: 'd', option_text: 'Browser', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-24',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 24,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Pig can run in ______ modes.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Local and MapReduce', is_correct: true },
      { option_letter: 'b', option_text: 'Manual and Automatic', is_correct: false },
      { option_letter: 'c', option_text: 'Online and Offline', is_correct: false },
      { option_letter: 'd', option_text: 'Static and Dynamic', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-25',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 25,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Which operation is used to filter data in Pig?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'FILTER', is_correct: true },
      { option_letter: 'b', option_text: 'SELECT', is_correct: false },
      { option_letter: 'c', option_text: 'LIMIT', is_correct: false },
      { option_letter: 'd', option_text: 'INSERT', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-26',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 26,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'MapReduce jobs are written primarily in ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Java', is_correct: true },
      { option_letter: 'b', option_text: 'HTML', is_correct: false },
      { option_letter: 'c', option_text: 'CSS', is_correct: false },
      { option_letter: 'd', option_text: 'PHP', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-27',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 27,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Which component manages the scheduling of MapReduce jobs?',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'HDFS', is_correct: false },
      { option_letter: 'b', option_text: 'YARN', is_correct: true },
      { option_letter: 'c', option_text: 'Pig', is_correct: false },
      { option_letter: 'd', option_text: 'Hive', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-28',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 28,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Hive converts HiveQL queries into ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'MapReduce jobs', is_correct: true },
      { option_letter: 'b', option_text: 'Python scripts', is_correct: false },
      { option_letter: 'c', option_text: 'HTML code', is_correct: false },
      { option_letter: 'd', option_text: 'JSON files', is_correct: false }
    ]
  },
  {
    id: 'xds601-u4-a-29',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 29,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Pig is mainly used by ______.',
    key_answer: '(d)',
    options: [
      { option_letter: 'a', option_text: 'Data analysts', is_correct: false },
      { option_letter: 'b', option_text: 'Data scientists', is_correct: false },
      { option_letter: 'c', option_text: 'Programmers', is_correct: false },
      { option_letter: 'd', option_text: 'All of the above', is_correct: true }
    ]
  },
  {
    id: 'xds601-u4-a-30',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 30,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Which tool provides a high-level abstraction over MapReduce?',
    key_answer: '(c)',
    options: [
      { option_letter: 'a', option_text: 'Hive', is_correct: false },
      { option_letter: 'b', option_text: 'Pig', is_correct: false },
      { option_letter: 'c', option_text: 'Both (a) and (b)', is_correct: true },
      { option_letter: 'd', option_text: 'None', is_correct: false }
    ]
  },

  // SECTION B: Short Answers Questions (Q1 - Q15)
  {
    id: 'xds601-u4-b-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 1,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Define MapReduce.',
    key_answer: 'A programming model used to process large datasets in parallel across distributed clusters.'
  },
  {
    id: 'xds601-u4-b-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 2,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'What are the two main phases of MapReduce?',
    key_answer: 'Map phase and Reduce phase.'
  },
  {
    id: 'xds601-u4-b-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 3,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'What is the role of the Map function?',
    key_answer: 'It processes input data and converts it into intermediate key-value pairs.'
  },
  {
    id: 'xds601-u4-b-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 4,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Explain the Reduce function in MapReduce.',
    key_answer: 'It aggregates and processes intermediate key-value pairs to produce final output.'
  },
  {
    id: 'xds601-u4-b-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 5,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'What is shuffle and sort in MapReduce?',
    key_answer: 'The phase that transfers map output to reducers and sorts data by key.'
  },
  {
    id: 'xds601-u4-b-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 6,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'What is fault tolerance in Hadoop?',
    key_answer: 'The ability of Hadoop to continue operation even if some nodes fail.'
  },
  {
    id: 'xds601-u4-b-07',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 7,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Define Hive.',
    key_answer: 'A data warehouse tool used to query and analyze big data stored in Hadoop.'
  },
  {
    id: 'xds601-u4-b-08',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 8,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'What is HiveQL?',
    key_answer: 'A SQL-like query language used to query data in Hive.'
  },
  {
    id: 'xds601-u4-b-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 9,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'List any two Hive data types.',
    key_answer: 'INT and STRING.'
  },
  {
    id: 'xds601-u4-b-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 10,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'What is the use of the GROUP BY clause in Hive?',
    key_answer: 'It groups rows with the same values to perform aggregate operations.'
  },
  {
    id: 'xds601-u4-b-11',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 11,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'What is Apache Pig?',
    key_answer: 'A high-level platform used to analyze large datasets in Hadoop.'
  },
  {
    id: 'xds601-u4-b-12',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 12,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'What is Pig Latin?',
    key_answer: 'A scripting language used in Apache Pig for data analysis.'
  },
  {
    id: 'xds601-u4-b-13',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 13,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'List the components of Pig data model.',
    key_answer: 'Atom, Tuple, Bag, Map.'
  },
  {
    id: 'xds601-u4-b-14',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 14,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'What are the execution modes of Pig?',
    key_answer: 'Local mode and MapReduce (Hadoop) mode.'
  },
  {
    id: 'xds601-u4-b-15',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 15,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Mention two advantages of using Pig.',
    key_answer: 'Easy to write data analysis programs and supports large-scale data processing.'
  },

  // SECTION C: Descriptive Questions (Q1 - Q10)
  {
    id: 'xds601-u4-c-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 1,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Explain the MapReduce programming model with a neat diagram.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of MapReduce programming model:
• Distributed data processing framework
• Parallel computation on large datasets
• Key-value pair processing
K3 (40% = 6 Marks)
Explanation of Map and Reduce functions:
• Map phase processing
• Shuffle and sort phase
• Reduce phase aggregation
K3 (20% = 3 Marks)
Neat diagram representing MapReduce workflow`
  },
  {
    id: 'xds601-u4-c-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 2,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Describe the processing steps involved in MapReduce.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Overview of MapReduce processing:
• Input data splitting
• Distribution across cluster nodes
K2 (40% = 6 Marks)
Detailed processing steps:
• Map phase execution
• Shuffle and sort process
• Reduce phase computation
K2 (20% = 3 Marks)
Output generation and storage in HDFS`
  },
  {
    id: 'xds601-u4-c-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 3,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Explain how MapReduce handles node failures and ensures fault tolerance.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of fault tolerance in Hadoop:
• Need for reliability in distributed systems
• Handling hardware failures
K3 (40% = 6 Marks)
Mechanisms used in MapReduce:
• Task re-execution on another node
• Data replication in HDFS
• Job tracking and monitoring
K3 (20% = 3 Marks)
Example illustrating fault tolerance`
  },
  {
    id: 'xds601-u4-c-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 4,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Discuss the architecture and workflow of Hive.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Apache Hive:
• Data warehouse framework on Hadoop
• SQL-like query interface
K3 (40% = 6 Marks)
Hive architecture components:
• Hive client
• Driver
• Compiler
• Metastore
• Execution engine
K3 (20% = 3 Marks)
Workflow from query submission to execution`
  },
  {
    id: 'xds601-u4-c-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 5,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Explain HiveQL with examples of DDL and DML commands.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of HiveQL:
• SQL-like query language used in Hive
• Used for querying and managing data in Hadoop
K3 (40% = 6 Marks)
DDL commands examples:
• CREATE TABLE
• DROP TABLE
• ALTER TABLE
K3 (20% = 3 Marks)
DML commands examples:
• SELECT
• INSERT
• LOAD DATA`
  },
  {
    id: 'xds601-u4-c-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 6,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Describe the Hive data model, data types, and file formats.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Hive data model:
• Databases
• Tables and partitions
• Buckets
K2 (40% = 6 Marks)
Hive data types:
• Primitive types (int, string, float)
• Complex types (array, map, struct)
K2 (20% = 3 Marks)
Hive file formats:
• Text file
• ORC
• Parquet`
  },
  {
    id: 'xds601-u4-c-07',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 7,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Explain the concepts of Join, Aggregation, and Group By in HiveQL.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Join operations:
• Inner join
• Left and right join
K3 (40% = 6 Marks)
Aggregation functions:
• COUNT
• SUM
• AVG
K3 (20% = 3 Marks)
Group By clause with example`
  },
  {
    id: 'xds601-u4-c-08',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 8,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Discuss Apache Pig architecture and features.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Apache Pig:
• High-level platform for Big Data processing
• Pig Latin scripting language
K2 (40% = 6 Marks)
Pig architecture components:
• Pig Latin scripts
• Parser
• Optimizer
• Execution engine
K2 (20% = 3 Marks)
Key features of Pig`
  },
  {
    id: 'xds601-u4-c-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 9,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Explain the Pig Latin data model with suitable examples.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Pig Latin data model:
• Data processing language for Hadoop
K3 (40% = 6 Marks)
Data model components:
• Atom
• Tuple
• Bag
• Map
K3 (20% = 3 Marks)
Examples illustrating Pig Latin data structures`
  },
  {
    id: 'xds601-u4-c-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 10,
    unit_name: 'MAP-REDUCE, HIVE and PIG',
    question_text: 'Describe the steps involved in developing and executing Pig scripts.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Pig scripting:
• Writing data processing scripts using Pig Latin
K3 (40% = 6 Marks)
Steps in Pig script development:
• Writing script
• Loading data
• Performing transformations
K3 (20% = 3 Marks)
Execution modes:
• Local mode
• Hadoop mode`
  }
];

module.exports = module4Questions;
