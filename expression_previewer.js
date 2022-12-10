// Validation collections
POSE_CODES = []
EYEBROW_CODES = []
EYE_CODES = []
MOUTH_CODES = []
BLUSH_CODES = []
TEAR_CODES = []
EMOTE_CODES = []
SWEAT_CODES = []

// When an option is selected, this forces an update of the corresponding image tag's src to show the correct sprite
function updateLayer(layer) {
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
    updateSpriteCode()
}

// This generates the sprite code for the currently selected sprite combination seen by the user
function updateSpriteCode() {
    var code = $("#pose_control :selected").val()
        + $("#eyebrows_control :selected").val()
        + $("#eyes_control :selected").val()
        + $("#mouth_control :selected").val()
        + $("#blush_control :selected").val()
        + $("#tears_control :selected").val()
        + $("#emote_control :selected").val()
        + $("#sweat_control :selected").val()
    $("#sprite_code").text(code)
}

function getFromSpriteCode(spritecode){
    // Get the two main portions of the spritecode
    baseCode = spritecode.slice(0, 6);

    if (baseCode.length == 0) {
        return
    }

    else if (baseCode.length < 6) {
        updateSpriteCodeStatus(false, "Invalid spritecode: spritecodes must be 6+ characters")
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
        updateSpriteCodeStatus(false, "Invalid spritecode: undefined pose " + pose)
        return
    }
    if (!EYEBROW_CODES.includes(eyebrows)){
        updateSpriteCodeStatus(false, "Invalid spritecode: undefined eyebrows " + eyebrows)
        return
    }
    if (!EYE_CODES.includes(eyes)){
        updateSpriteCodeStatus(false, "Invalid spritecode: undefined eyes " + eyes)
        return
    }
    if (!MOUTH_CODES.includes(mouth)){
        updateSpriteCodeStatus(false, "Invalid spritecode: undefined mouth " + mouth)
        return
    }

    blush = null
    tears = null
    emote = null
    sweat = null

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
            else if (SWEAT_CODES.includes(optionalCode.slice(0,3))) {
                sweat = optionalCode.slice(0,3)
                optionalCode = optionalCode.slice(3)
            }
            else {
                updateSpriteCodeStatus(false, "Invalid optional expression subcode " + optionalCode + ". (All optional parts must follow mandatory ones)")
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

    if (sweat !== null) {
        $("#sweat_control option[value='" + sweat + "']").prop("selected", true)
    }
    else {
        $("#sweat_control option[value='']").prop("selected", true)
    }
    
    updateLayer("pose")
    updateLayer("eyebrows")
    updateLayer("eyes")
    updateLayer("mouth")
    updateLayer("blush")
    updateLayer("tears")
    updateLayer("emote")
    updateLayer("sweat")
    updateSpriteCodeStatus(true)
}

// Copies the currently displayed sprite code to the clipboard
function copyCodeToClipboard(object) {
    object.innerHTML = "[copied!]"
    navigator.clipboard.writeText($("#sprite_code").text())
    setTimeout(() => {
        object.innerHTML = "[copy]"
    }, 250);
}

// Reset everything by reloading the page
function resetCanvas(){
    $("option[default_option]").prop("selected", true)
    updateSpriteCode()
    updateLayer("pose")
    updateLayer("eyebrows")
    updateLayer("eyes")
    updateLayer("mouth")
    updateLayer("blush")
    updateLayer("tears")
    updateLayer("emote")
    updateLayer("sweat")
}

// Updates the sprite code status indicator
function updateSpriteCodeStatus(isValid, hint="Invalid sprite code.") {
    if (isValid) {
        $("#sprite_code_status").attr("src", "./img/spritecode_status/valid.png?" + new Date())
        $("#sprite_code_status").attr("title", "Valid spritecode!")
    }
    else {
        $("#sprite_code_status").attr("src", "./img/spritecode_status/invalid.png?" + new Date())
        $("#sprite_code_status").attr("title", hint)
    }
}

// When the page loads, show the sprite code for the default sprite combination
$(document).ready(function() {
    updateSpriteCode()

    document.getElementById("input_code").addEventListener(
        "keyup",
        function() {
            $("#input_code").val($("#input_code").val().trim())
            getFromSpriteCode($("#input_code").val())
        }
    )

    document.getElementById("input_code").addEventListener(
        "paste",
        function() {
            $("#input_code").val($("#input_code").val().trim())
            getFromSpriteCode($("#input_code").val())
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
    $.each($("#sweat_control option"), function(index, value) {
        if (value.value) {
            SWEAT_CODES.push(value.value)
        }
    });
});