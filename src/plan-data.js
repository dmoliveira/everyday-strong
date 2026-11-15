// Frozen source programme: 4 phases × 3 sessions × 6 prescribed slots.
export const planData = {
  "phases": [
    {
      "title": "Foundation",
      "range": "Weeks 1–13",
      "goal": "Learn technique, establish consistency and rebuild movement confidence.",
      "cardio": "Easy continuous cardio; increase time, not intensity.",
      "note": "Keep supported versions. First 2 weeks: 1–2 sets. Weeks 3 onward: usually 2 sets. Control beats speed."
    },
    {
      "title": "Build",
      "range": "Weeks 14–26",
      "goal": "Increase muscle-building stimulus using stronger bands and harder bodyweight variations.",
      "cardio": "Longer steady sessions and optional modest incline.",
      "note": "Aim for 2–3 sets on the main movements. Progress resistance when the top end of the rep range feels easy."
    },
    {
      "title": "Develop",
      "range": "Weeks 27–39",
      "goal": "Improve single-leg strength, pushing/pulling capacity, core and endurance.",
      "cardio": "Keep one steady session; optionally introduce gentle bike intervals.",
      "note": "Use controlled 2–3 second lowering on selected movements. Do not turn balance exercises into a race."
    },
    {
      "title": "Consolidate",
      "range": "Weeks 40–52",
      "goal": "Build sustainable long-term strength and test how far you have progressed.",
      "cardio": "Maintain regular aerobic work, varying easy and brisk efforts.",
      "note": "Keep the strongest variations you can execute safely. Week 52 is a light review week, not a maximal test."
    }
  ],
  "workouts": [
    {
      "A": [
        {
          "en": "Chair squat / sit-to-stand",
          "pt": "Agachamento na cadeira",
          "muscle": "Quads · glutes",
          "why": "Practical leg strength for stairs and getting up.",
          "how": "Use a sturdy chair; stand tall, then sit slowly.",
          "dose": "8–12",
          "kind": "strength",
          "id": "chair-squat-sit-to-stand"
        },
        {
          "en": "Incline push-up (wall or bench)",
          "pt": "Flexão de braços inclinada",
          "muscle": "Chest · triceps · shoulders",
          "why": "Efficient upper-body pushing strength.",
          "how": "Hands on a stable surface; keep body straight.",
          "dose": "6–12",
          "kind": "strength",
          "id": "incline-push-up-wall-or-bench"
        },
        {
          "en": "Seated resistance-band row",
          "pt": "Remada sentada com elástico",
          "muscle": "Back · biceps",
          "why": "Upper-back and arm strength to balance pushing.",
          "how": "Loop band around feet securely; pull elbows back without jerking.",
          "dose": "10–15",
          "kind": "strength",
          "id": "seated-resistance-band-row"
        },
        {
          "en": "Glute bridge",
          "pt": "Elevação de quadril",
          "muscle": "Glutes · hamstrings",
          "why": "Hip strength without deadlifts.",
          "how": "On your back with knees bent, lift hips without arching spine.",
          "dose": "10–15",
          "kind": "strength",
          "id": "glute-bridge"
        },
        {
          "en": "Standing calf raise",
          "pt": "Elevação de panturrilhas em pé",
          "muscle": "Calves · ankles",
          "why": "Ankle strength and walking resilience.",
          "how": "Hold a wall; lift and lower heels slowly.",
          "dose": "12–20",
          "kind": "strength",
          "id": "standing-calf-raise"
        },
        {
          "en": "Dead bug",
          "pt": "Inseto morto",
          "muscle": "Deep abs · trunk",
          "why": "Core control with low spinal movement.",
          "how": "Extend opposite arm and leg slowly; keep ribs and pelvis steady.",
          "dose": "6–10 / side",
          "kind": "core",
          "id": "dead-bug"
        }
      ],
      "B": [
        {
          "en": "Supported split squat",
          "pt": "Agachamento com pernas afastadas e apoio",
          "muscle": "Quads · glutes",
          "why": "Unilateral leg strength and stability.",
          "how": "Hold a sturdy chair; bend both knees a little, rise with control.",
          "dose": "6–10 / leg",
          "kind": "strength",
          "id": "supported-split-squat"
        },
        {
          "en": "Neutral-grip dumbbell press",
          "pt": "Desenvolvimento de ombros com halteres",
          "muscle": "Shoulders · triceps",
          "why": "Safe-range overhead pushing strength.",
          "how": "Use light weights, palms facing in; stop if shoulder pain.",
          "dose": "8–12",
          "kind": "strength",
          "id": "neutral-grip-dumbbell-press"
        },
        {
          "en": "Band pull-apart",
          "pt": "Abertura com elástico",
          "muscle": "Rear shoulders · upper back",
          "why": "Strengthens often-neglected rear-shoulder muscles.",
          "how": "Pull a light band apart at chest level without shrugging.",
          "dose": "12–15",
          "kind": "strength",
          "id": "band-pull-apart"
        },
        {
          "en": "Hamstring heel-dig bridge",
          "pt": "Ponte de glúteos com pressão dos calcanhares",
          "muscle": "Hamstrings · glutes",
          "why": "Extra back-of-leg work without hinging under load.",
          "how": "Press heels into floor and lift hips; hold 1–2 seconds.",
          "dose": "8–12",
          "kind": "strength",
          "id": "hamstring-heel-dig-bridge"
        },
        {
          "en": "Bird dog",
          "pt": "Extensão alternada de braço e perna em quatro apoios",
          "muscle": "Back stabilisers · core",
          "why": "Spine control and coordination.",
          "how": "Reach opposite arm and leg; avoid twisting.",
          "dose": "6–10 / side",
          "kind": "core",
          "id": "bird-dog"
        },
        {
          "en": "Modified front plank",
          "pt": "Prancha frontal com joelhos apoiados",
          "muscle": "Abdominals · core",
          "why": "Train anti-extension core endurance.",
          "how": "Elbows below shoulders, knees down, breathe normally.",
          "dose": "15–30 sec",
          "kind": "core",
          "id": "modified-front-plank"
        }
      ],
      "C": [
        {
          "en": "Bodyweight squat",
          "pt": "Agachamento livre",
          "muscle": "Quads · glutes",
          "why": "Second leg stimulus, building endurance.",
          "how": "Squat comfortably; use chair option if needed.",
          "dose": "10–15",
          "kind": "strength",
          "id": "bodyweight-squat"
        },
        {
          "en": "Incline push-up",
          "pt": "Flexão inclinada",
          "muscle": "Chest · triceps",
          "why": "Second weekly chest stimulus.",
          "how": "Use a stable surface; lower slowly.",
          "dose": "8–12",
          "kind": "strength",
          "id": "incline-push-up"
        },
        {
          "en": "Seated band row",
          "pt": "Remada sentada com elástico",
          "muscle": "Back · biceps",
          "why": "Second weekly pulling stimulus.",
          "how": "Control the return, shoulders relaxed.",
          "dose": "10–15",
          "kind": "strength",
          "id": "seated-band-row"
        },
        {
          "en": "Side-lying clamshell",
          "pt": "Abdução de quadril deitado de lado",
          "muscle": "Outer hips · glute medius",
          "why": "Hip control and lateral stability.",
          "how": "Knees bent, raise top knee while pelvis stays still.",
          "dose": "12–15 / side",
          "kind": "strength",
          "id": "side-lying-clamshell"
        },
        {
          "en": "Standing calf raise",
          "pt": "Elevação de panturrilhas em pé",
          "muscle": "Calves",
          "why": "Build ankle endurance and control.",
          "how": "Rise onto toes; pause and lower.",
          "dose": "12–20",
          "kind": "strength",
          "id": "standing-calf-raise"
        },
        {
          "en": "Modified side plank",
          "pt": "Prancha lateral com joelhos apoiados",
          "muscle": "Obliques · side core",
          "why": "Lateral trunk stability.",
          "how": "Elbow under shoulder, knees bent; raise hips.",
          "dose": "15–25 sec / side",
          "kind": "core",
          "id": "modified-side-plank"
        }
      ]
    },
    {
      "A": [
        {
          "en": "Tempo squat with light dumbbells",
          "pt": "Agachamento lento com halteres leves",
          "muscle": "Quads · glutes",
          "why": "Progress legs when 4 kg weights feel light.",
          "how": "Lower for 3 seconds; stay within comfortable range.",
          "dose": "8–15",
          "kind": "strength",
          "id": "tempo-squat-with-light-dumbbells"
        },
        {
          "en": "Lower incline push-up",
          "pt": "Flexão inclinada em apoio mais baixo",
          "muscle": "Chest · triceps",
          "why": "Progressively stronger pushing.",
          "how": "Reduce incline only if alignment remains good.",
          "dose": "6–12",
          "kind": "strength",
          "id": "lower-incline-push-up"
        },
        {
          "en": "Stronger-band seated row",
          "pt": "Remada sentada com elástico mais forte",
          "muscle": "Back · biceps",
          "why": "Progress pulling with increased tension.",
          "how": "Pause 1 second with elbows back.",
          "dose": "8–15",
          "kind": "strength",
          "id": "stronger-band-seated-row"
        },
        {
          "en": "Single-leg-assisted glute bridge",
          "pt": "Ponte de glúteos com auxílio de uma perna",
          "muscle": "Glutes · hamstrings",
          "why": "Greater hip challenge without deadlifts.",
          "how": "Keep one foot lightly assisting; do not rotate pelvis.",
          "dose": "8–12 / side",
          "kind": "strength",
          "id": "single-leg-assisted-glute-bridge"
        },
        {
          "en": "Single-leg supported calf raise",
          "pt": "Elevação unilateral de panturrilha com apoio",
          "muscle": "Calves",
          "why": "Greater stimulus with little equipment.",
          "how": "Hold support, use a small controlled range.",
          "dose": "8–15 / side",
          "kind": "strength",
          "id": "single-leg-supported-calf-raise"
        },
        {
          "en": "Reverse crunch",
          "pt": "Abdominal reverso",
          "muscle": "Abdominals · pelvis control",
          "why": "Direct abdominal flexion emphasis.",
          "how": "Roll pelvis gently off floor without swinging legs.",
          "dose": "8–12",
          "kind": "core",
          "id": "reverse-crunch"
        }
      ],
      "B": [
        {
          "en": "Supported reverse lunge",
          "pt": "Afundo para trás com apoio",
          "muscle": "Quads · glutes",
          "why": "Better single-leg strength and balance.",
          "how": "Step back holding a sturdy support, descend only comfortably.",
          "dose": "6–10 / leg",
          "kind": "strength",
          "id": "supported-reverse-lunge"
        },
        {
          "en": "Neutral-grip shoulder press",
          "pt": "Desenvolvimento de ombros com pegada neutra",
          "muscle": "Shoulders · triceps",
          "why": "Upper-body pressing progress.",
          "how": "Press light weights slowly, avoid back arching.",
          "dose": "8–15",
          "kind": "strength",
          "id": "neutral-grip-shoulder-press"
        },
        {
          "en": "Band pull-apart",
          "pt": "Abertura com elástico",
          "muscle": "Upper back · rear shoulders",
          "why": "Shoulder balance.",
          "how": "Pull gently apart at chest height.",
          "dose": "12–20",
          "kind": "strength",
          "id": "band-pull-apart"
        },
        {
          "en": "Hamstring walkout (short range)",
          "pt": "Ponte com caminhada dos calcanhares",
          "muscle": "Hamstrings · glutes",
          "why": "Hamstring challenge without deadlifts.",
          "how": "From bridge, take 1–2 tiny heel steps out and back; swap for bridge if cramping.",
          "dose": "5–8",
          "kind": "strength",
          "id": "hamstring-walkout-short-range"
        },
        {
          "en": "Band biceps curl",
          "pt": "Rosca bíceps com elástico",
          "muscle": "Biceps",
          "why": "Direct arm strength.",
          "how": "Stand on band, elbows still; curl slowly.",
          "dose": "10–15",
          "kind": "strength",
          "id": "band-biceps-curl"
        },
        {
          "en": "Front plank",
          "pt": "Prancha frontal",
          "muscle": "Abdominals · anti-extension",
          "why": "Greater trunk endurance.",
          "how": "Start on knees if floor version is too difficult.",
          "dose": "20–40 sec",
          "kind": "core",
          "id": "front-plank"
        }
      ],
      "C": [
        {
          "en": "Supported step-up on low stable step",
          "pt": "Subida em degrau baixo com apoio",
          "muscle": "Quads · glutes",
          "why": "Functional leg strength for stairs.",
          "how": "Use a low, secure step and hand support, no bouncing.",
          "dose": "8–12 / leg",
          "kind": "strength",
          "id": "supported-step-up-on-low-stable-step"
        },
        {
          "en": "Incline push-up",
          "pt": "Flexão inclinada",
          "muscle": "Chest · triceps",
          "why": "Reinforce pushing strength.",
          "how": "Use a comfortable incline with full control.",
          "dose": "8–15",
          "kind": "strength",
          "id": "incline-push-up"
        },
        {
          "en": "Seated band row",
          "pt": "Remada sentada com elástico",
          "muscle": "Back · biceps",
          "why": "Reinforce pulling strength.",
          "how": "Pause briefly and return slowly.",
          "dose": "10–15",
          "kind": "strength",
          "id": "seated-band-row"
        },
        {
          "en": "Side-lying hip abduction",
          "pt": "Elevação lateral da perna deitado",
          "muscle": "Outer hips",
          "why": "Hip stability and control.",
          "how": "Raise straight top leg slowly without rotating the body.",
          "dose": "10–15 / side",
          "kind": "strength",
          "id": "side-lying-hip-abduction"
        },
        {
          "en": "Band triceps extension",
          "pt": "Extensão de tríceps com elástico",
          "muscle": "Triceps",
          "why": "Direct upper-arm development.",
          "how": "Use a safe band position, keep shoulders comfortable.",
          "dose": "10–15",
          "kind": "strength",
          "id": "band-triceps-extension"
        },
        {
          "en": "Basic crunch",
          "pt": "Abdominal tradicional curto",
          "muscle": "Rectus abdominis",
          "why": "Direct abdominal flexion training.",
          "how": "Lift upper back slightly with chin relaxed, no neck pulling.",
          "dose": "8–15",
          "kind": "core",
          "id": "basic-crunch"
        }
      ]
    },
    {
      "A": [
        {
          "en": "Supported split squat with 3-sec lowering",
          "pt": "Agachamento unilateral assistido com descida lenta",
          "muscle": "Quads · glutes",
          "why": "Harder leg work without heavy weights.",
          "how": "Hold support and lower for 3 seconds.",
          "dose": "8–12 / leg",
          "kind": "strength",
          "id": "supported-split-squat-with-3-sec-lowering"
        },
        {
          "en": "Low incline or floor push-up",
          "pt": "Flexão baixa ou no chão",
          "muscle": "Chest · triceps",
          "why": "Increase pushing challenge safely.",
          "how": "Keep the variation where every rep is controlled.",
          "dose": "6–12",
          "kind": "strength",
          "id": "low-incline-or-floor-push-up"
        },
        {
          "en": "Band row with 2-sec pause",
          "pt": "Remada com elástico e pausa",
          "muscle": "Back · biceps",
          "why": "Progress pulling strength.",
          "how": "Hold elbows back 2 seconds each repetition.",
          "dose": "8–15",
          "kind": "strength",
          "id": "band-row-with-2-sec-pause"
        },
        {
          "en": "Single-leg glute bridge",
          "pt": "Ponte unilateral",
          "muscle": "Glutes · posterior chain",
          "why": "More challenging glute strength.",
          "how": "Keep pelvis level; retain assisted version if needed.",
          "dose": "8–12 / leg",
          "kind": "strength",
          "id": "single-leg-glute-bridge"
        },
        {
          "en": "Supported single-leg calf raise",
          "pt": "Elevação unilateral de panturrilha",
          "muscle": "Calves",
          "why": "Progress calf strength.",
          "how": "Rise and lower deliberately.",
          "dose": "10–15 / leg",
          "kind": "strength",
          "id": "supported-single-leg-calf-raise"
        },
        {
          "en": "Dead bug with slow exhale",
          "pt": "Inseto morto com expiração lenta",
          "muscle": "Deep abs",
          "why": "Increase abdominal control.",
          "how": "Exhale over 3–4 seconds extending limbs.",
          "dose": "8–12 / side",
          "kind": "core",
          "id": "dead-bug-with-slow-exhale"
        }
      ],
      "B": [
        {
          "en": "Supported reverse lunge",
          "pt": "Afundo para trás com apoio",
          "muscle": "Quads · glutes",
          "why": "Balance and unilateral control.",
          "how": "Hold support and use a deliberate tempo.",
          "dose": "8–12 / leg",
          "kind": "strength",
          "id": "supported-reverse-lunge"
        },
        {
          "en": "Light dumbbell shoulder press",
          "pt": "Desenvolvimento com halteres",
          "muscle": "Shoulders · triceps",
          "why": "Upper-body pressing work.",
          "how": "Use 4 kg or less, no painful overhead range.",
          "dose": "8–15",
          "kind": "strength",
          "id": "light-dumbbell-shoulder-press"
        },
        {
          "en": "Band pull-apart",
          "pt": "Abertura com elástico",
          "muscle": "Rear shoulders",
          "why": "Shoulder stability.",
          "how": "Keep ribs down; pull band apart.",
          "dose": "12–20",
          "kind": "strength",
          "id": "band-pull-apart"
        },
        {
          "en": "Short-range hamstring walkout",
          "pt": "Ponte com caminhada dos calcanhares",
          "muscle": "Hamstrings",
          "why": "Harder hamstring stimulus.",
          "how": "Keep steps small; stop on cramp and use bridge instead.",
          "dose": "6–10",
          "kind": "strength",
          "id": "short-range-hamstring-walkout"
        },
        {
          "en": "Band biceps curl",
          "pt": "Rosca bíceps com elástico",
          "muscle": "Biceps",
          "why": "Direct arm development.",
          "how": "No swinging or shoulder movement.",
          "dose": "10–20",
          "kind": "strength",
          "id": "band-biceps-curl"
        },
        {
          "en": "Side plank",
          "pt": "Prancha lateral",
          "muscle": "Obliques · lateral core",
          "why": "Core endurance and lateral control.",
          "how": "Knees down or legs straight as tolerated.",
          "dose": "20–40 sec / side",
          "kind": "core",
          "id": "side-plank"
        }
      ],
      "C": [
        {
          "en": "Slow supported step-up",
          "pt": "Subida lenta em degrau com apoio",
          "muscle": "Quads · glutes",
          "why": "Functional endurance and single-leg control.",
          "how": "Use a low stable step, lower slowly.",
          "dose": "10–12 / leg",
          "kind": "strength",
          "id": "slow-supported-step-up"
        },
        {
          "en": "Incline push-up with pause",
          "pt": "Flexão inclinada com pausa",
          "muscle": "Chest · triceps",
          "why": "Push-up strength and control.",
          "how": "Pause briefly at the lower position.",
          "dose": "8–15",
          "kind": "strength",
          "id": "incline-push-up-with-pause"
        },
        {
          "en": "Band row high reps",
          "pt": "Remada com elástico",
          "muscle": "Back · biceps",
          "why": "Back muscular endurance.",
          "how": "Use smooth reps without swinging.",
          "dose": "12–20",
          "kind": "strength",
          "id": "band-row-high-reps"
        },
        {
          "en": "Side-lying hip abduction",
          "pt": "Elevação lateral da perna",
          "muscle": "Outer hips",
          "why": "Hip endurance.",
          "how": "Keep torso stable; add light mini-band if available.",
          "dose": "12–20 / side",
          "kind": "strength",
          "id": "side-lying-hip-abduction"
        },
        {
          "en": "Triceps band extension",
          "pt": "Extensão de tríceps com elástico",
          "muscle": "Triceps",
          "why": "Arm development.",
          "how": "Use stable band setup away from face.",
          "dose": "10–20",
          "kind": "strength",
          "id": "triceps-band-extension"
        },
        {
          "en": "Reverse crunch",
          "pt": "Abdominal reverso",
          "muscle": "Abs · pelvic control",
          "why": "Abdominal development and control.",
          "how": "Curl pelvis slowly off floor.",
          "dose": "10–15",
          "kind": "core",
          "id": "reverse-crunch"
        }
      ]
    },
    {
      "A": [
        {
          "en": "Controlled squat or supported split squat",
          "pt": "Agachamento controlado ou dividido com apoio",
          "muscle": "Quads · glutes",
          "why": "Maintain your best safe leg variation.",
          "how": "Select the version challenging at 8–15 reps with good form.",
          "dose": "8–15",
          "kind": "strength",
          "id": "controlled-squat-or-supported-split-squat"
        },
        {
          "en": "Progressive incline/floor push-up",
          "pt": "Flexão inclinada ou no chão",
          "muscle": "Chest · triceps",
          "why": "Track upper-body strength gains.",
          "how": "Choose the hardest controlled variation.",
          "dose": "6–15",
          "kind": "strength",
          "id": "progressive-incline-floor-push-up"
        },
        {
          "en": "Strong-band row",
          "pt": "Remada com elástico forte",
          "muscle": "Back · biceps",
          "why": "Maintain progressive pulling stimulus.",
          "how": "Increase band tension when reps become easy.",
          "dose": "8–15",
          "kind": "strength",
          "id": "strong-band-row"
        },
        {
          "en": "Single-leg or assisted bridge",
          "pt": "Ponte unilateral ou assistida",
          "muscle": "Glutes · hamstrings",
          "why": "Maintain hip strength.",
          "how": "Avoid pelvis dropping or back arching.",
          "dose": "10–15 / leg",
          "kind": "strength",
          "id": "single-leg-or-assisted-bridge"
        },
        {
          "en": "Single-leg calf raise",
          "pt": "Elevação unilateral de panturrilha",
          "muscle": "Calves",
          "why": "Ankle strength maintenance.",
          "how": "Use a chair for balance.",
          "dose": "10–20 / leg",
          "kind": "strength",
          "id": "single-leg-calf-raise"
        },
        {
          "en": "Slow reverse crunch",
          "pt": "Abdominal reverso lento",
          "muscle": "Abs",
          "why": "Controlled dynamic abdominal strength.",
          "how": "Pause with pelvis lifted briefly; never swing.",
          "dose": "10–15",
          "kind": "core",
          "id": "slow-reverse-crunch"
        }
      ],
      "B": [
        {
          "en": "Supported reverse lunge or low step-up",
          "pt": "Afundo com apoio ou subida em degrau",
          "muscle": "Legs · balance",
          "why": "Keep progressing functional strength.",
          "how": "Choose a pain-free variation with secure support.",
          "dose": "8–15 / leg",
          "kind": "strength",
          "id": "supported-reverse-lunge-or-low-step-up"
        },
        {
          "en": "Shoulder press",
          "pt": "Desenvolvimento de ombros",
          "muscle": "Shoulders",
          "why": "Maintain overhead strength.",
          "how": "Use comfortable range with light dumbbells.",
          "dose": "10–15",
          "kind": "strength",
          "id": "shoulder-press"
        },
        {
          "en": "Band pull-apart",
          "pt": "Abertura com elástico",
          "muscle": "Rear shoulders",
          "why": "Support upper-back strength.",
          "how": "Slow full control.",
          "dose": "12–20",
          "kind": "strength",
          "id": "band-pull-apart"
        },
        {
          "en": "Hamstring bridge walkout or heel-dig bridge",
          "pt": "Ponte com caminhada ou pressão dos calcanhares",
          "muscle": "Hamstrings",
          "why": "Maintain posterior-chain strength.",
          "how": "Choose the version without cramping or low-back strain.",
          "dose": "6–15",
          "kind": "strength",
          "id": "hamstring-bridge-walkout-or-heel-dig-bridge"
        },
        {
          "en": "Band biceps curl",
          "pt": "Rosca bíceps com elástico",
          "muscle": "Biceps",
          "why": "Arm strength.",
          "how": "Elbows close to body.",
          "dose": "10–20",
          "kind": "strength",
          "id": "band-biceps-curl"
        },
        {
          "en": "Front plank with shoulder taps (optional)",
          "pt": "Prancha frontal com toques nos ombros",
          "muscle": "Abdominals · stabilisers",
          "why": "Advanced anti-rotation option.",
          "how": "Use ordinary knee plank if shoulder taps make hips sway.",
          "dose": "20–40 sec or 6–10 taps / side",
          "kind": "core",
          "id": "front-plank-with-shoulder-taps-optional"
        }
      ],
      "C": [
        {
          "en": "Tempo chair squat or low step-up",
          "pt": "Agachamento lento ou subida em degrau",
          "muscle": "Quads · glutes",
          "why": "Reinforce leg endurance.",
          "how": "Keep tempo slow and stable.",
          "dose": "12–20",
          "kind": "strength",
          "id": "tempo-chair-squat-or-low-step-up"
        },
        {
          "en": "Incline push-up",
          "pt": "Flexão inclinada",
          "muscle": "Chest · triceps",
          "why": "Extra quality pressing volume.",
          "how": "Select controlled variation.",
          "dose": "10–15",
          "kind": "strength",
          "id": "incline-push-up"
        },
        {
          "en": "Seated band row",
          "pt": "Remada sentada com elástico",
          "muscle": "Back · biceps",
          "why": "Extra quality pulling volume.",
          "how": "Full controlled range.",
          "dose": "12–20",
          "kind": "strength",
          "id": "seated-band-row"
        },
        {
          "en": "Side-lying hip abduction",
          "pt": "Elevação lateral da perna deitado",
          "muscle": "Hip stabilisers",
          "why": "Lateral hip strength.",
          "how": "Stop before pelvis rotates.",
          "dose": "12–20 / side",
          "kind": "strength",
          "id": "side-lying-hip-abduction"
        },
        {
          "en": "Band triceps extension",
          "pt": "Extensão de tríceps com elástico",
          "muscle": "Triceps",
          "why": "Direct arm work.",
          "how": "Keep band controlled throughout.",
          "dose": "12–20",
          "kind": "strength",
          "id": "band-triceps-extension"
        },
        {
          "en": "Crunch or side plank (alternate weeks)",
          "pt": "Abdominal curto ou prancha lateral (alternar semanas)",
          "muscle": "Abs · obliques",
          "why": "Train abdominal flexion and lateral stability.",
          "how": "Choose crunch on odd weeks, side plank on even weeks.",
          "dose": "10–20 or 20–40 sec / side",
          "kind": "core",
          "id": "crunch-or-side-plank-alternate-weeks"
        }
      ]
    }
  ],
  "mobility": [
    [
      "Cat-cow",
      "Gato-vaca",
      "8–10 slow reps",
      "Spinal mobility without forcing range."
    ],
    [
      "Hip flexor stretch",
      "Alongamento dos flexores do quadril",
      "20–30 sec / side",
      "Improves hip extension comfort."
    ],
    [
      "Hamstring stretch",
      "Alongamento posterior da coxa",
      "20–30 sec / side",
      "Improves hamstring flexibility."
    ],
    [
      "Doorway chest stretch",
      "Alongamento de peitoral na porta",
      "20–30 sec / side",
      "Opens chest and shoulder range."
    ],
    [
      "Open-book rotation",
      "Rotação torácica “livro aberto”",
      "6–8 / side",
      "Upper-back rotation."
    ],
    [
      "Calf stretch",
      "Alongamento de panturrilha",
      "20–30 sec / side",
      "Ankle mobility for walking."
    ]
  ]
};
