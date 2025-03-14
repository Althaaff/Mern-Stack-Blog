import CallToAction from "../components/CallToAction.jsx";

export default function Projects() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3 mt-3">
      <h1 className="text-3xl font-semibold">Projects</h1>

      <p className="text-md text-gray-500">
        Build fun and engaging projects while learning Frontent Development!
      </p>

      <CallToAction />
    </div>
  );
}
