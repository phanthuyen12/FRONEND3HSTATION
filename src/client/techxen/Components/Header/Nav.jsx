import { Link } from "react-router-dom";

export default function Nav({ setMobileToggle }) {
  return (
    <ul className="cs_nav_list fw-medium">
      <li>
        <Link to="/landing" onClick={() => setMobileToggle(false)}>
          Trang chủ
        </Link>
      </li>
      <li>
        <Link to="/techxen/services" onClick={() => setMobileToggle(false)}>
          Dịch vụ
        </Link>
      </li>
      <li>
        <Link to="/techxen/service-intro" onClick={() => setMobileToggle(false)}>
          Giới thiệu dịch vụ
        </Link>
      </li>
      <li>
        <Link to="/blog" onClick={() => setMobileToggle(false)}>
          Blog
        </Link>
      </li>
      <li>
        <Link to="/contact" onClick={() => setMobileToggle(false)}>
          Liên hệ
        </Link>
      </li>
    </ul>
  );
}


