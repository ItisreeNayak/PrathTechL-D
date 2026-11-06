import React from 'react';
import { Certificate } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Award, Download, Printer, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  const { addToast } = useApp();

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    addToast('Certificate Downloaded', `Certificate ${certificate.certificateNumber} saved as PDF.`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title="Official Professional Certification"
      subtitle="PrathTech Verified Credential Document"
      footer={
        <>
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 flex items-center gap-1.5"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </>
      }
    >
      <div className="relative overflow-hidden rounded-2xl border-4 border-double border-indigo-900/30 bg-gradient-to-br from-amber-50/40 via-white to-indigo-50/30 p-8 text-center shadow-lg font-serif">
        {/* Subtle Watermark Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <Award className="w-96 h-96 text-indigo-950" />
        </div>

        {/* Top Badges */}
        <div className="flex items-center justify-between border-b border-indigo-100 pb-4 font-sans text-xs">
          <div className="flex items-center gap-2">
            <img src="/prath-logo.png" alt="PrathTech" className="h-6 w-auto object-contain" />
            <span className="font-extrabold tracking-widest uppercase text-indigo-950">
              PrathTech Learning & Development Academy
            </span>
          </div>
          <span className="font-mono text-2xs text-slate-500 font-semibold">
            ID: {certificate.certificateNumber}
          </span>
        </div>

        {/* Certificate Title */}
        <div className="mt-8">
          <p className="text-xs font-sans uppercase tracking-widest text-indigo-600 font-bold">
            Certificate of Achievement
          </p>
          <p className="mt-2 text-xs font-sans text-slate-500 italic">This is proudly presented to</p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight underline decoration-amber-400 decoration-2 underline-offset-8">
            {certificate.employeeName}
          </h2>
          <p className="mt-2 text-xs font-sans text-slate-600">
            {certificate.employeeCode} • {certificate.employeeDept}
          </p>
        </div>

        {/* Body Text */}
        <div className="mt-6 max-w-lg mx-auto">
          <p className="text-xs font-sans text-slate-600 leading-relaxed">
            for successfully completing all syllabus modules, technical assessments, and competency evaluations in
          </p>
          <h3 className="mt-2 text-lg font-bold font-sans text-indigo-950">
            {certificate.courseTitle}
          </h3>
          {certificate.grade && (
            <p className="mt-1 font-sans text-xs font-semibold text-emerald-700">
              Honors Grade: {certificate.grade}
            </p>
          )}
        </div>

        {/* Skills verified pill badges */}
        {certificate.skillsVerified && certificate.skillsVerified.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-1.5 font-sans">
            {certificate.skillsVerified.map((skill, i) => (
              <span
                key={i}
                className="rounded-full bg-white border border-slate-200 px-3 py-1 text-2xs font-semibold text-slate-700 shadow-2xs"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        )}

        {/* Signatures & Seal Grid */}
        <div className="mt-10 grid grid-cols-3 items-end border-t border-indigo-100 pt-6 font-sans">
          {/* Left: Lead Instructor */}
          <div className="text-left">
            <div className="font-serif italic text-lg text-slate-800 -rotate-3">
              {certificate.instructor}
            </div>
            <div className="h-0.5 w-32 bg-slate-300 mt-1" />
            <p className="text-2xs font-bold text-slate-700 mt-1 uppercase">Lead Instructor</p>
            <p className="text-3xs text-slate-400">Technical Excellence Board</p>
          </div>

          {/* Center: Official Gold Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-amber-950 shadow-lg ring-4 ring-amber-100/80">
              <Award className="h-9 w-9" />
            </div>
            <span className="text-3xs uppercase tracking-widest text-amber-900 font-bold mt-1.5">
              Verified Credential
            </span>
          </div>

          {/* Right: Date & Verification QR */}
          <div className="text-right">
            <div className="flex justify-end mb-1">
              <QrCode className="h-10 w-10 text-slate-800 p-1 border border-slate-200 bg-white rounded" />
            </div>
            <p className="text-2xs text-slate-600">
              <span className="font-bold">Issued:</span> {certificate.issueDate}
            </p>
            <p className="text-2xs text-slate-600">
              <span className="font-bold">Valid Until:</span> {certificate.expiryDate}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

