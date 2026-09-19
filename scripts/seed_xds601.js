const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://pdrliutjrpuvezrzlorq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_B6Vw7mQfe_1r7bt-PGkVtQ_ilEfk6F5';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DEPT_ID = 'd3badb28-42c1-4fe6-be2e-94ce46161cac'; // Informatics
const COURSE_ID = 'c0000601-0000-4000-8000-000000000601';

const MODULE_IDS = {
  1: 'b0000601-0001-4000-8000-000000000001',
  2: 'b0000601-0002-4000-8000-000000000002',
  3: 'b0000601-0003-4000-8000-000000000003',
  4: 'b0000601-0004-4000-8000-000000000004',
  5: 'b0000601-0005-4000-8000-000000000005'
};

const CO_IDS = {
  CO1: 'ca000601-0001-4000-8000-000000000001',
  CO2: 'ca000601-0002-4000-8000-000000000002',
  CO3: 'ca000601-0003-4000-8000-000000000003',
  CO4: 'ca000601-0004-4000-8000-000000000004',
  CO5: 'ca000601-0005-4000-8000-000000000005',
  CO6: 'ca000601-0006-4000-8000-000000000006'
};

async function seed() {
  console.log('--- Step 1: Upsert Course XDS601 ---');
  const coursePayload = {
    id: COURSE_ID,
    code: 'XDS601',
    name: 'Big Data Analytics',
    department_id: DEPT_ID,
    semester: 6,
    academic_year: '2025-2026'
  };
  const { data: courseData, error: courseErr } = await supabase.from('courses').upsert(coursePayload).select();
  if (courseErr) {
    console.error('Course creation error:', courseErr);
    return;
  }
  console.log('Course XDS601 created/verified:', courseData[0].id);

  console.log('\n--- Step 2: Upsert 5 Modules ---');
  const modules = [
    {
      id: MODULE_IDS[1],
      course_id: COURSE_ID,
      module_number: 1,
      title: 'FUNDAMENTALS OF BIG DATA',
      description: 'Understanding Big Data - Concepts and Terminologies - Big Data Characteristics - 3Vs to 32Vs Definition and Big Data Venn diagram - Different Types of Data - Evolution of Big Data - Sources of Big Data - Big Data Infrastructure - Big Data Adoption and Planning Considerations - Big Data Life Cycle - Big Data Technology - Big Data Applications and Use Cases.'
    },
    {
      id: MODULE_IDS[2],
      course_id: COURSE_ID,
      module_number: 2,
      title: 'BIG DATA STORAGE CONCEPTS',
      description: 'Cluster Computing - Distribution Models - File Systems and Distributed File Systems - Relational and Non-Relational Databases NoSQL Data Store - NoSQL Data Architecture - NoSQL to Manage Big Data: MongoDB, Cassandra - Scaling Up and Scaling Out Storage - Sharding with: Replication, Master-Slave and Peer to-Peer - CAP Theorem - ACID - BASE.'
    },
    {
      id: MODULE_IDS[3],
      course_id: COURSE_ID,
      module_number: 3,
      title: 'HADOOP AND DISTRIBUTED FRAMEWORKS',
      description: 'Hadoop ecosystem: Core components and features - Ecosystem components - Streaming and pipes - Hadoop distributed file systems (HDFS) - MapReduce framework and programming model - Hadoop Yarn: Execution model and improvements - Hadoop Tools: Ambari, HBase, Hive, Pig, and Mahout.'
    },
    {
      id: MODULE_IDS[4],
      course_id: COURSE_ID,
      module_number: 4,
      title: 'MAP-REDUCE, HIVE and PIG',
      description: 'Map-Reduce tasks: Map and Reduce - Processing steps in Map-Reduce - Coping with node failures and fault tolerance - Composing Map-Reduce for calculations and algorithms - Hive: Architecture, Data types, File formats, Data model, Workflow, and Built-in functions - HiveQL: DDL, DML, Querying, Aggregation, Join, and Group by Clause - Pig: Apache Pig, Pig Latin data model, and Developing scripts.'
    },
    {
      id: MODULE_IDS[5],
      course_id: COURSE_ID,
      module_number: 5,
      title: 'BIG DATA ANALYSIS TECHNIQUES',
      description: 'Big Data Analytics: Terminologies, Life cycle, and Techniques - Quantitative Analysis - Qualitative Analysis - Data Mining - Statistical Analysis - Machine Learning - Semantic Analysis - Visual Analysis Techniques - Big Data business intelligence - Real-Time analytics processing - Case Studies: Correlation, Regression, Time Series Plot, Clustering and Classification.'
    }
  ];

  for (const mod of modules) {
    const { error: modErr } = await supabase.from('modules').upsert(mod);
    if (modErr) console.error(`Module ${mod.module_number} error:`, modErr);
    else console.log(`Module ${mod.module_number} OK: ${mod.title}`);
  }

  console.log('\n--- Step 3: Upsert 6 Course Outcomes ---');
  const cos = [
    {
      id: CO_IDS.CO1,
      course_id: COURSE_ID,
      code: 'CO1',
      description: 'Describe the fundamentals, terminologies, and life cycle of Big Data'
    },
    {
      id: CO_IDS.CO2,
      course_id: COURSE_ID,
      code: 'CO2',
      description: 'Explain storage models and NoSQL databases for managing Big Data'
    },
    {
      id: CO_IDS.CO3,
      course_id: COURSE_ID,
      code: 'CO3',
      description: 'Demonstrate the use of Hadoop and its ecosystem for distributed data storage and processing'
    },
    {
      id: CO_IDS.CO4,
      course_id: COURSE_ID,
      code: 'CO4',
      description: 'Apply MapReduce, Hive, and Pig for efficient data processing and querying'
    },
    {
      id: CO_IDS.CO5,
      course_id: COURSE_ID,
      code: 'CO5',
      description: 'Analyze Big Data using advanced techniques, including statistical and machine learning methods'
    },
    {
      id: CO_IDS.CO6,
      course_id: COURSE_ID,
      code: 'CO6',
      description: 'Propose data-driven solutions for real-world problems'
    }
  ];

  for (const co of cos) {
    const { error: coErr } = await supabase.from('course_outcomes').upsert(co);
    if (coErr) console.error(`CO ${co.code} error:`, coErr);
    else console.log(`CO ${co.code} OK`);
  }

  console.log('\n--- Step 4: Loading All 270 Questions Dataset ---');
  const questionsData = require('./xds601_all_questions.data.js');
  console.log(`Loaded ${questionsData.length} questions.`);

  let insertedCount = 0;
  let optionsCount = 0;

  // Insert in chunks of 25 questions
  const chunkSize = 25;
  for (let i = 0; i < questionsData.length; i += chunkSize) {
    const chunk = questionsData.slice(i, i + chunkSize);
    const dbQuestions = chunk.map(q => ({
      id: q.id,
      department_id: DEPT_ID,
      course_id: COURSE_ID,
      module_id: q.module_id,
      course_outcome_id: q.course_outcome_id,
      k_level_id: q.k_level_id,
      question_type_id: q.question_type_id,
      marks_id: q.marks_id,
      mark_value: q.mark_value,
      question_text: q.question_text
    }));

    const { error: qErr } = await supabase.from('questions').upsert(dbQuestions);
    if (qErr) {
      console.error(`Error inserting questions chunk ${i}-${i + chunk.length}:`, qErr);
    } else {
      insertedCount += dbQuestions.length;
    }

    // Collect and insert options
    const allOptions = [];
    chunk.forEach(q => {
      if (q.options && q.options.length > 0) {
        q.options.forEach(opt => {
          allOptions.push({
            id: opt.id || crypto.randomUUID(),
            question_id: q.id,
            option_letter: opt.option_letter,
            option_text: opt.option_text,
            is_correct: opt.is_correct
          });
        });
      }
    });

    if (allOptions.length > 0) {
      const qIds = chunk.map(q => q.id);
      await supabase.from('question_options').delete().in('question_id', qIds);
      const { error: optErr } = await supabase.from('question_options').insert(allOptions);
      if (optErr) {
        console.error(`Error inserting options chunk for questions ${i}:`, optErr);
      } else {
        optionsCount += allOptions.length;
      }
    }
  }

  console.log(`\n=== SEED COMPLETED ===`);
  console.log(`Successfully saved ${insertedCount} questions into Supabase.`);
  console.log(`Successfully saved ${optionsCount} MCQ options into Supabase.`);
}

seed().catch(console.error);
