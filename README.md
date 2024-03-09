# Image Scanner App

## Getting Started

### Prerequisites

To install the software, you will need the following:

Node.js and npm:
You can install the latest version of npm globally by running the command `npm install npm@latest -g`.
You can install Node.js using nvm (Node Version Manager) by running `nvm install v20`.

### Installation

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the Images tab.

## The Brief

This component is responsible for handling the upload and display of passport information. It is structured using Tailwind CSS classes for styling and layout. Here's a breakdown of its functionality:

- **Loading and Error Handling**:

  - The component shows a toast notification with the message "Scanning passport..." indicating that the passport scanning process is in progress.
  - If an `error` occurs, it displays a toast notification with the error message to alert the user of the issue.

- **Add Button**:

  - A button labeled "Add" allows users to add new passport images from their local system.
  - Only image files can be loaded. (png/jpeg)

- **Passport Data Table**:

  - Displays the passport data in a table format with columns for Passport, Expiry Date, and Birth Date. Button `Scan passport` is visible only until the passport is not scanned.
  - The table is scrollable horizontally to accommodate the content width, ensuring responsiveness and accessibility.

## Authors

Ravneet Singh Anand - [RavneetAnand](https://github.com/RavneetAnand)
