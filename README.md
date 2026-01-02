# Fudan Graduate Course Evaluation Auto-Fill Script

A Tampermonkey userscript to automatically fill course evaluation forms for Fudan University graduate students.

## Features

- **One-Click Fill**: Automatically select "Totally Agree" for all questions
- **Auto-Process All Courses**: Automatically iterate through all unevaluated courses
- **Modern Control Panel**: Floating panel with easy-to-use buttons
- **Smart Detection**: Multiple fallback methods to detect form elements

## Installation

### Prerequisites

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension:
   - [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### Install Script

1. Click on the Tampermonkey icon in your browser
2. Select "Create a new script"
3. Delete all existing content
4. Copy and paste the content from `FudanEvaluation.user.js`
5. Press `Ctrl+S` or click "File > Save"

Alternatively:
1. Open `FudanEvaluation.user.js` file directly in browser
2. Tampermonkey should prompt to install

## Usage

1. Navigate to the Fudan Graduate Evaluation System:
   ```
   https://yzsfwapp.fudan.edu.cn/gsapp/sys/wspjappfudan/*default/index.do
   ```

2. Log in with your student credentials

3. A floating control panel will appear on the right side of the page

4. **Options**:
   - **Fill All (Totally Agree)**: Fill all questions in current form with "Totally Agree"
   - **Auto All Courses**: Automatically process ALL unevaluated courses
   - **Submit Current**: Submit the current evaluation form
   - **Close Panel**: Hide the control panel

## Configuration

You can modify these settings in the script:

```javascript
const CONFIG = {
    CLICK_DELAY: 300,        // Delay between clicks (ms)
    SUBMIT_DELAY: 500,       // Delay after submit (ms)
    NEXT_COURSE_DELAY: 1000, // Delay before next course (ms)
    PAGE_LOAD_DELAY: 1500,   // Wait for page load (ms)
    AUTO_MODE: true,         // Enable auto mode
    DEBUG: true              // Show console logs
};
```

## Troubleshooting

### Script not loading

- Ensure Tampermonkey is enabled
- Check that the script is enabled in Tampermonkey dashboard
- Refresh the page after installing

### Buttons not clicking

- The page structure may have changed
- Try increasing `PAGE_LOAD_DELAY` in config
- Check browser console (F12) for error messages

### Form not submitting

- Some forms may require all fields to be filled
- Check if there are any required text fields at the bottom

## Technical Details

- **Target URL**: `https://yzsfwapp.fudan.edu.cn/gsapp/sys/wspjappfudan/*`
- **Framework**: Vanilla JavaScript (ES6+)
- **Dependencies**: None (self-contained)

## Changelog

### v1.0 (2026-01-02)

- Initial release
- Auto-fill "Totally Agree" for all questions
- Auto-process all courses feature
- Floating control panel UI

## Disclaimer

This script is provided for educational purposes only. Use at your own discretion. The author is not responsible for any consequences of using this script.

## License

MIT License

