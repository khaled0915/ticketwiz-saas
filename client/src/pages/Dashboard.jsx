import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, Plus, AlertCircle, CheckCircle, BrainCircuit, Activity } from 'lucide-react';

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

   

    // Fetch Tickets on Load AND every 2 seconds
    useEffect(() => {
        fetchTickets(); // Initial fetch

        // Set up a timer to fetch data every 2000ms (2 seconds)
        const interval = setInterval(() => {
            fetchTickets();
        }, 2000);

        // Cleanup the timer when we leave the page
        return () => clearInterval(interval);
    }, []);



    const fetchTickets = async () => {
        try {
            const res = await api.get('/tickets');
            setTickets(res.data);
        } catch (error) {
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('AI is analyzing your ticket...');
        try {
            await api.post('/tickets/create', formData);
            toast.success('Ticket created & Analyzed!', { id: toastId });
            setFormData({ title: '', description: '' });
            setShowForm(false);
            fetchTickets(); // Refresh list
        } catch (error) {
            toast.error('Failed to create ticket', { id: toastId });
        }
    };

    // Helper to get color based on AI Priority
    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <BrainCircuit className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold text-gray-800">TicketWiz <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-1">AI Powered</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 hidden md:block">Org: {user?.role}</span>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="hidden md:inline">Logout</span>
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Support Dashboard</h1>
                        <p className="text-gray-500">Real-time AI analysis of incoming tickets</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        New Ticket
                    </button>
                </div>

                {/* Create Ticket Form (Collapsible) */}
                {showForm && (
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8 animate-fade-in-down">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Create New Ticket</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                                type="text" placeholder="Issue Title (e.g. Server is down)" 
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                required
                            />
                            <textarea 
                                placeholder="Describe the issue... (AI will analyze this text)" 
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">Submit & Analyze</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500">Total Tickets</p>
                                <h3 className="text-3xl font-bold text-gray-900">{tickets.length}</h3>
                            </div>
                            <Activity className="text-blue-500" />
                        </div>
                    </div>
                    {/* You can add more stats here later */}
                </div>

                {/* Ticket Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading tickets...</div>
                ) : (
                    <div className="grid gap-6">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{ticket.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)} uppercase tracking-wide`}>
                                                {ticket.priority} Priority
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4">{ticket.description}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* The AI Section */}
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BrainCircuit className="w-4 h-4 text-purple-600" />
                                        <span className="text-xs font-bold text-purple-700 uppercase">AI Analysis</span>
                                        
                                        {/* Sentiment Badge */}
                                        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${ticket.sentiment_score < -0.5 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                                            Sentiment: {ticket.sentiment_score?.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 italic">
                                        "{ticket.ai_suggested_solution || 'No suggestion available.'}"
                                    </p>
                                </div>






                           
<div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
    {ticket.status !== 'resolved' ? (
        <button 
            onClick={async () => {
               await api.put(`/tickets/${ticket.id}/status`, { status: 'resolved' });
               fetchTickets(); // Refresh list
               toast.success('Ticket Resolved!');
            }}
            className="text-sm bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 px-3 py-1 rounded-md border border-gray-200 transition-colors"
        >
            Mark as Resolved
        </button>
    ) : (
        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Resolved
        </span>
    )}
</div>






                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;