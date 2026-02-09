import React, { useEffect, useState } from 'react';
import { insforge } from '../lib/insforge';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Employee {
    id: number;
    employee_id: string;
    full_name: string;
    department: string;
}

interface AttendanceRecord {
    employee_id: number;
    date: string;
    status: 'Present' | 'Absent';
}

const Attendance: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attendance, setAttendance] = useState<Record<number, AttendanceRecord>>({});
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState<number | null>(null);
    const selectedDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        setLoading(true);
        const [empRes, attRes] = await Promise.all([
            insforge.database.from('employees').select('*'),
            insforge.database.from('attendance').select('*').eq('date', selectedDate)
        ]);

        if (empRes.data) setEmployees(empRes.data);
        if (attRes.data) {
            const attMap: Record<number, AttendanceRecord> = {};
            attRes.data.forEach((rec: any) => {
                attMap[rec.employee_id] = rec;
            });
            setAttendance(attMap);
        }
        setLoading(false);
    };

    const markAttendance = async (employeeId: number, status: 'Present' | 'Absent') => {
        setMarking(employeeId);
        const { data, error } = await insforge.database
            .from('attendance')
            .insert([{
                employee_id: employeeId,
                date: selectedDate,
                status: status
            }])
            .select();

        if (data) {
            setAttendance(prev => ({ ...prev, [employeeId]: data[0] }));
        } else {
            console.error(error);
            alert('Failed to mark attendance. It might already be marked for today.');
        }
        setMarking(null);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Attendance Manager</h1>
                    <p className="text-slate-500">Track and record daily presence for all staff</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <Calendar className="text-blue-600" size={20} />
                    <span className="font-semibold text-slate-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">ID & Dept</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {employees.map((emp) => {
                                const record = attendance[emp.id];
                                return (
                                    <tr key={emp.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold uppercase">
                                                    {emp.full_name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900">{emp.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 text-sm font-medium">{emp.employee_id}</span>
                                                <span className="text-slate-400 text-xs">{emp.department}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {record ? (
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${record.status === 'Present' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {record.status === 'Present' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                                    {record.status}
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-400 text-sm font-medium italic">
                                                    <Clock size={16} />
                                                    Not Marked
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {record ? (
                                                <span className="text-slate-300 text-sm italic">Verified</span>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        disabled={marking === emp.id}
                                                        onClick={() => markAttendance(emp.id, 'Present')}
                                                        className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all disabled:opacity-50"
                                                    >
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button
                                                        disabled={marking === emp.id}
                                                        onClick={() => markAttendance(emp.id, 'Absent')}
                                                        className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                                                    >
                                                        <XCircle size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {employees.length === 0 && !loading && (
                    <div className="py-20 text-center">
                        <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
                        <p className="text-slate-500">No employees found to track attendance.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
