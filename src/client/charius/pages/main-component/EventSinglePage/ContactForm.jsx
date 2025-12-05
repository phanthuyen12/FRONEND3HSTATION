import React, { useState } from 'react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        note: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
        

            setSuccessMessage('Thank you for your message!');
        } catch (error) {
            setErrorMessage('Error occurred while sending email. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="contact-validation-active" id="contact-form-main">
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-12 form-group">
                    <input type="text" className="form-control" name="name" id="name" placeholder="Your Name*" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-12 form-group clearfix">
                    <input type="email" className="form-control" name="email" id="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="col-lg-12 col-12 form-group">
                    <textarea className="form-control" name="note" id="note" placeholder="Message" value={formData.note} onChange={handleInputChange}></textarea>
                </div>
                <div className="submit-area col-lg-12 col-12">
                    <button type="submit" className="theme-btn submit-btn" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Now'}</button>
                    <div id="loader">{submitting && <i className="ti-reload"></i>}</div>
                </div>
            </div>
            <div className="clearfix error-handling-messages">
                {successMessage && <div id="success">{successMessage}</div>}
                {errorMessage && <div id="error">{errorMessage}</div>}
            </div>
        </form>
    );
};

export default ContactForm;
