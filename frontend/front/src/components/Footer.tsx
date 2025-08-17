export default function Footer() {
  return (
    <footer className="footer-grad mt-0">
      <div className="cc-container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <span className="text-sm">CC</span>
              </div>
              <span className="font-mont font-bold text-lg">Career Compass</span>
            </div>
            <p className="mt-3 text-white/85 max-w-sm">
              Navigate your career journey with confidence and expert guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mont font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-white/85">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="#about" className="hover:underline">About</a></li>
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-mont font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-white/85">
              <li>Career Assessment</li>
              <li>Career Planning</li>
              <li>Mentorship</li>
              <li>Job Search</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mont font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-white/85">
              <li>support@careercompass.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Career Street, Success City, SC 12345</li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-white/20" />
        <p className="text-center text-white/80 text-sm">
          © 2024 Career Compass. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
