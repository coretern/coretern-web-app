const QRCode = require('qrcode');

/**
 * Generate a QR code Data URL for a given text (link)
 * @param {string} text 
 * @returns {Promise<string>} Data URL
 */
exports.generateQRCode = async (text) => {
    try {
        return await QRCode.toDataURL(text);
    } catch (err) {
        console.error('QR Code Generation Error:', err);
        throw err;
    }
};
