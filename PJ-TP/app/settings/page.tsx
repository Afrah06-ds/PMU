'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { storage } from '@/lib/storage';
import { UserSettings } from '@/types';
import { Sun, Moon, Monitor, Save, RefreshCw, Download, CheckCircle2, Trash2 } from 'lucide-react';
import { ConfirmDeleteModal } from '@/components/common/ConfirmDeleteModal';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings>(storage.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [wipeModalOpen, setWipeModalOpen] = useState(false);

  useEffect(() => {
    setSettings(storage.getSettings());
  }, []);

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleConfirmWipeData = () => {
    storage.wipeOutAllData();
    window.location.reload();
  };

  const handleExportData = () => {
    const data = {
      settings: storage.getSettings(),
      syllabi: storage.getSyllabi(),
      topics: storage.getTopics(),
      subtopics: storage.getSubtopics(),
      items: storage.getItems(),
      progress: storage.getProgressList(),
      events: storage.getRevisionEvents(),
      notes: storage.getNotes(),
      noteLinks: storage.getNoteLinks(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracker-pro-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Application Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure appearance, revision engine intervals, and manage data.
        </p>
      </div>

      {/* SECTION 1: APPEARANCE */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-xs">
        <h2 className="text-base font-semibold text-foreground">Visual Theme & Appearance</h2>
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <button
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'light'
                ? 'border-primary bg-primary/10 text-primary font-bold'
                : 'border-border hover:bg-accent text-muted-foreground'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs">Light</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'dark'
                ? 'border-primary bg-primary/10 text-primary font-bold'
                : 'border-border hover:bg-accent text-muted-foreground'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs">Dark</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'system'
                ? 'border-primary bg-primary/10 text-primary font-bold'
                : 'border-border hover:bg-accent text-muted-foreground'
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span className="text-xs">System</span>
          </button>
        </div>
      </section>

      {/* SECTION 2: REVISION SCHEDULE ENGINE */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-xs">
        <div>
          <h2 className="text-base font-semibold text-foreground">Spaced Repetition Schedule Engine</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Adjust the interval (in days) between subsequent review cycles.
          </p>
        </div>

        <form onSubmit={handleSaveSchedule} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                Revision #1
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={settings.rev_1_days}
                  onChange={(e) => setSettings({ ...settings, rev_1_days: parseInt(e.target.value) || 1 })}
                  className="w-full bg-background border border-border rounded-lg p-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                Revision #2
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={settings.rev_2_days}
                  onChange={(e) => setSettings({ ...settings, rev_2_days: parseInt(e.target.value) || 1 })}
                  className="w-full bg-background border border-border rounded-lg p-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                Revision #3
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={settings.rev_3_days}
                  onChange={(e) => setSettings({ ...settings, rev_3_days: parseInt(e.target.value) || 1 })}
                  className="w-full bg-background border border-border rounded-lg p-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                Revision #4
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={settings.rev_4_days}
                  onChange={(e) => setSettings({ ...settings, rev_4_days: parseInt(e.target.value) || 1 })}
                  className="w-full bg-background border border-border rounded-lg p-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-xs"
            >
              <Save className="w-4 h-4" /> Save Revision Schedule
            </button>

            {savedSuccess && (
              <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>
        </form>
      </section>

      {/* SECTION 3: DATA MANAGEMENT */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-xs">
        <div>
          <h2 className="text-base font-semibold text-foreground">Data Management & Purge</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Export all learning and note records or completely wipe out data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background hover:bg-accent text-foreground text-xs font-semibold shadow-xs"
          >
            <Download className="w-4 h-4 text-primary" /> Export Data (JSON)
          </button>

          <button
            onClick={() => setWipeModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold shadow-xs transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Wipe Out Entire Data
          </button>
        </div>
      </section>

      {/* Confirm Delete Modals */}
      <ConfirmDeleteModal
        isOpen={wipeModalOpen}
        onClose={() => setWipeModalOpen(false)}
        onConfirm={handleConfirmWipeData}
        title="Wipe Out Entire Data?"
        description="This will permanently delete ALL syllabi, topics, items, progress, notes, and settings. You will start with a completely empty application."
        confirmText="Wipe Out Entire Data"
        cancelText="Cancel"
        isDanger={true}
      />
    </div>
  );
}
