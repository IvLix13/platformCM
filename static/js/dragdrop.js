function attachDragAndDrop() {
    $(".task-card").on("dragstart", function (event) {
        event.originalEvent.dataTransfer.setData("id", $(this).data("id"));
    });

    $("#dynamic-content").on("dragover", function (event) {
        event.preventDefault();
    });

    $("#dynamic-content").on("drop", function (event) {
        event.preventDefault();
        let taskId = event.originalEvent.dataTransfer.getData("id");
        console.log("Перетащен таск ID:", taskId);
    });
}

attachDragAndDrop();
