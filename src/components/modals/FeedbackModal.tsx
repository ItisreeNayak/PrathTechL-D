import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Star } from 'lucide-react';

interface FeedbackModalProps {
  courseId: string;
  courseTitle: string;
  trainerName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  courseId,
  courseTitle,
  trainerName,
  isOpen,
  onClose,
}) => {
  const { submitFeedback, currentUser } = useApp();

  const [courseRating, setCourseRating] = useState(5);
  const [trainerRating, setTrainerRating] = useState(5);
  const [contentQuality, setContentQuality] = useState(5);
  const [comments, setComments] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback({
      courseId,
      courseTitle,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      trainerName,
      courseRating,
      trainerRating,
      contentQuality,
      comments: comments || 'High-quality training session with practical real-world takeaways.',
    });
    onClose();
  };

  const StarPicker = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (val: number) => void;
    label: string;
  }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => onChange(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`h-5 w-5 ${
                star <= value ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Course & Trainer Feedback"
      subtitle={`Your review helps elevate curriculum standards for ${courseTitle}`}
      maxWidth="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700"
          >
            Submit Feedback
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3">
          <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Subject</p>
          <p className="text-xs font-bold text-slate-900 mt-0.5">{courseTitle}</p>
          <p className="text-2xs text-slate-500">Instructor: {trainerName}</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-3 bg-white">
          <StarPicker
            label="Overall Course Content Relevance"
            value={courseRating}
            onChange={setCourseRating}
          />
          <StarPicker
            label="Instructor Clarity & Engagement"
            value={trainerRating}
            onChange={setTrainerRating}
          />
          <StarPicker
            label="Hands-On Labs & Exercise Quality"
            value={contentQuality}
            onChange={setContentQuality}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Written Feedback & Suggestions
          </label>
          <textarea
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share what worked best and where the curriculum can improve..."
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden resize-none"
          />
        </div>
      </form>
    </Modal>
  );
};

