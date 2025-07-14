# IDP Images Directory

This directory contains images related to the Individual Development Plan (IDP) feature.

## How to Add Your PNG File

1. **Place your PNG file** in this directory (`src/shared/assets/images/idp/`)
   
   Recommended filename: `goal-categories-breakdown.png`

2. **Update the index.ts file** to import your actual PNG:
   ```typescript
   // Replace this line:
   export const trainingBreakdownImage = '/placeholder-training-breakdown.png';
   
   // With this:
   import trainingBreakdownImage from './goal-categories-breakdown.png';
   export { trainingBreakdownImage };
   ```

3. **The modal will automatically display your image** when users click the IDP info badge.

## File Structure
```
idp/
├── index.ts                         ← Import/export file
├── goal-categories-breakdown.png    ← Your PNG file goes here
├── idp-info.png                     ← Additional IDP images (optional)
└── README.md                        ← This file
```

## Image Requirements
- **Format**: PNG (recommended) or JPG
- **Size**: Optimize for web (ideally under 500KB)
- **Dimensions**: Responsive design will scale automatically
- **Content**: Should show the IDP goal categories (Business Goals vs Development Goals)

## Testing
After adding your PNG file:
1. Navigate to Employee Evaluation → Worker → IDP
2. Click the "IDP info about Goals - Goal Categories" badge
3. Verify your image displays correctly in the modal
2. Click "Add IDP Goal"
3. Click the green training info badge
4. Your image should appear in the modal popup
