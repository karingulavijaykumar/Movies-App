import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <div className="footer-container">
    <div>
      <FaGoogle size={20} className="footer-icon" />
      <FaTwitter size={20} className="footer-icon" />
      <FaInstagram size={20} className="footer-icon" />
      <FaYoutube size={20} className="footer-icon" />
    </div>
    <p className="contact-us">Contact Us</p>
  </div>
)

export default Footer
