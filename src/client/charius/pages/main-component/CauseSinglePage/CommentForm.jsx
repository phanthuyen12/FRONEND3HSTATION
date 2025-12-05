import React, { useState } from 'react';

const CommentForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        website: '',
        comment: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit} id="commentform" className="comment-form">
            <div className="form-inputs">
                <input
                    placeholder="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    placeholder="Website"
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                />
            </div>
            <div className="form-textarea">
                <textarea
                    id="comment"
                    placeholder="Write Your Comments..."
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                ></textarea>
            </div>
            <div className="form-submit">
                <input id="submit" value="Reply" type="submit" />
            </div>
        </form>
    );
};

export default CommentForm;
