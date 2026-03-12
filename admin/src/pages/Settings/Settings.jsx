import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Loader2, ShieldCheck, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
    const [config, setConfig] = useState({
        allowEmailAuth: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/config`);
            setConfig(data.data);
        } catch (err) {
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        setConfig(prev => ({ ...prev, allowEmailAuth: !prev.allowEmailAuth }));
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        setSaving(true);
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/config`, config, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Settings updated successfully');
            setConfig(data.data);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    return (
        <div className="settings-page">
            <header className="settings-header">
                <div>
                    <h1 className="outfit">System Settings</h1>
                    <p className="text-text-muted">Configure global application behavior</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
                </button>
            </header>

            <div className="settings-container">
                <section className="settings-section card">
                    <div className="section-header">
                        <ShieldCheck className="text-primary" size={24} />
                        <h2 className="outfit">Authentication Controls</h2>
                    </div>
                    <p className="section-desc">Manage how users can sign in to the platform.</p>

                    <div className="setting-item flex justify-between items-center">
                        <div className="setting-info">
                            <h4 className="m-0 flex items-center gap-2">
                                <Mail size={18} /> Allow Email/Password Login
                            </h4>
                            <p className="text-sm text-text-muted mt-1">
                                When disabled, users will only be able to sign in via Google.
                            </p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={config.allowEmailAuth}
                                onChange={handleToggle}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
