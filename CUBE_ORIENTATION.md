# Rubik's Cube Orientation Guide

## How to Hold the Cube

When reading the cube string, hold your physical cube with:
- **Yellow (U)** on **TOP**
- **White (D)** on **BOTTOM**
- **Green (F)** facing **YOU** (Front)
- **Blue (B)** facing **AWAY** from you (Back)
- **Orange (R)** on the **RIGHT** side
- **Red (L)** on the **LEFT** side

```
        ┌─────┐
        │  U  │  ← Yellow (Up)
        │(Top)│
┌───────┼─────┼───────┐
│   L   │  F  │   R   │
│ (Red) │(Grn)│(Orng) │
└───────┼─────┼───────┘
        │  D  │  ← White (Down)
        │(Bot)│
        └─────┘
        │  B  │  ← Blue (Back - opposite of Front)
        │(Bck)│
```

## Face Symbols

- **U** = **Up** (Yellow) - Top face
- **D** = **Down** (White) - Bottom face
- **F** = **Front** (Green) - Face facing you
- **B** = **Back** (Blue) - Face opposite of front
- **R** = **Right** (Orange) - Right side when facing front
- **L** = **Left** (Red) - Left side when facing front

## Cube String Format

The cube string is **54 characters** long, representing all 54 facelets (9 stickers per face × 6 faces).

### Face Order in String
The string is organized as:
1. **Positions 0-8**: Up face (U) - Yellow
2. **Positions 9-17**: Right face (R) - Orange
3. **Positions 18-26**: Front face (F) - Green
4. **Positions 27-35**: Down face (D) - White
5. **Positions 36-44**: Left face (L) - Red
6. **Positions 45-53**: Back face (B) - Blue

### Facelet Order Within Each Face

Each face's 9 facelets are arranged in **reading order** (left-to-right, top-to-bottom):

```
For each face (U, R, F, D, L, B):
┌─────┬─────┬─────┐
│  0  │  1  │  2  │  ← Top row
├─────┼─────┼─────┤
│  3  │  4  │  5  │  ← Middle row
├─────┼─────┼─────┤
│  6  │  7  │  8  │  ← Bottom row
└─────┴─────┴─────┘
```

### Example: Solved Cube String

```
UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB
│         │         │         │         │         │
│         │         │         │         │         └─ Back (B) - Blue
│         │         │         │         └─────────── Left (L) - Red
│         │         │         └───────────────────── Down (D) - White
│         │         └─────────────────────────────── Front (F) - Green
│         └────────────────────────────────────────── Right (R) - Orange
└──────────────────────────────────────────────────── Up (U) - Yellow
```

## How to Read Your Cube

1. **Hold the cube** with Yellow on top, Green facing you
2. **Read each face** from top-left to bottom-right (like reading a book)
3. **For each facelet**, note which color it is and use the corresponding letter:
   - Yellow → U
   - White → D
   - Green → F
   - Blue → B
   - Orange → R
   - Red → L

### Example: Reading the Up (Yellow) Face

Looking down at the top of the cube:
```
┌─────┬─────┬─────┐
│  U  │  U  │  U  │  ← Row 0 (top)
├─────┼─────┼─────┤
│  U  │  U  │  U  │  ← Row 1 (middle)
├─────┼─────┼─────┤
│  U  │  U  │  U  │  ← Row 2 (bottom)
└─────┴─────┴─────┘
```

This would be: `UUUUUUUUU` (positions 0-8 in the string)

## Important Notes

1. **Orientation matters!** The cube string assumes a specific orientation:
   - Yellow on top
   - Green facing you
   - Orange on right

2. **If your cube has different colors**, you need to mentally map:
   - Your top color → U
   - Your bottom color → D
   - Your front color → F
   - Your back color → B
   - Your right color → R
   - Your left color → L

3. **The app uses this same orientation** - when you look at the 3D cube in the app, it's showing:
   - Yellow (U) on top
   - Green (F) facing you
   - Orange (R) on right
   - Red (L) on left
   - Blue (B) on back
   - White (D) on bottom

## Solution Notation

When you get a solution like `"R U R' U R U2 R'"`, these are moves:

- **R** = Turn Right face clockwise 90°
- **R'** = Turn Right face counterclockwise 90°
- **R2** = Turn Right face 180°
- **U** = Turn Up face clockwise 90°
- **U'** = Turn Up face counterclockwise 90°
- **U2** = Turn Up face 180°

And so on for F (Front), B (Back), L (Left), D (Down).

## Quick Reference

| Symbol | Face | Color | Position |
|--------|------|-------|----------|
| U | Up | Yellow | Top |
| D | Down | White | Bottom |
| F | Front | Green | Facing you |
| B | Back | Blue | Opposite of front |
| R | Right | Orange | Right side |
| L | Left | Red | Left side |

