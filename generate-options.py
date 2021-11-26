# This helper script is designed to read a list of comments in the format # <code> - <name> from natsuki-sprites.rpy, and creates <option> tags for use on the
# expression previewer tool.

import os

target_file_and_path = os.path.join(os.path.dirname(__file__), "options.txt")

if os.path.isfile(target_file_and_path):

    # Load in from source file
    source_file = open(target_file_and_path, "r")
    content = source_file.readlines()
    source_file.close()

    output = []

    for line in content:
        output.append('<option value="{0}">{1}</option>\n'.format(
            line.split(' - ')[0].replace("#", "").strip(),
            line.split(' - ')[1].strip()
        ))

    # Write back
    destination_file = open(target_file_and_path, "w")
    destination_file.writelines(output)
    destination_file.close()
    print("Done!")

else:
    # No source file found; create and return
    new_source_file = open(target_file_and_path, "w")
    new_source_file.close()
    print(f"Target file {target_file_and_path} not found and was created instead, insert options and retry.")
