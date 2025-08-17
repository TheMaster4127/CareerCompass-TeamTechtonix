export default function Landing() {
  return (
    <main className="flex-1 hero-surface">
      {/* HERO */}
      <section className="cc-container py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: Headline */}
          <div>
            <h1 className="font-mont font-bold tracking-tight text-4xl md:text-5xl leading-tight">
              Navigate Your{" "}
              <span className="text-cc-600">Career Journey</span>
              <span className="ml-1"> with</span>
              <br className="hidden md:block" />
              {" "}
              <span>Confidence</span>
            </h1>

            <p className="mt-5 text-gray-600 text-base md:text-lg max-w-xl">
              Career Compass is your trusted career guidance platform that helps students and professionals
              identify, plan, and navigate their career path with expert insights and personalized guidance.
            </p>

            {/* Metric + CTA */}
            <div className="mt-6 flex items-center gap-3">
              <span className="cc-badge">
                <span className="text-lg">⬆</span>
                500+ <span className="text-gray-700">Career Paths</span>
              </span>
            </div>

            <div className="mt-6">
              <a href="/login" className="cc-btn-primary">
                Start Your Journey
                <span aria-hidden>→</span>
              </a>
            </div>

            {/* Caption */}
            <p className="mt-3 text-sm italic text-gray-500">
              AI-powered personalized guidance
            </p>
          </div>

          {/* Right: Illustration card */}
          <div className="relative">
            <div className="cc-card shadow-soft">
              <img
                src="/src/assets/hero.jpg"
                alt="Career guidance illustration"
                className="w-full h-auto rounded-xl2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT / WHAT IS */}
      <section id="about" className="cc-container py-14 md:py-16">
        <h2 className="font-mont font-semibold text-3xl text-center">
          What is Career Compass?
        </h2>
        <p className="mt-4 text-gray-600 text-center max-w-3xl mx-auto">
          Career Compass is a comprehensive career guidance platform designed to empower
          students and professionals in making informed decisions about their career journey.
        </p>

        {/* Feature panel */}
        <div className="mt-8 cc-card p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left text block */}
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cc-100 text-cc-700 mb-4">
                <span>🍃</span>
              </div>
              <h3 className="font-mont font-semibold text-2xl">
                Your Career Navigation Tool
              </h3>
              <p className="mt-3 text-gray-700">
                Career Compass is fundamentally a career guidance website and tool that serves as your trusted
                navigator in the professional world. We help students and working professionals{" "}
                <span className="font-semibold">identify their strengths</span>,{" "}
                <span className="font-semibold">plan their career trajectory</span>, and{" "}
                <span className="font-semibold">navigate complex career decisions</span> with confidence and clarity.
              </p>
            </div>

            {/* Right stacked highlights */}
            <div className="space-y-4">
              <div className="rounded-xl bg-cc-50 border border-cc-100 p-4">
                <div className="font-semibold">🎯 Identify</div>
                <div className="text-gray-700">
                  Discover your unique skills, interests, and career potential through comprehensive assessments.
                </div>
              </div>
              <div className="rounded-xl bg-cc-50 border border-cc-100 p-4">
                <div className="font-semibold">📝 Plan</div>
                <div className="text-gray-700">
                  Create structured, actionable career plans tailored to your goals and circumstances.
                </div>
              </div>
              <div className="rounded-xl bg-cc-50 border border-cc-100 p-4">
                <div className="font-semibold">🧭 Navigate</div>
                <div className="text-gray-700">
                  Make informed career decisions with expert guidance and industry insights.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE BENEFIT CARDS */}
      <section id="features" className="cc-container py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="cc-card p-6 text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cc-100 text-cc-700">📘</div>
            <h3 className="font-mont font-semibold text-xl">Expert Resources</h3>
            <p className="mt-2 text-gray-600">
              Access comprehensive career guides, industry insights, and professional development resources.
            </p>
          </div>

          <div className="cc-card p-6 text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cc-100 text-cc-700">👥</div>
            <h3 className="font-mont font-semibold text-xl">Community Support</h3>
            <p className="mt-2 text-gray-600">
              Connect with peers, mentors, and industry professionals in our supportive community.
            </p>
          </div>

          <div className="cc-card p-6 text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cc-100 text-cc-700">🏅</div>
            <h3 className="font-mont font-semibold text-xl">Proven Success</h3>
            <p className="mt-2 text-gray-600">
              Join thousands who have successfully navigated their career journey with our guidance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mt-12">
        <div className="bg-cta-grad py-14">
          <div className="cc-container text-center text-white">
            <h2 className="font-mont font-bold tracking-tight text-4xl">
              Ready to Transform Your Career?
            </h2>
            <p className="mt-3 text-white/90 max-w-3xl mx-auto">
              Join thousands of students and professionals who have successfully navigated their career journey with
              Career Compass. Start your transformation today.
            </p>

            {/* bullets row */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-white/95">
              <span className="inline-flex items-center gap-2">
                <span>✔</span> Free Career Assessment
              </span>
              <span className="inline-flex items-center gap-2">
                <span>✔</span> Personalized Guidance
              </span>
              <span className="inline-flex items-center gap-2">
                <span>✔</span> Expert Mentorship
              </span>
            </div>

           {/* actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
             <a href="/login" className="cc-btn bg-white text-cc-800 hover:bg-white/90">
              Start Your Free Assessment <span aria-hidden>→</span>
              </a>

            {/* Always-visible outlined button on green background */}
              <a
                 href="#contact"
                  className="cc-btn border border-white/70 text-white hover:bg-white/10"
               >
                  Contact Us </a>
                 </div>


            <p className="mt-8 text-white/80 text-sm">
              Trusted by thousands of professionals • 500+ career paths available • Free to get started
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
