import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, Plus, CheckCircle, BrainCircuit, Activity, Clock, User, X, Loader2, AlertTriangle, AlertCircle, CircleDot, ChevronDown, ChevronUp } from 'lucide-react';

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [activeTab, setActiveTab] = useState('active');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedCards, setExpandedCards] = useState({});
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    // Filter tickets into active and resolved
    const activeTickets = tickets.filter(t => t.status !== 'resolved');
    const resolvedTickets = tickets.filter(t => t.status === 'resolved');

    // Group active tickets by priority
    const highPriority = activeTickets.filter(t => t.priority?.toLowerCase() === 'high');
    const mediumPriority = activeTickets.filter(t => t.priority?.toLowerCase() === 'medium');
    const lowPriority = activeTickets.filter(t => t.priority?.toLowerCase() === 'low');

    // Extract email from description (format: [Contact: email])
    // const extractEmail = (ticket) => {
    //     const match = ticket.description?.match(/\[Contact:\s*([^\]]+)\]/i);
    //     if (match) return match[1].trim();
    //     if (ticket.email) return ticket.email;
    //     return null;
    // };

    // Helper: Determine who reported the ticket
    const getReporterDisplay = (ticket) => {
        // 1. Registered User - show name and email if available from backend JOIN
        if (ticket.reporter_name && ticket.reporter_email) {
            return `${ticket.reporter_name} (${ticket.reporter_email})`;
        }
        if (ticket.reporter_name) return ticket.reporter_name;
        
        // 2. Email only (could be from registered user or customer_email for guest)
        if (ticket.reporter_email) return `Guest: ${ticket.reporter_email}`;
        
        // 3. Legacy: Public Ticket (Extract email from description if still embedded)
        const match = ticket.description?.match(/\[Contact:\s*([^\]]+)\]/i);
        if (match) return `Guest: ${match[1].trim()}`;
        
        // 4. Fallback with user_id if available
        if (ticket.user_id) return `User ID: ${ticket.user_id}`;
        
        return 'Anonymous Guest';
    };

    // Get clean description without the contact info
    const getCleanDescription = (description) => {
        return description?.replace(/\[Contact:\s*[^\]]+\]/i, '').trim() || description;
    };

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
        setIsSubmitting(true);
        const toastId = toast.loading('AI is analyzing your ticket...');
        try {
            await api.post('/tickets/create', formData);
            toast.success('Ticket created & Analyzed!', { id: toastId });
            setFormData({ title: '', description: '' });
            setShowForm(false);
            fetchTickets(); // Refresh list
        } catch (error) {
            toast.error('Failed to create ticket', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResolve = async (ticketId) => {
        try {
            await api.put(`/tickets/${ticketId}/status`, { status: 'resolved' });
            fetchTickets();
            toast.success('Ticket Resolved!');
        } catch (error) {
            toast.error('Failed to resolve ticket');
        }
    };

    // Priority column config
    const priorityConfig = {
        high: { 
            title: 'High Priority', 
            icon: AlertTriangle, 
            headerBg: 'bg-red-500', 
            cardBorder: 'border-l-red-500',
            badge: 'bg-red-100 text-red-700 border-red-200'
        },
        medium: { 
            title: 'Medium Priority', 
            icon: AlertCircle, 
            headerBg: 'bg-yellow-500', 
            cardBorder: 'border-l-yellow-500',
            badge: 'bg-yellow-100 text-yellow-700 border-yellow-200'
        },
        low: { 
            title: 'Low Priority', 
            icon: CircleDot, 
            headerBg: 'bg-green-500', 
            cardBorder: 'border-l-green-500',
            badge: 'bg-green-100 text-green-700 border-green-200'
        }
    };

    // Ticket Card Component
    const TicketCard = ({ ticket, showResolveBtn = true }) => {
        const email = getReporterDisplay(ticket);
        const cleanDesc = getCleanDescription(ticket.description);
        const priority = ticket.priority?.toLowerCase() || 'low';
        const config = priorityConfig[priority] || priorityConfig.low;
        const isExpanded = expandedCards[ticket.id] || false;

        const toggleExpand = () => {
            setExpandedCards(prev => ({
                ...prev,
                [ticket.id]: !prev[ticket.id]
            }));
        };

        return (
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 border-l-4 ${config.cardBorder} p-4 hover:shadow-md transition-all`}>
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{ticket.title}</h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                </div>

                {/* Description */}
                <p className={`text-gray-600 text-xs mb-3 ${isExpanded ? '' : 'line-clamp-2'}`}>{cleanDesc}</p>

                {/* Reporter */}
                {/* <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <User className="w-3.5 h-3.5" />
                    <span>{email ? `Reported by: ${email}` : `User ID: ${ticket.user_id || 'N/A'}`}</span>
                </div> */}

                {/* Reporter */}
                {/* Reporter */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-medium">{getReporterDisplay(ticket)}</span>
                </div>

                {/* AI Analysis Box */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                            <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
                            <span className="text-xs font-bold text-purple-700">AI Insight</span>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ticket.sentiment_score < -0.5 ? 'text-red-600 bg-red-50' : ticket.sentiment_score > 0.5 ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-100'}`}>
                            {ticket.sentiment_score?.toFixed(2) || '0.00'}
                        </span>
                    </div>
                    <p className={`text-xs text-gray-600 italic ${isExpanded ? '' : 'line-clamp-2'}`}>
                        "{ticket.ai_suggested_solution || 'No suggestion available.'}"
                    </p>
                    {/* Expand/Collapse Button */}
                    {ticket.ai_suggested_solution && ticket.ai_suggested_solution.length > 80 && (
                        <button 
                            onClick={toggleExpand}
                            className="flex items-center gap-1 mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="w-3.5 h-3.5" />
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                    Read More
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Actions */}
                {showResolveBtn && ticket.status !== 'resolved' && (
                    <button 
                        onClick={() => handleResolve(ticket.id)}
                        className="w-full text-xs bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 px-3 py-2 rounded-lg border border-gray-200 hover:border-green-200 transition-all font-medium"
                    >
                        Mark as Resolved
                    </button>
                )}
                {ticket.status === 'resolved' && (
                    <div className="flex items-center justify-center gap-1.5 text-green-600 text-xs font-medium py-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Resolved</span>
                    </div>
                )}
            </div>
        );
    };

    // Priority Column Component
    const PriorityColumn = ({ priority, tickets: columnTickets }) => {
        const config = priorityConfig[priority];
        const Icon = config.icon;

        return (
            <div className="bg-gray-100 rounded-xl p-4 min-h-[400px]">
                {/* Column Header */}
                <div className={`${config.headerBg} rounded-lg p-3 mb-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-white" />
                        <span className="font-semibold text-white text-sm">{config.title}</span>
                    </div>
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {columnTickets.length}
                    </span>
                </div>

                {/* Tickets */}
                <div className="space-y-3">
                    {columnTickets.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            No tickets
                        </div>
                    ) : (
                        columnTickets.map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                        <BrainCircuit className="text-white w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <span className="text-lg md:text-xl font-bold text-gray-800">TicketWiz</span>
                    <span className="hidden sm:inline text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">AI Powered</span>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    <span className="text-xs md:text-sm text-gray-500 hidden md:block">Org: {user?.role}</span>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="hidden md:inline text-sm">Logout</span>
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Support Dashboard</h1>
                        <p className="text-gray-500 text-sm">Real-time AI analysis of incoming tickets</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all text-sm font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        New Ticket
                    </button>
                </div>

                {/* Create Ticket Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900">Create New Ticket</h3>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">Issue Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Server is down" 
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                                        value={formData.title} 
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">Description</label>
                                    <textarea 
                                        placeholder="Describe the issue... (AI will analyze this text)" 
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none h-32 transition-all bg-gray-50 focus:bg-white resize-none text-sm"
                                        value={formData.description} 
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowForm(false)} 
                                        className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-400 text-white px-6 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            'Submit & Analyze'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs md:text-sm text-gray-500">Active Tickets</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{activeTickets.length}</h3>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Activity className="text-blue-600 w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs md:text-sm text-gray-500">Total Resolved</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-green-600">{resolvedTickets.length}</h3>
                            </div>
                            <div className="bg-green-100 p-2 rounded-lg">
                                <CheckCircle className="text-green-600 w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs md:text-sm text-gray-500">High Priority</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-red-600">{highPriority.length}</h3>
                            </div>
                            <div className="bg-red-100 p-2 rounded-lg">
                                <AlertTriangle className="text-red-600 w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs md:text-sm text-gray-500">Total Tickets</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{tickets.length}</h3>
                            </div>
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <BrainCircuit className="text-purple-600 w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-fit">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-4 md:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            activeTab === 'active' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Active Board
                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'active' ? 'bg-white/20' : 'bg-gray-200'}`}>
                                {activeTickets.length}
                            </span>
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('resolved')}
                        className={`px-4 md:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            activeTab === 'resolved' 
                                ? 'bg-green-600 text-white shadow-md' 
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Resolved History
                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'resolved' ? 'bg-white/20' : 'bg-gray-200'}`}>
                                {resolvedTickets.length}
                            </span>
                        </span>
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                ) : activeTab === 'active' ? (
                    /* Kanban Board - 3 Column Grid */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <PriorityColumn priority="high" tickets={highPriority} />
                        <PriorityColumn priority="medium" tickets={mediumPriority} />
                        <PriorityColumn priority="low" tickets={lowPriority} />
                    </div>
                ) : (
                    /* Resolved List */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 md:p-5 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                Resolved Tickets History
                            </h3>
                        </div>
                        {resolvedTickets.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No resolved tickets yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {resolvedTickets.map(ticket => {
                                    const email = getReporterDisplay(ticket);
                                    const cleanDesc = getCleanDescription(ticket.description);
                                    return (
                                        <div key={ticket.id} className="p-4 md:p-5 hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        <h4 className="font-semibold text-gray-900 truncate">{ticket.title}</h4>
                                                    </div>
                                                    <p className="text-sm text-gray-500 truncate">{cleanDesc}</p>


                                                    {/* <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-3.5 h-3.5" />
                                                            {email || `User ID: ${ticket.user_id || 'N/A'}`}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                                    </div> */}


                                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                                        <span className="flex items-center gap-1 font-medium text-gray-500">
                                                            <User className="w-3.5 h-3.5" />
                                                            {getReporterDisplay(ticket)}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                                    </div>


                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <div className="text-right">
                                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                            ticket.priority?.toLowerCase() === 'high' ? 'bg-red-100 text-red-700' :
                                                            ticket.priority?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                            {ticket.priority || 'Low'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;