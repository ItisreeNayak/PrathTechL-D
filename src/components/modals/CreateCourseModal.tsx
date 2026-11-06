import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ProgramCategory, DeliveryMode, DifficultyLevel, CourseModule } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose }) => {
  const { addCourse, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProgramCategory>('Technical');
  const [mode, setMode] = useState<DeliveryMode>('Online');
  const [durationHours, setDurationHours] = useState(16);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [skillsInput, setSkillsInput] = useState('');
  const [prereqInput, setPrereqInput] = useState('');

  const [modules, setModules] = useState<CourseModule[]>([
    { id: 'm-new-1', title: 'Module 1: Foundations & Architecture Overview', durationMinutes: 45, type: 'video' },
    { id: 'm-new-2', title: 'Module 2: Core Practical Hands-On Lab', durationMinutes: 60, type: 'lab' },
    { id: 'm-new-3', title: 'Module 3: Knowledge Evaluation & Quiz', durationMinutes: 30, type: 'quiz' },
  ]);

  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleType, setNewModuleType] = useState<CourseModule['type']>('video');
  const [newModuleDuration, setNewModuleDuration] = useState(45);

  const handleAddModule = () => {
    if (!newModuleTitle.trim()) return;
    const newMod: CourseModule = {
      id: `m-new-${Date.now()}`,
      title: newModuleTitle,
      durationMinutes: Number(newModuleDuration) || 30,
      type: newModuleType,
    };
    setModules([...modules, newMod]);
    setNewModuleTitle('');
  };

  const handleRemoveModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedSkills = skillsInput
      ? skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Architecture', 'Best Practices'];
    const parsedPrereqs = prereqInput
      ? prereqInput.split(',').map((p) => p.trim()).filter(Boolean)
      : ['Basic knowledge required'];

    addCourse({
      title,
      description,
      category,
      mode,
      durationHours: Number(durationHours) || 10,
      difficulty,
      trainerId: currentUser.id,
      trainerName: currentUser.name,
      prerequisites: parsedPrereqs,
      skills: parsedSkills,
      resources: [
        { id: `res-${Date.now()}-1`, title: `${title} Syllabus & Slide Deck.pdf`, type: 'PDF', url: '#', size: '3.8 MB' },
        { id: `res-${Date.now()}-2`, title: 'Hands-on Exercise Code Repo.zip', type: 'Code Repo', url: '#', size: '10.2 MB' },
      ],
      modules: modules.length > 0 ? modules : [
        { id: 'mod-1', title: 'Module 1: Introduction', durationMinutes: 30, type: 'video' }
      ],
    });

    onClose();
    setTitle('');
    setDescription('');
    setSkillsInput('');
    setPrereqInput('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Course to Catalog"
      subtitle="Define learning curriculum, difficulty, skills acquired, and syllabus modules"
      maxWidth="3xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Save Course
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Course Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Advanced Event-Driven Microservices with Kafka"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Overview Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key takeaways, target audience, and practical real-world applications..."
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProgramCategory)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="Technical">Technical</option>
              <option value="Soft Skills">Soft Skills</option>
              <option value="Leadership">Leadership</option>
              <option value="Compliance">Compliance</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as DeliveryMode)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 bg-white focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Hours)</label>
            <input
              type="number"
              min={1}
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Skills Verified (comma-separated)</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Kafka, Event Sourcing, Distributed Tracing"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Prerequisites (comma-separated)</label>
            <input
              type="text"
              value={prereqInput}
              onChange={(e) => setPrereqInput(e.target.value)}
              placeholder="e.g. Java 17, Docker Basics"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Modules Builder */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-800">Syllabus Modules ({modules.length})</h4>
            <span className="text-2xs text-slate-500">Modules enable step-by-step progress tracking</span>
          </div>

          <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
            {modules.map((m, idx) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-lg bg-white border border-slate-200/90 p-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-700">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{m.title}</span>
                  <span className="text-2xs text-slate-400 capitalize">({m.type} • {m.durationMinutes} min)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveModule(m.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick Add Module row */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
            <input
              type="text"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="Module title..."
              className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
            />
            <select
              value={newModuleType}
              onChange={(e) => setNewModuleType(e.target.value as any)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
            >
              <option value="video">Video</option>
              <option value="reading">Reading</option>
              <option value="lab">Lab</option>
              <option value="quiz">Quiz</option>
            </select>
            <input
              type="number"
              value={newModuleDuration}
              onChange={(e) => setNewModuleDuration(Number(e.target.value))}
              placeholder="Mins"
              className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700"
            />
            <button
              type="button"
              onClick={handleAddModule}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

