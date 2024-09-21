console.log('i was loaded')

function createFlexbox(name, number) {
  box = $("<div>", {
    id: name + number.toString()
  }).css("display", "flex")
    .css("flex-wrap", "wrap");

  console.log('made a box');
  console.log(box);

  $("#annotated-text").appendChild(box);
}

function addCharsToFlexbox(curr_line, curr_seg) {
  curr_box = $("#char_line" + curr_line.toString());
  character_bubble = $("#bubble" + curr_seg.toString());
  curr_box.appendChild(character_bubble);
}