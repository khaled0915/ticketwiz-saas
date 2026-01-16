import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Direct axios because we don't need the Interceptor/Token
import toast from 'react-hot-toast';
import { Send, LifeBuoy, ArrowLeft, Mail, FileText, MessageSquare, Loader2 } from 'lucide-react';

const SupportPage = () => {
    // Hardcoded Org ID for demo (In real life, read from URL param)
    const ORG_ID = 6 // CHANGE THIS TO YOUR ORGANIZATION ID (Check your DB or Dashboard)
    
    const [formData, setFormData] = useState({ title: '', description: '', email: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading('Submitting ticket...');
        
        try {
            // Using the full URL because this page might be "public"
            await axios.post(`http://localhost:5000/api/tickets/public/${ORG_ID}`, formData);
            toast.success('Ticket received! An agent will review it.', { id: toastId });
            setFormData({ title: '', description: '', email: '' });
        } catch (error) {
            toast.error('Failed to submit ticket', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col p-4 md:p-8">
            {/* Back to Home - Fixed responsiveness */}
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
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                    {/* Header */}
                    <div className="p-6 md:p-8 text-center bg-gradient-to-r from-blue-600 to-blue-700">
                        <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                            <LifeBuoy className="w-7 h-7 md:w-8 md:h-8 text-white" />
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold text-white mb-1">Customer Support</h1>
                        <p className="text-blue-100 text-sm md:text-base">How can we help you today?</p>
                    </div>
                    
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-4 md:space-y-5">
                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Your Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="you@example.com"
                                    className="w-full pl-11 pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})} 
                                />
                            </div>
                        </div>

                        {/* Subject Input */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Subject</label>
                            <div className="relative group">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="What's this about?"
                                    className="w-full pl-11 pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                                    value={formData.title} 
                                    onChange={e => setFormData({...formData, title: e.target.value})} 
                                />
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Description</label>
                            <div className="relative group">
                                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <textarea 
                                    required 
                                    placeholder="Please describe your issue in detail..."
                                    className="w-full pl-11 pr-4 py-2.5 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none h-28 md:h-32 bg-gray-50 focus:bg-white"
                                    value={formData.description} 
                                    onChange={e => setFormData({...formData, description: e.target.value})} 
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 md:py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Submit Ticket</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="bg-gray-50 px-5 md:px-8 py-3 md:py-4 border-t border-gray-100 text-center">
                        <p className="text-xs md:text-sm text-gray-500">We typically respond within 24 hours</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;