import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import DragnDropTeacher from "./components/DragnDropTeacher";
import DnDTeacher from "./components/DnDTeacher";

function App() {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  return (
    <div class="w-full h-full">
      <p class="font-bold h-fit w-full m-auto mt-8 mb-4 self-center text-center">Manhasset Master Schedule Builder</p>
      <DnDTeacher/>
    </div>

  );
}

export default App;
