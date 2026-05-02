import { useState } from "react";
import { Edit2, MessageSquare } from "lucide-react";

const studentData = {
  rollNumber: "24N81A6758",
  college: "Sphoorthi Engineering College",
  firstName: "NEANAVTH",
  lastName: "JASHWANTH SINGH",
  mobile: "8074772823",
  email: "jashwanth038@gmail.com",
  batch: "2024-2028",
  branch: "Computer Science & Engineering (Data Science)",
  section: "A",
  semester: "IV",
  cgpa: "8.4",
  fatherName: "NEANAVTH VENKAT RAO",
  dob: "15-03-2006",
  address: "Hyderabad, Telangana",
};

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-2.5 bg-white">
        <span className="text-sm font-semibold text-[#182B68]">{value}</span>
        <Edit2 size={14} className="text-gray-300 cursor-pointer hover:text-[#3D65F4] transition-colors" />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [tab, setTab] = useState<"profile" | "feedback">("profile");

  return (
    <div className="h-full overflow-y-auto">
      {/* Top tabs */}
      <div className="px-6 pt-4 pb-0 border-b border-gray-100 flex gap-6">
        {[
          { id: "profile", label: "My Profile" },
          { id: "feedback", label: "Complaints & Feedback" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
              tab === t.id ? "border-[#3D65F4] text-[#3D65F4]" : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="max-w-2xl mx-auto p-6">
          {/* Header banner */}
          <div
            className="rounded-2xl px-6 py-5 mb-6 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #7C5CFC, #3D65F4, #FF6B4A)" }}
          >
            <span className="text-white font-extrabold text-lg tracking-wide">{studentData.rollNumber}</span>
            <span className="text-white font-semibold text-sm">{studentData.college}</span>
          </div>

          {/* Profile info */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 shrink-0">
              <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
                <circle cx="40" cy="28" r="16" fill="#CBD5E1"/>
                <ellipse cx="40" cy="68" rx="28" ry="16" fill="#CBD5E1"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#3D65F4]">
                {studentData.firstName} {studentData.lastName}
              </h2>
              <p className="text-sm text-gray-400">{studentData.rollNumber}</p>
            </div>
          </div>

          {/* General Information */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-[#182B68] mb-4">My General Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="First name" value={studentData.firstName} />
              <InfoField label="Second name" value={studentData.lastName} />
              <InfoField label="Mobile" value={studentData.mobile} />
              <InfoField label="Email" value={studentData.email} />
              <InfoField label="Batch" value={studentData.batch} />
              <InfoField label="Roll Number" value={studentData.rollNumber} />
              <InfoField label="Branch" value={studentData.branch} />
              <InfoField label="Section" value={studentData.section} />
              <InfoField label="Current Semester" value={studentData.semester} />
              <InfoField label="CGPA" value={studentData.cgpa} />
              <InfoField label="Father's Name" value={studentData.fatherName} />
              <InfoField label="Date of Birth" value={studentData.dob} />
            </div>
          </div>

          {/* Academic summary */}
          <div className="bg-[#F9FBFF] rounded-2xl p-5 border border-blue-100">
            <h3 className="text-sm font-bold text-[#182B68] mb-4">Academic Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "CGPA", value: studentData.cgpa },
                { label: "Semester", value: "IV" },
                { label: "Attendance", value: "82%" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-3 text-center border border-blue-50">
                  <p className="text-lg font-extrabold text-[#3D65F4]">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "feedback" && (
        <div className="max-w-lg mx-auto p-6">
          <h3 className="text-sm font-bold text-[#182B68] mb-4">Complaints & Feedback</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Subject</label>
              <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3D65F4]" placeholder="Enter subject" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Message</label>
              <textarea className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3D65F4] h-32 resize-none" placeholder="Describe your complaint or feedback" />
            </div>
            <button className="w-full py-3 rounded-xl text-white font-semibold text-sm" style={{ background: "linear-gradient(135deg, #3D65F4, #5B3CF4)" }}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
