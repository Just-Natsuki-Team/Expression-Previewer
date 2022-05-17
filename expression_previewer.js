// Validation collections
POSE_CODES = []
EYEBROW_CODES = []
EYE_CODES = []
MOUTH_CODES = []
BLUSH_CODES = []
TEAR_CODES = []
EMOTE_CODES = []

// When an option is selected, this forces an update of the corresponding image tag's src to show the correct sprite
function update_layer(layer) {
    var text = $("#" + layer + "_control :selected").text()
    if (text === "(none)")
    {
        // We use Date here to ensure images aren't cached by spoofing a request for the newest ver.
        $("#" + layer + "_layer").attr("src", "./img/etc/empty.png" + "?" + new Date())
    }
    else
    {
        // We use Date here to ensure images aren't cached by spoofing a request for the newest ver.
        $("#" + layer + "_layer").attr("src", "./img/" + layer + "/" + text + ".png" + "?" + new Date())
    }

    // Update the sprite code displayed to the user
    update_sprite_code()
}

// This generates the sprite code for the currently selected sprite combination seen by the user
function update_sprite_code() {
    var code = $("#pose_control :selected").val()
        + $("#eyebrows_control :selected").val()
        + $("#eyes_control :selected").val()
        + $("#mouth_control :selected").val()
        + $("#blush_control :selected").val()
        + $("#tears_control :selected").val()
        + $("#emote_control :selected").val()
    $("#sprite_code").text(code)
}

function get_from_sprite_code(spritecode){
    // Get the two main portions of the spritecode
    baseCode = spritecode.slice(0, 6);

    if (baseCode.length == 0) {
        return
    }

    else if (baseCode.length < 6) {
        alert("Invalid spritecode: spritecodes must be 6+ characters")
        return
    }

    optionalCode = spritecode.slice(6);

    // Get base subportions
    pose = baseCode[0]
    eyebrows = baseCode[1]
    eyes = baseCode[2] + baseCode[3]
    mouth = baseCode[4] + baseCode[5]

    // Validate base subportions
    if (!POSE_CODES.includes(pose)){
        alert("Invalid spritecode: undefined pose " + pose)
        return
    }
    if (!EYEBROW_CODES.includes(eyebrows)){
        alert("Invalid spritecode: undefined eyebrows " + eyebrows)
        return
    }
    if (!EYE_CODES.includes(eyes)){
        alert("Invalid spritecode: undefined eyes " + eyes)
        return
    }
    if (!MOUTH_CODES.includes(mouth)){
        alert("Invalid spritecode: undefined mouth " + mouth)
        return
    }

    blush = null
    tears = null
    emote = null

    // Get, validate optional subportions
    while (optionalCode) {
        if (BLUSH_CODES.includes(optionalCode[0])) {
            blush = optionalCode[0]
            optionalCode = optionalCode.slice(1)
        }
        else {
            if (TEAR_CODES.includes(optionalCode.slice(0,3))) {
                tears = optionalCode.slice(0,3)
                optionalCode = optionalCode.slice(3)
            }
            else if (EMOTE_CODES.includes(optionalCode.slice(0,3))) {
                emote = optionalCode.slice(0,3)
                optionalCode = optionalCode.slice(3)
            }
            else {
                alert("Invalid optional expression subcode " + optionalCode + ". (All optional parts must follow mandatory ones)")
                return
            }
        }
    }
    
    // Finally update the visuals
    $("#pose_control option[value='" + pose + "']").prop("selected", true)
    $("#eyebrows_control option[value='" + eyebrows + "']").prop("selected", true)
    $("#eyes_control option[value='" + eyes + "']").prop("selected", true)
    $("#mouth_control option[value='" + mouth + "']").prop("selected", true)

    if (blush !== null) {
        $("#blush_control option[value='" + blush + "']").prop("selected", true)
    }
    else {
        $("#blush_control option[value='']").prop("selected", true)
    }

    if (tears !== null) {
        $("#tears_control option[value='" + tears + "']").prop("selected", true)
    }
    else {
        $("#tears_control option[value='']").prop("selected", true)
    }

    if (emote !== null) {
        $("#emote_control option[value='" + emote + "']").prop("selected", true)
    }
    else {
        $("#emote_control option[value='']").prop("selected", true)
    }
    
    update_layer("pose")
    update_layer("eyebrows")
    update_layer("eyes")
    update_layer("mouth")
    update_layer("blush")
    update_layer("tears")
    update_layer("emote")
}

// Copies the currently displayed sprite code to the clipboard
function copy_code_to_clipboard(object) {
    object.innerHTML = "[copied!]"
    navigator.clipboard.writeText($("#sprite_code").text())
    setTimeout(() => {
        object.innerHTML = "[copy]"
    }, 250);
}

// Reset everything by reloading the page
function reset_canvas(){
    location.reload()
}

// When the page loads, show the sprite code for the default sprite combination
$(document).ready(function() {
    update_sprite_code()

    document.getElementById("input_code").addEventListener(
        "keyup",
        function() {
            get_from_sprite_code($("#input_code").val())
        }
    )

    document.getElementById("input_code").addEventListener(
        "paste",
        function() {
            get_from_sprite_code($("#input_code").val())
        }
    )
    
    // Add map values for input spritecode checks based on select options

    // Compulsary code subportions
    $.each($("#pose_control option"), function(index, value) {
        POSE_CODES.push(value.value)
    });
    $.each($("#eyebrows_control option"), function(index, value) {
        EYEBROW_CODES.push(value.value)
    });
    $.each($("#eyes_control option"), function(index, value) {
        EYE_CODES.push(value.value)
    });
    $.each($("#mouth_control option"), function(index, value) {
        MOUTH_CODES.push(value.value)
    });
    
    // Optional code subportions
    $.each($("#blush_control option"), function(index, value) {
        if (value.value) {
            BLUSH_CODES.push(value.value)
        }
    });
    $.each($("#tears_control option"), function(index, value) {
        if (value.value) {
            TEAR_CODES.push(value.value)
        }
    });
    $.each($("#emote_control option"), function(index, value) {
        if (value.value) {
            EMOTE_CODES.push(value.value)
        }
    });
});