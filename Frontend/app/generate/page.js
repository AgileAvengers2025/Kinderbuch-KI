import Button from "../components/Button";

export default function Generate() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-black mb-8">Generate</h1>
      <div className="flex flex-col gap-4 font-bold">
        <Button variant="primary">Adventure</Button>
        <Button variant="primary">Curiosity</Button>
        <Button variant="primary">Calm</Button>
        <Button variant="primary">Peace</Button>
      </div>
    </div>
  );
}
