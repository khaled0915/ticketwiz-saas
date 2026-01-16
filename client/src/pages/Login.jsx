import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Ticket, Lock, Mail, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            
            // Save Token
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            toast.success(`Welcome back, ${res.data.user.name}!`);
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center p-4 ">

                        <div className="absolute  top-4 left-4">
                <Link to="/" className="flex items-center border  rounded-lg p-2 border-white gap-2 text-white hover:text-pink-700 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </div>





            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Ticket className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">TicketWiz Login</h2>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="you@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-500">Don't have an account? Ask your admin.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;