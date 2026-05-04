# StarPals AI

**StarPals AI** is a cutting-edge film casting platform that leverages advanced generative artificial intelligence to streamline the talent discovery process. It facilitates precise role-matching by analyzing actor profiles, scripts, and visual data through multi-modal learning.

### Project Overview
*   **AI-Driven Profiling:** Developed a platform for automated actor profiling, script analysis, and lookalike detection.
*   **Intelligent Matching:** Implemented precise role-matching algorithms using Generative AI and Natural Language Processing (NLP).
*   **Workflow Optimization:** Streamlined the casting workflow for the entertainment industry with automated character extraction and visual similarity tools.

### Technologies Used
*   **Generative AI:** Google Gemini 2.5 Flash
*   **AI Orchestration:** Genkit
*   **Frameworks:** Next.js 15 & React 19
*   **Language:** TypeScript & Node.js
*   **UI/UX:** Tailwind CSS & Shadcn UI

## Key Features

### 1. Intelligent Script Analysis
Eliminate manual character breakdown. The AI analyzes script excerpts to extract structured character profiles including:
- **Demographics:** Automated estimation of age range and gender.
- **Physical Requirements:** Detection of build, height, and specific features.
- **Psychological Profiling:** Extraction of emotional traits and character "vibe."
- **Skill Identification:** Detection of required specialized skills (e.g., martial arts, accents).

### 2. Multi-Modal Lookalike Detection
Specifically designed for finding younger versions of lead actors or family matches.
- **Vision-Language Analysis:** Compares facial structures (jawlines, eyes, face shape) between adult leads and potential child actors.
- **Similarity Scoring:** Returns a percentage-based confidence score and a qualitative justification for the match.

### 3. Precision Matching Engine
A custom algorithm that calculates a weighted **Compatibility Score** between actors and roles based on:
- **Hard Filters:** Gender and age range alignment.
- **Soft Matches:** Overlap in specialized skills and emotional traits.
- **Physical Alignment:** Proximity to specified physical requirements.

### 4. Talent Management & Analytics
- **Real-time Database:** Global talent directory powered by Firestore.
- **Bulk Data Processing:** CSV import/export for large-scale talent migrations.
- **Visual Analytics:** Real-time dashboards visualizing database growth, genre distribution, and database demographics using Recharts.

---

## Technical Implementation

- **AI Orchestration:** Used **Genkit** to build reliable, server-side AI flows with strong schema enforcement via Zod.
- **Client-Side Firebase:** Leveraged the Firebase Web SDK for real-time document synchronization and low-latency UI updates.
- **Multi-Modal Workflows:** Implemented image-to-data-URI pipelines to feed visual data directly into LLM prompts for visual analysis.
- **Responsive Design:** A mobile-first, sidebar-driven navigation system built for efficiency on set or in the office.

---
