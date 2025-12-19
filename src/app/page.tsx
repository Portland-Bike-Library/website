import Link from "next/link";
import { organization, programs } from "@/content/organization";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">{organization.name}</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{organization.mission}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-100 transition-colors"
            >
              Browse Bikes
            </Link>
            <Link
              href="/waiver"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Vision</h2>
          <p className="text-xl text-gray-600 italic">&quot;{organization.vision}&quot;</p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {organization.values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Our Programs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {program.title}
                </h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <p className="text-sm text-green-600 font-medium">
                  Goal: {program.goal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Ride?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join our community and get access to quality bikes for your family.
            Watch our safety video, sign the waiver, and start exploring your neighborhood!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learn"
              className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-500 transition-colors"
            >
              Watch Safety Video
            </Link>
            <Link
              href="/auth/signup"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Serving Our Community</h2>
          <p className="text-lg text-gray-600 mb-4">
            We&apos;re centered around the <strong>Abernethy Elementary School</strong> catchment area
            in inner SE Portland, Oregon.
          </p>
          <p className="text-gray-500">
            Our goal is to make biking accessible to all families in our neighborhood,
            regardless of income.
          </p>
        </div>
      </section>
    </div>
  );
}
