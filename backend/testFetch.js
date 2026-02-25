console.log('Node Version:', process.version);
console.log('Fetch defined:', typeof fetch !== 'undefined');
try {
    fetch('https://www.google.com').then(() => console.log('Fetch works')).catch(e => console.log('Fetch failed:', e.message));
} catch (e) {
    console.log('Fetch threw error:', e.message);
}
