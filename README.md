<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Dreamcast - Kids Podcast Creator 🌙✨

> **"Transformer le rituel du coucher en une expérience audio magique, éducative et personnalisée grâce à l'IA."**

Dreamcast est un **Studio de Création Audio pour Enfants** nouvelle génération. Plus qu'une simple application d'histoires, c'est un compagnon intelligent qui permet aux parents et aux enfants de *façonner* leurs propres aventures, de gérer la routine du soir et de s'apaiser avant de dormir.

---

## 🚀 Fonctionnalités Clés (The Vibe)

### 🧙‍♂️ Le Sorcier (Story Wizard)
Créez des histoires sur mesure en quelques secondes. Choisissez le héros, le thème, la morale, et laissez l'IA (Google Gemini) tisser un conte unique.
*   *Tech:* Génération de script et de prompt d'image en temps réel.

### 🎙️ Voice Lab (Clonage de Voix)
**La "Killer Feature"**. Permet aux parents de cloner leur voix (via un échantillon) pour que l'histoire soit racontée avec une tonalité familière et rassurante, même en leur absence.

### 🌙 Rituel du Soir (Good Night Routine)
Un véritable outil parental gamifié pour accompagner l'enfant : brossage de dents, pyjama, moment calme. Transforme les corvées en quêtes ludiques.

### 🧘 Zen Mode & Journal
Des méditations guidées et un journal de rêves pour cultiver la pleine conscience et apaiser l'esprit après une journée bien remplie.

---

## 🛠️ Architecture & Stack Technique

Le projet est conçu comme une **SPA (Single Page Application)** moderne, rapide et "Mobile First".

*   **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) (Performance & DX)
*   **Intelligence:** [Google Gemini API](https://ai.google.dev/) (`@google/genai`) pour la génération créative.
*   **UI/UX:** [Tailwind CSS](https://tailwindcss.com/) pour un design "Cosmic Candy" (Glassmorphism, gradients néons, mode sombre par défaut pour le confort visuel).
*   **Icons:** [Lucide React](https://lucide.dev/).
*   **Persistence:** LocalStorage (MVP actuel pour une expérience sans friction).

---

## ⚡ Installation & Démarrage

Ce projet contient tout le nécessaire pour lancer votre propre studio Dreamcast localement.

**Prérequis :** Node.js installé sur votre machine.

1.  **Installation des dépendances :**
    ```bash
    npm install
    ```

2.  **Configuration de l'IA :**
    Créez un fichier `.env.local` à la racine et ajoutez votre clé API Gemini :
    ```env
    GEMINI_API_KEY=votre_cle_api_ici
    ```

3.  **Lancement du studio :**
    ```bash
    npm run dev
    ```

---

*View your app in AI Studio: https://ai.studio/apps/drive/1D8-QHrr00FxCOfTQCb1ORy5ymBLMHqEE*
