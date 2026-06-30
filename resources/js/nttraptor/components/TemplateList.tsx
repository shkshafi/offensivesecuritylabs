import React, { useState } from 'react';
import { ArrowLeft, Plus, Edit3, Trash2, FileText, Shield, AlertTriangle } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  html: string;
  isDefault: boolean;
}

interface TemplateListProps {
  templates: Template[];
  onCreateTemplate: (name: string) => void;
  onEditTemplate: (id: string) => void;
  onDeleteTemplate: (id: string) => void;
  onClose: () => void;
}

export default function TemplateList({
  templates,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onClose
}: TemplateListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;
    onCreateTemplate(newTemplateName.trim());
    setNewTemplateName('');
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-700 dark:text-slate-200 font-sans selection:bg-blue-500/30">
      <main className="w-full px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pt-4 pb-2 mb-8 border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2">
                Template
                <span className="bg-gradient-to-br from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Settings
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Manage report templates. Create new templates using the Default Template as a base.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="ntt-btn-glowing w-auto shrink-0"
          >
            <span className="ntt-btn-glowing-inner py-2 px-4 h-full">
              <Plus className="w-4 h-4" />
              <span>Create New Template</span>
            </span>
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-650 rounded-xl p-5 transition-all flex flex-col justify-between relative overflow-hidden shadow-sm min-h-[160px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="text-base font-semibold text-slate-800 dark:text-white break-words">
                    {template.name}
                  </h4>
                  {template.isDefault ? (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full shrink-0">
                      Default
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-350 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 px-2 py-0.5 rounded-full shrink-0">
                      Custom
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {template.isDefault 
                    ? "Standard report template. Cannot be deleted." 
                    : "Custom template based on the default template."}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-4 mt-4">
                {!template.isDefault ? (
                  <button
                    onClick={() => setTemplateToDelete(template.id)}
                    className="p-1.5 text-slate-500 hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/10 rounded-md transition-all"
                    title="Delete Template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-8"></div>
                )}

                <button
                  onClick={() => onEditTemplate(template.id)}
                  className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/50 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-800 dark:text-white transition-all group-hover:border-slate-300 dark:group-hover:border-slate-650"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Create New Template
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Enter a name for the new template. It will copy the current default template as its base content.
              </p>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Template Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="e.g. Red Team Custom Layout"
                    className="w-full rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/50 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 transition-all"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => {
                      setNewTemplateName('');
                      setShowCreateModal(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 text-white dark:bg-gradient-to-r dark:from-blue-500 dark:to-indigo-500 dark:text-white hover:bg-slate-800 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-sm font-semibold rounded-lg transition-all shadow-md dark:shadow-[0_0_15px_rgba(96,165,250,0.15)]"
                  >
                    Create Template
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {templateToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Delete Template
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Are you sure you want to delete the template <span className="font-semibold text-slate-900 dark:text-white">"{templates.find(t => t.id === templateToDelete)?.name}"</span>? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setTemplateToDelete(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (templateToDelete) {
                      onDeleteTemplate(templateToDelete);
                      setTemplateToDelete(null);
                    }
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
