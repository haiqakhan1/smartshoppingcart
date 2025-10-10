---

# Smart Shopping Cart – Scan Interface Component

## Overview
This section documents the Scan Interface UI component developed as part of the Smart Shopping Cart project.  
It is a UI-only React component that simulates product scanning, displays scanned products, and shows alert messages (without hardware logic).

---

## Component Location
`src/Component/ScanInterface.jsx`

---

## Usage Instructions

1. Make sure Tailwind CSS is properly set up in your Vite React project.
2. Import and use the component inside `App.jsx`:
   ```javascript
   import ScanInterface from './Component/ScanInterface';

   function App() {
     return (
       <div>
         <ScanInterface />
       </div>
     );
   }

   export default App;
