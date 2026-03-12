import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Upload, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './ManageInternships.css';

const quillModules = {
    toolbar: [
        [{ 'font': [] }, { 'size': [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }, { 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
    ],
};

const ManageInternships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        domain: 'Summer Internship',
        fee: '',
        duration: '',
        description: '',
        curriculum: '',
        details: '',
        videos: '',
        whatsappGroup: '',
        storageType: 'database'
    });
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/internships`);
            setInternships(data.data);
        } catch (err) {
            toast.error('Failed to fetch internships');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (intern = null) => {
        if (intern) {
            setEditingId(intern._id);
            setFormData({
                title: intern.title,
                domain: intern.domain,
                fee: intern.fee,
                duration: intern.duration,
                description: intern.description,
                curriculum: intern.curriculum?.join(', ') || '',
                details: intern.details || '',
                videos: intern.videos?.map(v => `${v.title}|${v.url}`).join('\n') || '',
                whatsappGroup: intern.whatsappGroup || '',
                storageType: intern.storageType || 'database'
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                domain: 'Summer Internship',
                fee: '',
                duration: '',
                description: '',
                curriculum: '',
                details: '',
                videos: '',
                whatsappGroup: '',
                storageType: 'database'
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const token = localStorage.getItem('token');

        // Prepare arrays once
        const currArray = formData.curriculum ? formData.curriculum.split(',').map(i => i.trim()).filter(i => i !== '') : [];
        const videoArray = formData.videos ? formData.videos.split('\n').map(line => {
            const [title, url] = line.split('|');
            return { title: title?.trim(), url: url?.trim() };
        }).filter(v => v.title && v.url) : [];

        let payload;
        let isFormData = !!image;

        if (isFormData) {
            payload = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'curriculum') {
                    // Multer needs array elements appended individually for curriculum[]
                    currArray.forEach(item => payload.append('curriculum[]', item));
                } else if (key === 'videos') {
                    // Send videos as a JSON string for consistent backend parsing
                    payload.append('videos', JSON.stringify(videoArray));
                } else {
                    payload.append(key, formData[key]);
                }
            });
            payload.append('image', image);
        } else {
            payload = {
                ...formData,
                curriculum: currArray,
                videos: videoArray
            };
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // Let axios handle boundaries for FormData, but set JSON type for plain objects
            if (!isFormData) {
                config.headers['Content-Type'] = 'application/json';
            }

            if (editingId) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/internships/${editingId}`, payload, config);
                toast.success('Internship Updated');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/internships`, payload, config);
                toast.success('Internship Created');
            }
            setShowModal(false);
            setImage(null);
            fetchInternships();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('This will permanently delete the internship. Continue?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/internships/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Internship Deleted');
            fetchInternships();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    if (loading) return <div className="loader-container"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    return (
        <div className="manage-intern-page">
            <header className="title-box flex justify-between items-center">
                <div>
                    <h1 className="outfit">Manage Internships</h1>
                    <p className="text-text-muted">Create and manage your program offerings</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-primary">
                    <Plus size={20} /> New Internship
                </button>
            </header>

            <div className="internships-admin-grid">
                {internships.map(intern => (
                    <div key={intern._id} className="card admin-intern-card">
                        <img src={intern.image} alt="" />
                        <div className="card-content">
                            <span className="admin-status-badge text-primary font-bold uppercase text-xs">{intern.domain}</span>
                            <h3 className="outfit mt-2">{intern.title}</h3>
                            <div className="admin-actions">
                                <button onClick={() => handleOpenModal(intern)} className="btn btn-outline flex-1"><Edit2 size={16} /> Edit</button>
                                <button onClick={() => handleDelete(intern._id)} className="btn btn-outline flex-1 text-danger border-danger"><Trash2 size={16} /> Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="admin-modal-overlay">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card admin-modal-content"
                        >
                            <div className="admin-modal-header">
                                <h2 className="outfit text-2xl m-0">{editingId ? 'Edit' : 'Create'} Internship</h2>
                                <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="admin-modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="admin-form-row">
                                        <div>
                                            <label className="admin-label">Internship Title</label>
                                            <input type="text" className="admin-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                        </div>
                                        <div>
                                            <label className="admin-label">Domain</label>
                                            <select className="admin-select" value={formData.domain} onChange={e => setFormData({ ...formData, domain: e.target.value })}>
                                                <option>Summer Internship</option>
                                                <option>Open Source</option>
                                                <option>Regular Course</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="admin-form-row">
                                        <div>
                                            <label className="admin-label">Program Fee (₹)</label>
                                            <input type="number" className="admin-input" value={formData.fee} onChange={e => setFormData({ ...formData, fee: e.target.value })} required />
                                        </div>
                                        <div>
                                            <label className="admin-label">Duration</label>
                                            <input type="text" className="admin-input" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 4 Weeks" required />
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <label className="admin-label">WhatsApp Group Join Link (Student will see this after enrollment)</label>
                                        <input
                                            type="url"
                                            className="admin-input"
                                            value={formData.whatsappGroup}
                                            onChange={e => setFormData({ ...formData, whatsappGroup: e.target.value })}
                                            placeholder="https://chat.whatsapp.com/..."
                                        />
                                    </div>

                                    <div className="mb-8">
                                        <label className="admin-label">Storage Destination</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="storageType"
                                                    value="database"
                                                    checked={formData.storageType === 'database'}
                                                    onChange={e => setFormData({ ...formData, storageType: e.target.value })}
                                                />
                                                <span>Database (Cloud)</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="storageType"
                                                    value="file"
                                                    checked={formData.storageType === 'file'}
                                                    onChange={e => setFormData({ ...formData, storageType: e.target.value })}
                                                />
                                                <span>Code File (Local Fast Load)</span>
                                            </label>
                                        </div>
                                        <p className="text-xs text-text-muted mt-1">
                                            Selecting 'Code File' will also save it to a local JSON for faster loading on the student side.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="admin-label">Short Summary (optional)</label>
                                        <textarea className="admin-textarea" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="admin-label">Curriculum (Tags separated by comma)</label>
                                        <textarea className="admin-textarea" style={{ height: '60px' }} value={formData.curriculum} onChange={e => setFormData({ ...formData, curriculum: e.target.value })} placeholder="React, Node.js, MongoDB..." />
                                    </div>

                                    <div>
                                        <label className="admin-label">Videos (Format: Title|URL per line)</label>
                                        <textarea
                                            className="admin-textarea"
                                            style={{ height: '100px' }}
                                            value={formData.videos}
                                            onChange={e => setFormData({ ...formData, videos: e.target.value })}
                                            placeholder="Introduction|https://youtube.com/...\nModule 1|https://..."
                                        />
                                    </div>

                                    <div className="mb-8">
                                        <label className="admin-label">Detailed Internship Content</label>
                                        <div className="quill-wrapper">
                                            <ReactQuill
                                                theme="snow"
                                                value={formData.details}
                                                onChange={val => setFormData({ ...formData, details: val })}
                                                modules={quillModules}
                                                placeholder="Write detailed information about the internship..."
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <label className="admin-label">Cover Image</label>
                                        <div className="flex items-center gap-4">
                                            <button type="button" className="btn btn-outline" onClick={() => document.getElementById('admin-img-input').click()}>
                                                <Upload size={18} /> Choose Visual
                                            </button>
                                            <input id="admin-img-input" type="file" className="hidden" onChange={e => setImage(e.target.files[0])} />
                                            {image && <span className="text-sm text-primary">{image.name}</span>}
                                        </div>
                                    </div>

                                    <button disabled={submitting} className="btn btn-primary w-full py-4 justify-center">
                                        {submitting ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {editingId ? 'Save Changes' : 'Publish Internship'}</>}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageInternships;
