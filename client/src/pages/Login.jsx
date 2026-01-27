import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Ticket, Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            
            // Save Token
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            toast.success(`Welcome back, ${res.data.user.name}!`);
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col p-4 md:p-8">
            {/* Back to Home */}
            <div className="mb-6 md:mb-8">
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-slate-300 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
            </div>

            {/* Main Card - Centered */}
            <div className="flex-1 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    {/* Header */}
                    <div className="p-6 md:p-8 text-center bg-gradient-to-r from-blue-600 to-blue-700">
                        <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                            <Ticket className="w-7 h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Welcome Back</h1>
                        <p className="text-blue-100 text-sm md:text-base">Sign in to your TicketWiz account</p>
                    </div>
                    
                    {/* Form */}
                    <form onSubmit={handleLogin} className="p-5 md:p-8 space-y-4 md:space-y-5">
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 md:py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="bg-gray-50 px-5 md:px-8 py-3 md:py-4 border-t border-gray-100 text-center">
                        <p className="text-xs md:text-sm text-gray-500">Don't have an account? Contact your admin.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;