// this will prevent me from messing up my variables
"use strict";

// this is a jquery function that loads when the page is ready
// I'm writing jQuery instead of using it's shorthand $ sign to avoid errors
jQuery(function() {
    new ClipboardJS('#copybutton');
    // whenever our element with #convert id is clicked, do something
    var fileIs;
    jQuery( "#convert" ).click(function() {
        
        // first i grab the textarea content, trim here removes any whitespace before and after
        var content = jQuery("#caminput").val().trim();
        
        // then i pass it through this function to determine whichever file format we have there
        // and i store it to a variable so i won't be calling this function again
        fileIs = detectFileType(content);

        // if file format matches this strings (always compare strings with "===")
        if(fileIs === "CCcam"){
            splitFile(content, fileIs);
        }else if(fileIs === "OScam"){
            splitFile(content, fileIs);
        }else{
            alert("Unrecognized File Format");
        }
        console.log(fileIs);
    });
});

// this function receives the textinput and read it's first characters
function detectFileType(input){

    // this variable will save the filetype for later use.
    var fileType;    
    if(input.substring(0, 2) === "C:"){
    // if there's an 'c:' it's CCcam
        fileType = 'CCcam';
    }else if(input.substring(0, 8) === "[reader]"){
         // if there is '[reader]' on it, it's OScam
        fileType = 'OScam';
    }else{
        // otherwiser is nothing we wan't
        fileType = 'undertemined';
    }
    return fileType;
}

// here we get file type and content and proceed to split and convert it to a new format 
function splitFile(input, fileType){

    // for CCcam format
    if(fileType === "CCcam"){
        // we split each line by linebreaks and put each one in an array 'splited'
        var splited = input.split(/\r?\n/g);
        // we'll declara an empty array to put the formated content on 
        var finalContent = [];
        // we run a foreach
        jQuery.each(splited, function( index, value ) {
            // now we split each line using spaces, so we get individual strings
            var sliced = value.split(' ');
            // i'm using template tags to fill our desired string with data, \n to break lines so it looks nice
            var templateString =  `[reader] \nlabel = ${sliced[1]}_${sliced[3]}\nenable = 1\nprotocol = cccam\ndevice =  ${sliced[1]},${sliced[2]}\nuser = ${sliced[3]}\npassword = ${sliced[4]}\ncccversion = 2.0.11\ngroup = 1\nAU disabled:  0\nwant emu = 1\nccckeepalive = 1\ndisablecrccws_only_for = 1708:000000;1709:000000;09C4:000000;0500:050F00;0500:030B00,050F00;098D:000000;1884:000000;1841:000000\n`;
            // then we push our string to our array 
            finalContent.push(templateString);  
        });
        // when we're done we fill our textarea with our content
        jQuery("#camoutput").val(finalContent.join("\n"));
    }
    // very similar way to deal with our content
    if(fileType == "OScam"){
        // but now we split it looking for it's 'reader' tag
        var splited = input.split('[reader]');
        // again an empty array for later use
        var finalContent = [];
        // another foreach
        jQuery.each(splited, function( index, value ) {
            // this time we skip first index, since it's empty
            if(index == 0){ return };
            // and we split it using = symbol
            var sliced = value.split("=");
            // Now i'm assiging our desired content to variables
            // i'm using split with array index next to it
            // that's because 'split' returns an array
            // and I already now which index i want
            // trim removes empty spaces around it
            var domain = sliced[1].split("\n")[0].trim();
            var port = sliced[4].split("\n")[0].split(",")[1].trim();
            var user =  sliced[5].split("\n")[0].trim();
            var pass = sliced[6].split("\n")[0].trim();
            // i'm using template tags to fill our string with data, \n to break lines so it looks nice
            var templateString = `C: ${domain} ${port} ${user} ${pass}`;
            // then we push our string to an array 
            finalContent.push(templateString);  
        });
        // and fill our textarea again
        jQuery("#camoutput").val(finalContent.join("\n"));
    }
}
// a copy function
function copyOutputContent() {
    /* Get the text field */
    var copyText = document.getElementById("camoutput");
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
  
     /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
  
    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
  }