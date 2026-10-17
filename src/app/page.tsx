import Walk from "@/components/Walk";
import Approach from "@/components/sections/Approach";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Walk />
      <Approach />
      <Process />
      <Projects />
      <Contact />
    </main>
  );
}
