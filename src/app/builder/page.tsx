import CVForm from "@/components/cv/cvForm";

export default function BuilderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Générateur de CV</h1>
      <CVForm />
    </div>
  );
}