import React, { useState } from 'react';

function HeaderSearchForm() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleToggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleOutsideClick = (e) => {
        if (e.target.closest(".header-search-form-wrapper") === null) {
            setIsSearchOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <div className="header-search-form-wrapper">
            <div className="cart-search-contact">
                <button className="search-toggle-btn" onClick={handleToggleSearch}>
                    <i className={isSearchOpen ? "fi ti-close" : "fi flaticon-search"}></i>
                </button>
                <div className={`header-search-form ${isSearchOpen ? "header-search-content-toggle" : ""}`}>
                    <form>
                        <div>
                            <input type="text" className="form-control" placeholder="Search here..." />
                            <button type="submit"><i className="fi flaticon-search"></i></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default HeaderSearchForm;
