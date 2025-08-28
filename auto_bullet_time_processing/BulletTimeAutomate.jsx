/**
 * BulletTimeAutomate.jsx
 * Single script that does EVERYTHING - monitoring, processing, rendering
 * Drop in After Effects Startup folder and it runs automatically
 */

(function BulletTimeAutomation() {
    
    // ===== UTILITY FUNCTIONS =====
    function getScriptPath() {
        var scriptFile = new File($.fileName);
        return scriptFile.parent.fsName;
    }
    
    function detectPlatform() {
        // Check if running on Windows or Mac
        return $.os.indexOf("Windows") >= 0 ? "windows" : "mac";
    }
    
    function getPathSeparator() {
        // Return correct path separator for platform
        return $.os.indexOf("Windows") >= 0 ? "\\" : "/";
    }
    
    function joinPath(base, file) {
        // Properly join paths for current platform
        var sep = getPathSeparator();
        if (!base) return file;
        if (!file) return base;
        
        // Remove trailing separator from base
        if (base.charAt(base.length - 1) === "/" || base.charAt(base.length - 1) === "\\") {
            base = base.substring(0, base.length - 1);
        }
        
        return base + sep + file;
    }
    
    function normalizePath(path) {
        // Handle both Mac and Windows path formats
        path = String(path);
        
        // Windows path (C:\ or \\)
        if (path.indexOf(":") === 1 || path.substring(0, 2) === "\\\\") {
            return path.replace(/\//g, "\\");
        }
        
        // Mac/Unix path
        return path.replace(/\\/g, "/");
    }
    
    // JSON polyfill for ECMA3
    function parseJSON(str) {
        try {
            // Simple JSON parse using eval (safe since we control the config file)
            return eval("(" + str + ")");
        } catch(e) {
            return null;
        }
    }
    
    // ===== CONFIG LOADING =====
    function loadConfig() {
        var config = {
            INPUT_FOLDER: "",
            OUTPUT_FOLDER: "",
            PROCESSED_FOLDER: "",
            TEMPLATE_PATH: "",
            LOG_FILE_PATH: "",
            TIME_STRETCH: 300,
            APPLY_BULLET_TIME: true,
            CHECK_INTERVAL: 2000
        };
        
        try {
            var configPath = joinPath(getScriptPath(), "BulletTimeAutomate.json");
            var configFile = new File(configPath);
            
            if (!configFile.exists) {
                alert("Config file not found!\n" + configPath + "\n\nPlease create BulletTimeAutomate.json");
                return null;
            }
            
            configFile.open("r");
            var content = configFile.read();
            configFile.close();
            
            // Parse JSON
            var jsonData = parseJSON(content);
            if (!jsonData) {
                alert("Invalid JSON in config file!");
                return null;
            }
            
            // Detect platform
            var platform = detectPlatform();
            
            // Map JSON structure to config based on platform
            try {
                config.INPUT_FOLDER = normalizePath(jsonData.folders.input[platform] || "");
                config.OUTPUT_FOLDER = normalizePath(jsonData.folders.output[platform] || "");
                config.PROCESSED_FOLDER = normalizePath(jsonData.folders.processed[platform] || "");
                config.TEMPLATE_PATH = normalizePath(jsonData.folders.template[platform] || "");
                
                // Default log path: create a 'logs' folder next to 'out' folder
                if (jsonData.folders.logFile && jsonData.folders.logFile[platform] && jsonData.folders.logFile[platform].length > 0) {
                    var logPath = normalizePath(jsonData.folders.logFile[platform]);
                    
                    // Check if it's a folder path or file path
                    var testFolder = new Folder(logPath);
                    if (testFolder.exists || logPath.charAt(logPath.length - 1) === "/" || logPath.charAt(logPath.length - 1) === "\\") {
                        // It's a folder - add the log filename
                        config.LOG_FILE_PATH = joinPath(logPath, "bullet_time.log");
                    } else if (logPath.indexOf(".") > logPath.lastIndexOf("/") && logPath.indexOf(".") > logPath.lastIndexOf("\\")) {
                        // It has an extension - treat as full file path
                        config.LOG_FILE_PATH = logPath;
                    } else {
                        // No extension and not an existing folder - assume it's a folder path
                        config.LOG_FILE_PATH = joinPath(logPath, "bullet_time.log");
                    }
                } else {
                    // Get parent of output folder and create logs folder
                    var outputFolder = new Folder(config.OUTPUT_FOLDER);
                    var parentPath = outputFolder.parent ? outputFolder.parent.fsName : config.OUTPUT_FOLDER;
                    var logsFolder = joinPath(parentPath, "logs");
                    config.LOG_FILE_PATH = joinPath(logsFolder, "bullet_time.log");
                }
                config.TIME_STRETCH = jsonData.processing.timeStretch || 300;
                config.APPLY_BULLET_TIME = jsonData.processing.applyBulletTime !== false;
                config.CHECK_INTERVAL = jsonData.processing.checkInterval || 2000;
            } catch(e) {
                alert("Error reading config values: " + e.toString());
                return null;
            }
            
        } catch(e) {
            alert("Error reading config: " + e.toString());
            return null;
        }
        
        // Validate required paths
        if (!config.INPUT_FOLDER) {
            alert("INPUT folder must be specified for " + platform + " in config!");
            return null;
        }
        if (!config.OUTPUT_FOLDER) {
            alert("OUTPUT folder must be specified for " + platform + " in config!");
            return null;
        }
        if (!config.PROCESSED_FOLDER) {
            var response = confirm("PROCESSED folder not specified in config.\n\n" +
                                  "Processed files will remain in INPUT folder.\n" +
                                  "Continue anyway?");
            if (!response) return null;
        }
        
        return config;
    }
    
    // ===== STATE MANAGEMENT =====
    var STATE = {
        config: null,
        isProcessing: false,
        processedFiles: {},
        checkTimer: null
    };
    
    // ===== LOGGING =====
    function log(msg) {
        var timestamp = new Date().toLocaleString();
        $.writeln("[" + timestamp + "] " + msg);
        
        // Also write to log file
        try {
            if (!STATE.config || !STATE.config.LOG_FILE_PATH) return;
            
            var logFile = new File(STATE.config.LOG_FILE_PATH);
            
            // Create parent folder if needed
            var logFolderPath = logFile.parent.fsName;
            var logFolder = new Folder(logFolderPath);
            if (!logFolder.exists) {
                logFolder.create();
            }
            
            logFile.open("a");
            logFile.writeln("[" + timestamp + "] " + msg);
            logFile.close();
        } catch(e) {
            $.writeln("LOG ERROR: " + e.toString());
        }
    }
    
    // ===== FOLDER OPERATIONS =====
    function ensureFolders() {
        var missingFolders = [];
        var folderNames = ["INPUT", "OUTPUT", "PROCESSED"];
        var folders = [
            STATE.config.INPUT_FOLDER,
            STATE.config.OUTPUT_FOLDER,
            STATE.config.PROCESSED_FOLDER
        ];
        
        // Check which folders are missing
        for (var i = 0; i < folders.length; i++) {
            if (!folders[i]) continue;
            
            var folder = Folder(folders[i]);
            if (!folder.exists) {
                missingFolders.push(folderNames[i] + ": " + folders[i]);
            }
        }
        
        // If folders are missing, alert user
        if (missingFolders.length > 0) {
            var message = "The following folders do not exist:\n\n";
            for (var j = 0; j < missingFolders.length; j++) {
                message += "• " + missingFolders[j] + "\n";
            }
            message += "\nWould you like to create them automatically?";
            
            if (confirm(message)) {
                // Try to create folders
                var failedFolders = [];
                for (var k = 0; k < folders.length; k++) {
                    if (!folders[k]) continue;
                    
                    var folderToCreate = Folder(folders[k]);
                    if (!folderToCreate.exists) {
                        if (!folderToCreate.create()) {
                            failedFolders.push(folders[k]);
                        } else {
                            log("Created folder: " + folders[k]);
                        }
                    }
                }
                
                if (failedFolders.length > 0) {
                    alert("Failed to create these folders:\n" + failedFolders.join("\n") + 
                          "\n\nPlease create them manually or check permissions.");
                    return false;
                }
                
                alert("All folders created successfully!");
            } else {
                alert("Automation stopped.\n\nPlease create the folders manually or update the config file:\n" + 
                      joinPath(getScriptPath(), "BulletTimeAutomate.json"));
                return false;
            }
        }
        
        return true;
    }
    
    function getVideoFiles() {
        var videos = [];
        var processedToMove = [];
        var extensions = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".m4v"];
        
        try {
            var folder = new Folder(STATE.config.INPUT_FOLDER);
            if (!folder.exists) return videos;
            
            var files = folder.getFiles();
            
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (file instanceof File) {
                    var name = file.name.toLowerCase();
                    
                    // Check if this is a _processed file that needs moving
                    if (name.indexOf("_processed") >= 0) {
                        // Try to move _processed files to processed folder periodically
                        processedToMove.push(file);
                        continue;
                    }
                    
                    // Check extension
                    var hasValidExt = false;
                    for (var j = 0; j < extensions.length; j++) {
                        if (name.indexOf(extensions[j]) === name.length - extensions[j].length) {
                            hasValidExt = true;
                            break;
                        }
                    }
                    
                    if (hasValidExt) {
                        // Skip if already processed in this session
                        if (!STATE.processedFiles[file.fsName]) {
                            videos.push(file);
                        }
                    }
                }
            }
            
            // Try to move any _processed files if we have a processed folder
            if (STATE.config.PROCESSED_FOLDER && processedToMove.length > 0) {
                tryMoveProcessedFiles(processedToMove);
            }
            
        } catch(e) {
            log("Error scanning folder: " + e.toString());
        }
        
        return videos;
    }
    
    function tryMoveProcessedFiles(files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            try {
                var processedPath = joinPath(STATE.config.PROCESSED_FOLDER, file.name);
                if (file.copy(processedPath)) {
                    if (file.remove()) {
                        log("Moved previously processed file: " + file.name);
                    }
                }
            } catch(e) {
                // Silent fail - file still locked
            }
        }
    }
    
    // ===== VIDEO PROCESSING =====
    function processVideo(videoFile) {
        if (STATE.isProcessing) return;
        STATE.isProcessing = true;
        
        log("Processing: " + videoFile.name);
        
        try {
            // Mark as processed immediately to avoid reprocessing
            STATE.processedFiles[videoFile.fsName] = true;
            
            // Import footage
            var io = new ImportOptions(videoFile);
            var footage = app.project.importFile(io);
            log("Imported: " + footage.name);
            
            // Create or find composition
            var comp = null;
            
            // Check for template (only if explicitly specified)
            if (STATE.config.TEMPLATE_PATH && STATE.config.TEMPLATE_PATH.length > 0) {
                var templateFile = new File(STATE.config.TEMPLATE_PATH);
                if (templateFile.exists) {
                    log("Loading template: " + STATE.config.TEMPLATE_PATH);
                    // Open template project
                    app.open(templateFile);
                    
                    // Find first comp
                    for (var i = 1; i <= app.project.numItems; i++) {
                        if (app.project.item(i) instanceof CompItem) {
                            comp = app.project.item(i);
                            break;
                        }
                    }
                } else {
                    log("Template file not found: " + STATE.config.TEMPLATE_PATH);
                }
            }
            
            // Calculate duration with time stretch
            var targetDuration = footage.duration * (STATE.config.TIME_STRETCH / 100);
            
            if (!comp) {
                // Create new comp matching video specs
                comp = app.project.items.addComp(
                    "BulletTime_" + videoFile.name,
                    footage.width,
                    footage.height,
                    footage.pixelAspect || 1.0,
                    targetDuration,
                    footage.frameRate
                );
                log("Created composition: " + footage.width + "x" + footage.height + " @ " + footage.frameRate + "fps");
            } else {
                // Update existing comp to match video specs
                comp.width = footage.width;
                comp.height = footage.height;
                comp.pixelAspect = footage.pixelAspect || 1.0;
                comp.duration = targetDuration;
                comp.frameRate = footage.frameRate;
                log("Updated comp to match video: " + footage.width + "x" + footage.height + " @ " + footage.frameRate + "fps");
            }
            
            // Add or replace layer
            var layer;
            if (comp.numLayers > 0) {
                layer = comp.layer(1);
                try {
                    layer.replaceSource(footage, false);
                } catch(e) {
                    layer.remove();
                    layer = comp.layers.add(footage);
                }
            } else {
                layer = comp.layers.add(footage);
            }
            
            // Apply time stretch
            layer.stretch = STATE.config.TIME_STRETCH;
            log("Applied " + STATE.config.TIME_STRETCH + "% time stretch");
            
            // Apply Bullet Time effect
            if (STATE.config.APPLY_BULLET_TIME) {
                try {
                    var fx = layer.property("ADBE Effect Parade");
                    var bulletTime = fx.addProperty("ADBE Bullet Time");
                    
                    // Set to Timestretching (option 2 instead of option 1)
                    try {
                        var interpProp = bulletTime.property("ADBE Bullet Time-2028");
                        if (interpProp) interpProp.setValue(2);  // 2 = Timestretching
                    } catch(e) {}
                    
                    // Optional: Set start/end points if needed
                    // var startProp = bulletTime.property("ADBE Bullet Time-2029");  // Start
                    // if (startProp) startProp.setValue(0);
                    // var endProp = bulletTime.property("ADBE Bullet Time-2030");    // End  
                    // if (endProp) endProp.setValue(100);
                    
                    log("Applied Bullet Time effect with Timestretching mode");
                } catch(e) {
                    // Alert user that Bullet Time is not available
                    alert("BULLET TIME EFFECT NOT AVAILABLE!\n\n" +
                          "The Bullet Time (Twixtor) plugin is not installed.\n" +
                          "Please install RE:Vision Effects Twixtor plugin.\n\n" +
                          "Processing stopped for: " + videoFile.name);
                    
                    log("ERROR: Bullet Time effect not available - " + e.toString());
                    
                    // Stop processing this video
                    throw new Error("Bullet Time plugin required but not available");
                }
            }
            
            // Generate output filename with clean timestamp
            var now = new Date();
            var timestamp = now.getFullYear() + "-" +
                           ("0" + (now.getMonth() + 1)).slice(-2) + "-" +
                           ("0" + now.getDate()).slice(-2) + "_" +
                           ("0" + now.getHours()).slice(-2) + "-" +
                           ("0" + now.getMinutes()).slice(-2) + "-" +
                           ("0" + now.getSeconds()).slice(-2);
            var outputName = videoFile.name.replace(/\.[^\.]+$/, "") + "_" + timestamp + ".mp4";
            var outputPath = joinPath(STATE.config.OUTPUT_FOLDER, outputName);
            
            // Add to render queue
            var rqItem = app.project.renderQueue.items.add(comp);
            var om = rqItem.outputModule(1);
            om.file = new File(outputPath);
            
            // Apply output template
            try {
                om.applyTemplate("H.264 - Match Render Settings - 15 Mbps");
            } catch(e) {
                try {
                    om.applyTemplate("H.264 - High Quality");
                } catch(e2) {
                    om.applyTemplate("Lossless");
                }
            }
            
            log("Rendering to: " + outputPath);
            
            // Render
            log("Starting render...");
            app.project.renderQueue.render();
            log("Render queue finished, checking status...");
            
            // Check render status
            log("Render item status: " + rqItem.status);
            log("Expected DONE status: " + RQItemStatus.DONE);
            
            if (rqItem.status === RQItemStatus.DONE) {
                log("Render complete: " + outputName);
                
                // STEP 1: Always rename with _processed suffix first
                try {
                    log("Step 1: Adding _processed suffix to mark completion...");
                    var baseName = videoFile.name.replace(/\.[^\.]+$/, "");
                    var extension = videoFile.name.substring(baseName.length);
                    var newName = baseName + "_processed" + extension;
                    
                    // On Windows, try to remove read-only attribute first
                    if ($.os.indexOf("Windows") >= 0) {
                        try {
                            log("Removing read-only attribute (Windows)...");
                            // Use Windows attrib command to remove read-only
                            var cmd = 'attrib -R "' + videoFile.fsName + '"';
                            system.callSystem(cmd);
                        } catch(e) {
                            log("Could not remove read-only attribute: " + e.toString());
                        }
                    }
                    
                    // Try to rename the file
                    var renameSuccess = false;
                    try {
                        renameSuccess = videoFile.rename(newName);
                    } catch(e) {
                        log("Rename failed: " + e.toString());
                        
                        // Alternative approach: copy to new name then delete old
                        if (!renameSuccess) {
                            log("Trying alternative: copy with new name...");
                            var newPath = joinPath(STATE.config.INPUT_FOLDER, newName);
                            if (videoFile.copy(newPath)) {
                                log("Copy successful, trying to delete original...");
                                // Try to delete the original
                                try {
                                    if ($.os.indexOf("Windows") >= 0) {
                                        // Force delete on Windows
                                        var delCmd = 'del /F "' + videoFile.fsName + '"';
                                        system.callSystem(delCmd);
                                    } else {
                                        videoFile.remove();
                                    }
                                    renameSuccess = true;
                                    videoFile = new File(newPath); // Update reference to new file
                                } catch(e2) {
                                    log("Could not delete original, keeping both files");
                                    // Mark the copy as processed
                                    var newFile = new File(newPath);
                                    STATE.processedFiles[newFile.fsName] = true;
                                }
                            }
                        }
                    }
                    
                    if (renameSuccess) {
                        log("SUCCESS: File renamed to: " + newName);
                        // Use the videoFile reference which may have been updated
                        var renamedFile = (typeof videoFile === 'object' && videoFile.fsName) ? 
                                         videoFile : new File(joinPath(STATE.config.INPUT_FOLDER, newName));
                        
                        // STEP 2: Try to move the renamed file to processed folder
                        if (STATE.config.PROCESSED_FOLDER) {
                            log("Step 2: Attempting to move renamed file to processed folder...");
                            
                            var processedPath = joinPath(STATE.config.PROCESSED_FOLDER, newName);
                            log("Destination: " + processedPath);
                            
                            // Ensure processed folder exists
                            var processedFolder = new Folder(STATE.config.PROCESSED_FOLDER);
                            if (!processedFolder.exists) {
                                log("Creating processed folder...");
                                processedFolder.create();
                            }
                            
                            // Try to move the renamed file
                            if (processedFolder.exists) {
                                if (renamedFile.copy(processedPath)) {
                                    if (renamedFile.remove()) {
                                        log("SUCCESS: File moved to processed folder");
                                    } else {
                                        log("INFO: File copied but couldn't delete from input folder");
                                        log("File remains in input with _processed suffix");
                                        // Delete the copy since we're keeping the original
                                        var copiedFile = new File(processedPath);
                                        copiedFile.remove();
                                    }
                                } else {
                                    log("INFO: Could not copy to processed folder");
                                    log("File remains in input with _processed suffix");
                                }
                            }
                        } else {
                            log("No processed folder configured - file remains in input with _processed suffix");
                        }
                        
                        // Mark as processed regardless of move success
                        STATE.processedFiles[renamedFile.fsName] = true;
                        
                    } else {
                        log("ERROR: Could not rename file - it may be locked");
                        log("WARNING: File might be reprocessed on restart!");
                        // Still mark as processed to avoid infinite loop in this session
                        STATE.processedFiles[videoFile.fsName] = true;
                    }
                } catch(e) {
                    log("EXCEPTION during file processing: " + e.toString());
                    // Mark as processed to avoid infinite loop
                    STATE.processedFiles[videoFile.fsName] = true;
                }
            } else {
                log("Render failed!");
            }
            
            // Clean up project items but don't close AE
            for (var i = app.project.numItems; i >= 1; i--) {
                app.project.item(i).remove();
            }
            
        } catch(e) {
            log("Error processing video: " + e.toString());
        } finally {
            // Always reset processing flag
            STATE.isProcessing = false;
        }
    }
    
    // ===== MONITORING LOOP =====
    function checkForVideos() {
        if (STATE.isProcessing) return;
        
        var videos = getVideoFiles();
        if (videos.length > 0) {
            log("Found " + videos.length + " video(s) to process");
            processVideo(videos[0]);
        }
    }
    
    function startMonitoring() {
        log("Starting folder monitoring...");
        log("Watching: " + STATE.config.INPUT_FOLDER);
        log("Output to: " + STATE.config.OUTPUT_FOLDER);
        
        // Use app.scheduleTask for periodic checking
        STATE.checkTimer = app.scheduleTask(
            "BulletTimeAutomation.checkForVideos();",
            STATE.config.CHECK_INTERVAL,
            true  // repeat
        );
        
        // Also check immediately
        checkForVideos();
    }
    
    
    // ===== MAIN INITIALIZATION =====
    function initialize() {
        // Only run in main app (not in render engine)
        if (app.isRenderEngine || app.isWatchFolder) {
            return;
        }
        
        // Create startup log file - first determine where it should go
        var startupLogPath;
        
        // Try to determine logs folder path before config is loaded
        try {
            // Read config file to get output path
            var configPath = joinPath(getScriptPath(), "BulletTimeAutomate.json");
            var configFile = new File(configPath);
            if (configFile.exists) {
                configFile.open("r");
                var content = configFile.read();
                configFile.close();
                
                var jsonData = parseJSON(content);
                var platform = detectPlatform();
                
                if (jsonData && jsonData.folders) {
                    // Check for explicit log file path
                    if (jsonData.folders.logFile && jsonData.folders.logFile[platform] && jsonData.folders.logFile[platform].length > 0) {
                        var logFilePath = normalizePath(jsonData.folders.logFile[platform]);
                        var logFile = new File(logFilePath);
                        startupLogPath = joinPath(logFile.parent.fsName, "startup_debug.txt");
                    } 
                    // Otherwise use logs folder next to output
                    else if (jsonData.folders.output && jsonData.folders.output[platform]) {
                        var outputPath = normalizePath(jsonData.folders.output[platform]);
                        var outputFolder = new Folder(outputPath);
                        var parentPath = outputFolder.parent ? outputFolder.parent.fsName : outputPath;
                        var logsFolder = joinPath(parentPath, "logs");
                        
                        // Create logs folder if needed
                        var logsFolderObj = new Folder(logsFolder);
                        if (!logsFolderObj.exists) {
                            logsFolderObj.create();
                        }
                        
                        startupLogPath = joinPath(logsFolder, "startup_debug.txt");
                    }
                }
            }
        } catch(e) {
            // Fallback to script directory if config read fails
        }
        
        // Fallback to script directory if we couldn't determine logs path
        if (!startupLogPath) {
            startupLogPath = joinPath(getScriptPath(), "startup_debug.txt");
        }
        
        var startupLog = new File(startupLogPath);
        startupLog.open("w");
        startupLog.writeln("=== BulletTime Startup Debug ===");
        startupLog.writeln("Time: " + new Date().toString());
        startupLog.writeln("Platform: " + $.os);
        startupLog.writeln("Script path: " + getScriptPath());
        startupLog.writeln("Path separator: " + getPathSeparator());
        
        // Load configuration
        STATE.config = loadConfig();
        if (!STATE.config) {
            startupLog.writeln("ERROR: Failed to load config");
            var logLocation = startupLogPath || "logs folder";
            startupLog.close();
            alert("Failed to load config! Check startup_debug.txt at:\n" + logLocation);
            return;
        }
        
        startupLog.writeln("Config loaded successfully");
        startupLog.writeln("Input folder: " + STATE.config.INPUT_FOLDER);
        startupLog.writeln("Output folder: " + STATE.config.OUTPUT_FOLDER);
        startupLog.writeln("Processed folder: " + STATE.config.PROCESSED_FOLDER);
        startupLog.writeln("Log file path: " + STATE.config.LOG_FILE_PATH);
        
        // Create folders if needed
        if (!ensureFolders()) {
            startupLog.writeln("ERROR: Failed to create folders");
            startupLog.close();
            return;
        }
        
        startupLog.writeln("Folders verified/created");
        startupLog.close();
        
        // Now we can use the log function
        log("========================================");
        log("BulletTime Automation Starting...");
        log("Platform: " + $.os);
        log("Input: " + STATE.config.INPUT_FOLDER);
        log("Output: " + STATE.config.OUTPUT_FOLDER);
        log("Processed: " + STATE.config.PROCESSED_FOLDER);
        log("Log file: " + STATE.config.LOG_FILE_PATH);
        log("========================================");
        
        // Make functions globally accessible for scheduleTask
        $.global.BulletTimeAutomation = {
            checkForVideos: checkForVideos,
            processVideo: processVideo
        };
        
        // Start monitoring
        startMonitoring();
        
        // Keep monitoring active
        // Don't stop on errors - just log them
        
        log("Automation ready! Drop videos into: " + STATE.config.INPUT_FOLDER);
    }
    
    // Start the system
    initialize();
    
})();