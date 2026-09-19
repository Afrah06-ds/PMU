const COURSE_ID = 'c0000601-0000-4000-8000-000000000601';
const DEPT_ID = 'd3badb28-42c1-4fe6-be2e-94ce46161cac';
const MODULE_ID = 'b0000601-0005-4000-8000-000000000005';

const CO_IDS = {
  CO4: 'ca000601-0004-4000-8000-000000000004'
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

const module5Questions = [
  // SECTION A: Objective Type Questions (Q1 - Q30)
  {
    id: 'xds601-u5-a-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 1,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Big Data Analytics refers to the process of ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Storing data', is_correct: false },
      { option_letter: 'b', option_text: 'Examining large datasets to uncover patterns', is_correct: true },
      { option_letter: 'c', option_text: 'Deleting data', is_correct: false },
      { option_letter: 'd', option_text: 'Encrypting data', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 2,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'The Big Data Analytics life cycle mainly involves ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Data collection and analysis', is_correct: true },
      { option_letter: 'b', option_text: 'Data storage only', is_correct: false },
      { option_letter: 'c', option_text: 'Data deletion', is_correct: false },
      { option_letter: 'd', option_text: 'Data compression', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 3,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Which analysis focuses on numerical data and measurable variables?',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Qualitative analysis', is_correct: false },
      { option_letter: 'b', option_text: 'Quantitative analysis', is_correct: true },
      { option_letter: 'c', option_text: 'Semantic analysis', is_correct: false },
      { option_letter: 'd', option_text: 'Visual analysis', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 4,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Qualitative analysis mainly deals with ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Numerical values', is_correct: false },
      { option_letter: 'b', option_text: 'Non-numerical information', is_correct: true },
      { option_letter: 'c', option_text: 'Algorithms', is_correct: false },
      { option_letter: 'd', option_text: 'Databases', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 5,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Data mining is the process of ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Storing data', is_correct: false },
      { option_letter: 'b', option_text: 'Extracting useful patterns from large datasets', is_correct: true },
      { option_letter: 'c', option_text: 'Encrypting data', is_correct: false },
      { option_letter: 'd', option_text: 'Compressing data', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 6,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Statistical analysis is used to ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Store data', is_correct: false },
      { option_letter: 'b', option_text: 'Interpret numerical data', is_correct: true },
      { option_letter: 'c', option_text: 'Delete data', is_correct: false },
      { option_letter: 'd', option_text: 'Transfer data', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-07',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 7,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Machine learning is a subset of ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Artificial Intelligence', is_correct: true },
      { option_letter: 'b', option_text: 'Networking', is_correct: false },
      { option_letter: 'c', option_text: 'Operating Systems', is_correct: false },
      { option_letter: 'd', option_text: 'Web development', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-08',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 8,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Semantic analysis mainly deals with understanding ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Numbers', is_correct: false },
      { option_letter: 'b', option_text: 'Meanings of text and language', is_correct: true },
      { option_letter: 'c', option_text: 'Images', is_correct: false },
      { option_letter: 'd', option_text: 'Graphs', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 9,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Visual analysis techniques help users ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Store data', is_correct: false },
      { option_letter: 'b', option_text: 'Interpret data using charts and graphs', is_correct: true },
      { option_letter: 'c', option_text: 'Encrypt data', is_correct: false },
      { option_letter: 'd', option_text: 'Delete data', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 10,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Big Data Business Intelligence is used for ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Strategic decision making', is_correct: true },
      { option_letter: 'b', option_text: 'Data deletion', is_correct: false },
      { option_letter: 'c', option_text: 'Network configuration', is_correct: false },
      { option_letter: 'd', option_text: 'Programming', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-11',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 11,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Real-time analytics refers to ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Batch processing', is_correct: false },
      { option_letter: 'b', option_text: 'Immediate processing of data', is_correct: true },
      { option_letter: 'c', option_text: 'Manual processing', is_correct: false },
      { option_letter: 'd', option_text: 'Delayed processing', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-12',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 12,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Correlation analysis measures the ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Difference between variables', is_correct: false },
      { option_letter: 'b', option_text: 'Relationship between variables', is_correct: true },
      { option_letter: 'c', option_text: 'Storage capacity', is_correct: false },
      { option_letter: 'd', option_text: 'Speed of computation', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-13',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 13,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Regression analysis is mainly used for ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Data storage', is_correct: false },
      { option_letter: 'b', option_text: 'Predicting relationships between variables', is_correct: true },
      { option_letter: 'c', option_text: 'Data deletion', is_correct: false },
      { option_letter: 'd', option_text: 'Encryption', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-14',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 14,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Time series plots are used to analyze ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Static data', is_correct: false },
      { option_letter: 'b', option_text: 'Data over time', is_correct: true },
      { option_letter: 'c', option_text: 'Random data', is_correct: false },
      { option_letter: 'd', option_text: 'Categorical data', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-15',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 15,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Clustering is a technique used to ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Group similar data objects', is_correct: true },
      { option_letter: 'b', option_text: 'Delete data', is_correct: false },
      { option_letter: 'c', option_text: 'Encrypt data', is_correct: false },
      { option_letter: 'd', option_text: 'Compress data', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-16',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 16,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Classification is a process of ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Grouping unlabeled data', is_correct: false },
      { option_letter: 'b', option_text: 'Assigning data into predefined categories', is_correct: true },
      { option_letter: 'c', option_text: 'Removing duplicates', is_correct: false },
      { option_letter: 'd', option_text: 'Compressing files', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-17',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 17,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Which tool is commonly used for data visualization?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Charts and graphs', is_correct: true },
      { option_letter: 'b', option_text: 'Network cables', is_correct: false },
      { option_letter: 'c', option_text: 'Hard disks', is_correct: false },
      { option_letter: 'd', option_text: 'CPUs', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-18',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 18,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Which analysis technique is mainly used for textual data?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Semantic analysis', is_correct: true },
      { option_letter: 'b', option_text: 'Regression', is_correct: false },
      { option_letter: 'c', option_text: 'Clustering', is_correct: false },
      { option_letter: 'd', option_text: 'Sorting', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-19',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 19,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Big Data analytics techniques help organizations to ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Improve decision making', is_correct: true },
      { option_letter: 'b', option_text: 'Delete files', is_correct: false },
      { option_letter: 'c', option_text: 'Reduce memory', is_correct: false },
      { option_letter: 'd', option_text: 'Slow down systems', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-20',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 20,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Which of the following is a machine learning technique?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Clustering', is_correct: true },
      { option_letter: 'b', option_text: 'Encryption', is_correct: false },
      { option_letter: 'c', option_text: 'Formatting', is_correct: false },
      { option_letter: 'd', option_text: 'Compilation', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-21',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 21,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Quantitative analysis mainly relies on ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Numbers and statistics', is_correct: true },
      { option_letter: 'b', option_text: 'Images', is_correct: false },
      { option_letter: 'c', option_text: 'Audio', is_correct: false },
      { option_letter: 'd', option_text: 'Videos', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-22',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 22,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Which technique helps in predicting future values based on past data?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Time series analysis', is_correct: true },
      { option_letter: 'b', option_text: 'Classification', is_correct: false },
      { option_letter: 'c', option_text: 'Sorting', is_correct: false },
      { option_letter: 'd', option_text: 'Encryption', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-23',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 23,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Big Data analytics life cycle includes ______.',
    key_answer: '(d)',
    options: [
      { option_letter: 'a', option_text: 'Data collection', is_correct: false },
      { option_letter: 'b', option_text: 'Data analysis', is_correct: false },
      { option_letter: 'c', option_text: 'Data visualization', is_correct: false },
      { option_letter: 'd', option_text: 'All of the above', is_correct: true }
    ]
  },
  {
    id: 'xds601-u5-a-24',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 24,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Which method is used to identify hidden patterns in large datasets?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Data mining', is_correct: true },
      { option_letter: 'b', option_text: 'Sorting', is_correct: false },
      { option_letter: 'c', option_text: 'Searching', is_correct: false },
      { option_letter: 'd', option_text: 'Networking', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-25',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 25,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Visual analytics helps users understand ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Data patterns visually', is_correct: true },
      { option_letter: 'b', option_text: 'Hardware performance', is_correct: false },
      { option_letter: 'c', option_text: 'Network cables', is_correct: false },
      { option_letter: 'd', option_text: 'File systems', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-26',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 26,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Regression analysis is often used for ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Prediction', is_correct: true },
      { option_letter: 'b', option_text: 'Compression', is_correct: false },
      { option_letter: 'c', option_text: 'Encryption', is_correct: false },
      { option_letter: 'd', option_text: 'Deletion', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-27',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 27,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Real-time analytics is widely used in ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Fraud detection systems', is_correct: true },
      { option_letter: 'b', option_text: 'Word processing', is_correct: false },
      { option_letter: 'c', option_text: 'Text editing', is_correct: false },
      { option_letter: 'd', option_text: 'Spreadsheet formatting', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-28',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 28,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Clustering is a type of ______ learning technique.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Supervised', is_correct: false },
      { option_letter: 'b', option_text: 'Unsupervised', is_correct: true },
      { option_letter: 'c', option_text: 'Reinforcement', is_correct: false },
      { option_letter: 'd', option_text: 'Semi-supervised', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-29',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 29,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Which of the following is an example of business intelligence tool?',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Dashboard', is_correct: true },
      { option_letter: 'b', option_text: 'Compiler', is_correct: false },
      { option_letter: 'c', option_text: 'Operating system', is_correct: false },
      { option_letter: 'd', option_text: 'Firewall', is_correct: false }
    ]
  },
  {
    id: 'xds601-u5-a-30',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 30,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Classification algorithms require ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Labeled data', is_correct: true },
      { option_letter: 'b', option_text: 'Unlabeled data', is_correct: false },
      { option_letter: 'c', option_text: 'Random data', is_correct: false },
      { option_letter: 'd', option_text: 'Encrypted data', is_correct: false }
    ]
  },

  // SECTION B: Short Answers Questions (Q1 - Q15)
  {
    id: 'xds601-u5-b-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 1,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Define Big Data Analytics.',
    key_answer: 'The process of analyzing large datasets to discover patterns, trends, and useful information.'
  },
  {
    id: 'xds601-u5-b-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 2,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'List the stages in the Big Data Analytics life cycle.',
    key_answer: 'Data collection, data storage, data processing, data analysis, and data visualization.'
  },
  {
    id: 'xds601-u5-b-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 3,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'What is quantitative analysis?',
    key_answer: 'Analysis of numerical data using mathematical and statistical techniques.'
  },
  {
    id: 'xds601-u5-b-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 4,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Define qualitative analysis.',
    key_answer: 'Analysis of non-numerical data such as text, images, or opinions to understand patterns and meanings.'
  },
  {
    id: 'xds601-u5-b-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 5,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'What is data mining?',
    key_answer: 'The process of extracting useful patterns and knowledge from large datasets.'
  },
  {
    id: 'xds601-u5-b-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 6,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'What is statistical analysis?',
    key_answer: 'The use of statistical methods to collect, analyze, interpret, and present data.'
  },
  {
    id: 'xds601-u5-b-07',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 7,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Define machine learning.',
    key_answer: 'A branch of AI where systems learn from data to make predictions or decisions.'
  },
  {
    id: 'xds601-u5-b-08',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 8,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'What is semantic analysis?',
    key_answer: 'A technique used to understand the meaning and context of text data.'
  },
  {
    id: 'xds601-u5-b-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 9,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'What are visual analysis techniques?',
    key_answer: 'Techniques that use charts, graphs, and dashboards to represent and analyze data visually.'
  },
  {
    id: 'xds601-u5-b-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 10,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'What is Big Data Business Intelligence?',
    key_answer: 'The use of big data analytics tools to support business decision-making.'
  },
  {
    id: 'xds601-u5-b-11',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 11,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'What is real-time analytics processing?',
    key_answer: 'The process of analyzing data immediately as it is generated.'
  },
  {
    id: 'xds601-u5-b-12',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 12,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Define correlation analysis.',
    key_answer: 'A statistical method used to measure the relationship between two variables.'
  },
  {
    id: 'xds601-u5-b-13',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 13,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'What is regression analysis?',
    key_answer: 'A statistical technique used to predict the relationship between dependent and independent variables.'
  },
  {
    id: 'xds601-u5-b-14',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 14,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'What is time series analysis?',
    key_answer: 'Analysis of data points collected over time to identify trends or patterns.'
  },
  {
    id: 'xds601-u5-b-15',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 15,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Differentiate clustering and classification.',
    key_answer: 'Clustering groups similar data without labels; classification assigns data to predefined categories.'
  },

  // SECTION C: Descriptive Questions (Q1 - Q10)
  {
    id: 'xds601-u5-c-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 1,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Explain the concept, terminologies, and life cycle of Big Data Analytics.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Big Data Analytics:
• Definition of Big Data analytics
• Importance of analyzing large-scale data
• Role in decision making
K3 (40% = 6 Marks)
Key terminologies:
• Data sources
• Data processing frameworks
• Analytical models
K3 (20% = 3 Marks)
Big Data analytics life cycle:
• Data collection
• Data processing
• Data analysis and visualization`
  },
  {
    id: 'xds601-u5-c-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 2,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Describe the different Big Data analytics techniques with examples.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of analytics techniques:
• Role in extracting insights from data
K3 (40% = 6 Marks)
Types of analytics:
• Descriptive analytics
• Predictive analytics
• Prescriptive analytics
K3 (20% = 3 Marks)
Examples illustrating each analytics type`
  },
  {
    id: 'xds601-u5-c-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 3,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Compare quantitative analysis and qualitative analysis in Big Data.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of quantitative analysis:
• Numerical data analysis
• Statistical techniques
K2 (40% = 6 Marks)
Concept of qualitative analysis:
• Non-numerical data analysis
• Text and content interpretation
K4 (20% = 3 Marks)
Comparison factors:
• Data type
• Methods used
• Applications`
  },
  {
    id: 'xds601-u5-c-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 4,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Explain the role of data mining in Big Data analytics.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of data mining:
• Extracting patterns and knowledge from data
• Integration with Big Data systems
K3 (40% = 6 Marks)
Key data mining techniques:
• Classification
• Clustering
• Association rule mining
K3 (20% = 3 Marks)
Applications of data mining in Big Data analytics`
  },
  {
    id: 'xds601-u5-c-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 5,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Discuss the importance of statistical analysis in Big Data.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of statistical analysis:
• Role in data interpretation
• Understanding trends and patterns
K3 (40% = 6 Marks)
Statistical techniques used:
• Mean, median, variance
• Hypothesis testing
• Regression analysis
K3 (20% = 3 Marks)
Importance in decision making and forecasting`
  },
  {
    id: 'xds601-u5-c-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 6,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Explain the role of machine learning in Big Data analytics with examples.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of machine learning:
• Learning patterns from large datasets
• Automated predictive modeling
K3 (40% = 6 Marks)
Machine learning techniques used in Big Data:
• Classification
• Clustering
• Regression
K3 (20% = 3 Marks)
Examples such as recommendation systems and fraud detection`
  },
  {
    id: 'xds601-u5-c-07',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 7,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Describe semantic analysis and visual analysis techniques used in Big Data.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of semantic analysis:
• Understanding meaning from text data
• Natural language processing techniques
K3 (40% = 6 Marks)
Visual analysis techniques:
• Data visualization tools
• Graphs, charts, dashboards
K3 (20% = 3 Marks)
Applications in Big Data analytics`
  },
  {
    id: 'xds601-u5-c-08',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K3,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 8,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Explain the concept and importance of Big Data Business Intelligence.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Business Intelligence:
• Data-driven decision making
• Integration of analytics with business processes
K3 (40% = 6 Marks)
Components of BI systems:
• Data warehouses
• Analytical tools
• Reporting systems
K3 (20% = 3 Marks)
Importance in strategic business decisions`
  },
  {
    id: 'xds601-u5-c-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 9,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Discuss real-time analytics processing and its applications.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of real-time analytics:
• Immediate processing of streaming data
• Need for quick decision making
K4 (40% = 6 Marks)
Real-time analytics technologies and processing methods
K4 (20% = 3 Marks)
Applications such as fraud detection, stock trading, and monitoring systems`
  },
  {
    id: 'xds601-u5-c-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO4,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 10,
    unit_name: 'BIG DATA ANALYSIS TECHNIQUES',
    question_text: 'Explain case studies of correlation, regression, time series plot, clustering, and classification in Big Data analysis.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concepts used in Big Data analysis:
• Correlation analysis
• Regression analysis
• Time series plots
K4 (40% = 6 Marks)
Data mining techniques:
• Clustering
• Classification
K4 (20% = 3 Marks)
Case study examples illustrating these techniques`
  }
];

module.exports = module5Questions;
