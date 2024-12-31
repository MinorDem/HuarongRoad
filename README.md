# HuarongRoad

## Sliding Puzzle Game

A classic sliding puzzle game built using React, Next.js, and ShadCN UI components. Challenge yourself to rearrange the tiles in numerical order by sliding them into the empty space. This game is perfect for enhancing problem-solving skills while having fun!

---

## Features

- **Interactive Gameplay**: Slide tiles smoothly with real-time feedback.
- **Timer**: Track how long it takes you to solve the puzzle.
- **Reset Button**: Start over with a freshly shuffled puzzle.
- **Responsive Design**: The game works seamlessly across devices.
- **Customizable Grid**: Easily adapt the grid size or design in the code.

---

## How to Play

1. Rearrange the tiles to their original order (e.g., 1 to 8) by sliding them into the empty space.
2. Aim to complete the puzzle in the shortest time possible.
3. Use the Reset button to restart the game.

---

## Project File Structure

```plaintext
├── src
│   ├── app
│   │   ├── api
│   │   │   └── leaderboard
│   │   │       ├── rank
│   │   │       │   └── route.ts        # API route to fetch user rank
│   │   │       └── route.ts            # API route to fetch leaderboard
│   │   ├── favicon.ico
│   │   ├── globals.css                 # Global styles for the application
│   │   ├── layout.tsx                  # Application layout
│   │   └── page.tsx                    # Main page of the application
│   ├── components
│   │   └── ui
│   │       ├── board.tsx               # Board component for the puzzle
│   │       ├── button.tsx              # Reusable button component
│   │       ├── card.tsx                # Reusable card component
│   │       ├── dialog.tsx              # Dialog component
│   │       ├── gameControls.tsx        # Controls for the game
│   │       ├── leaderboardDialog.tsx   # Leaderboard dialog component
│   │       ├── tile.tsx                # Tile component for the puzzle
│   │       ├── timer.tsx               # Timer component
│   │       └── victoryDialog.tsx       # Victory dialog component
│   ├── lib
│   │   └── utils.ts                    # Utility functions
│   ├── service
│   │   └── dynamoDBService.ts          # Service for interacting with DynamoDB
│   ├── types.ts                        # Type definitions
│   └── utils
│       └── shuffleUtils.ts             # Logic for shuffling the puzzle
```

---

## Technologies Used

- **React**: For building the interactive UI components.
- **Next.js**: For server-side rendering and routing.
- **ShadCN**: For pre-styled UI components.
- **Tailwind CSS**: For efficient and customizable styling.
- **AWS DynamoDB**: For leaderboard storage.
- **TypeScript**: To enable static type checking and better code quality.

---

## Future Enhancements

- Add a leaderboard using AWS DynamoDB to store player scores.
- Implement additional grid sizes (e.g., 4x4, 5x5).
- Create animations for tile movements.

---

## Setting Up AWS Leaderboard

### 1. Configure Environment Variables

Create a `.env` file in the project root and add the following:

```env
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

Replace `your-region`, `your-access-key-id`, and `your-secret-access-key` with your AWS credentials.

### 2. Setting Up DynamoDB Table

1. Log in to the [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to **DynamoDB > Tables**.
3. Create a table named **`puzzle-leaderboard`** with:
   - **Primary Key**: `uuid` (String).
4. Add a **Global Secondary Index (GSI)** if required for advanced sorting.

---

## Contributing

Contributions are welcome! If you'd like to improve the game or report a bug, feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

---

Enjoy solving the Sliding Puzzle Game! 🚀
