import { Link } from "react-router-dom";

function Terms() {
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
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Terms of Use</h1>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-gray-300 leading-relaxed">

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">01 — Acceptance</h2>
            <p className="text-sm leading-7">
              By accessing and using this portfolio website, you agree to these terms. This is a personal portfolio site owned and operated by Vijay Saini. If you do not agree with any part of these terms, please do not use this site.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">02 — Intellectual property</h2>
            <p className="text-sm leading-7">
              All content on this site — including but not limited to designs, case studies, illustrations, copy, and code — is the intellectual property of Vijay Saini unless otherwise credited. You may not reproduce, distribute, or use any content from this site without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">03 — Portfolio work</h2>
            <p className="text-sm leading-7">
              Projects displayed in the portfolio may include work created for clients under contract. Where applicable, client information has been shared with permission or anonymised. All creative work remains the property of the respective clients unless otherwise stated.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">04 — Disclaimer</h2>
            <p className="text-sm leading-7">
              This site is provided as-is for informational and portfolio purposes only. Vijay Saini makes no warranties regarding the accuracy, completeness, or suitability of any content. The site may be updated or taken offline at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">05 — Limitation of liability</h2>
            <p className="text-sm leading-7">
              Vijay Saini shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of, or inability to use, this website or its content.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">06 — Changes to terms</h2>
            <p className="text-sm leading-7">
              These terms may be updated at any time. Continued use of the site after any changes constitutes acceptance of the revised terms. The "last updated" date at the top of this page reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4">07 — Contact</h2>
            <p className="text-sm leading-7">
              For any questions regarding these terms, contact{" "}
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

export default Terms;