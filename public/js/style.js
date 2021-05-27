function share(t) {
  var e = `https://eceblog.herokuapp.com/publicStories/${t}`;
  navigator.clipboard.writeText(e).then(
    function () {
      alert("Copying to clipboard was successful!");
    },
    function (t) {
      alert("Could not copy text: ", t);
    }
  );
}

jQuery(document).ready(function ($) {
  var alterClass = function () {
    var ww = document.body.clientWidth;
    if (ww < "500") {
      $(".js-ui").removeClass("container");
    } else if (ww >= "501") {
      $(".js-ui").addClass("container");
    }
  };
  $(window).resize(function () {
    alterClass();
  });
  //Fire it when the page first loads:
  alterClass();
});

(window.onload = function () {
  document.querySelector(".spinner-wrapper").style.display = "none";
}),
  $(document).ready(function () {
    $(".tooltipped").tooltip();
  }),
  $(document).ready(function () {
    $("input#input_text, textarea#textarea2").characterCounter();
  });
