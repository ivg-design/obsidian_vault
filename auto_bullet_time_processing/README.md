# BulletTime Automation - Single Script Solution

Fully automated After Effects script that monitors folders and applies Bullet Time effect with slow motion to videos.

## Installation (2 Files Only!)

### Step 1: Copy Files to After Effects Startup Folder

**Mac:**
```
/Applications/Adobe After Effects 2025/Scripts/Startup/
```

**Windows:**
```
C:\Program Files\Adobe\Adobe After Effects 2025\Support Files\Scripts\Startup\
```

Copy these 2 files:
- `BulletTimeAutomate.jsx` - The automation script
- `BulletTimeAutomate.json` - Your configuration

### Step 2: Configure Your Folders

Edit `BulletTimeAutomate.json` to set your folder paths:

```json
{
    "folders": {
        "input": {
            "mac": "/Users/yourname/BulletTime/in",
            "windows": "C:\\Users\\YourName\\BulletTime\\in"
        },
        "output": {
            "mac": "/Users/yourname/BulletTime/out",
            "windows": "C:\\Users\\YourName\\BulletTime\\out"
        },
        "processed": {
            "mac": "/Users/yourname/BulletTime/processed",
            "windows": "C:\\Users\\YourName\\BulletTime\\processed"
        },
        "template": {
            "mac": "",
            "windows": ""
        },
        "logFile": {
            "mac": "/Users/yourname/BulletTime/logs/automation.log",
            "windows": "C:\\Users\\YourName\\BulletTime\\logs\\automation.log"
        }
    },
    "processing": {
        "timeStretch": 300,
        "applyBulletTime": true,
        "checkInterval": 2000
    }
}
```

The script automatically detects your platform and uses the correct paths!

### Step 3: Launch After Effects

That's it! The script starts automatically when After Effects opens.

## How It Works

1. Launch After Effects - the script loads automatically
2. If folders don't exist, it prompts to create them
3. Drop video files into your input folder
4. Script automatically:
   - Detects new videos
   - Creates or updates compositions to match video dimensions/framerate
   - Applies time stretch (slow motion)
   - Applies Bullet Time effect (if available)
   - Renders to output folder
   - Moves originals to processed folder

## Configuration Details

### Folder Settings
- `input` - Where you drop videos to process
- `output` - Where processed videos are saved  
- `processed` - Where original files are moved after processing (optional)
- `template` - (Optional) Path to .aep template file - leave empty to create from scratch
- `logFile` - (Optional) Where to save the log file - defaults to a 'logs' folder next to output

### Processing Settings
- `timeStretch` - Slow motion percentage (300 = 3x slower, 100 = normal)
- `applyBulletTime` - true/false to apply Bullet Time effect
- `checkInterval` - How often to check for new files (milliseconds)

## Features

✅ **ONE Script** - Runs entirely within After Effects  
✅ **No Dependencies** - No Node.js, no external tools  
✅ **Auto-Setup** - Creates folders if they don't exist  
✅ **Dynamic Comp Adjustment** - Matches each video's dimensions & framerate  
✅ **Cross-Platform** - Works on Mac and Windows  
✅ **Template Support** - Optionally use .aep template (not required!)  
✅ **Background Processing** - Monitors and processes automatically  
✅ **Permission Handling** - If files can't be moved, adds _processed suffix  
✅ **Smart Skip** - Automatically skips files with _processed suffix  

## Project Structure

```
BulletTime/
├── in/          # Drop videos here
├── out/         # Processed videos appear here
└── processed/   # Original files moved here after processing
```

## Uninstall

Delete these 2 files from the Startup folder:
- `BulletTimeAutomate.jsx`
- `BulletTimeAutomate.json`

## Troubleshooting

**Script not running?**
- Verify files are in the correct Startup folder
- Check if After Effects allows scripts (Edit > Preferences > Scripting & Expressions)

**Folders not found?**
- The script will prompt to create them automatically
- Or create them manually and update paths in the JSON file

**No Bullet Time effect?**
- Script falls back to Pixel Motion blur if Bullet Time plugin isn't installed
- Install RE:Vision Effects Twixtor for full Bullet Time support

**Videos not processing?**
- Check the log file (default location: `logs` folder next to your output folder)
- On Windows also check `startup_debug.txt` in the Scripts/Startup folder
- Ensure video format is supported (.mp4, .mov, .avi, .mkv, .webm, .m4v)
- Files with `_processed` suffix are automatically skipped

**Files not moving on Windows?**
- If permission issues prevent moving files, they'll be renamed with `_processed` suffix
- These renamed files are automatically skipped in future runs
- Check the log for details about permission errors

## Requirements

- After Effects 2025
- Bullet Time plugin (optional - uses Pixel Motion as fallback)