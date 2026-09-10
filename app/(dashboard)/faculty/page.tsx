'use client';

import React, { useState, useEffect } from 'react';
import { FacultyProfile, Department } from '@/types';
import { MasterDataService } from '@/services/master-data.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, ShieldCheck, Mail, UserCheck, Trash2 } from 'lucide-react';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'faculty'>('faculty');
  const [deptId, setDeptId] = useState('');

  const loadData = async () => {
    const [fList, dList] = await Promise.all([
      MasterDataService.getFaculty(),
      MasterDataService.getDepartments()
    ]);
    setFaculty(fList);
    setDepartments(dList);
    if (dList.length > 0 && !deptId) setDeptId(dList[0].id);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setFullName('');
    setEmail('');
    setRole('faculty');
    setDeptId(departments[0]?.id || '');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await MasterDataService.saveFaculty({
      full_name: fullName,
      email,
      role,
      department_id: deptId,
      status: 'active'
    });
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this faculty account?')) {
      await MasterDataService.deleteFaculty(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            Faculty & User Accounts
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage system administrator and faculty role permissions.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {faculty.map(f => (
          <Card key={f.id} className="hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <Badge variant={f.role === 'admin' ? 'primary' : 'info'} className="capitalize">
                  {f.role === 'admin' ? (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-brand-500" /> Admin
                    </span>
                  ) : (
                    'Faculty'
                  )}
                </Badge>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="font-bold text-slate-900 mt-3 text-base">{f.full_name}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-mono">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {f.email}
              </p>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                {f.department?.name || 'Department of Computer Science & Engineering'}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Faculty Account</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Aris Thorne"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="faculty@pmu.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as 'admin' | 'faculty')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="faculty">Faculty Member</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Department
                </label>
                <select
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

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
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
