import { organization, board, programs } from "@/content/organization";

export default function AboutPage() {
  return (
    <div className="py-12">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
        <p className="text-xl text-gray-600">{organization.purpose}</p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-green-50 py-12 mb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600">{organization.mission}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
              <p className="text-gray-600 italic">"{organization.vision}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Board of Directors</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {board.map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-green-600">
                  {member.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              {member.roles.length > 0 && (
                <p className="text-green-600 font-medium">
                  {member.roles.join(", ")}
                </p>
              )}
              <a
                href={`mailto:${member.email}`}
                className="text-sm text-gray-500 hover:text-green-600 transition-colors"
              >
                {member.email}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Our Programs */}
      <section className="bg-gray-50 py-12 mb-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Programs</h2>
          <div className="space-y-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{program.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{program.description}</p>
                    <p className="text-green-600 font-medium">
                      <strong>Goal:</strong> {program.goal}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 501(c)(3) Status */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Legal Foundation</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">
            Portland Bike Library is a <strong>501(c)(3) nonprofit organization</strong> incorporated
            in the State of Oregon. As a public benefit nonprofit, we are committed to serving
            underserved families in our community.
          </p>
          <p className="text-gray-600 mb-4">
            Your donations are tax-deductible to the extent allowed by law. We maintain
            general liability insurance to protect our volunteers and participants.
          </p>
          <p className="text-gray-600">
            In accordance with our bylaws, in the event of dissolution, our assets would be
            distributed to another 501(c)(3) organization with a similar mission.
          </p>
        </div>
      </section>

      {/* How to Support */}
      <section className="bg-green-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Support Our Mission</h2>
          <p className="text-lg mb-8">
            We rely on donations, grants, and community support to keep bikes rolling
            for families in SE Portland.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-green-600 p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-2">Donate a Bike</h3>
              <p className="text-green-100">
                Have a bike in good condition? We'd love to add it to our library
                or sell it to fund our programs.
              </p>
            </div>
            <div className="bg-green-600 p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-2">Financial Support</h3>
              <p className="text-green-100">
                Tax-deductible donations help us maintain bikes, acquire new ones,
                and expand our reach.
              </p>
            </div>
            <div className="bg-green-600 p-6 rounded-lg">
              <h3 className="font-semibold text-xl mb-2">Volunteer</h3>
              <p className="text-green-100">
                Help with bike maintenance, event coordination, or administrative
                tasks. Every bit helps!
              </p>
            </div>
          </div>
          <p className="mt-8">
            Contact us at{" "}
            <a
              href={`mailto:${organization.contact.email}`}
              className="underline hover:text-green-200"
            >
              {organization.contact.email}
            </a>{" "}
            to get involved.
          </p>
        </div>
      </section>
    </div>
  );
}
