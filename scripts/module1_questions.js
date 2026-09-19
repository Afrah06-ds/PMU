const COURSE_ID = 'c0000601-0000-4000-8000-000000000601';
const DEPT_ID = 'd3badb28-42c1-4fe6-be2e-94ce46161cac';
const MODULE_ID = 'b0000601-0001-4000-8000-000000000001';

const CO_IDS = {
  CO1: 'ca000601-0001-4000-8000-000000000001',
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
  7: '059bb17e-652c-426c-a4f3-b96c5041b55b',
  8: '45f67068-e9ad-4f5c-b564-be7e54194b85',
  10: 'e0000010-0000-0000-0000-000000000010',
  15: 'e0000015-0000-0000-0000-000000000015'
};

const module1Questions = [
  // SECTION A: Objective Type Questions (Q1 - Q25)
  {
    id: 'xds601-u1-a-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 1,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Big Data is mainly characterized by:',
    key_answer: '(c)',
    options: [
      { option_letter: 'a', option_text: 'Small size', is_correct: false },
      { option_letter: 'b', option_text: 'Structured format only', is_correct: false },
      { option_letter: 'c', option_text: 'Large, complex datasets', is_correct: true },
      { option_letter: 'd', option_text: 'Manual processing', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 2,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'The original 3Vs of Big Data are:',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Volume, Velocity, Variety', is_correct: true },
      { option_letter: 'b', option_text: 'Value, Veracity, Volume', is_correct: false },
      { option_letter: 'c', option_text: 'Velocity, Validity, Variety', is_correct: false },
      { option_letter: 'd', option_text: 'Volume, Visualization, Value', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 3,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Which V refers to speed of data generation?',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Volume', is_correct: false },
      { option_letter: 'b', option_text: 'Velocity', is_correct: true },
      { option_letter: 'c', option_text: 'Variety', is_correct: false },
      { option_letter: 'd', option_text: 'Value', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 4,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Which type of data is stored in tables?',
    key_answer: '(c)',
    options: [
      { option_letter: 'a', option_text: 'Unstructured', is_correct: false },
      { option_letter: 'b', option_text: 'Semi-structured', is_correct: false },
      { option_letter: 'c', option_text: 'Structured', is_correct: true },
      { option_letter: 'd', option_text: 'Multimedia', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 5,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'JSON is an example of:',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Structured data', is_correct: false },
      { option_letter: 'b', option_text: 'Semi-structured data', is_correct: true },
      { option_letter: 'c', option_text: 'Unstructured data', is_correct: false },
      { option_letter: 'd', option_text: 'Binary data', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 6,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Which of the following generates massive real-time data?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'IoT devices', is_correct: true },
      { option_letter: 'b', option_text: 'Typewriter', is_correct: false },
      { option_letter: 'c', option_text: 'Printed books', is_correct: false },
      { option_letter: 'd', option_text: 'Fax machine', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-07',
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
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Big Data cannot be handled effectively by:',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Distributed systems', is_correct: false },
      { option_letter: 'b', option_text: 'Traditional RDBMS alone', is_correct: true },
      { option_letter: 'c', option_text: 'Cloud platforms', is_correct: false },
      { option_letter: 'd', option_text: 'Parallel computing', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-08',
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
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Which platform is widely used for distributed storage?',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'MS Word', is_correct: false },
      { option_letter: 'b', option_text: 'Hadoop Distributed File System', is_correct: true },
      { option_letter: 'c', option_text: 'Paint', is_correct: false },
      { option_letter: 'd', option_text: 'Notepad', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 9,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Data mining is used for:',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Storing data', is_correct: false },
      { option_letter: 'b', option_text: 'Extracting patterns', is_correct: true },
      { option_letter: 'c', option_text: 'Deleting data', is_correct: false },
      { option_letter: 'd', option_text: 'Encrypting data', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 10,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Which of the following is unstructured data?',
    key_answer: '(c)',
    options: [
      { option_letter: 'a', option_text: 'Excel sheet', is_correct: false },
      { option_letter: 'b', option_text: 'SQL table', is_correct: false },
      { option_letter: 'c', option_text: 'Image file', is_correct: true },
      { option_letter: 'd', option_text: 'CSV file', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-11',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 11,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Big Data is measured in:',
    key_answer: '(c)',
    options: [
      { option_letter: 'a', option_text: 'KB only', is_correct: false },
      { option_letter: 'b', option_text: 'MB only', is_correct: false },
      { option_letter: 'c', option_text: 'TB and PB', is_correct: true },
      { option_letter: 'd', option_text: 'Bytes only', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-12',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 12,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Which era led to rapid Big Data growth?',
    key_answer: '(c)',
    options: [
      { option_letter: 'a', option_text: 'Stone Age', is_correct: false },
      { option_letter: 'b', option_text: 'Industrial Age', is_correct: false },
      { option_letter: 'c', option_text: 'Social Media Era', is_correct: true },
      { option_letter: 'd', option_text: 'Agricultural Age', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-13',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 13,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Veracity refers to:',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Data speed', is_correct: false },
      { option_letter: 'b', option_text: 'Data accuracy', is_correct: true },
      { option_letter: 'c', option_text: 'Data size', is_correct: false },
      { option_letter: 'd', option_text: 'Data format', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-14',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 14,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Value in Big Data means:',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Monetary cost', is_correct: false },
      { option_letter: 'b', option_text: 'Business usefulness', is_correct: true },
      { option_letter: 'c', option_text: 'Data type', is_correct: false },
      { option_letter: 'd', option_text: 'Data speed', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-15',
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
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Big Data Life Cycle starts with:',
    key_answer: '(c)',
    options: [
      { option_letter: 'a', option_text: 'Analysis', is_correct: false },
      { option_letter: 'b', option_text: 'Visualization', is_correct: false },
      { option_letter: 'c', option_text: 'Data generation', is_correct: true },
      { option_letter: 'd', option_text: 'Storage', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-16',
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
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Which company uses Big Data for recommendations?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Amazon', is_correct: true },
      { option_letter: 'b', option_text: 'Local grocery shop', is_correct: false },
      { option_letter: 'c', option_text: 'Library', is_correct: false },
      { option_letter: 'd', option_text: 'Post office', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-17',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 17,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Which data type includes videos?',
    key_answer: '(c)',
    options: [
      { option_letter: 'a', option_text: 'Structured', is_correct: false },
      { option_letter: 'b', option_text: 'Semi-structured', is_correct: false },
      { option_letter: 'c', option_text: 'Unstructured', is_correct: true },
      { option_letter: 'd', option_text: 'Tabular', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-18',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 18,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Big Data infrastructure requires:',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Single computer', is_correct: false },
      { option_letter: 'b', option_text: 'Distributed systems', is_correct: true },
      { option_letter: 'c', option_text: 'Paper records', is_correct: false },
      { option_letter: 'd', option_text: 'Manual files', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-19',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 19,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Data Warehouse is mainly used for:',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Gaming', is_correct: false },
      { option_letter: 'b', option_text: 'Data storage & analysis', is_correct: true },
      { option_letter: 'c', option_text: 'Printing', is_correct: false },
      { option_letter: 'd', option_text: 'Editing', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-20',
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
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Cloud platforms support:',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Distributed computing', is_correct: true },
      { option_letter: 'b', option_text: 'Manual storage', is_correct: false },
      { option_letter: 'c', option_text: 'Offline typing', is_correct: false },
      { option_letter: 'd', option_text: 'Paper filing', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-21',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 21,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Variety refers to:',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Data types', is_correct: true },
      { option_letter: 'b', option_text: 'Data speed', is_correct: false },
      { option_letter: 'c', option_text: 'Data size', is_correct: false },
      { option_letter: 'd', option_text: 'Data accuracy', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-22',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 22,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'IoT stands for:',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Internet of Things', is_correct: true },
      { option_letter: 'b', option_text: 'Internal Online Tools', is_correct: false },
      { option_letter: 'c', option_text: 'Integrated Operating Terminal', is_correct: false },
      { option_letter: 'd', option_text: 'Internet of Text', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-23',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 23,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Which is an example of semi-structured data?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'XML', is_correct: true },
      { option_letter: 'b', option_text: 'Image', is_correct: false },
      { option_letter: 'c', option_text: 'Table', is_correct: false },
      { option_letter: 'd', option_text: 'Printed page', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-24',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 24,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Big Data technologies emerged mainly due to:',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Small data growth', is_correct: false },
      { option_letter: 'b', option_text: 'Rapid data explosion', is_correct: true },
      { option_letter: 'c', option_text: 'Decrease in storage', is_correct: false },
      { option_letter: 'd', option_text: 'Less internet use', is_correct: false }
    ]
  },
  {
    id: 'xds601-u1-a-25',
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
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Business Intelligence helps in:',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Decision making', is_correct: true },
      { option_letter: 'b', option_text: 'Cooking', is_correct: false },
      { option_letter: 'c', option_text: 'Printing', is_correct: false },
      { option_letter: 'd', option_text: 'Typing', is_correct: false }
    ]
  },

  // SECTION B: Short Answers Questions (Q1 - Q15)
  {
    id: 'xds601-u1-b-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 1,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Define Big Data.',
    key_answer: 'Very large and complex data sets that require advanced tools for storage and processing.'
  },
  {
    id: 'xds601-u1-b-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 2,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'What are the 3Vs of Big Data?',
    key_answer: 'Volume, Velocity, Variety.'
  },
  {
    id: 'xds601-u1-b-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 3,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Define Volume and Velocity.',
    key_answer: 'Volume – amount of data; Velocity – speed of data generation and processing.'
  },
  {
    id: 'xds601-u1-b-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 4,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'What is structured data?',
    key_answer: 'Data organized in fixed format like rows and columns in databases.'
  },
  {
    id: 'xds601-u1-b-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 5,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'What is unstructured data?',
    key_answer: 'Data without a predefined structure such as videos, images, emails, and social media data.'
  },
  {
    id: 'xds601-u1-b-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 6,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Define Veracity.',
    key_answer: 'The accuracy, reliability, and quality of data.'
  },
  {
    id: 'xds601-u1-b-07',
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
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'What is Big Data Life Cycle?',
    key_answer: 'The stages of data collection, storage, processing, analysis, and visualization.'
  },
  {
    id: 'xds601-u1-b-08',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 8,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Mention any two sources of Big Data.',
    key_answer: 'Social media and sensor/IoT data.'
  },
  {
    id: 'xds601-u1-b-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 9,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'What is Data Mining?',
    key_answer: 'Process of extracting useful patterns and knowledge from large datasets.'
  },
  {
    id: 'xds601-u1-b-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 10,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'What is Data Warehouse?',
    key_answer: 'Central repository used to store integrated data from multiple sources for analysis.'
  },
  {
    id: 'xds601-u1-b-11',
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
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Define Big Data Infrastructure.',
    key_answer: 'Hardware and software systems used to store, manage, and process big data.'
  },
  {
    id: 'xds601-u1-b-12',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 12,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'What is IoT (Internet of Things)?',
    key_answer: 'Network of connected devices that collect and exchange data through the internet.'
  },
  {
    id: 'xds601-u1-b-13',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 13,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'What is Business Intelligence?',
    key_answer: 'Technologies and tools used to analyze data for better business decision making.'
  },
  {
    id: 'xds601-u1-b-14',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 14,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Differentiate structured and semi-structured data.',
    key_answer: 'Structured: fixed schema (tables); Semi-structured: flexible format like XML or JSON.'
  },
  {
    id: 'xds601-u1-b-15',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 15,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'List any two applications of Big Data.',
    key_answer: 'Healthcare analytics and e-commerce recommendations.'
  },

  // SECTION C: Descriptive Questions (Q1 - Q10)
  {
    id: 'xds601-u1-c-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[8],
    mark_value: 8,
    section_type: 'SECTION_C',
    q_no: 1,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Explain the 3Vs of Big Data with examples.',
    evaluation_scheme: `K2 (60% = 5 Marks)
Concept of 3Vs of Big Data:
• Volume – large amount of data generated
• Velocity – speed at which data is generated and processed
• Variety – different forms of data (text, images, videos)
K2 (40% = 2 Marks)
Examples illustrating the 3Vs:
• Social media data
• Online transactions`
  },
  {
    id: 'xds601-u1-c-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[7],
    mark_value: 7,
    section_type: 'SECTION_C',
    q_no: 2,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Describe different types of data in Big Data.',
    evaluation_scheme: `K2 (60% = 4 Marks)
Types of data:
• Structured data
• Semi-structured data
• Unstructured data
K2 (40% = 3 Marks)
Examples and importance of each data type`
  },
  {
    id: 'xds601-u1-c-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[10],
    mark_value: 10,
    section_type: 'SECTION_C',
    q_no: 3,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Explain the Big Data Life Cycle.',
    evaluation_scheme: `K2 (60% = 6 Marks)
Concept of Big Data Life Cycle:
• Data generation
• Data collection
• Data storage
K2 (40% = 4 Marks)
Further stages:
• Data processing
• Data analysis and visualization`
  },
  {
    id: 'xds601-u1-c-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[10],
    mark_value: 10,
    section_type: 'SECTION_C',
    q_no: 4,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Discuss the evolution of Big Data.',
    evaluation_scheme: `K2 (60% = 8 Marks)
Early data management:
• Traditional databases
• Data warehousing
K2 (40% = 2 Marks)
Modern Big Data evolution:
• Growth of internet and social media
• Cloud computing and distributed systems`
  },
  {
    id: 'xds601-u1-c-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 5,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Explain Big Data infrastructure components.',
    evaluation_scheme: `K2 (40% = 5 Marks)
Concept of Big Data infrastructure:
• Hardware and software framework
K3 (60% = 10 Marks)
Major components:
• Data storage systems
• Distributed computing frameworks
• Data processing tools`
  },
  {
    id: 'xds601-u1-c-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[10],
    mark_value: 10,
    section_type: 'SECTION_C',
    q_no: 6,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Define Big Data and explain its characteristics from 3Vs to extended Vs.',
    evaluation_scheme: `K2 (40% = 4 Marks)
Definition of Big Data:
• Large, complex datasets that require advanced processing tools
K2 (40% = 4 Marks)
Core characteristics:
• Volume
• Velocity
• Variety
K2 (20% = 2 Marks)
Extended Vs:
• Veracity
• Value`
  },
  {
    id: 'xds601-u1-c-07',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 7,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Discuss the Big Data Life Cycle in detail with diagram.',
    evaluation_scheme: `K2 (40% = 7 Marks)
Stages of Big Data Life Cycle:
• Data generation
• Data collection
• Data storage
K3 (40% = 5 Marks)
Further stages:
• Data processing
• Data analysis
• Data visualization
K3 (20% = 3 Marks)
Diagram representation and explanation`
  },
  {
    id: 'xds601-u1-c-08',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO1,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[10],
    mark_value: 10,
    section_type: 'SECTION_C',
    q_no: 8,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Explain different types of data and their importance in Big Data analytics.',
    evaluation_scheme: `K2 (40% = 4 Marks)
Types of data:
• Structured data
• Semi-structured data
• Unstructured data
K3 (40% = 4 Marks)
Examples and characteristics of each type
K3 (20% = 2 Marks)
Importance in Big Data analytics`
  },
  {
    id: 'xds601-u1-c-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO2,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[10],
    mark_value: 10,
    section_type: 'SECTION_C',
    q_no: 9,
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Describe Big Data infrastructure and major technologies used.',
    evaluation_scheme: `K2 (40% = 4 Marks)
Concept of Big Data infrastructure:
• Distributed storage and processing systems
K4 (40% = 4 Marks)
Major technologies:
• Hadoop
• Spark
• NoSQL databases
K4 (20% = 2 Marks)
Role of these technologies in Big Data processing`
  },
  {
    id: 'xds601-u1-c-10',
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
    unit_name: 'FUNDAMENTALS OF BIG DATA',
    question_text: 'Discuss Big Data applications and use cases in various industries.',
    evaluation_scheme: `K2 (40% = 4 Marks)
Concept of Big Data applications:
• Data-driven decision making
K4 (40% = 4 Marks)
Industry use cases:
• Healthcare analytics
• Financial fraud detection
• E-commerce recommendation systems
K4 (20% = 2 Marks)
Benefits and impact of Big Data in industries`
  }
];

module.exports = module1Questions;
