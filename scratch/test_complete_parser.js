const { QuestionBankParser } = require('../lib/question-bank-parser');

const sampleHeader = `
PERIYAR MANIAMMAI INSTITUTE OF SCIENCE & TECHNOLOGY
Faculty of Computing Science and Applications (FCSA)
DEPARTMENT OF INFORMATICS
Course Details
Programme Code 172 Programme Name B.Sc. Data Science
Course Code XDS601 Course Name Big Data Analytics
Course Category Programme Core Courses Course Type Theory Course
Batch 2023 - 2026 Academic Year 2025-2026 Semester EVEN
Learning Hours 45 No. of Learners 58
L T P C CA ESE 3 0 0 3 40 60
Course Coordinator Dr. A. MUTHAMIZH SELVAN Associate Professor, Department of Informatics
Course Teacher Mr. N. SENTHIL KUMAR Assistant Professor (SS), Department of Informatics

Course Outcomes
After successful completion of the course, the students will be able to
COs Course Outcome RBT Level
CO1 Describe the fundamentals, terminologies, and life cycle of Big Data K2
CO2 Explain storage models and NoSQL databases for managing Big Data K2
CO3 Demonstrate the use of Hadoop and its ecosystem for distributed data storage and processing K3
CO4 Apply MapReduce, Hive, and Pig for efficient data processing and querying K3
CO5 Analyze Big Data using advanced techniques, including statistical and machine learning methods K4
CO6 Propose data-driven solutions for real-world problems K3
`;

console.log('Sample header ready for testing');
