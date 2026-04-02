import { FileText, Download } from "lucide-react";

export const metadata = { title: "Reports — BSV" };

const REPORTS = [
  {
    title: "Rider Eligibility Audit",
    description: "Full export of rider profiles, license status, consent records, and health compliance.",
    type: "CSV",
    href: "/api/reports/riders",
  },
  {
    title: "Event Pipeline Report",
    description: "All events with registration counts, check-in rates, venue details and publication status.",
    type: "CSV",
    href: "/api/reports/events",
  },
  {
    title: "Competition Results Ledger",
    description: "Official judge scores grouped by event, activity, rider and horse with flag status.",
    type: "CSV",
    href: "/api/reports/scores",
  },
  {
    title: "Financial Settlements",
    description: "Consolidated revenue records including registration fees, payment status and amounts.",
    type: "CSV",
    href: "/api/reports/payments",
  },
  {
    title: "Asset Registry Export",
    description: "Full export of horse biological profiles, ownership, FEI IDs and current eligibility.",
    type: "CSV",
    href: "/api/reports/horses",
  },
  {
    title: "Official Accreditation Log",
    description: "Detailed audit of issued badges, access zones, expiry dates and revocation records.",
    type: "CSV",
    href: "/api/reports/accreditations",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Report Engine</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5 tracking-wide">Data Extraction & Regulatory Compliance Exports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORTS.map((report, i) => (
          <div key={i} className="group bg-white border border-slate-200 rounded-3xl p-6 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                  <FileText size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                  {report.type}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 tracking-tight">{report.title}</h3>
              <p className="text-sm text-slate-500 font-medium line-clamp-3 mb-6">{report.description}</p>
            </div>

            <a
              href={report.href}
              download
              className="w-full py-3 bg-slate-900 group-hover:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Download size={14} />
              Download {report.type}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
