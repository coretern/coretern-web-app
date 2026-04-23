/* eslint-disable @typescript-eslint/no-explicit-any */

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

function getAuthHeadersMultipart(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {};
    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

async function handleResponse(res: Response) {
    const data = await res.json();
    if (!res.ok) {
        // For server errors (DB down, etc.), log quietly and throw
        // The calling code's try/catch will handle this
        const msg = data.error || 'Something went wrong';
        if (res.status >= 500) {
            console.warn(`[API ${res.status}] ${msg}`);
        }
        throw new Error(msg);
    }
    return data;
}

// ========== AUTH ==========
export const authAPI = {
    register: (body: any) =>
        fetch(`${API_BASE}/auth/register`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    login: (body: any) =>
        fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    verifyOtp: (body: any) =>
        fetch(`${API_BASE}/auth/verify-otp`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    resendOtp: (body: any) =>
        fetch(`${API_BASE}/auth/resend-otp`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    google: (body: any) =>
        fetch(`${API_BASE}/auth/google`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    me: () =>
        fetch(`${API_BASE}/auth/me`, { headers: getAuthHeaders() }).then(handleResponse),
    forgotPassword: (body: any) =>
        fetch(`${API_BASE}/auth/forgot-password`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    resetPassword: (body: any) =>
        fetch(`${API_BASE}/auth/reset-password`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    updateProfile: (body: any) =>
        fetch(`${API_BASE}/auth/update-profile`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
};

// ========== INTERNSHIPS ==========
export const internshipAPI = {
    getAll: () =>
        fetch(`${API_BASE}/internships`).then(handleResponse),
    getById: (id: string) =>
        fetch(`${API_BASE}/internships/${id}`).then(handleResponse),
    create: (formData: FormData) =>
        fetch(`${API_BASE}/internships`, { method: 'POST', headers: getAuthHeadersMultipart(), body: formData }).then(handleResponse),
    update: (id: string, formData: FormData) =>
        fetch(`${API_BASE}/internships/${id}`, { method: 'PUT', headers: getAuthHeadersMultipart(), body: formData }).then(handleResponse),
    delete: (id: string) =>
        fetch(`${API_BASE}/internships/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(handleResponse),
};

// ========== ENROLLMENTS ==========
export const enrollmentAPI = {
    getAll: () =>
        fetch(`${API_BASE}/enrollments`, { headers: getAuthHeaders() }).then(handleResponse),
    getMy: () =>
        fetch(`${API_BASE}/enrollments/my`, { headers: getAuthHeaders() }).then(handleResponse),
    enroll: (formData: FormData) =>
        fetch(`${API_BASE}/enrollments`, { method: 'POST', headers: getAuthHeadersMultipart(), body: formData }).then(handleResponse),
    verify: (orderId: string) =>
        fetch(`${API_BASE}/enrollments/verify/${orderId}`, { headers: getAuthHeaders() }).then(handleResponse),
    submitReview: (id: string, body: any) =>
        fetch(`${API_BASE}/enrollments/${id}/review`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    getReviews: (internshipId: string) =>
        fetch(`${API_BASE}/enrollments/reviews/${internshipId}`).then(handleResponse),
    markPaid: (id: string, body: any) =>
        fetch(`${API_BASE}/enrollments/${id}/pay`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
};

// ========== CERTIFICATES ==========
export const certificateAPI = {
    issue: (body: any) =>
        fetch(`${API_BASE}/certificates`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    getMy: () =>
        fetch(`${API_BASE}/certificates/my`, { headers: getAuthHeaders() }).then(handleResponse),
    verify: (certId: string) =>
        fetch(`${API_BASE}/certificates/verify/${certId}`).then(handleResponse),
    issueManual: (body: any) =>
        fetch(`${API_BASE}/certificates/manual`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    getManual: () =>
        fetch(`${API_BASE}/certificates/manual`, { headers: getAuthHeaders() }).then(handleResponse),
};

// ========== TICKETS ==========
export const ticketAPI = {
    getAll: () =>
        fetch(`${API_BASE}/tickets`, { headers: getAuthHeaders() }).then(handleResponse),
    getMy: () =>
        fetch(`${API_BASE}/tickets/my`, { headers: getAuthHeaders() }).then(handleResponse),
    create: (body: any) =>
        fetch(`${API_BASE}/tickets`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    getById: (id: string) =>
        fetch(`${API_BASE}/tickets/${id}`, { headers: getAuthHeaders() }).then(handleResponse),
    reply: (id: string, body: any) =>
        fetch(`${API_BASE}/tickets/${id}/reply`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    updateStatus: (id: string, body: any) =>
        fetch(`${API_BASE}/tickets/${id}/status`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(body) }).then(handleResponse),
    delete: (id: string) =>
        fetch(`${API_BASE}/tickets/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(handleResponse),
};

// ========== USERS ==========
export const userAPI = {
    getAll: () =>
        fetch(`${API_BASE}/users`, { headers: getAuthHeaders() }).then(handleResponse),
    impersonate: (id: string) =>
        fetch(`${API_BASE}/users/${id}`, { method: 'POST', headers: getAuthHeaders() }).then(handleResponse),
    toggleStatus: (id: string) =>
        fetch(`${API_BASE}/users/${id}`, { method: 'PUT', headers: getAuthHeaders() }).then(handleResponse),
    delete: (id: string) =>
        fetch(`${API_BASE}/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() }).then(handleResponse),
};
