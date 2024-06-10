<?php
include 'connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userId = $_POST['id'];
    $caption = $_POST['caption'];

    if (isset($_FILES['imagePost']) && $_FILES['imagePost']['error'] == 0) {
        $targetDir = "postImage/";
        $targetFile = $targetDir . basename($_FILES["imagePost"]["name"]);

        if (move_uploaded_file($_FILES["imagePost"]["tmp_name"], $targetFile)) {
            $sql = "INSERT INTO post (user_id, caption, imagePost) VALUES ('$userId', '$caption', '$targetFile')";

            if ($conn->query($sql) === TRUE) {
                $response = array('res' => 'success');
            } else {
                $response = array('res' => 'error', 'message' => $conn->error);
            }
        } else {
            $response = array('res' => 'error', 'message' => 'Error uploading file.');
        }
    } else {
        $sql = "INSERT INTO post (user_id, caption, imagePost) VALUES ('$userId', '$caption', ' ')";

        if ($conn->query($sql) === TRUE) {
            $response = array('res' => 'success');
        } else {
            $response = array('res' => 'error', 'message' => $conn->error);
        }
    }

    echo json_encode($response);
} else {
    echo json_encode(array('res' => 'error', 'message' => 'Invalid request.'));
}

$conn->close();
?>