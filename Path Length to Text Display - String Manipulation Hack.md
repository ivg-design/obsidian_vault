Path Length to Text Display - String Manipulation Hack

  A workaround that I developed when trying to create custom length strings where the length of the string is controlled by the length of the path it follows -it can allow for dynamic text reveals using animated paths, and is based on path length using `String Pad`  converter as a substring function.

**SETUP**

  **ViewModel Structure:**

  Create a ViewModel with these properties:
  - character-width (Number) - an average width of the character using your font
  - string-length (Number) - a number that will hold the number of character to be revealed.
  - blank-string (String) - leave empty 
  
  **Create the following converters:**
  
  Formula - {Input}/{{vm/character-width(px)}} 
  Pad String - add the string you want to reveal, then data bind `Length` property of the converter to `string-length` view model property, and set `Direction` to `End` value
  [Screenshot: ViewModel with all properties]

**Artboard Setup**

1. add a text string - and delete the dummy `text` 

2. add a path - this will be the path your string will follow (its fun to add the bones to vertices so that it is easier to control the path)
  
%% *N.B. this works best with monospace fonts - but will work with any fonts but not as precisely.*  %%

  2. Convert path length to character count - Select your path's `Length` property  and bind it to `string-length`, and use the formula converter on it.

  3. Setup Text Run - Select the run of you text string and databind the empty string from the viewmodel to the text field, add the `Pad String` converter to it

  %% Quick Method For Calibrating Character Width
		  - Type "MMMMMMMMMM" (10 chars)
		  - Measure width
		  - Divide by 10
		  - Update charWidth
%%

  That's it! A simple hack that opens up creative possibilities for dynamic text in Rive.

  ---
  Have questions? Drop them in the comments below.