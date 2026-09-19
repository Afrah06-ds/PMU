const COURSE_ID = 'c0000601-0000-4000-8000-000000000601';
const DEPT_ID = 'd3badb28-42c1-4fe6-be2e-94ce46161cac';
const MODULE_ID = 'b0000601-0003-4000-8000-000000000003';

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

const module3Questions = [
  // SECTION A: Objective Type Questions (Q1 - Q30)
  {
    id: 'xds601-u3-a-01',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Hadoop is mainly used for processing ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Small data', is_correct: false },
      { option_letter: 'b', option_text: 'Big Data', is_correct: true },
      { option_letter: 'c', option_text: 'Images only', is_correct: false },
      { option_letter: 'd', option_text: 'Text files only', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-02',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Hadoop is an example of a ______ framework.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Distributed computing', is_correct: true },
      { option_letter: 'b', option_text: 'Centralized computing', is_correct: false },
      { option_letter: 'c', option_text: 'Standalone computing', is_correct: false },
      { option_letter: 'd', option_text: 'Desktop computing', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 3,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'The two main core components of Hadoop are ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'HDFS and MapReduce', is_correct: true },
      { option_letter: 'b', option_text: 'Hive and Pig', is_correct: false },
      { option_letter: 'c', option_text: 'HBase and Mahout', is_correct: false },
      { option_letter: 'd', option_text: 'Yarn and Spark', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 4,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Hadoop Distributed File System (HDFS) is designed for ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Small datasets', is_correct: false },
      { option_letter: 'b', option_text: 'Large-scale distributed storage', is_correct: true },
      { option_letter: 'c', option_text: 'Single system storage', is_correct: false },
      { option_letter: 'd', option_text: 'Temporary storage', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 5,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'In HDFS, the master node is called ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'DataNode', is_correct: false },
      { option_letter: 'b', option_text: 'NameNode', is_correct: true },
      { option_letter: 'c', option_text: 'TaskTracker', is_correct: false },
      { option_letter: 'd', option_text: 'ResourceManager', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 6,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'DataNodes in HDFS are responsible for ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Managing metadata', is_correct: false },
      { option_letter: 'b', option_text: 'Storing actual data blocks', is_correct: true },
      { option_letter: 'c', option_text: 'Running MapReduce jobs', is_correct: false },
      { option_letter: 'd', option_text: 'Data visualization', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-07',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 7,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Hadoop splits large files into blocks typically of size ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: '64MB or 128MB', is_correct: true },
      { option_letter: 'b', option_text: '1MB', is_correct: false },
      { option_letter: 'c', option_text: '10MB', is_correct: false },
      { option_letter: 'd', option_text: '512KB', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-08',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'MapReduce is mainly used for ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Data storage', is_correct: false },
      { option_letter: 'b', option_text: 'Parallel data processing', is_correct: true },
      { option_letter: 'c', option_text: 'Data compression', is_correct: false },
      { option_letter: 'd', option_text: 'Data encryption', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-09',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'The MapReduce model consists of ______ phases.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Two', is_correct: true },
      { option_letter: 'b', option_text: 'Three', is_correct: false },
      { option_letter: 'c', option_text: 'Four', is_correct: false },
      { option_letter: 'd', option_text: 'Five', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-10',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'The first phase in MapReduce programming is ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Reduce', is_correct: false },
      { option_letter: 'b', option_text: 'Map', is_correct: true },
      { option_letter: 'c', option_text: 'Shuffle', is_correct: false },
      { option_letter: 'd', option_text: 'Sort', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-11',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 11,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'The Reduce phase in MapReduce is responsible for ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Data storage', is_correct: false },
      { option_letter: 'b', option_text: 'Aggregating results', is_correct: true },
      { option_letter: 'c', option_text: 'Data partitioning', is_correct: false },
      { option_letter: 'd', option_text: 'Data replication', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-12',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 12,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Hadoop Streaming allows Hadoop to run programs written in ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Any programming language', is_correct: true },
      { option_letter: 'b', option_text: 'Java only', is_correct: false },
      { option_letter: 'c', option_text: 'Python only', is_correct: false },
      { option_letter: 'd', option_text: 'C++ only', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-13',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Hadoop Pipes are mainly used to write MapReduce programs in ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Python', is_correct: false },
      { option_letter: 'b', option_text: 'C++', is_correct: true },
      { option_letter: 'c', option_text: 'Java', is_correct: false },
      { option_letter: 'd', option_text: 'SQL', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-14',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 14,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Hadoop YARN stands for ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Yet Another Resource Negotiator', is_correct: true },
      { option_letter: 'b', option_text: 'Your Application Resource Network', is_correct: false },
      { option_letter: 'c', option_text: 'Yet Another Resource Node', is_correct: false },
      { option_letter: 'd', option_text: 'Yarn Resource Manager', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-15',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'YARN is responsible for ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Resource management', is_correct: true },
      { option_letter: 'b', option_text: 'Data storage', is_correct: false },
      { option_letter: 'c', option_text: 'Data cleaning', is_correct: false },
      { option_letter: 'd', option_text: 'Data compression', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-16',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 16,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'In YARN, the component responsible for resource allocation is ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'DataNode', is_correct: false },
      { option_letter: 'b', option_text: 'ResourceManager', is_correct: true },
      { option_letter: 'c', option_text: 'JobTracker', is_correct: false },
      { option_letter: 'd', option_text: 'TaskTracker', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-17',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 17,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'The component that manages application execution in YARN is ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'NodeManager', is_correct: true },
      { option_letter: 'b', option_text: 'NameNode', is_correct: false },
      { option_letter: 'c', option_text: 'HiveServer', is_correct: false },
      { option_letter: 'd', option_text: 'PigEngine', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-18',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 18,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Apache Hive is mainly used for ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Data storage', is_correct: false },
      { option_letter: 'b', option_text: 'SQL-like querying of big data', is_correct: true },
      { option_letter: 'c', option_text: 'Machine learning', is_correct: false },
      { option_letter: 'd', option_text: 'File compression', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-19',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Hive uses a query language called ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'HQL', is_correct: true },
      { option_letter: 'b', option_text: 'SQL+', is_correct: false },
      { option_letter: 'c', option_text: 'NoSQL', is_correct: false },
      { option_letter: 'd', option_text: 'PQL', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-20',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Apache Pig is used for ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Big data analysis using scripts', is_correct: true },
      { option_letter: 'b', option_text: 'Data storage', is_correct: false },
      { option_letter: 'c', option_text: 'Machine learning', is_correct: false },
      { option_letter: 'd', option_text: 'Visualization', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-21',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 21,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'The scripting language used in Apache Pig is ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Pig Latin', is_correct: true },
      { option_letter: 'b', option_text: 'HiveQL', is_correct: false },
      { option_letter: 'c', option_text: 'Python', is_correct: false },
      { option_letter: 'd', option_text: 'SQL', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-22',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Apache HBase is a ______ database.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Relational', is_correct: false },
      { option_letter: 'b', option_text: 'Column-oriented NoSQL', is_correct: true },
      { option_letter: 'c', option_text: 'Graph database', is_correct: false },
      { option_letter: 'd', option_text: 'Hierarchical database', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-23',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'HBase runs on top of ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'HDFS', is_correct: true },
      { option_letter: 'b', option_text: 'MySQL', is_correct: false },
      { option_letter: 'c', option_text: 'MongoDB', is_correct: false },
      { option_letter: 'd', option_text: 'Cassandra', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-24',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 24,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Apache Mahout is mainly used for ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Machine learning', is_correct: true },
      { option_letter: 'b', option_text: 'Data storage', is_correct: false },
      { option_letter: 'c', option_text: 'Data compression', is_correct: false },
      { option_letter: 'd', option_text: 'Query optimization', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-25',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Apache Ambari is used for ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Cluster management and monitoring', is_correct: true },
      { option_letter: 'b', option_text: 'Data analysis', is_correct: false },
      { option_letter: 'c', option_text: 'Machine learning', is_correct: false },
      { option_letter: 'd', option_text: 'Query execution', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-26',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Hadoop ecosystem refers to ______.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Single Hadoop tool', is_correct: false },
      { option_letter: 'b', option_text: 'Collection of tools around Hadoop', is_correct: true },
      { option_letter: 'c', option_text: 'Database system', is_correct: false },
      { option_letter: 'd', option_text: 'File system only', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-27',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Hadoop provides ______ scalability.',
    key_answer: '(b)',
    options: [
      { option_letter: 'a', option_text: 'Vertical', is_correct: false },
      { option_letter: 'b', option_text: 'Horizontal', is_correct: true },
      { option_letter: 'c', option_text: 'Static', is_correct: false },
      { option_letter: 'd', option_text: 'Limited', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-28',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.MCQ,
    marks_id: MARK_IDS[1],
    mark_value: 1,
    section_type: 'SECTION_A',
    q_no: 28,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'MapReduce programs are mainly written in ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Java', is_correct: true },
      { option_letter: 'b', option_text: 'SQL', is_correct: false },
      { option_letter: 'c', option_text: 'HTML', is_correct: false },
      { option_letter: 'd', option_text: 'PHP', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-29',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'The shuffle phase in MapReduce occurs between ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Map and Reduce', is_correct: true },
      { option_letter: 'b', option_text: 'Reduce and Map', is_correct: false },
      { option_letter: 'c', option_text: 'Input and Map', is_correct: false },
      { option_letter: 'd', option_text: 'Output and Reduce', is_correct: false }
    ]
  },
  {
    id: 'xds601-u3-a-30',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Hadoop ecosystem tools help in ______.',
    key_answer: '(a)',
    options: [
      { option_letter: 'a', option_text: 'Big data storage and processing', is_correct: true },
      { option_letter: 'b', option_text: 'Desktop computing', is_correct: false },
      { option_letter: 'c', option_text: 'Game development', is_correct: false },
      { option_letter: 'd', option_text: 'Operating system design', is_correct: false }
    ]
  },

  // SECTION B: Short Answers Questions (Q1 - Q15)
  {
    id: 'xds601-u3-b-01',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Define Hadoop.',
    key_answer: 'An open-source framework used for distributed storage and processing of large datasets across clusters of computers.'
  },
  {
    id: 'xds601-u3-b-02',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'List the core components of Hadoop.',
    key_answer: 'HDFS and MapReduce.'
  },
  {
    id: 'xds601-u3-b-03',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'What is the Hadoop ecosystem?',
    key_answer: 'A collection of tools and technologies that work with Hadoop for big data storage, processing, and analysis.'
  },
  {
    id: 'xds601-u3-b-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 4,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'What is HDFS?',
    key_answer: 'Hadoop Distributed File System used for storing large data across multiple machines.'
  },
  {
    id: 'xds601-u3-b-05',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'What is the role of the NameNode in HDFS?',
    key_answer: 'It manages file system metadata and controls access to files in HDFS.'
  },
  {
    id: 'xds601-u3-b-06',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'What is the function of DataNode?',
    key_answer: 'It stores actual data blocks and performs read/write operations in HDFS.'
  },
  {
    id: 'xds601-u3-b-07',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Define MapReduce.',
    key_answer: 'A programming model used for processing large datasets in parallel across distributed systems.'
  },
  {
    id: 'xds601-u3-b-08',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'What are the two phases of MapReduce?',
    key_answer: 'Map phase and Reduce phase.'
  },
  {
    id: 'xds601-u3-b-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 9,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'What is Hadoop Streaming?',
    key_answer: 'A utility that allows MapReduce programs to be written in languages other than Java.'
  },
  {
    id: 'xds601-u3-b-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K1,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 10,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'What is Hadoop YARN?',
    key_answer: 'Yet Another Resource Negotiator used for resource management and job scheduling in Hadoop.'
  },
  {
    id: 'xds601-u3-b-11',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 11,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'What is the function of the ResourceManager in YARN?',
    key_answer: 'It manages cluster resources and schedules applications.'
  },
  {
    id: 'xds601-u3-b-12',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'What is Apache Hive?',
    key_answer: 'A data warehouse tool used for querying and managing large datasets in Hadoop using SQL-like language.'
  },
  {
    id: 'xds601-u3-b-13',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.SHORT,
    marks_id: MARK_IDS[2],
    mark_value: 2,
    section_type: 'SECTION_B',
    q_no: 13,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'What is Apache Pig?',
    key_answer: 'A platform for analyzing large datasets using a scripting language called Pig Latin.'
  },
  {
    id: 'xds601-u3-b-14',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'What is HBase?',
    key_answer: 'A distributed column-oriented NoSQL database that runs on top of HDFS.'
  },
  {
    id: 'xds601-u3-b-15',
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
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'What is Apache Mahout used for?',
    key_answer: 'It is used for machine learning and data mining algorithms on big data.'
  },

  // SECTION C: Descriptive Questions (Q1 - Q10)
  {
    id: 'xds601-u3-c-01',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 1,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Explain the Hadoop ecosystem, including its core components and features.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Hadoop ecosystem:
• Definition of Hadoop
• Need for distributed data processing
• Role in Big Data analytics
K2 (40% = 6 Marks)
Core components:
• HDFS
• MapReduce
• YARN
• Hadoop Common
K2 (20% = 3 Marks)
Key features:
• Scalability
• Fault tolerance
• Distributed storage and processing`
  },
  {
    id: 'xds601-u3-c-02',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 2,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Describe the Hadoop Distributed File System (HDFS) architecture and working principle.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of HDFS:
• Distributed file storage system
• Designed for large datasets
K4 (40% = 6 Marks)
HDFS architecture:
• NameNode
• DataNode
• Block storage mechanism
K4 (20% = 3 Marks)
Working principle:
• Data replication
• Fault tolerance and data access`
  },
  {
    id: 'xds601-u3-c-03',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 3,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Explain the MapReduce framework and programming model with an example.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of MapReduce framework:
• Distributed data processing model
• Parallel computation
K4 (40% = 6 Marks)
Programming model:
• Map phase
• Shuffle and sort phase
• Reduce phase
K4 (20% = 3 Marks)
Example such as word count application`
  },
  {
    id: 'xds601-u3-c-04',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 4,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Discuss Hadoop Streaming and Pipes and their role in Hadoop programming.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Hadoop Streaming:
• Running MapReduce programs using scripts
• Support for languages like Python and Perl
K2 (40% = 6 Marks)
Concept of Hadoop Pipes:
• C++ API for MapReduce programming
• Integration with Hadoop framework
K2 (20% = 3 Marks)
Importance in flexible Hadoop development`
  },
  {
    id: 'xds601-u3-c-05',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 5,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Explain the Hadoop YARN architecture, execution model, and improvements over earlier versions.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Hadoop YARN:
• Resource management layer in Hadoop
• Separation of resource management and processing
K4 (40% = 6 Marks)
Architecture and execution model:
• Resource Manager
• Node Manager
• Application Master
• Containers
K4 (20% = 3 Marks)
Improvements over earlier Hadoop versions`
  },
  {
    id: 'xds601-u3-c-06',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 6,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Describe the role of Apache Hive in Big Data processing.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Apache Hive:
• Data warehouse system on Hadoop
• SQL-like query language (HiveQL)
K4 (40% = 6 Marks)
Working mechanism:
• Query processing
• Conversion of Hive queries into MapReduce jobs
K4 (20% = 3 Marks)
Applications in Big Data analytics`
  },
  {
    id: 'xds601-u3-c-07',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 7,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Explain the features and working of Apache Pig with examples.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Apache Pig:
• High-level platform for Big Data processing
• Pig Latin scripting language
K4 (40% = 6 Marks)
Working principle:
• Data loading
• Data transformation operations
• Execution on Hadoop cluster
K4 (20% = 3 Marks)
Example illustrating Pig operations`
  },
  {
    id: 'xds601-u3-c-08',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 8,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Discuss the architecture and advantages of Apache HBase.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Apache HBase:
• Distributed NoSQL database
• Built on top of HDFS
K4 (40% = 6 Marks)
Architecture components:
• HBase Master
• Region Servers
• Tables and regions
K4 (20% = 3 Marks)
Advantages:
• High scalability
• Real-time read/write access`
  },
  {
    id: 'xds601-u3-c-09',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K2,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 9,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Explain the purpose of Apache Ambari and Apache Mahout in the Hadoop ecosystem.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of Hadoop ecosystem tools:
• Supporting tools for cluster management and analytics
K2 (40% = 6 Marks)
Explanation of:
• Apache Ambari – cluster monitoring and management
• Apache Mahout – machine learning library for Big Data
K2 (20% = 3 Marks)
Importance in Hadoop-based systems`
  },
  {
    id: 'xds601-u3-c-10',
    department_id: DEPT_ID,
    course_id: COURSE_ID,
    module_id: MODULE_ID,
    course_outcome_id: CO_IDS.CO3,
    k_level_id: K_IDS.K4,
    question_type_id: TYPE_IDS.LONG,
    marks_id: MARK_IDS[15],
    mark_value: 15,
    section_type: 'SECTION_C',
    q_no: 10,
    unit_name: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
    question_text: 'Discuss how Hadoop distributed frameworks support large-scale data processing and storage.',
    evaluation_scheme: `K2 (40% = 6 Marks)
Concept of distributed frameworks:
• Distributed storage and parallel processing
K4 (40% = 6 Marks)
Key mechanisms:
• Data partitioning
• Parallel computation
• Fault tolerance
K4 (20% = 3 Marks)
Benefits in large-scale Big Data applications`
  }
];

module.exports = module3Questions;
