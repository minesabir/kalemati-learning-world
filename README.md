# Kalemati | كلماتي

Kalemati is a playful 3D-inspired Arabic learning world for children and non-Arabic-speaking beginners. The surrounding interface is in English, while the learning curriculum and spoken content are in Arabic.

![Kalemati learning world](public/kalemati-world.png)

## Live application

[Open Kalemati](https://kalemati-learning-world.minaalbayati05.chatgpt.site/)

## GitHub Pages edition

[Open Kalemati on GitHub Pages](https://minesabir.github.io/kalemati-learning-world/)

The GitHub Pages edition keeps learning progress and artwork in the current
browser. Cloud accounts, cross-device saving, and teacher requests remain
available in the full application above.

## Learning experience

- Progressive Arabic levels for letters, words, simple sentences, reading, and comprehension
- A library of 30 short illustrated stories with Arabic narration
- Placement tests, quizzes, and Arabic dictation activities
- Sentence-building exercises with multiple prompts and difficulty levels
- Colouring, tracing, copying, and homework activities
- Learning games, rewards, achievements, and learner progress
- Parent dashboard and teacher-contact experience
- Calm colours, original cartoon visuals, and a bird-free visual identity
- Responsive navigation for desktop, tablet, and mobile

## Technology

The application uses React, TypeScript, vinext, Cloudflare Workers, D1, and Drizzle. Sign-in and learner progress are handled on the server, so the full application is published with OpenAI Sites rather than as a static GitHub Pages site.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Privacy

Local environment files, build outputs, and dependencies are excluded from version control. No production credentials are stored in this repository.
