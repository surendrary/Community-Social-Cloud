/**
 * Created by amayd on 5/14/2017.
 */
function postComment(postId) {
    var comment = document.getElementById(postId).value;
    $.ajax({
        type: "POST",
        url: "/addComment",
        data: {
            comment: comment,
            postId : postId
        },
        success: function(result) {
            alert(result);
        },
        error: function(result) {
            alert('error');
        }
    });
}