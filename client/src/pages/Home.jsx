import { Link } from 'react-router-dom';
import { ShieldCheck, LifeBuoy, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Welcome to <span className="text-blue-400">TicketWiz</span>
                    </h1>
                    <p className="text-slate-400 text-lg">
                        The AI-Powered Customer Support Platform.
                        <br />
                        Please select your role to continue.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Option 1: For Agents */}
                    <Link to="/login" className="group relative bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="text-white w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Support Agent</h2>
                        <p className="text-slate-400 mb-6">
                            Log in to the Dashboard to view tickets, see AI analysis, and manage resolutions.
                        </p>
                        <div className="flex items-center text-blue-400 font-semibold group-hover:gap-2 transition-all">
                            Agent Login <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </Link>

                    {/* Option 2: For Customers */}
                    <Link to="/support" className="group relative bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                        <div className="bg-emerald-500 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <LifeBuoy className="text-white w-7 h-7" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-3">Customer</h2>
                        <p className="text-slate-400 mb-6">
                            Submit a new support ticket. Our AI will route your request to the right team immediately.
                        </p>
                        <div className="flex items-center text-emerald-400 font-semibold group-hover:gap-2 transition-all">
                            Submit Ticket <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </Link>
                </div>

                <div className="text-center mt-12 text-slate-600 text-sm">
                    Built by Khaled Saifullah 
                </div>
            </div>
        </div>
    );
};

export default Home;