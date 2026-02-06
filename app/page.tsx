"use client";
import { useState, useEffect } from "react";
import { generateRoutine } from "../utils/generateRoutine";
import confetti from "canvas-confetti";

export default function Home() {
  var stateStep = useState(0);
  var step = stateStep[0];
  var setStep = stateStep[1];

  var stateAnswers = useState({
    skinType: "",
    concerns: [],
    sensitivities: [],
    climate: "",
  });
  var answers = stateAnswers[0];
  var setAnswers = stateAnswers[1];

  var stateRoutine = useState(null);
  var routine = stateRoutine[0];
  var setRoutine = stateRoutine[1];

  var steps = [
    { question: "What is your skin type?", options: ["dry", "oily", "combination", "sensitive"], key: "skinType", multiple: false },
    { question: "What are your main skin concerns?", options: ["acne", "hyperpigmentation", "dryness", "texture", "redness"], key: "concerns", multiple: true },
    { question: "Any sensitivities?", options: ["fragrance", "retinoids", "acids"], key: "sensitivities", multiple: true },
    { question: "What climate do you live in?", options: ["dry", "humid", "temperate"], key: "climate", multiple: false },
  ];

  var current = steps[step];

  function handleSelect(option) {
    if (current.multiple) {
      setAnswers(function (prev) {
        var updated = Object.assign({}, prev);
        var values = prev[current.key];
        if (values.indexOf(option) !== -1) {
          updated[current.key] = values.filter(v => v !== option);
        } else {
          updated[current.key] = values.concat(option);
        }
        return updated;
      });
    } else {
      setAnswers(function (prev) {
        var updated = Object.assign({}, prev);
        updated[current.key] = option;
        return updated;
      });
    }
  }

  function next() {
    if (step === steps.length - 1) {
      setRoutine(generateRoutine(answers));
      confetti({ particleCount: 300, spread: 120, origin: { x: 0.5, y: 0.5 }, colors: ["#F43F5E", "#FB7185", "#FBCFE8", "#F472B6"], scalar: 1.5 });
    } else {
      setStep(step + 1);
    }
  }

  function prev() {
    if (step > 0) setStep(step - 1);
  }

  function restartQuiz() {
    setStep(0);
    setAnswers({ skinType: "", concerns: [], sensitivities: [], climate: "" });
    setRoutine(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function copyRoutine() {
    if (!routine) return;
    const text = `AM Routine:\n${routine.am.map(s => s.name).join('\n')}\n\nPM Routine:\n${routine.pm.map(s => s.name).join('\n')}`;
    navigator.clipboard.writeText(text);
    alert("Routine copied to clipboard!");
  }

  if (routine) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-rose-50 to-neutral-100 p-8 text-black">
        <h1 className="text-5xl font-bold mb-4 text-center tracking-tight">GlowGuide</h1>
        <p className="text-center text-lg mb-10">Your personalized AM/PM skincare routine</p>
        <div className="max-w-3xl mx-auto space-y-10">
          <Routine title="AM Routine" steps={routine.am} />
          <Routine title="PM Routine" steps={routine.pm} />
        </div>

        <button onClick={copyRoutine} className="mt-6 w-full bg-rose-400 text-white py-3 rounded-xl hover:bg-rose-500 transition">Copy Routine</button>
        <button onClick={restartQuiz} className="mt-4 w-full bg-rose-500 text-white py-3 rounded-xl hover:bg-rose-600 transition">Restart Quiz</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-neutral-100 flex flex-col items-center justify-center p-8 text-black">
      <h1 className="text-5xl font-bold mb-4 text-center tracking-tight">GlowGuide</h1>
      <p className="text-center text-lg mb-10">Personalized skincare routines for your skin type and concerns</p>

      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-8 rounded-2xl shadow-lg max-w-md w-full fade-in">
        <div className="mb-6">
          <p className="text-sm mb-2">Step {step + 1} of {steps.length}</p>
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div className="h-full bg-rose-400 transition-all" style={{ width: ((step + 1)/steps.length)*100 + "%" }} />
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 fade-in">{current.question}</h2>

        <div className="grid grid-cols-2 gap-3">
          {current.options.map(function (opt) {
            var selected = current.multiple ? answers[current.key].indexOf(opt) !== -1 : answers[current.key] === opt;
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`px-4 py-3 rounded-xl border transition transform duration-150 hover:scale-105 text-sm capitalize ${selected ? "bg-rose-400 text-white border-rose-400 shadow relative" : "bg-white hover:border-rose-300"}`}
              >
                {opt}
                {selected && <span className="absolute top-1 right-1 text-white font-bold">✔</span>}
              </button>
            );
          })}
        </div>

        {step > 0 && <button onClick={prev} className="mt-4 text-sm underline text-rose-600 hover:text-rose-800">Back</button>}

        <button onClick={next} className="mt-8 w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition">{step === steps.length - 1 ? "Generate My Routine" : "Continue"}</button>
      </div>
    </main>
  );
}

function Routine(props) {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">{props.title}</h2>
      <ul className="space-y-4">
        {props.steps.map(function (step, idx) {
          return (
            <li key={idx} className="bg-white p-5 rounded-2xl shadow-sm border fade-in">
              <p className="font-medium text-lg">{idx + 1}. {step.name}</p>
              <p className="text-sm mt-1">{step.reason}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

