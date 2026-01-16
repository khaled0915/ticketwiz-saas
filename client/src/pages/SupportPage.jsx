import { useState } from 'react';
import axios from 'axios'; // Direct axios because we don't need the Interceptor/Token
import toast from 'react-hot-toast';
import { Send, LifeBuoy } from 'lucide-react';

const SupportPage = () => {
    // Hardcoded Org ID for demo (In real life, read from URL param)
    const ORG_ID = 6 // CHANGE THIS TO YOUR ORGANIZATION ID (Check your DB or Dashboard)
    
    const [formData, setFormData] = useState({ title: '', description: '', email: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Submitting ticket...');
        
        try {
            // Using the full URL because this page might be "public"
            await axios.post(`http://localhost:5000/api/tickets/public/${ORG_ID}`, formData);
            toast.success('Ticket received! An agent will review it.', { id: toastId });
            setFormData({ title: '', description: '', email: '' });
        } catch (error) {
            toast.error('Failed to submit ticket', { id: toastId });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
                <div className="bg-blue-600 p-6 text-white text-center">
                    <LifeBuoy className="w-12 h-12 mx-auto mb-2 opacity-80" />
                    <h1 className="text-2xl font-bold">Customer Support</h1>
                    <p className="opacity-90">How can we help you today?</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                        <input type="email" required className="w-full p-2 border rounded-lg"
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input type="text" required className="w-full p-2 border rounded-lg"
                            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea required className="w-full p-2 border rounded-lg h-32"
                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all">
                        <Send className="w-4 h-4" /> Submit Ticket
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SupportPage;