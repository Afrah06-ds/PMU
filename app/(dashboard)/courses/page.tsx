'use client';

import React, { useState, useEffect } from 'react';
import { Course, Department } from '@/types';
import { MasterDataService } from '@/services/master-data.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit2, Trash2, Filter, RefreshCw } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [deptId, setDeptId] = useState('');
  const [semester, setSemester] = useState(5);
  const [academicYear, setAcademicYear] = useState('2025-2026');

  const loadData = async () => {
    setLoading(true);
    // Clear legacy localStorage cache if any
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pmu_courses');
    }
    const [cList, dList] = await Promise.all([
      MasterDataService.getCourses(selectedDeptId || undefined),
      MasterDataService.getDepartments()
    ]);
    setCourses(cList);
    setDepartments(dList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedDeptId]);

  const handleOpenAdd = () => {
    setEditId(null);
    setCode('');
    setName('');
    setDeptId(departments[0]?.id || '11111111-1111-1111-1111-111111111111');
    setSemester(5);
    setAcademicYear('2025-2026');
    setShowModal(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditId(c.id);
    setCode(c.code);
    setName(c.name);
    setDeptId(c.department_id);
    setSemester(c.semester || 5);
    setAcademicYear(c.academic_year || '2025-2026');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await MasterDataService.saveCourse({
      id: editId || undefined,
      code,
      name,
      department_id: deptId,
      semester: Number(semester),
      academic_year: academicYear
    });
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      await MasterDataService.deleteCourse(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-600" />
            Course Catalog
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage degree courses, semester codes, and academic years.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Supabase</span>
          </Button>
          <Button variant="primary" onClick={handleOpenAdd}>
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase">Filter Department:</span>
        <select
          value={selectedDeptId}
          onChange={e => setSelectedDeptId(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-slate-50 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>
              {d.code} - {d.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
          Fetching live courses from Supabase PostgreSQL...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <Card key={course.id} className="hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <Badge variant="primary" className="font-mono text-xs">
                    {course.code}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 mt-2 text-base">{course.name}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {course.department?.name || 'Department of Computer Science & Engineering'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Semester {course.semester || 5}</span>
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{course.academic_year || '2025-2026'}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {editId ? 'Edit Course' : 'Add Course'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Department
                </label>
                <select
                  required
                  value={deptId}
                  onChange={e => setDeptId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. U24"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Machine Learning"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={e => setSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    required
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Course
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
