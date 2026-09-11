'use client';

import React, { useState, useEffect } from 'react';
import { MasterDataService } from '@/services/master-data.service';
import { Department, FacultyProfile, UserRole } from '@/types';
import {
  Building2,
  Users,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  Key,
  CheckCircle2,
  XCircle,
  Search,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AcademicSetupPage() {
  const [activeTab, setActiveTab] = useState<'departments' | 'faculty'>('departments');

  // Data states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [faculty, setFaculty] = useState<FacultyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Department Modal State
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');

  // Faculty Modal State
  const [facultyModalOpen, setFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('faculty');
  const [deptId, setDeptId] = useState('');
  const [canCreateFaculty, setCanCreateFaculty] = useState(false);
  const [canCreateCourses, setCanCreateCourses] = useState(true);
  const [canCreateQuestions, setCanCreateQuestions] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [deptsData, facultyData] = await Promise.all([
        MasterDataService.getDepartments(),
        MasterDataService.getFaculty()
      ]);
      setDepartments(deptsData);
      setFaculty(facultyData);
      if (deptsData.length > 0 && !deptId) {
        setDeptId(deptsData[0].id);
      }
    } catch (e) {
      console.error('Failed to load academic setup data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Department Handlers
  const handleOpenDeptModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setDeptCode(dept.code);
      setDeptName(dept.name);
    } else {
      setEditingDept(null);
      setDeptCode('');
      setDeptName('');
    }
    setDeptModalOpen(true);
  };

  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptCode.trim() || !deptName.trim()) return;

    await MasterDataService.saveDepartment({
      id: editingDept?.id,
      code: deptCode.trim().toUpperCase(),
      name: deptName.trim()
    });

    setDeptModalOpen(false);
    loadData();
  };

  const handleDeleteDept = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    await MasterDataService.deleteDepartment(id);
    loadData();
  };

  // Faculty Handlers
  const handleOpenFacultyModal = (fac?: FacultyProfile) => {
    if (fac) {
      setEditingFaculty(fac);
      setFullName(fac.full_name);
      setEmail(fac.email);
      setPassword(fac.password || '••••••••');
      setRole(fac.role);
      setDeptId(fac.department_id || (departments[0]?.id ?? ''));
      setCanCreateFaculty(fac.can_create_faculty ?? fac.role === 'admin');
      setCanCreateCourses(fac.can_create_courses ?? true);
      setCanCreateQuestions(fac.can_create_questions ?? true);
    } else {
      setEditingFaculty(null);
      setFullName('');
      setEmail('');
      setPassword('password123');
      setRole('faculty');
      setDeptId(departments[0]?.id ?? '');
      setCanCreateFaculty(false);
      setCanCreateCourses(true);
      setCanCreateQuestions(true);
    }
    setFacultyModalOpen(true);
  };

  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    await MasterDataService.saveFaculty({
      id: editingFaculty?.id,
      full_name: fullName.trim(),
      email: email.trim(),
      password: password || 'password123',
      role,
      department_id: deptId,
      status: 'active',
      can_create_faculty: canCreateFaculty,
      can_create_courses: canCreateCourses,
      can_create_questions: canCreateQuestions
    });

    setFacultyModalOpen(false);
    loadData();
  };

  const handleDeleteFaculty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty account?')) return;
    await MasterDataService.deleteFaculty(id);
    loadData();
  };

  const filteredDepts = departments.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaculty = faculty.filter(f =>
    f.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-slate-900 tracking-tight">
            Academic Setup
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage institutional departments, faculty accounts, and granular access permissions.
          </p>
        </div>

        {/* Action Button */}
        <div>
          {activeTab === 'departments' ? (
            <Button variant="primary" onClick={() => handleOpenDeptModal()}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Department
            </Button>
          ) : (
            <Button variant="primary" onClick={() => handleOpenFacultyModal()}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Faculty Account
            </Button>
          )}
        </div>
      </div>

      {/* Tabs & Search Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-lg border border-slate-200/60">
          <button
            type="button"
            onClick={() => setActiveTab('departments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'departments'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Departments ({departments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faculty')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'faculty'
                ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Faculty Accounts ({faculty.length})</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 font-medium">Loading Academic Setup...</div>
      ) : activeTab === 'departments' ? (
        /* Departments List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepts.map(dept => (
            <div
              key={dept.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-xs font-poppins">
                    {dept.code}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenDeptModal(dept)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDept(dept.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm font-poppins">{dept.name}</h3>
              </div>
            </div>
          ))}
          {filteredDepts.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              No departments found matching your query.
            </div>
          )}
        </div>
      ) : (
        /* Faculty Accounts Table with Access Permissions */
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Faculty / Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Access Permissions (3 Flags)</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFaculty.map(fac => {
                  const dept = departments.find(d => d.id === fac.department_id);
                  const canFaculty = fac.can_create_faculty ?? fac.role === 'admin';
                  const canCourses = fac.can_create_courses ?? true;
                  const canQuestions = fac.can_create_questions ?? true;

                  return (
                    <tr key={fac.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900">{fac.full_name}</div>
                        <div className="text-slate-400 text-[11px]">{fac.email}</div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">
                        {dept ? `${dept.code} - ${dept.name}` : 'General'}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={fac.role === 'admin' ? 'primary' : 'info'} className="capitalize">
                          {fac.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          {/* 1. Create Faculty */}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              canFaculty
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}
                          >
                            {canFaculty ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            <span>Create Faculty</span>
                          </span>

                          {/* 2. Create Courses */}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              canCourses
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}
                          >
                            {canCourses ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            <span>Create Courses</span>
                          </span>

                          {/* 3. Create Questions */}
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              canQuestions
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {canQuestions ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Create Questions</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>Read Only</span>
                              </>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenFacultyModal(fac)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Edit Account & Permissions"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFaculty(fac.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredFaculty.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No faculty accounts found matching your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Department Modal */}
      {deptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-poppins text-base">
                {editingDept ? 'Edit Department' : 'Add New Department'}
              </h3>
              <button
                onClick={() => setDeptModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveDept} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department Code
                </label>
                <input
                  type="text"
                  required
                  value={deptCode}
                  onChange={e => setDeptCode(e.target.value)}
                  placeholder="e.g. CSE"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department Full Name
                </label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={e => setDeptName(e.target.value)}
                  placeholder="e.g. Department of Computer Science & Engineering"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setDeptModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Department
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Account & Permissions Modal */}
      {facultyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 font-poppins text-base">
                {editingFaculty ? 'Edit Faculty Account & Permissions' : 'Create Faculty Account'}
              </h3>
              <button
                onClick={() => setFacultyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveFaculty} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Dr. Aris Thorne"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="faculty@pmu.edu"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="password123"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
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
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  >
                    <option value="faculty">Faculty</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>
              </div>

              {/* Granular Access Permissions (3 Switches) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Access Control Permissions (3 Flags)</span>
                </p>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
                    <div>
                      <p className="font-semibold text-slate-900">1. Can Create Faculty Accounts</p>
                      <p className="text-[11px] text-slate-500">Allows adding & managing other faculty members</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={canCreateFaculty}
                      onChange={e => setCanCreateFaculty(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
                    <div>
                      <p className="font-semibold text-slate-900">2. Can Create Courses & Modules</p>
                      <p className="text-[11px] text-slate-500">Allows defining new courses, modules, and COs</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={canCreateCourses}
                      onChange={e => setCanCreateCourses(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 cursor-pointer">
                    <div>
                      <p className="font-semibold text-slate-900">3. Can Create Questions</p>
                      <p className="text-[11px] text-slate-500">Uncheck to set account in Read-Only mode</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={canCreateQuestions}
                      onChange={e => setCanCreateQuestions(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" type="button" onClick={() => setFacultyModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
