import React, { useEffect, useState } from 'react';
import { insforge } from '../lib/insforge';
import { Search, UserPlus, Building2, Mail, Hash } from 'lucide-react';

interface Employee {
    id: number;
    employee_id: string;
    full_name: string;
    email: string;
    department: string;
    created_at: string;
}

const Directory: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        const { data, error } = await insforge.database
            .from('employees')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setEmployees(data);
        setLoading(false);
    };

    const filteredEmployees = employees.filter(emp =>
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Employee Directory</h1>
                    <p className="text-slate-500">Manage and view all your team members</p>
                </div>
                <button
                    onClick={onAdd}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-200"
                >
                    <UserPlus size={20} />
                    <span>Add Employee</span>
                </button>
            </div>

            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={20} />
                </span>
                <input
                    type="text"
                    placeholder="Search by name, ID or department..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEmployees.map((employee) => (
                        <div key={employee.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {employee.full_name.charAt(0)}
                                </div>
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                    {employee.department}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-4">{employee.full_name}</h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-slate-500 text-sm">
                                    <Hash size={16} />
                                    <span>{employee.employee_id}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 text-sm">
                                    <Mail size={16} />
                                    <span className="truncate">{employee.email}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                                <span>Joined {new Date(employee.created_at).toLocaleDateString()}</span>
                                <button className="text-blue-600 font-medium hover:underline">View Profile</button>
                            </div>
                        </div>
                    ))}

                    {filteredEmployees.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <Search size={40} />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No employees found</h3>
                            <p className="text-slate-500">Try adjusting your search or add a new employee.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Directory;
