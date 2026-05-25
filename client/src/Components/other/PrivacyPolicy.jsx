import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <main className="bg-black text-white min-h-screen px-6 md:px-16 py-24 font-JetBrainsMono">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest hover:text-white transition-colors mb-16"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12 pb-8 border-b border-gray-800">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">01 — Overview</h2>
            <p className="text-sm leading-7">
              This portfolio website is a personal project by Vijay Saini. I respect your privacy and am committed to being transparent about the minimal data this site interacts with. This page explains what is collected, why, and how it is handled.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">02 — Information I collect</h2>
            <p className="text-sm leading-7 mb-4">
              This site does not collect any personal information without your explicit action. The only data interactions are:
            </p>
            <ul className="space-y-3">
              {[
                "Contact or booking form submissions — only if you choose to fill them out.",
                "Email address — only if you reach out directly via a contact form or email link.",
                "Analytics — basic anonymous page view data may be collected via a third-party tool (e.g. Vercel Analytics) with no personally identifiable information.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="text-gray-600 mt-1">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">03 — How I use your information</h2>
            <p className="text-sm leading-7">
              Any information you provide (such as your name or email via a contact form) is used solely to respond to your enquiry or schedule a discovery call. I do not sell, share, or distribute your data to any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">04 — Cookies</h2>
            <p className="text-sm leading-7">
              This site uses no tracking cookies. Any cookies present are strictly functional and necessary for the site to operate (e.g. session or preference storage). No advertising or behavioural tracking cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">05 — Third-party links</h2>
            <p className="text-sm leading-7">
              This site contains links to external platforms such as Dribbble, LinkedIn, Instagram, and GitHub. Once you leave this site, I am not responsible for the privacy practices of those platforms. Please review their individual privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">06 — Contact</h2>
            <p className="text-sm leading-7">
              If you have any questions about this privacy policy or how your data is handled, feel free to reach out directly at{" "}
              <a
                href="mailto:hello@vijaysaini.design"
                className="text-white underline underline-offset-4 decoration-gray-600 hover:decoration-white transition-colors"
              >
                hello@vijaysaini.design
              </a>
            </p>
          </section>

        </div>

        {/* Footer note */}
        <div className="mt-20 pt-8 border-t border-gray-800 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Vijay Saini. All rights reserved.</p>
        </div>

      </div>
    </main>
  );
}

export default PrivacyPolicy;