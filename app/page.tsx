import { AlbumView } from "@/components/album-view";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-6 p-6">
        <AlbumView />
      </main>
    </div>
  );
}
