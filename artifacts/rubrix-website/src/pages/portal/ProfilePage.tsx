import { useState } from "react";
import { Edit2, MapPin, Phone, Mail, Globe, Award, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRubrixData } from "../../hooks/useRubrixData";

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-[11px] text-gray-400 mb-1 font-medium">{label}</label>
      <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-2.5 bg-white hover:border-[#3D65F4]/40 transition-colors">
        <span className="text-sm font-semibold text-[#182B68]">{value || "—"}</span>
        <Edit2 size={13} className="text-gray-300 cursor-pointer hover:text-[#3D65F4] transition-colors shrink-0 ml-2" />
      </div>
    </div>
  );
}

interface RubrixProfile {
  firstName?: string; lastName?: string; mobileNo?: string;
  personalMail?: string; workMail?: string; designation?: string;
  batchName?: string; section?: string; currentYear?: string;
  currentSem?: string; cgpa?: string; fatherName?: string; dob?: string;
  instituteName?: string; departmentName?: string;
}

export default function ProfilePage() {
  const [tab, setTab] = useState<"profile" | "feedback">("profile");
  const { student } = useAuth();

  const idNo = student?.identificationNo || (student?.rollNumber ? `SPHN_STD_${student.rollNumber}` : "");
  const { data: rawInfo, loading: infoLoading } = useRubrixData<{ result?: RubrixProfile[] }>(
    "main",
    `/my-account/info?identificationNo=${encodeURIComponent(idNo)}`,
    !!idNo,
  );
  const info: RubrixProfile = rawInfo?.result?.[0] || {};

  // Merge: prefer live API over cached profile
  const firstName = info.firstName || student?.firstName || "";
  const lastName  = info.lastName  || student?.lastName  || "";
  const fullName  = [firstName, lastName].filter(Boolean).join(" ") || student?.rollNumber || "";
  const email     = info.personalMail  || info.workMail  || student?.email    || "";
  const mobile    = info.mobileNo      || student?.mobile   || "";
  const college   = info.instituteName || student?.college  || "";
  const branch    = info.departmentName|| student?.branch   || "";
  const batch     = info.batchName     || student?.batch    || "";
  const section   = info.section       || student?.section  || "";
  const year      = info.currentYear   || student?.year     || "";
  const semester  = info.currentSem    || student?.semester || "";
  const cgpa      = info.cgpa          || student?.cgpa     || "";
  const roll      = student?.rollNumber || "";

  return (
    <div className="h-full overflow-y-auto bg-[#F9FBFF]">
      {/* Tabs */}
      <div className="px-6 pt-4 pb-0 bg-white border-b border-gray-100 flex gap-6">
        {[{ id: "profile", label: "My Profile" }, { id: "feedback", label: "Complaints & Feedback" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as "profile" | "feedback")}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${tab === t.id ? "border-[#3D65F4] text-[#3D65F4]" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="max-w-2xl mx-auto p-6 space-y-5">

          {infoLoading && (
            <div className="flex items-center gap-2 text-xs text-[#3D65F4] font-semibold px-1">
              <Loader2 size={13} className="animate-spin" /> Syncing live profile data…
            </div>
          )}

          {/* Banner */}
          <div className="rounded-2xl px-6 py-5 flex items-center justify-between shadow-lg"
            style={{ background: "linear-gradient(135deg, #7C5CFC 0%, #3D65F4 50%, #FF6B4A 100%)" }}>
            <div>
              <p className="text-white/70 text-xs font-semibold mb-0.5">Roll Number</p>
              <span className="text-white font-extrabold text-xl tracking-wide">{roll}</span>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs font-semibold mb-0.5">Institution</p>
              <span className="text-white font-bold text-sm">{college || "Sphoorthy Engineering College"}</span>
            </div>
          </div>

          {/* Profile header */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#EEF2FF] to-[#F5F0FF] flex items-center justify-center shrink-0 border-2 border-[#3D65F4]/20">
              <svg viewBox="0 0 80 80" className="w-14 h-14" fill="none">
                <circle cx="40" cy="28" r="15" fill="#BFDBFE"/>
                <ellipse cx="40" cy="66" rx="25" ry="13" fill="#BFDBFE"/>
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-extrabold text-[#3D65F4]">{fullName}</h2>
              <p className="text-sm text-gray-400 mb-2">{roll}</p>
              <div className="flex flex-wrap gap-2">
                {year && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#3D65F4]">{year}</span>}
                {semester && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FFF4] text-green-600">SEM {semester}</span>}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0EB] text-[#FF6B4A]">Data Science</span>
                {cgpa && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5F0FF] text-[#7C5CFC]">CGPA: {cgpa}</span>}
              </div>
            </div>
          </div>

          {/* College Info */}
          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#182B68]">College Information</h3>
              <div className="flex items-center gap-1.5">
                <Award size={13} className="text-orange-500" />
                <span className="text-xs font-bold text-orange-600">NAAC A Grade</span>
                <span className="mx-1 text-gray-300">|</span>
                <span className="text-xs font-bold text-[#3D65F4]">UGC Autonomous</span>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0 mt-0.5"><MapPin size={13} className="text-[#3D65F4]" /></div>
                <div>
                  <p className="text-xs font-semibold text-[#182B68]">{college || "Sphoorthy Engineering College (UGC Autonomous)"}</p>
                  <p className="text-xs text-gray-500">Nadargul Village, Saroornagar Mandal, Hyderabad, Telangana – 501510</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0"><Phone size={13} className="text-[#3D65F4]" /></div>
                <p className="text-xs text-gray-600">+91 9392 11 9392</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0"><Mail size={13} className="text-[#3D65F4]" /></div>
                <p className="text-xs text-gray-600">admissions@sphoorthyengg.ac.in</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0"><Globe size={13} className="text-[#3D65F4]" /></div>
                <a href="https://www.sphoorthyengg.ac.in" target="_blank" rel="noopener noreferrer" className="text-xs text-[#3D65F4] font-semibold hover:underline">www.sphoorthyengg.ac.in</a>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
                {[{ label: "Affiliation", value: "JNTUH" }, { label: "Code", value: "SPHN" }, { label: "Est.", value: "2004" }].map((item) => (
                  <div key={item.label} className="bg-[#F9FBFF] rounded-xl p-2.5 text-center border border-blue-50">
                    <p className="text-sm font-extrabold text-[#3D65F4]">{item.value}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* General Info – live from API */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-[#182B68] mb-4">My General Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <InfoField label="First Name"    value={firstName} />
              <InfoField label="Last Name"     value={lastName} />
              <InfoField label="Mobile"        value={mobile} />
              <InfoField label="Email"         value={email} />
              <InfoField label="Batch"         value={batch} />
              <InfoField label="Roll Number"   value={roll} />
              <div className="col-span-2">
                <InfoField label="Branch" value={branch || "B.Tech – Computer Science & Engineering (Data Science)"} />
              </div>
              <InfoField label="Section"       value={section} />
              <InfoField label="Current Year"  value={year} />
              <InfoField label="Semester"      value={semester ? `SEM ${semester}` : ""} />
              <InfoField label="CGPA"          value={cgpa} />
              <InfoField label="Father's Name" value={info.fatherName || ""} />
              <InfoField label="Date of Birth" value={info.dob || ""} />
            </div>
          </div>

          {/* Academic Summary */}
          <div className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
            <h3 className="text-sm font-bold text-[#182B68] mb-4">Academic Summary</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "CGPA",      value: cgpa || "—",      color: "text-[#3D65F4]" },
                { label: "Year",      value: year || "2nd",    color: "text-[#7C5CFC]" },
                { label: "Semester",  value: semester || "IV", color: "text-[#FF6B4A]" },
                { label: "Section",   value: section || "A",   color: "text-green-600" },
              ].map((s) => (
                <div key={s.label} className="bg-[#F9FBFF] rounded-xl p-3 text-center border border-blue-50">
                  <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pb-2">
            <p className="text-[11px] text-gray-300 font-medium">
              Portal customized by <span className="text-[#3D65F4] font-bold">Neanavth Jashwanth Singh</span> · 24N81A6758 · Sphoorthy Engineering College
            </p>
          </div>
        </div>
      )}

      {tab === "feedback" && (
        <div className="max-w-lg mx-auto p-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-[#182B68] mb-1">Complaints & Feedback</h3>
            <p className="text-xs text-gray-400 mb-5">Your feedback helps improve the platform for everyone.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Category</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#3D65F4] bg-white">
                  <option>Academic Issue</option><option>Technical Problem</option><option>Career Guidance</option><option>General Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Subject</label>
                <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3D65F4] transition-colors" placeholder="Brief subject of your complaint or feedback" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Message</label>
                <textarea className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#3D65F4] h-32 resize-none transition-colors" placeholder="Describe in detail…" />
              </div>
              <button className="w-full py-3 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg, #3D65F4, #5B3CF4)" }}>
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
