type IntakePath = "headache" | "digestive" | "sleep" | "general";

export class MockAIService {
  static getNextQuestion(previousAnswers: string[]): string {
    if (previousAnswers.length === 0) {
      return "Namaskaram. I will ask a few questions to prepare your case for the practitioner. What brings you to the hospital today?";
    }

    const path = this.identifyPath(previousAnswers[0] || "");
    const followUps: Record<IntakePath, string[]> = {
      headache: [
        "I understand you are experiencing a headache. When did it begin, how severe is it, and where do you feel it?",
        "Do you notice nausea, sensitivity to light, blurred vision, fever, or any trigger such as stress, missed meals, or screen time?",
        "How have your sleep, appetite, water intake, and daily routine been recently?",
        "Thank you. I have collected enough information to prepare your structured Ayush case history for the practitioner.",
      ],
      digestive: [
        "I understand this is related to digestion. How long have you had this discomfort, and is it acidity, bloating, pain, nausea, or something else?",
        "How is your appetite and digestion after meals? Please also describe your bowel pattern.",
        "Tell me about your usual diet, meal timing, sleep, and recent stress levels.",
        "Thank you. I have collected enough information to prepare your structured Ayush case history for the practitioner.",
      ],
      sleep: [
        "I understand sleep or stress is affecting you. How many hours are you sleeping, and when did this change begin?",
        "Do you feel stress, anxiety, fatigue, racing thoughts, or daytime sleepiness?",
        "Tell me about your evening routine, caffeine use, diet, and any recent changes in your daily schedule.",
        "Thank you. I have collected enough information to prepare your structured Ayush case history for the practitioner.",
      ],
      general: [
        "Can you describe your symptoms in more detail? When did they start and what makes them better or worse?",
        "Do you have any relevant medical history, current medicines, allergies, or associated symptoms?",
        "How are your digestion, bowel pattern, sleep, diet, and daily routine currently?",
        "Thank you. I have collected enough information to prepare your structured Ayush case history for the practitioner.",
      ],
    };

    return (
      followUps[path][
        Math.min(previousAnswers.length - 1, followUps[path].length - 1)
      ] ??
      "Thank you. I have collected enough information to prepare your structured Ayush case history for the practitioner."
    );
  }

  static identifyPath(answer: string): IntakePath {
    const text = answer.toLowerCase();
    if (/(headache|migraine|head pain|dizzy|dizziness)/.test(text))
      return "headache";
    if (
      /(acidity|acid reflux|bloat|bloating|digestion|digestive|stomach|abdomen|gas|constipat|diarrh)/.test(
        text,
      )
    )
      return "digestive";
    if (/(sleep|sleepless|insomnia|stress|anxiety|tired|fatigue)/.test(text))
      return "sleep";
    return "general";
  }

  static detectRedFlags(patientResponses: string[]): string[] {
    const text = patientResponses.join(" ").toLowerCase();
    const flags: string[] = [];
    if (text.includes("chest") && text.includes("pain"))
      flags.push("Chest pain reported.");
    if (text.includes("breath") || text.includes("breathing difficulty"))
      flags.push("Breathing difficulty reported.");
    if (text.includes("blood") || text.includes("bleeding"))
      flags.push("Bleeding reported.");
    if (text.includes("faint") || text.includes("unconscious"))
      flags.push("Fainting or loss of consciousness reported.");
    return flags;
  }

  static generateStructuredHistory(patientResponses: string[]): any {
    const chiefComplaint = patientResponses[0] || "Not recorded";
    const path = this.identifyPath(chiefComplaint);
    const profile: Record<
      IntakePath,
      { location: string; character: string; agni: string; nidana: string }
    > = {
      headache: {
        location: "Head",
        character: "Headache reported by patient",
        agni: "To be assessed",
        nidana: "Possible stress, sleep or routine-related factors to verify",
      },
      digestive: {
        location: "Abdomen",
        character: "Digestive discomfort reported by patient",
        agni: "Vishamagni (Irregular) — patient intake indication",
        nidana: "Diet and meal timing factors to verify",
      },
      sleep: {
        location: "General wellbeing",
        character: "Sleep or stress disturbance reported by patient",
        agni: "To be assessed",
        nidana: "Stress and routine-related factors to verify",
      },
      general: {
        location: "To be assessed",
        character: "Patient-reported symptoms",
        agni: "To be assessed",
        nidana: "To be assessed by practitioner",
      },
    };
    const selected = profile[path];
    return {
      chiefComplaint,
      hpi: {
        onset: patientResponses[1] || "Not recorded",
        location: selected.location,
        character: selected.character,
        associatedSymptoms: patientResponses.slice(2, 3),
      },
      pastMedical: ["Not recorded"],
      medications: ["Not recorded"],
      allergies: ["Not recorded"],
      prakriti: "To be assessed by practitioner",
      vikriti: "To be assessed by practitioner",
      agni: selected.agni,
      koshtha: "To be assessed",
      nidana: selected.nidana,
      dashavidhaPariksha: {
        sara: "To be assessed",
        samhanana: "To be assessed",
        pramana: "To be assessed",
      },
      lifestyle: {
        diet: patientResponses[3] || "Not recorded",
        sleep:
          path === "sleep"
            ? patientResponses[1] || "Not recorded"
            : "Not recorded",
      },
    };
  }
}
