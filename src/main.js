$("#test")
  .find(".child")
  .addClass("red")
  .end()
  .addClass("blue");

$("<div>HELLO</div>").appendTo($("#test"));
$("<div>BODY</div>").appendTo(document.body);

$("#test")
  .parent()
  .print();

$("#test")
  .children()
  .print();
