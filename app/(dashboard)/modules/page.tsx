'use client';

import React, { useState, useEffect } from 'react';
import { Module, Course } from '@/types';
import { MasterDataService } from '@/services/master-data.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Boxes, Plus, Edit2, Trash2, Filter } from 'lucide-react';

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [courseId, setCourseId] = useState('');
  const [moduleNumber, setModuleNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const loadData = async () => {
    const [mList, cList] = await Promise.all([
      MasterDataService.getModules(selectedCourseId || undefined),
      MasterDataService.getCourses()
    ]);
    setModules(mList);
    setCourses(cList);
    if (cList.length > 0 && !courseId) {
      setCourseId(cList[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCourseId]);

  const handleOpenAdd = () => {
    setEditId(null);
    setCourseId(courses[0]?.id || '');
    setModuleNumber(modules.length + 1);
    setTitle('');
    setDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (m: Module) => {
    setEditId(m.id);
    setCourseId(m.course_id);
    setModuleNumber(m.module_number);
    setTitle(m.title);
    setDescription(m.description || '');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await MasterDataService.saveModule({
      id: editId || undefined,
      course_id: courseId,
      module_number: Number(moduleNumber),
      title,
      description
    });
    setShowModal(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      await MasterDataService.deleteModule(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-brand-600" />
            Course Modules & Units
          </h1>
          <p className="text-sm text-slate-500 mt-1">Structure course syllabus into modules for targeted question mapping.</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4" />
          <span>Add Module</span>
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase">Select Course:</span>
        <select
          value={selectedCourseId}
          onChange={e => setSelectedCourseId(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-slate-50 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
        >
          <option value="">All Courses</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>
              {c.code} - {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map(mod => (
          <Card key={mod.id} className="hover:border-slate-300 transition-all">
            <div className="flex items-start justify-between">
              <Badge variant="info" className="font-semibold">
                Module {mod.module_number}
              </Badge>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(mod)}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(mod.id)}
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 mt-2 text-base">{mod.title}</h3>
            {mod.description && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mod.description}</p>
            )}
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {editId ? 'Edit Module' : 'Add Module'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Course
                </label>
                <select
                  required
                  value={courseId}
                  onChange={e => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Module Number
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={moduleNumber}
                  onChange={e => setModuleNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Module Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Direct Link Networks & Physical Layer"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Description / Subtopics
                </label>
                <textarea
                  rows={3}
                  placeholder="Encoding, Framing, Error Detection..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Module
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
