# VERTICAL SLICE V2 — NARRATIVE EMOTIONAL LOOP

## Why V2 exists

V1 proved the basic tactical loop could function, but it did not create enough emotional attachment because the player met the characters only as combat pieces.

V2 changes the test question from:

> “Does the combat choice work?”

to:

> “Do I care enough about these people that the combat choice hurts?”

## Core sequence

**COLD OPEN → MEET THE CAST → HEAR THEIR RELATIONSHIPS → THREAT → CHOOSE WHO IS PROTECTED → HEAR THEIR REACTION → COMMIT → WATCH → LOSS → AFTERMATH → RECOVER OR LEAVE → MEMORY**

## Emotional goals

Before combat:
- establish the Living Caravan as a place, not a menu;
- establish Vael, Seris, and Mirel as distinct people;
- show that they already care about one another;
- make the incoming battle feel like an interruption to an existing life.

During combat:
- preserve simple controls;
- show the player's protection choice clearly;
- let characters speak during key events;
- make the protected side and exposed side equally visible.

After combat:
- do not jump directly to an economy screen;
- show the fallen character and surviving characters reacting first;
- only then expose the economic cost of rescue;
- make both rescue and abandonment create a persistent narrative memory.

## Current micro-story

Setting:
- Night 47 on the Glass Plain.
- The living caravan is called **Arca**.
- Hunters have followed the caravan's blood trail.

Character beats:
- Mirel quietly mourns flowers that died.
- Seris notices that Mirel is pretending not to care.
- Vael detects the approaching hunters first.
- Vael can fully guard only one of the two vulnerable members.
- The player chooses between protecting Seris's decisive ritual or Mirel's sustaining ecosystem role.

## Design principle under test

> **KNOW THEM → HEAR THEM → RISK THEM → MISS THEM → PAY FOR THEM**

This is now considered a required emotional structure for future prototypes unless explicitly overturned.

## Still not locked

V2 still does not lock:
- D002 control model;
- permanent death rules;
- exact rescue costs;
- run map structure;
- final spatial model;
- final character art;
- long-term relationship progression.

## Technical note

The live mobile slice temporarily uses DOM/CSS presentation for reliability after a deployed Pixi initialization path produced a blank mobile screen.

PixiJS remains the intended battle-rendering direction, but reintroduction should happen only after:
1. stable mobile startup,
2. graceful fallback,
3. visible first paint before renderer initialization,
4. actual-device testing.

## Live preview

`https://project-guildfall.vercel.app`
