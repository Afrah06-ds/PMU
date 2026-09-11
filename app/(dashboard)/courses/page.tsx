'use client';

import React, { useState, useEffect } from 'react';
import { MasterDataService } from '@/services/master-data.service';
import { Course, Department, Module, CourseOutcome, KLevel } from '@/types';
import {
  BookOpen,
  Boxes,
  Target,
  Plus,
  Edit2,
  Trash2,
  Search,
  Building2,
  GraduationCap,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [kLevels, setKLevels] = useState<KLevel[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');

  // Selected Course for Nested Drawer/Modal
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'modules' | 'cos'>('modules');

  // Modules & COs for active course
  const [courseModules, setCourseModules] = useState<Module[]>([]);
  const [courseCOs, setCourseCOs] = useState<CourseOutcome[]>([]);
  const [subLoading, setSubLoading] = useState(false);

  // Course Modal State
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [deptId, setDeptId] = useState('');
  const [semester, setSemester] = useState(1);
  const [academicYear, setAcademicYear] = useState('2025-2026');

  // Module Modal State
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleNum, setModuleNum] = useState(1);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');

  // CO Modal State
  const [coModalOpen, setCOModalOpen] = useState(false);
  const [editingCO, setEditingCO] = useState<CourseOutcome | null>(null);
  const [coNumber, setCONumber] = useState(1);
  const [coDesc, setCODesc] = useState('');
  const [selectedKLevel, setSelectedKLevel] = useState('K1');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [coursesData, deptsData, kLevelsData] = await Promise.all([
        MasterDataService.getCourses(),
        MasterDataService.getDepartments(),
        MasterDataService.getKLevels()
      ]);
      setCourses(coursesData);
      setDepartments(deptsData);
      setKLevels(kLevelsData);
      if (deptsData.length > 0 && !deptId) {
        setDeptId(deptsData[0].id);
      }
    } catch (e) {
      console.error('Failed to load courses data:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseSubDetails = async (course: Course) => {
    setActiveCourse(course);
    setSubLoading(true);
    try {
      const [mods, cos] = await Promise.all([
        MasterDataService.getModules(course.id),
        MasterDataService.getCourseOutcomes(course.id)
      ]);
      setCourseModules(mods);
      setCourseCOs(cos);
    } catch (e) {
      console.error('Failed to load course sub details:', e);
    } finally {
      setSubLoading(false);
    }
  };

  // Course CRUD Handlers
  const handleOpenCourseModal = (c?: Course) => {
    if (c) {
      setEditingCourse(c);
      setCourseCode(c.code);
      setCourseName(c.name);
      setDeptId(c.department_id);
      setSemester(c.semester);
      setAcademicYear(c.academic_year);
    } else {
      setEditingCourse(null);
      setCourseCode('');
      setCourseName('');
      setDeptId(departments[0]?.id || '');
      setSemester(1);
      setAcademicYear('2025-2026');
    }
    setCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim()) return;

    await MasterDataService.saveCourse({
      id: editingCourse?.id,
      code: courseCode.trim().toUpperCase(),
      name: courseName.trim(),
      department_id: deptId,
      semester,
      academic_year: academicYear
    });

    setCourseModalOpen(false);
    loadInitialData();
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course and all its nested modules/COs?')) return;
    await MasterDataService.deleteCourse(id);
    if (activeCourse?.id === id) setActiveCourse(null);
    loadInitialData();
  };

  // Module CRUD Handlers
  const handleOpenModuleModal = (m?: Module) => {
    if (m) {
      setEditingModule(m);
      setModuleNum(m.module_number);
      setModuleTitle(m.title);
      setModuleDesc(m.description || '');
    } else {
      setEditingModule(null);
      const nextNum = courseModules.length > 0
        ? Math.max(...courseModules.map(mod => mod.module_number)) + 1
        : 1;
      setModuleNum(nextNum);
      setModuleTitle('');
      setModuleDesc('');
    }
    setModuleModalOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse || !moduleTitle.trim()) return;

    await MasterDataService.saveModule({
      id: editingModule?.id,
      course_id: activeCourse.id,
      module_number: moduleNum,
      title: moduleTitle.trim(),
      description: moduleDesc.trim()
    });

    setModuleModalOpen(false);
    if (activeCourse) loadCourseSubDetails(activeCourse);
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm('Delete this module?')) return;
    await MasterDataService.deleteModule(id);
    if (activeCourse) loadCourseSubDetails(activeCourse);
  };

  // CO CRUD Handlers
  const handleOpenCOModal = (co?: CourseOutcome) => {
    if (co) {
      setEditingCO(co);
      setCONumber(co.co_number || parseInt(co.code.replace(/\D/g, '')) || 1);
      setCODesc(co.description);
      setSelectedKLevel(co.k_level_code || 'K1');
    } else {
      setEditingCO(null);
      const nextOrder = courseCOs.length > 0
        ? Math.max(...courseCOs.map(c => c.co_number || parseInt(c.code.replace(/\D/g, '')) || 0)) + 1
        : 1;
      setCONumber(nextOrder);
      setCODesc('');
      setSelectedKLevel('K1');
    }
    setCOModalOpen(true);
  };

  const handleSaveCO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse || !coDesc.trim()) return;

    await MasterDataService.saveCourseOutcome({
      id: editingCO?.id,
      course_id: activeCourse.id,
      co_number: coNumber,
      code: `CO${coNumber}`,
      description: coDesc.trim(),
      k_level_code: selectedKLevel
    });

    setCOModalOpen(false);
    if (activeCourse) loadCourseSubDetails(activeCourse);
  };

  const handleDeleteCO = async (id: string) => {
    if (!confirm('Delete this Course Outcome?')) return;
    await MasterDataService.deleteCourseOutcome(id);
    if (activeCourse) loadCourseSubDetails(activeCourse);
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDeptId === 'all' || c.department_id === selectedDeptId;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-slate-900 tracking-tight">
            Courses & Modules Management
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage course catalog, embedded modules, and Course Outcomes (CO) with integer ordering & K-Levels.
          </p>
        </div>

        <Button variant="primary" onClick={() => handleOpenCourseModal()}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Course
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Department Filter */}
          <select
            value={selectedDeptId}
            onChange={e => setSelectedDeptId(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search course code or name..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Main Grid: Courses List & Active Course Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Courses Grid (8 cols if drawer active, else 12) */}
        <div className={`${activeCourse ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4 transition-all duration-300`}>
          {loading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Loading course catalog...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map(c => {
                const isSelected = activeCourse?.id === c.id;
                const dept = departments.find(d => d.id === c.department_id);

                return (
                  <div
                    key={c.id}
                    className={`bg-white border rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-600/10 shadow-md'
                        : 'border-slate-200 hover:border-indigo-300'
                    }`}
                    onClick={() => loadCourseSubDetails(c)}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-xs font-poppins">
                          {c.code}
                        </span>
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleOpenCourseModal(c)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
                            title="Edit Course"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCourse(c.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50 transition-colors"
                            title="Delete Course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm font-poppins leading-snug">{c.name}</h3>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
                          Sem {c.semester}
                        </span>
                        <span>•</span>
                        <span>AY {c.academic_year}</span>
                        <span>•</span>
                        <span className="text-slate-600 truncate max-w-[130px]">
                          {dept?.code || 'Dept'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Manage Modules & COs</span>
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                    </div>
                  </div>
                );
              })}
              {filteredCourses.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 text-sm">
                  No courses found matching your criteria.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Active Course Modules & CO Inspector Drawer */}
        {activeCourse && (
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-5 flex flex-col sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-600 text-white rounded font-bold text-xs font-poppins">
                    {activeCourse.code}
                  </span>
                  <h2 className="font-bold text-slate-900 text-base font-poppins truncate max-w-[260px]">
                    {activeCourse.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Embedded Modules & Course Outcome (CO) Management
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveCourse(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Tabs: Modules vs Course Outcomes */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setActiveSubTab('modules')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeSubTab === 'modules'
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Boxes className="w-4 h-4" />
                <span>Modules ({courseModules.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubTab('cos')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeSubTab === 'cos'
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Course Outcomes ({courseCOs.length})</span>
              </button>
            </div>

            {/* Sub-Tab 1: Modules Management */}
            {activeSubTab === 'modules' && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Course Modules Breakdown
                  </h4>
                  <Button variant="outline" size="sm" onClick={() => handleOpenModuleModal()}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Module
                  </Button>
                </div>

                {subLoading ? (
                  <div className="py-8 text-center text-slate-400 text-xs">Loading modules...</div>
                ) : (
                  <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
                    {courseModules.map(m => (
                      <div
                        key={m.id}
                        className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-1.5 hover:border-indigo-200 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-indigo-700 text-xs font-poppins bg-indigo-100/70 px-2 py-0.5 rounded">
                            Module {m.module_number}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenModuleModal(m)}
                              className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteModule(m.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <h5 className="font-semibold text-slate-900 text-xs">{m.title}</h5>
                        {m.description && <p className="text-[11px] text-slate-500 leading-normal">{m.description}</p>}
                      </div>
                    ))}
                    {courseModules.length === 0 && (
                      <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No modules created for this course yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Sub-Tab 2: Course Outcomes (CO) Management with Integer Order & K-Level */}
            {activeSubTab === 'cos' && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Course Outcomes (CO) & Bloom's K-Levels
                  </h4>
                  <Button variant="outline" size="sm" onClick={() => handleOpenCOModal()}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Course Outcome
                  </Button>
                </div>

                {subLoading ? (
                  <div className="py-8 text-center text-slate-400 text-xs">Loading course outcomes...</div>
                ) : (
                  <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
                    {courseCOs.map(co => {
                      const coNum = co.co_number || parseInt(co.code.replace(/\D/g, '')) || 1;
                      const kCode = co.k_level_code || 'K1';
                      const kObj = kLevels.find(k => k.code === kCode);

                      return (
                        <div
                          key={co.id}
                          className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 hover:border-emerald-200 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-white text-xs font-poppins bg-emerald-600 px-2.5 py-0.5 rounded-md shadow-2xs">
                                CO{coNum}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {kCode} {kObj ? `- ${kObj.name}` : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenCOModal(co)}
                                className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCO(co.id)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs font-medium text-slate-800 leading-snug">{co.description}</p>
                        </div>
                      );
                    })}
                    {courseCOs.length === 0 && (
                      <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        No Course Outcomes defined for this course. Click Add Course Outcome to define CO1, CO2, etc.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Course Modal */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-poppins text-base">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h3>
              <button onClick={() => setCourseModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ×
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    placeholder="e.g. CS8591"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Semester
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={semester}
                    onChange={e => setSemester(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  placeholder="e.g. Computer Networks"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={deptId}
                    onChange={e => setDeptId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    required
                    value={academicYear}
                    onChange={e => setAcademicYear(e.target.value)}
                    placeholder="2025-2026"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setCourseModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Course
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Module Modal */}
      {moduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-poppins text-base">
                {editingModule ? 'Edit Module' : 'Add Module'}
              </h3>
              <button onClick={() => setModuleModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ×
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Module Number
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={moduleNum}
                  onChange={e => setModuleNum(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Module Title
                </label>
                <input
                  type="text"
                  required
                  value={moduleTitle}
                  onChange={e => setModuleTitle(e.target.value)}
                  placeholder="e.g. Direct Link Networks & Physical Layer"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Topics
                </label>
                <textarea
                  rows={3}
                  value={moduleDesc}
                  onChange={e => setModuleDesc(e.target.value)}
                  placeholder="Encoding, Framing, Error Detection..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setModuleModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Module
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Outcome (CO) Modal with Integer Order & K-Level */}
      {coModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-poppins text-base">
                {editingCO ? 'Edit Course Outcome' : 'Add Course Outcome'}
              </h3>
              <button onClick={() => setCOModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ×
              </button>
            </div>

            <form onSubmit={handleSaveCO} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    CO Order (Integer)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={coNumber}
                    onChange={e => setCONumber(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none font-bold"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Generates code: CO{coNumber}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Assigned K-Level
                  </label>
                  <select
                    value={selectedKLevel}
                    onChange={e => setSelectedKLevel(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none font-semibold text-indigo-700"
                  >
                    {kLevels.map(k => (
                      <option key={k.id} value={k.code}>
                        {k.code} - {k.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  CO Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={coDesc}
                  onChange={e => setCODesc(e.target.value)}
                  placeholder="Understand physical layer concepts, framing, and link level error detection..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setCOModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Course Outcome
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
