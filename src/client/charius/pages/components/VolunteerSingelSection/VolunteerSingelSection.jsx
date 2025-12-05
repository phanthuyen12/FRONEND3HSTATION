import React, { useState } from 'react';

import Vandor from "../../images/volunteer.jpg"
const VolunteerForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        file: null,
        note: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            file: file
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {

            setIsLoading(false);
            setSuccessMessage('Thank you');
            setTimeout(() => {
                setSuccessMessage('');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    file: null,
                    note: ''
                });
            }, 3000);
        }, 1500);
    };

    return (
        <div className="volunteer-area">
            <div className="volunteer-wrap">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="volunteer-item">
                                <div className="volunteer-img-wrap">
                                    <div className="volunter-img">
                                        <img src={Vandor} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="volunteer-contact">
                                <div className="volunteer-contact-form">
                                    <h2>Become a Volunteer</h2>
                                    <form onSubmit={handleSubmit} className="contact-validation-active" id="contact-form-main">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <input type="text" className="form-control" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="First Name" required />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group clearfix">
                                                <input type="email" className="form-control" name="email" id="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group">
                                                <input type="text" className="form-control" name="subject" id="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-12 form-group form-group-in">
                                                <label htmlFor="file">Upload Your CV</label>
                                                <input id="file" type="file" className="form-control" name="file" onChange={handleFileChange} />
                                                <i className="ti-cloud-up"></i>
                                            </div>
                                            <div className="col-lg-12 col-12 form-group">
                                                <textarea className="form-control" name="note" id="note" value={formData.note} onChange={handleChange} placeholder="Case Description..." required></textarea>
                                            </div>
                                            <div className="submit-area col-lg-12 col-12">
                                                <button type="submit" className="theme-btn submit-btn" disabled={isLoading}>Send Message</button>
                                                {isLoading && <div id="loader"><i className="ti-reload"></i></div>}
                                            </div>
                                        </div>
                                        <div className="clearfix error-handling-messages">
                                            {successMessage && <div id="success">{successMessage}</div>}
                                            {errorMessage && <div id="error">{errorMessage}</div>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerForm;
