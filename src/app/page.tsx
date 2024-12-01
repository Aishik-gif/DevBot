import MainPage from "@/components/pages/MainPage";

export default function Home() {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="mb-8 text-4xl font-bold">DevBot<span className="text-sm"> by Aishik Dutta</span></h1>
        <MainPage />
      </main>
    </div>
  );
}
